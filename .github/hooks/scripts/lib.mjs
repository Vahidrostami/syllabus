/**
 * Shared helpers for Syllabus agent hooks.
 *
 * Hooks receive a JSON object on stdin and communicate back to VS Code via
 * stdout (JSON) and exit codes. These helpers keep every hook script small,
 * defensive, and fail-open: a buggy hook must never break the agent pipeline.
 *
 * Important VS Code behaviors this code accounts for:
 *  - Hook "matchers" are ignored, so every hook fires on every event of its
 *    type. Each script must self-filter (by tool name / path / command).
 *  - Tool input uses camelCase (filePath, command, ...).
 *  - exit 2 = blocking error (stderr shown to the model); exit 0 = success
 *    (stdout parsed as JSON).
 */

import fs from 'node:fs';
import path from 'node:path';

/** Read and parse the JSON hook payload from stdin. Returns {} on any problem. */
export async function readHookInput() {
  if (process.stdin.isTTY) return {};
  try {
    const chunks = [];
    for await (const chunk of process.stdin) chunks.push(chunk);
    const raw = Buffer.concat(chunks).toString('utf8').trim();
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

export function getCwd(input) {
  return (input && typeof input.cwd === 'string' && input.cwd) || process.cwd();
}

/** Absolute path to the generated tutorial directory. */
export function outputDir(input) {
  return path.join(getCwd(input), 'syllabus-output');
}

export function toolInput(input) {
  return (input && input.tool_input) || {};
}

/** Extract a shell command string from a terminal tool invocation, if any. */
export function toolCommand(input) {
  const ti = toolInput(input);
  if (typeof ti.command === 'string') return ti.command;
  if (Array.isArray(ti.commands)) {
    return ti.commands
      .map((c) => (typeof c === 'string' ? c : (c && c.command) || ''))
      .join(' && ');
  }
  return '';
}

/** Extract any file paths referenced by a file-editing tool invocation. */
export function toolPaths(input) {
  const ti = toolInput(input);
  const out = [];
  const add = (v) => {
    if (typeof v === 'string' && v) out.push(v);
  };
  add(ti.filePath);
  add(ti.file_path);
  add(ti.path);
  add(ti.uri);
  if (Array.isArray(ti.files)) {
    for (const f of ti.files) {
      if (typeof f === 'string') add(f);
      else if (f && typeof f === 'object') {
        add(f.filePath);
        add(f.path);
        add(f.uri);
      }
    }
  }
  return out;
}

export function normalize(p) {
  return String(p).replace(/^file:\/\//, '').replace(/\\/g, '/');
}

/** Resolve a (possibly relative or file://) path against the session cwd. */
export function resolvePath(input, p) {
  const n = normalize(p);
  return path.isAbsolute(n) ? n : path.join(getCwd(input), n);
}

export function exists(p) {
  try {
    fs.accessSync(p);
    return true;
  } catch {
    return false;
  }
}

export function readJson(file) {
  return JSON.parse(fs.readFileSync(file, 'utf8'));
}

export function fileSize(p) {
  try {
    return fs.statSync(p).size;
  } catch {
    return -1;
  }
}

export function listFiles(dir, ext) {
  try {
    return fs
      .readdirSync(dir)
      .filter((f) => !ext || f.endsWith(ext))
      .map((f) => path.join(dir, f));
  } catch {
    return [];
  }
}

// ─── Output helpers ──────────────────────────────────────────────

/** No-op: let the operation proceed. */
export function pass() {
  process.exit(0);
}

/** Inject non-blocking context back into the conversation, then continue. */
export function injectContext(eventName, text) {
  process.stdout.write(
    JSON.stringify({
      hookSpecificOutput: { hookEventName: eventName, additionalContext: text },
    })
  );
  process.exit(0);
}

/** Block a tool call / post-processing and show the message to the model. */
export function blockToolUse(message) {
  process.stderr.write(message);
  process.exit(2);
}

/** PreToolUse: deny a single tool call. */
export function denyTool(reason) {
  process.stdout.write(
    JSON.stringify({
      hookSpecificOutput: {
        hookEventName: 'PreToolUse',
        permissionDecision: 'deny',
        permissionDecisionReason: reason,
      },
    })
  );
  process.exit(0);
}

/** PreToolUse: require explicit user confirmation for a single tool call. */
export function askTool(reason) {
  process.stdout.write(
    JSON.stringify({
      hookSpecificOutput: {
        hookEventName: 'PreToolUse',
        permissionDecision: 'ask',
        permissionDecisionReason: reason,
      },
    })
  );
  process.exit(0);
}

/**
 * Stop / SubagentStop: prevent the (sub)agent from finishing. Emits both the
 * top-level form (SubagentStop) and the hookSpecificOutput form (Stop) so it
 * works regardless of how the hook is scoped.
 */
export function blockStop(reason) {
  process.stdout.write(
    JSON.stringify({
      decision: 'block',
      reason,
      hookSpecificOutput: { hookEventName: 'Stop', decision: 'block', reason },
    })
  );
  process.exit(0);
}

/** Map a manifest audioFile ("/audio/x.mp3") to its on-disk public path. */
export function publicAudioPath(out, audioFile) {
  return path.join(out, 'public', String(audioFile).replace(/^\//, ''));
}

/** Collect all lesson ids declared in syllabus.json (module -> lessons). */
export function syllabusLessonIds(syllabus) {
  const ids = [];
  for (const m of (syllabus && syllabus.modules) || []) {
    for (const l of (m && m.lessons) || []) {
      if (l && l.id) ids.push(l.id);
    }
  }
  return ids;
}
