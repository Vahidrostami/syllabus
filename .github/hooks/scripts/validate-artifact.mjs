/**
 * PostToolUse — validate Syllabus JSON artifacts the moment they are written.
 *
 * The orchestrator advances its file-based state machine by checking which
 * files EXIST, not whether they are valid. A malformed syllabus.json, a lesson
 * with an unknown section type, an MCQ with zero/two correct answers, or an
 * audio manifest that points at missing MP3s will therefore sail through and
 * only break at runtime — often many phases later. This hook catches those at
 * write time and blocks (exit 2) so the agent fixes them immediately, with
 * full local context.
 *
 * Self-filters: only acts on *.json under syllabus-output/src/data/.
 */

import path from 'node:path';
import {
  readHookInput,
  toolPaths,
  resolvePath,
  outputDir,
  exists,
  fileSize,
  readJson,
  normalize,
  blockToolUse,
  injectContext,
  publicAudioPath,
  syllabusLessonIds,
} from './lib.mjs';

const VALID_SECTION_TYPES = new Set([
  'intro',
  'concept',
  'code-example',
  'callout',
  'summary',
  'diagram',
  'exercise',
  'quote',
  'list',
  'steps',
  'table',
]);

function validateSyllabus(obj, fatals, warns) {
  if (!obj || !Array.isArray(obj.modules) || obj.modules.length === 0) {
    fatals.push('syllabus.json: "modules" must be a non-empty array.');
    return;
  }
  if (!obj.title) warns.push('syllabus.json: missing "title".');
  if (!obj.description) warns.push('syllabus.json: missing "description".');
  obj.modules.forEach((m, i) => {
    if (!m || !m.id) fatals.push(`syllabus.json: module[${i}] missing "id".`);
    if (!m || !m.title) warns.push(`syllabus.json: module[${i}] missing "title".`);
    if (!m || !Array.isArray(m.lessons) || m.lessons.length === 0) {
      fatals.push(`syllabus.json: module "${(m && m.id) || i}" has no lessons.`);
    }
  });
}

function validateLesson(obj, file, fatals, warns) {
  const sections = (obj && obj.content && obj.content.sections) || (obj && obj.sections);
  if (!Array.isArray(sections) || sections.length === 0) {
    fatals.push(`${file}: lesson has no content.sections[].`);
    return;
  }
  sections.forEach((s, i) => {
    if (!s || !s.type) {
      fatals.push(`${file}: section[${i}] missing "type".`);
      return;
    }
    if (!VALID_SECTION_TYPES.has(s.type)) {
      warns.push(`${file}: section[${i}] has unknown type "${s.type}" (renderer may show nothing).`);
    }
    if (s.type === 'code-example') {
      if (!s.code) fatals.push(`${file}: code-example section[${i}] missing "code".`);
      if (!s.language) warns.push(`${file}: code-example section[${i}] missing "language".`);
    }
    if (s.type === 'callout' && !s.body) {
      warns.push(`${file}: callout section[${i}] missing "body".`);
    }
    if (s.type === 'summary' && !Array.isArray(s.keyTakeaways) && !s.body) {
      warns.push(`${file}: summary section[${i}] has neither "keyTakeaways" nor "body".`);
    }
  });
}

function validateQuiz(obj, file, fatals, warns) {
  if (!obj || !Array.isArray(obj.questions) || obj.questions.length === 0) {
    fatals.push(`${file}: quiz has no "questions" array.`);
    return;
  }
  obj.questions.forEach((q, i) => {
    if (!q || !q.type) {
      fatals.push(`${file}: question[${i}] missing "type".`);
      return;
    }
    // Any option-based question must have exactly one correct option.
    if (Array.isArray(q.options)) {
      const correct = q.options.filter((o) => o && o.correct === true).length;
      if (correct !== 1) {
        fatals.push(
          `${file}: question "${q.id || i}" has ${correct} correct options (must be exactly 1).`
        );
      }
    }
    if (q.type === 'code-completion' && !Array.isArray(q.blanks)) {
      warns.push(`${file}: code-completion "${q.id || i}" missing "blanks".`);
    }
    if (q.type === 'ordering' && !Array.isArray(q.items)) {
      warns.push(`${file}: ordering "${q.id || i}" missing "items".`);
    }
    if (q.type === 'coding-challenge' && !q.solutionCode) {
      warns.push(`${file}: coding-challenge "${q.id || i}" missing "solutionCode".`);
    }
  });
}

