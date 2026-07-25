#!/usr/bin/env node
/**
 * validate-course-data — deterministic QUIZ/WRITE phase gate.
 *
 * Checking that every lesson exists, every quiz matches its targets, and every
 * MCQ has exactly one correct answer is mechanical work. Running it as code
 * instead of as a model pass means the quiz-master is only invoked for the
 * modules that actually failed, rather than re-reading the entire course.
 *
 * Usage:  node scripts/validate-course-data.mjs [outputDir]
 * Exit 0 = everything valid. Exit 1 = failures listed per module.
 */

import fs from 'node:fs';
import path from 'node:path';

const outDir = path.resolve(process.argv[2] || 'syllabus-output');
const dataDir = path.join(outDir, 'src', 'data');
const syllabusPath = path.join(dataDir, 'syllabus.json');

if (!fs.existsSync(syllabusPath)) {
  console.error(`validate-course-data: ${path.relative(process.cwd(), syllabusPath)} not found.`);
  process.exit(1);
}

const syllabus = JSON.parse(fs.readFileSync(syllabusPath, 'utf8'));
const modules = syllabus.modules || [];

/** Per-module problem lists, so the orchestrator can re-run only what broke. */
const report = [];

function readJsonSafe(p) {
  if (!fs.existsSync(p)) return { missing: true };
  try {
    return { data: JSON.parse(fs.readFileSync(p, 'utf8')) };
  } catch (err) {
    return { invalid: err.message };
  }
}

function validateLesson(lesson, problems) {
  const rel = `src/data/lessons/${lesson.id}.json`;
  const res = readJsonSafe(path.join(outDir, rel));
  if (res.missing) return problems.push(`${rel}: missing`);
  if (res.invalid) return problems.push(`${rel}: invalid JSON — ${res.invalid}`);

  const doc = res.data;
  const sections = doc?.content?.sections;
  if (!Array.isArray(sections) || sections.length === 0) {
    return problems.push(`${rel}: no content.sections`);
  }
  if (doc.lessonId !== lesson.id) {
    problems.push(`${rel}: lessonId "${doc.lessonId}" does not match syllabus id "${lesson.id}"`);
  }
  if (!sections.some((s) => s.type === 'summary' && Array.isArray(s.keyTakeaways) && s.keyTakeaways.length >= 2)) {
    problems.push(`${rel}: needs a summary section with 2+ keyTakeaways`);
  }
  for (const s of sections) {
    if (s.type === 'code-example' && !String(s.code || '').trim()) {
      problems.push(`${rel}: code-example section "${s.heading || ''}" has empty code`);
    }
  }
  if (lesson.hasCodeExample && !sections.some((s) => s.type === 'code-example')) {
    problems.push(`${rel}: syllabus marks hasCodeExample but no code-example section exists`);
  }
}

function validateQuestion(q, i, lessonIds, rel, problems) {
  const where = `${rel} q[${i}]${q.id ? ` (${q.id})` : ''}`;
  if (!q.type) return problems.push(`${where}: missing type`);
  if (!String(q.question || '').trim()) problems.push(`${where}: empty question text`);
  if (!String(q.explanation || '').trim() && q.type !== 'coding-challenge') {
    problems.push(`${where}: missing explanation`);
  }
  if (q.relatedLesson && !lessonIds.has(q.relatedLesson)) {
    problems.push(`${where}: relatedLesson "${q.relatedLesson}" is not in this module`);
  }

  switch (q.type) {
    case 'multiple-choice':
    case 'true-false': {
      const options = q.options || [];
      const correct = options.filter((o) => o.correct);
      if (options.length < 2) problems.push(`${where}: needs at least 2 options`);
      if (correct.length !== 1) problems.push(`${where}: has ${correct.length} correct options, expected exactly 1`);
      break;
    }
    case 'code-completion': {
      const template = String(q.codeTemplate || '');
      if (!template) problems.push(`${where}: missing codeTemplate`);
      for (const blank of q.blanks || []) {
        if (!template.includes(blank.id)) problems.push(`${where}: blank "${blank.id}" not present in codeTemplate`);
        if (!String(blank.answer || '').trim()) problems.push(`${where}: blank "${blank.id}" has no answer`);
      }
      if (!(q.blanks || []).length) problems.push(`${where}: no blanks defined`);
      break;
    }
    case 'ordering': {
      const items = q.items || [];
      const positions = items.map((it) => it.correctPosition).sort((a, b) => a - b);
      const expected = items.map((_, n) => n + 1);
      if (items.length < 2) problems.push(`${where}: needs at least 2 items`);
      else if (JSON.stringify(positions) !== JSON.stringify(expected)) {
        problems.push(`${where}: correctPosition values must be 1..${items.length} with no gaps or duplicates`);
      }
      break;
    }
    case 'coding-challenge': {
      if (!String(q.starterCode || '').trim()) problems.push(`${where}: missing starterCode`);
      if (!String(q.solutionCode || '').trim()) problems.push(`${where}: missing solutionCode`);
      break;
    }
    default:
      break;
  }
}

for (const module of modules) {
  const problems = [];
  const lessons = module.lessons || [];
  const lessonIds = new Set(lessons.map((l) => l.id));

  for (const lesson of lessons) validateLesson(lesson, problems);

  const quizRel = `src/data/quizzes/quiz-${module.id}.json`;
  const quizRes = readJsonSafe(path.join(outDir, quizRel));
  if (quizRes.missing) {
    problems.push(`${quizRel}: missing`);
  } else if (quizRes.invalid) {
    problems.push(`${quizRel}: invalid JSON — ${quizRes.invalid}`);
  } else {
    const quiz = quizRes.data;
    const questions = quiz.questions || [];
    const targets = module.quiz || {};
    const wanted = targets.questionCount || 3;

    if (questions.length < wanted) {
      problems.push(`${quizRel}: ${questions.length} questions, syllabus targets ${wanted}`);
    }
    if (targets.codingChallenge && !questions.some((q) => q.type === 'coding-challenge')) {
      problems.push(`${quizRel}: syllabus targets a coding challenge but none is present`);
    }
    const ids = questions.map((q) => q.id).filter(Boolean);
    if (new Set(ids).size !== ids.length) problems.push(`${quizRel}: duplicate question ids`);

    questions.forEach((q, i) => validateQuestion(q, i, lessonIds, quizRel, problems));
  }

  report.push({ id: module.id, title: module.title, problems });
}

const failing = report.filter((m) => m.problems.length > 0);

for (const m of report) {
  if (m.problems.length === 0) {
    console.log(`✅ ${m.id}  ${m.title}`);
  } else {
    console.log(`❌ ${m.id}  ${m.title}`);
    for (const p of m.problems) console.log(`     • ${p}`);
  }
}

if (failing.length === 0) {
  console.log(`\n✅ Course data valid — ${report.length} modules.`);
  process.exit(0);
}

console.log(
  `\n❌ ${failing.length}/${report.length} modules need repair: ${failing.map((m) => m.id).join(', ')}`
);
console.log('Re-invoke the authoring agent for ONLY these modules, passing .briefs/<id>.json.');
process.exit(1);
