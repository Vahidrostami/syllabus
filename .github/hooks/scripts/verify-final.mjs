/**
 * Stop — final reliability gate. Targets the "Syllabus finished but audio is
 * broken" bug directly.
 *
 * After narration (phase 7 of 9) the orchestrator is supposed to re-run
 * `npm run build` so the freshly generated MP3s in public/audio/ get copied
 * into dist/. On a long run — especially after context compaction — that
 * rebuild is the single most-skipped step, leaving a build that looks done but
 * ships no audio. This gate blocks the agent from ending until:
 *   1. any generated audio is actually present in dist/, and
 *   2. the audio manifest does not reference missing / empty MP3s.
 *
 * Conservative by design: it only blocks once narration has produced MP3s, so
 * it never traps a user who intentionally stopped earlier in the pipeline.
 * Guarded by stop_hook_active to avoid an infinite continue loop.
 */

import path from 'node:path';
import {
  readHookInput,
  outputDir,
  exists,
  fileSize,
  listFiles,
  readJson,
  publicAudioPath,
  blockStop,
} from './lib.mjs';

async function main() {
  const input = await readHookInput();
  if (input.stop_hook_active === true) process.exit(0);

  const out = outputDir(input);
  if (!exists(out)) process.exit(0);

  const problems = [];
  const publicMp3 = listFiles(path.join(out, 'public', 'audio'), '.mp3');

  // 1. Audio-bundling consistency (the core "finished but broken" check).
  if (publicMp3.length > 0) {
    const dist = path.join(out, 'dist');
    if (!exists(dist)) {
      problems.push(
        `Narration generated ${publicMp3.length} audio file(s) in public/audio/, but there is no dist/ build. ` +
          'Run `cd syllabus-output && npm run build` so the audio ships.'
      );
    } else {
      const distMp3 = listFiles(path.join(dist, 'audio'), '.mp3');
      if (distMp3.length < publicMp3.length) {
        problems.push(
          `dist/audio has ${distMp3.length} MP3(s) but public/audio has ${publicMp3.length}. ` +
            'The post-narration build is stale — re-run `cd syllabus-output && npm run build`.'
        );
      }
    }
  }

  // 2. Manifest references must resolve to real, non-empty files.
  const manifestPath = path.join(out, 'src', 'data', 'audio-manifest.json');
  if (exists(manifestPath)) {
    let manifest;
    try {
      manifest = readJson(manifestPath);
    } catch {
      problems.push('audio-manifest.json is not valid JSON.');
    }
    if (manifest && manifest.provider === 'edge-tts' && Array.isArray(manifest.lessons)) {
      const broken = [];
      for (const L of manifest.lessons) {
        const id = (L && L.lessonId) || '?';
        if (!L || !L.audioFile) {
          broken.push(`${id} (no audioFile)`);
          continue;
        }
        const abs = publicAudioPath(out, L.audioFile);
        if (!exists(abs) || fileSize(abs) < 1024) broken.push(`${id} (missing/empty MP3)`);
      }
      if (broken.length) {
        problems.push(
          `audio-manifest.json (edge-tts) references missing/empty audio for: ${broken.join(', ')}. ` +
            'Regenerate them, or switch the manifest provider to "web-speech".'
        );
      }
    }
  }

  if (problems.length) {
    blockStop(
      'Audio reliability checks failed — do not finish yet:\n- ' +
        problems.join('\n- ') +
        '\n\nFix the above, then end the session.'
    );
  }
  process.exit(0);
}

main().catch(() => process.exit(0));
