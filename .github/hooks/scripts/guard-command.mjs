/**
 * PreToolUse — deterministic guard rails for terminal commands.
 *
 * Three jobs:
 *  1. Block catastrophic / safety-bypassing commands outright.
 *  2. Stop the agent from deploying a stale or audio-less build (the most
 *     common "finished but the live site is broken" failure).
 *  3. Require confirmation for interactive provider logins, which otherwise
 *     hang the pipeline silently waiting on stdin.
 *
 * Self-filters: only acts on tool calls that carry a shell command. Everything
 * else (and any parse failure) falls through to VS Code's normal approval.
 */

import path from 'node:path';
import {
  readHookInput,
  toolCommand,
  outputDir,
  exists,
  listFiles,
  denyTool,
  askTool,
} from './lib.mjs';

// Catastrophic / disallowed — deny unconditionally.
const DENY = [
  { re: /\brm\s+-[a-z]*[rf][a-z]*\s+(\/|~|\$HOME|\*|\.|\.\.)(\s|$)/i, msg: 'Refusing `rm -rf` targeting / ~ . .. or *.' },
  { re: /\bgit\s+push\b[^\n]*\s(--force|-f)\b/i, msg: 'Refusing git force-push.' },
  { re: /--no-verify\b/i, msg: 'Refusing to bypass verification hooks (--no-verify).' },
  { re: /:\(\)\s*\{\s*:\s*\|\s*:\s*&\s*\}\s*;\s*:/, msg: 'Refusing fork bomb.' },
  { re: /\bmkfs\b|\bdd\s+if=|>\s*\/dev\/sd[a-z]\b/i, msg: 'Refusing disk-destructive command.' },
  { re: /\bchmod\s+-R\s+777\s+\//i, msg: 'Refusing recursive 777 on an absolute path.' },
];

// Risky but sometimes legitimate — ask the user.
const ASK = [
  { re: /\bgit\s+reset\s+--hard\b/i, msg: 'git reset --hard discards work. Confirm?' },
];

const DEPLOY_CLI = /\b(vercel|netlify|surge|wrangler|gh-pages)\b/i;
const AUTH = /\b(login|logout)\b/i;
const INFO = /\b(whoami|--version|--help|inspect|list|ls)\b/i;

function isDeploy(cmd) {
  if (!DEPLOY_CLI.test(cmd) || AUTH.test(cmd) || INFO.test(cmd)) return false;
  // Vercel management subcommands (link, project add, pull, env…) are not deploys —
  // the deploy pipeline runs these to set a meaningful project name before deploying.
  if (/\bvercel\s+(link|project|projects|pull|env|teams|switch)\b/i.test(cmd)) return false;
  // surge deploys with a bare invocation; the others need a deploy verb.
  return /\bsurge\b/i.test(cmd) || /(--prod|\bdeploy\b|--yes)/i.test(cmd);
}

async function main() {
  const input = await readHookInput();
  const cmd = toolCommand(input).trim();
  if (!cmd) process.exit(0);

  for (const rule of DENY) if (rule.re.test(cmd)) denyTool(rule.msg);
  for (const rule of ASK) if (rule.re.test(cmd)) askTool(rule.msg);

  if (DEPLOY_CLI.test(cmd) && AUTH.test(cmd)) {
    askTool('Interactive provider auth can hang waiting for input. Confirm you want to run this login/logout flow.');
  }

  if (isDeploy(cmd)) {
    const out = outputDir(input);
    const dist = path.join(out, 'dist');
    if (!exists(dist) || listFiles(dist).length === 0) {
      denyTool('No production build found. Run `cd syllabus-output && npm run build` before deploying.');
    }
    const pubMp3 = listFiles(path.join(out, 'public', 'audio'), '.mp3');
    const distMp3 = listFiles(path.join(dist, 'audio'), '.mp3');
    if (pubMp3.length > 0 && distMp3.length < pubMp3.length) {
      denyTool(
        `Audio is not bundled into dist/ (public/audio has ${pubMp3.length} MP3s, dist/audio has ${distMp3.length}). ` +
          'Re-run `cd syllabus-output && npm run build` after narration, then deploy.'
      );
    }
  }

  process.exit(0);
}

main().catch(() => process.exit(0));
