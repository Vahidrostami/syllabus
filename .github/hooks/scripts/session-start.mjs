/**
 * SessionStart — inject deterministic resume + environment context.
 *
 * Syllabus is a resumable, file-driven pipeline, but the agent has to re-derive
 * "where am I?" from scratch each session and guess which external tools are
 * available. This hook computes both up front and injects them, so the agent
 * resumes at the right phase and picks the correct audio provider (edge-tts vs
 * the web-speech fallback) instead of discovering availability mid-run.
 */

import path from 'node:path';
import { execSync } from 'node:child_process';
import { readHookInput, outputDir, exists, listFiles, injectContext } from './lib.mjs';

function detectPhase(out) {
  if (!exists(out)) return 'BRIEF — no syllabus-output yet; gather topic/depth/style/goals.';
  const has = (rel) => exists(path.join(out, rel));
  const some = (rel) => listFiles(path.join(out, rel)).length > 0;
  if (has('dist')) return 'DEPLOY/DONE — a production build exists.';
  if (has('src/data/audio-manifest.json')) return 'AUDIT/DEPLOY — narration done.';
  if (some('src/components')) return 'NARRATE — app built; generate audio next.';
  if (has('src/lib/theme.js')) return 'BUILD — design ready; build the React app.';
  if (some('src/data/quizzes')) return 'DESIGN — quizzes done; pick theme/layout.';
  if (some('src/data/lessons')) return 'QUIZ — lessons done; write quizzes.';
  if (has('src/data/syllabus.json')) return 'REVIEW/WRITE — syllabus exists.';
  return 'BRIEF — syllabus-output exists but is empty.';
}

function has(cmd) {
  try {
    execSync(`command -v ${cmd}`, { stdio: 'ignore' });
    return true;
  } catch {
    return false;
  }
}

async function main() {
  const input = await readHookInput();
  const out = outputDir(input);

  const tools = {
    npm: has('npm'),
    python: has('python3') || has('python'),
    edgeTts: has('edge-tts'),
    vercel: has('vercel'),
    netlify: has('netlify'),
    surge: has('surge'),
  };

  const lines = [
    'Syllabus pipeline context:',
    `- Detected phase: ${detectPhase(out)}`,
    `- Audio provider: ${tools.edgeTts ? 'edge-tts available' : 'edge-tts NOT found — use the web-speech fallback (no MP3 pre-generation)'}.`,
    `- Tooling: npm=${tools.npm ? 'yes' : 'NO'}, python=${tools.python ? 'yes' : 'no'}, ` +
      `deploy=[${[tools.vercel && 'vercel', tools.netlify && 'netlify', tools.surge && 'surge'].filter(Boolean).join(', ') || 'none found'}].`,
    '- Reminder: after generating audio, ALWAYS re-run `cd syllabus-output && npm run build` so MP3s land in dist/ before audit/deploy.',
  ];

  injectContext('SessionStart', lines.join('\n'));
}

main().catch(() => process.exit(0));
