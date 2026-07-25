#!/usr/bin/env node
/**
 * make-module-briefs — deterministic context slicer.
 *
 * The WRITE phase used to run as a single long-lived agent that held the whole
 * syllabus plus every lesson it had already written. Cache-read cost then grows
 * with the square of the lesson count: the last lesson re-reads everything
 * before it. This script pre-slices `syllabus.json` into one small, flat brief
 * per module so each authoring agent can run in a fresh ~20k context and never
 * needs to open the full syllabus, its sibling modules, or its own output.
 *
 * Written by code, not by the model: slicing JSON is deterministic, so paying
 * output tokens for it is pure waste.
 *
 * Usage:  node scripts/make-module-briefs.mjs [outputDir]
 * Default outputDir: ./syllabus-output
 */

import fs from 'node:fs';
import path from 'node:path';

const outDir = path.resolve(process.argv[2] || 'syllabus-output');
const dataDir = path.join(outDir, 'src', 'data');
const syllabusPath = path.join(dataDir, 'syllabus.json');
const briefsDir = path.join(outDir, '.briefs');

function fail(msg) {
  console.error(`make-module-briefs: ${msg}`);
  process.exit(1);
}

function readJson(p) {
  try {
    return JSON.parse(fs.readFileSync(p, 'utf8'));
  } catch (err) {
    fail(`could not read ${path.relative(outDir, p)} — ${err.message}`);
  }
}

if (!fs.existsSync(syllabusPath)) {
  fail(`${path.relative(process.cwd(), syllabusPath)} not found. Run the curriculum-architect first.`);
}

const syllabus = readJson(syllabusPath);
const modules = Array.isArray(syllabus.modules) ? syllabus.modules : [];
if (modules.length === 0) fail('syllabus.json contains no modules.');

// The learning brief is optional; the orchestrator writes it during BRIEF so the
// per-module agents inherit tone/goals without re-asking the user.
const learningBriefPath = path.join(briefsDir, 'learning-brief.json');
const learningBrief = fs.existsSync(learningBriefPath) ? readJson(learningBriefPath) : null;

// Resolve which source chunks a module needs, so the authoring agent opens only
// those files instead of scanning the whole corpus directory.
const chunksDir = path.join(dataDir, 'source', 'chunks');
const chunkFiles = fs.existsSync(chunksDir) ? fs.readdirSync(chunksDir) : [];

function resolveChunks(module) {
  const refs = new Set();
  for (const lesson of module.lessons || []) {
    for (const ref of lesson.sourceRefs || []) refs.add(ref);
  }
  return [...refs]
    .map((ref) => {
      const match = chunkFiles.find((f) => f === ref || f.replace(/\.[^.]+$/, '') === ref);
      return match ? `src/data/source/chunks/${match}` : null;
    })
    .filter(Boolean);
}

// A neighbour summary gives just enough continuity ("pick up where module 2 left
// off") without the agent reading the adjacent modules in full.
function neighbour(module) {
  if (!module) return null;
  return {
    id: module.id,
    title: module.title,
    lessonTitles: (module.lessons || []).map((l) => l.title),
  };
}

fs.mkdirSync(briefsDir, { recursive: true });

const index = [];

modules.forEach((module, i) => {
  const moduleNum = String(i + 1).padStart(2, '0');
  const id = module.id || `mod-${moduleNum}`;
  const lessons = module.lessons || [];

  const brief = {
    _note:
      'Self-contained brief for ONE module. Everything you need is here — do not open syllabus.json, sibling modules, or lessons you have already written.',
    learningBrief,
    course: {
      title: syllabus.title,
      description: syllabus.description,
      difficulty: syllabus.difficulty,
      totalDuration: syllabus.totalDuration,
      prerequisites: syllabus.prerequisites || [],
      moduleCount: modules.length,
      modulePosition: i + 1,
    },
    source: syllabus.source || null,
    module,
    neighbors: {
      previous: neighbour(modules[i - 1]),
      next: neighbour(modules[i + 1]),
    },
    sourceChunks: resolveChunks(module),
    outputs: {
      lessons: lessons.map((l) => `src/data/lessons/${l.id}.json`),
      quiz: `src/data/quizzes/quiz-${id}.json`,
    },
    quizTargets: module.quiz || { questionCount: 5, types: ['multiple-choice'], codingChallenge: false },
  };

  const briefPath = path.join(briefsDir, `${id}.json`);
  fs.writeFileSync(briefPath, `${JSON.stringify(brief, null, 2)}\n`);

  index.push({
    id,
    title: module.title,
    brief: path.relative(outDir, briefPath),
    lessonCount: lessons.length,
    outputs: brief.outputs,
  });
});

fs.writeFileSync(path.join(briefsDir, 'index.json'), `${JSON.stringify({ modules: index }, null, 2)}\n`);

console.log(`✅ ${index.length} module briefs → ${path.relative(process.cwd(), briefsDir)}/`);
for (const m of index) {
  console.log(`   ${m.id}  ${m.lessonCount} lessons  →  ${m.brief}`);
}
console.log('\nAuthor each module in its own subagent invocation, passing only its brief path.');
