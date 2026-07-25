---
name: context-economy
description: Keep agent context small and flat so multi-file runs stay cheap. Covers per-module sharding, read discipline, edit-don't-rewrite, and what to hand to a script instead of the model. Load this in any agent that writes many files.
---

# Context Economy

Most of what a pipeline like this costs is **context carried across turns**, not
content produced. Cached context is re-read on every turn, so the bill is driven
by how much each agent is holding, multiplied by how long it holds it — not by
how many words it writes.

Cache-read cost is roughly:

$$\text{cost} \approx \text{context size} \times \text{number of turns}$$

So an agent that produces N artifacts in one context pays for artifact 1 again on
every turn through artifact N — quadratic growth. Splitting the same work across N
fresh contexts makes it linear, and improves quality: a 20k context writes
sharper prose than a saturated 180k one.

## Rule 1 — One module per invocation

## Rule 1 — One module per invocation

A long-running "do all N" agent is the main cost sink. Fan out instead:

```
for each module:
    node scripts/make-module-briefs.mjs      # once, up front
    invoke authoring agent with .briefs/mod-XX.json only
```

Each brief is self-contained: course metadata, the module's lessons and
objectives, neighbour summaries for continuity, resolved source chunk paths, and
exact output paths. The agent never needs the full syllabus.

## Rule 2 — Read discipline

Inside an authoring agent:

- **Never** open `syllabus.json`. The brief already contains your slice.
- **Never** re-read a file you just wrote. You wrote it; it is in your context.
- **Never** read sibling modules "for continuity". `neighbors` in the brief is
  the continuity.
- **Never** list or scan a directory to discover work. The brief's `outputs`
  block names every file you must produce.
- Open source chunks **only** by the paths in `sourceChunks`.

## Rule 3 — Edit, don't rewrite

Rewriting a 400-line file to change 3 lines costs 400 lines of output tokens.
Use a targeted edit with surrounding context. This matters most for the
quality-auditor and any repair pass.

## Rule 4 — If it's deterministic, it's a script

Anything identical on every run should cost zero tokens:

| Work | Do it with |
|---|---|
| Slicing the syllabus into briefs | `scripts/make-module-briefs.mjs` |
| Checking lessons/quizzes are well-formed | `scripts/validate-course-data.mjs` |
| Vite/Tailwind/router/progress-store boilerplate | copy a template, don't generate |
| Lesson JSON → narration script → MP3 | a Node script + edge-tts |
| Deploy | a shell command with provider fallback |

Invoke the model only on what a script reports as *broken* or genuinely creative.

## Rule 5 — Don't strand the cache

The prompt cache has a short TTL. A pipeline that pauses for human input between
phases re-writes its entire prefix on every resume, which can cost more than the
content it produces.

- Front-load every clarifying question into the BRIEF phase.
- Never block mid-pipeline for approval that could have been gathered up front.
- Run the pipeline in one unattended pass; review the result at the end.

## Rule 6 — Right-size the model

Reserve the strongest model for prose and bespoke components. Checklist
evaluation, schema conformance, research summarising, and orchestration
bookkeeping run fine on a small model — and a small model is several times
cheaper per token.

Pin the model in each agent's own definition, not at the session level. A
subagent runs in an isolated context with its own prompt cache, so giving it a
different model costs nothing extra — nothing is re-sent from the parent.

The one thing to avoid is switching the model of a **live conversation**
(the orchestrator). Prompt caches are keyed per model, so a mid-run switch
discards the cache and re-bills the entire prefix. Pick the session model once,
before the pipeline starts.

Two consequences worth knowing:

- A subagent's context window is sized by **its own** model. Small models have
  smaller windows — another reason each brief must stay small.
- A per-invocation or environment-level model override outranks the agent file.
  Leave those unset so the pinned routing actually applies.

## Quick self-check before any long phase

1. Am I about to load something I already have, or that a script could give me?
2. Is my context going to grow with each item I produce? If yes — shard.
3. Am I rewriting a whole file to change part of it?
4. Could a script decide whether this model pass is needed at all?
