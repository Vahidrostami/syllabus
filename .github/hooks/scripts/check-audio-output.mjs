/**
 * PostToolUse — catch silent Edge TTS failures right after they happen.
 *
 * `edge-tts` frequently exits 0 while writing a 0-byte / truncated MP3 (empty
 * script, transient network blip, rate limiting). The build still passes, so
 * the dead audio file is only discovered when a learner presses play. This
 * hook runs after any terminal command that invoked edge-tts and flags audio
 * files that exist but are suspiciously small, injecting their names back as
 * context so the agent regenerates just those.
 *
 * It deliberately only inspects files that ALREADY exist (never reports
 * "missing"), so it stays quiet during a normal per-lesson batch loop.
 * Completeness ("every lesson has audio") is enforced separately at manifest
 * write time and at the narration Stop gate.
 *
 * Self-filters: only acts when the command mentions edge-tts.
 */

import path from 'node:path';
import {
  readHookInput,
  toolCommand,
  outputDir,
  listFiles,
  fileSize,
  injectContext,
} from './lib.mjs';

const MIN_MP3_BYTES = 1024;
const MIN_VTT_BYTES = 50;

async function main() {
  const input = await readHookInput();
  const cmd = toolCommand(input);
  if (!/edge-tts/.test(cmd)) process.exit(0);

  const audioDir = path.join(outputDir(input), 'public', 'audio');
  const badMp3 = listFiles(audioDir, '.mp3')
    .filter((f) => fileSize(f) < MIN_MP3_BYTES)
    .map((f) => path.basename(f));
  const badVtt = listFiles(audioDir, '.vtt')
    .filter((f) => fileSize(f) < MIN_VTT_BYTES)
    .map((f) => path.basename(f));

  if (badMp3.length || badVtt.length) {
    const parts = [];
    if (badMp3.length) parts.push(`empty/corrupt MP3s: ${badMp3.join(', ')}`);
    if (badVtt.length) parts.push(`empty VTT subtitles: ${badVtt.join(', ')}`);
    injectContext(
      'PostToolUse',
      `Edge TTS reported success but produced ${parts.join('; ')}. ` +
        `A file under 1KB means the TTS call failed even though edge-tts exited 0. ` +
        `Re-run edge-tts for those lessons before updating audio-manifest.json.`
    );
  }
  process.exit(0);
}

main().catch(() => process.exit(0));
