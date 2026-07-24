/**
 * SubagentStop (scoped to the narration-engineer agent) — per-agent
 * "definition of done" for audio.
 *
 * Configured as a `Stop` hook in narration-engineer.agent.md frontmatter; VS
 * Code treats an agent-scoped Stop hook as SubagentStop, so it fires when the
 * narration subagent tries to finish. It refuses to let narration complete
 * until every lesson in syllabus.json is actually covered by the manifest with
 * a real, non-empty MP3 (edge-tts) or a script (web-speech).
 *
 * Guarded by stop_hook_active to avoid an infinite continue loop. Requires
 * `chat.useCustomAgentHooks: true` (set in .vscode/settings.json).
 */

import path from 'node:path';
import {
  readHookInput,
  outputDir,
  exists,
  fileSize,
  readJson,
  publicAudioPath,
  syllabusLessonIds,
  blockStop,
} from './lib.mjs';

async function main() {
  const input = await readHookInput();
  if (input.stop_hook_active === true) process.exit(0);

  const out = outputDir(input);
  const syllabusPath = path.join(out, 'src', 'data', 'syllabus.json');
  if (!exists(syllabusPath)) process.exit(0);

  let lessonIds;
  try {
    lessonIds = syllabusLessonIds(readJson(syllabusPath));
  } catch {
    process.exit(0);
  }
  if (lessonIds.length === 0) process.exit(0);

  const manifestPath = path.join(out, 'src', 'data', 'audio-manifest.json');
  if (!exists(manifestPath)) {
    blockStop(
      `Narration is not finished: audio-manifest.json is missing. Generate audio (or web-speech ` +
        `scripts) for all ${lessonIds.length} lessons and write the manifest before completing.`
    );
  }

  let manifest;
  try {
    manifest = readJson(manifestPath);
  } catch {
    blockStop('audio-manifest.json exists but is invalid JSON. Fix it before finishing narration.');
  }

  const problems = [];
  const covered = new Set((manifest.lessons || []).map((l) => l && l.lessonId));
  const missing = lessonIds.filter((id) => !covered.has(id));
  if (missing.length) problems.push(`Manifest is missing ${missing.length} lesson(s): ${missing.join(', ')}`);

  if (manifest.provider === 'edge-tts') {
    const bad = [];
    for (const L of manifest.lessons || []) {
      const id = (L && L.lessonId) || '?';
      if (!L || !L.audioFile) {
        bad.push(`${id} (no audioFile)`);
        continue;
      }
      const abs = publicAudioPath(out, L.audioFile);
      if (!exists(abs) || fileSize(abs) < 1024) bad.push(`${id} (missing/empty MP3)`);
    }
    if (bad.length) problems.push(`Edge TTS audio missing/corrupt for: ${bad.join(', ')}`);
  } else if (manifest.provider === 'web-speech') {
    const noScript = (manifest.lessons || [])
      .filter((L) => !L || !L.script || (Array.isArray(L.script) && L.script.length === 0))
      .map((L) => (L && L.lessonId) || '?');
    if (noScript.length) problems.push(`Web-speech fallback missing scripts for: ${noScript.join(', ')}`);
  } else {
    problems.push(`Manifest "provider" must be "edge-tts" or "web-speech" (got: ${manifest.provider ?? 'undefined'}).`);
  }

  if (problems.length) {
    blockStop('Narration is not complete:\n- ' + problems.join('\n- ') + '\n\nFinish these before ending.');
  }
  process.exit(0);
}

main().catch(() => process.exit(0));