function validateManifest(obj, file, out, fatals, warns) {
  if (!obj || !obj.provider) {
    fatals.push(`${file}: missing "provider" (expected "edge-tts" or "web-speech").`);
    return;
  }
  if (!Array.isArray(obj.lessons)) {
    fatals.push(`${file}: "lessons" must be an array.`);
    return;
  }
  if (obj.provider === 'edge-tts') {
    for (const L of obj.lessons) {
      const id = (L && L.lessonId) || '?';
      if (!L || !L.audioFile) {
        fatals.push(`${file}: lesson "${id}" has no "audioFile" (provider is edge-tts).`);
        continue;
      }
      const abs = publicAudioPath(out, L.audioFile);
      if (!exists(abs)) fatals.push(`${file}: lesson "${id}" audioFile missing on disk: ${L.audioFile}`);
      else if (fileSize(abs) < 1024) fatals.push(`${file}: lesson "${id}" audio is empty/corrupt (<1KB): ${L.audioFile}`);
      // Sequential, non-overlapping section timestamps.
      if (Array.isArray(L.sections)) {
        let prev = -1;
        for (const sec of L.sections) {
          if (typeof sec.startTime === 'number' && typeof sec.endTime === 'number') {
            if (sec.startTime < prev || sec.endTime < sec.startTime) {
              warns.push(`${file}: lesson "${id}" has out-of-order section timestamps.`);
              break;
            }
            prev = sec.endTime;
          }
        }
      }
    }
  } else if (obj.provider === 'web-speech') {
    for (const L of obj.lessons) {
      const id = (L && L.lessonId) || '?';
      if (L && L.audioFile) {
        fatals.push(`${file}: web-speech lesson "${id}" must not reference an "audioFile".`);
      }
      const hasScript = L && L.script && (!Array.isArray(L.script) || L.script.length > 0);
      if (!hasScript) fatals.push(`${file}: web-speech lesson "${id}" is missing its "script".`);
    }
  } else {
    fatals.push(`${file}: unknown provider "${obj.provider}".`);
  }

  // Every syllabus lesson should appear in the manifest.
  const syllabusPath = path.join(out, 'src', 'data', 'syllabus.json');
  if (exists(syllabusPath)) {
    try {
      const ids = syllabusLessonIds(readJson(syllabusPath));
      const covered = new Set(obj.lessons.map((l) => l && l.lessonId));
      const missing = ids.filter((id) => !covered.has(id));
      if (missing.length) warns.push(`${file}: not all lessons are narrated. Missing: ${missing.join(', ')}.`);
    } catch {
      /* syllabus unreadable — skip cross-check */
    }
  }
}

async function main() {
  const input = await readHookInput();
  const out = outputDir(input);

  const dataFiles = toolPaths(input)
    .map(normalize)
    .filter((p) => p.includes('syllabus-output/src/data/') && p.endsWith('.json'));
  if (dataFiles.length === 0) process.exit(0);

  const fatals = [];
  const warns = [];

  for (const p of dataFiles) {
    const abs = resolvePath(input, p);
    if (!exists(abs)) continue; // deletion or not-yet-written
    let obj;
    try {
      obj = readJson(abs);
    } catch (err) {
      fatals.push(`${path.basename(p)}: invalid JSON — ${err.message}`);
      continue;
    }
    const base = path.basename(p);
    if (base === 'syllabus.json') validateSyllabus(obj, fatals, warns);
    else if (base === 'audio-manifest.json') validateManifest(obj, base, out, fatals, warns);
    else if (p.includes('/lessons/')) validateLesson(obj, base, fatals, warns);
    else if (p.includes('/quizzes/')) validateQuiz(obj, base, fatals, warns);
  }

  if (fatals.length) {
    blockToolUse(
      'Syllabus artifact validation failed — fix before continuing:\n- ' +
        fatals.join('\n- ') +
        (warns.length ? '\n\nAlso review:\n- ' + warns.join('\n- ') : '')
    );
  }
  if (warns.length) {
    injectContext('PostToolUse', 'Syllabus artifact warnings:\n- ' + warns.join('\n- '));
  }
  process.exit(0);
}

main().catch(() => process.exit(0));
