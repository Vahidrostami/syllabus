---
name: source-extraction
description: "Ingest a user-provided document (PDF, Markdown, TXT, DOCX, EPUB, HTML) and turn it into a clean, chunked source corpus that grounds the syllabus and lessons. Use when the learner wants a course built FROM their own material (a white paper, book chapter, spec, internal doc) instead of, or in addition to, web research."
---

# Source Extraction Skill

Use this skill when the learner supplies their own document(s) and wants the
course grounded in that material — "build a course from this PDF", "teach me
everything in this white paper", "turn this spec into a tutorial".

The goal: convert one or more raw documents into a **clean, structured,
chunked corpus** that later phases (curriculum-architect, lesson-writer,
quiz-master) treat as the primary source of truth.

> **Grounding contract:** In source mode, the document is the authority. Every
> module, lesson, and quiz question must trace back to something actually in the
> corpus. Do not invent facts the document doesn't support. Web research is
> allowed only to *fill gaps* or *clarify terminology*, and anything sourced
> from the web must be marked as supplemental (see "Gap-filling" below).

---

## 0. Locate the source

The agent (or the orchestrator's BRIEF phase) will hand you one or more
`sources`. A source is a **local file path** or **pasted text** — never a
login-gated URL.

- If the user gave a URL that requires authentication (Google Drive, Notion,
  SharePoint, paywalled sites), you **cannot** fetch it. Ask the user to
  download the file into the workspace (e.g. `./docs/`) or paste the text.
- Public, directly-downloadable URLs (a raw `.pdf`/`.md`/`.txt` link) may be
  downloaded with `curl -L -o docs/<name> <url>` first, then treated as a local
  file.
- Files outside the workspace (e.g. `~/Downloads/paper.pdf`) are fine — read
  them by absolute path, but **copy the extracted text** into the output tree
  so the build is self-contained.

---

## 1. Extract text

Pick the extractor by file type. Prefer tools already on the machine
(the SessionStart hook reports availability; check with `command -v`).

| Format | Preferred | Command |
|--------|-----------|---------|
| PDF (text) | `pdftotext` (poppler) | `pdftotext -layout "<in>.pdf" "<out>.txt"` |
| PDF (any) | `pdftotext` then fallback | try `pdftotext`; if output is empty/garbled, the PDF is likely scanned → OCR (below) |
| PDF/DOCX/EPUB/HTML → Markdown | `pandoc` | `pandoc "<in>" -t gfm -o "<out>.md"` |
| DOCX | `pandoc` | `pandoc "<in>.docx" -t gfm -o "<out>.md"` |
| Markdown / TXT | none | read the file directly |
| Scanned PDF / images | `ocrmypdf` or `tesseract` | `ocrmypdf "<in>.pdf" "<ocr>.pdf" && pdftotext -layout "<ocr>.pdf" "<out>.txt"` |

Notes:
- `pdftotext -layout` preserves columns and tables far better than the default.
- Inspect first: `pdfinfo "<in>.pdf"` for page count; skim the raw `.txt` head to
  confirm it isn't empty (a sign of a scanned/DRM PDF).
- If no extractor is installed, install the smallest one that works
  (`brew install poppler` / `pip install pdfminer.six`) rather than giving up.
- A quick Python fallback when CLI tools are absent:
  ```bash
  python3 - "<in>.pdf" "<out>.txt" <<'PY'
  import sys
  from pdfminer.high_level import extract_text
  open(sys.argv[2], "w").write(extract_text(sys.argv[1]))
  PY
  ```

---

## 2. Clean the extracted text

Raw extraction is noisy. Before chunking, strip artifacts:

- Remove repeated page headers/footers and running titles.
- Drop page numbers and line-number gutters.
- Rejoin words hyphenated across line breaks (`exam-\nple` → `example`).
- Collapse hard-wrapped lines back into paragraphs (keep intentional breaks:
  headings, lists, code, tables).
- Preserve structure signals: heading text, bullet/numbered lists, code blocks,
  table rows, figure/table captions.
- Keep figure and table **captions** even though the image itself is lost —
  they carry meaning ("Figure 3: throughput vs. batch size").

Do not paraphrase or summarize yet — this pass is faithful cleanup only.

---

## 3. Chunk into a structured corpus

Split the cleaned text along the document's own structure so later phases can
cite precisely.

- Prefer the document's natural sections (chapters, numbered headings,
  `## Heading`s). Each becomes a chunk.
- If a section is very long (> ~1500 words), sub-split on sub-headings or
  paragraph groups.
- Give every chunk a stable id and a human title, and preserve order.
- Record where it came from (source file + page range or heading path) so
  lessons can cite it.

---

## 4. Write the corpus to the output tree

Save everything under `syllabus-output/src/data/source/`:

```
syllabus-output/src/data/source/
├── manifest.json          ← index of sources + chunks (below)
├── raw/                   ← verbatim extracted text, one file per source
│   └── day-1.txt
└── chunks/                ← cleaned, chunked corpus (one .md per chunk)
    ├── 001-introduction.md
    ├── 002-architecture.md
    └── ...
```

`manifest.json` schema:
```json
{
  "mode": "source-grounded",
  "webSupplement": "gap-fill-only",
  "generatedAt": "2026-07-05T00:00:00Z",
  "sources": [
    {
      "id": "day-1",
      "title": "Day 1 — <document title from cover/first heading>",
      "originalPath": "~/Downloads/Day_1_v3.pdf",
      "format": "pdf",
      "pages": 42,
      "extractor": "pdftotext -layout",
      "rawFile": "raw/day-1.txt"
    }
  ],
  "chunks": [
    {
      "id": "001-introduction",
      "sourceId": "day-1",
      "title": "Introduction",
      "headingPath": ["1. Introduction"],
      "pages": "1-3",
      "file": "chunks/001-introduction.md",
      "wordCount": 820,
      "keyTerms": ["term A", "term B"]
    }
  ],
  "outline": [
    { "title": "Introduction", "chunkIds": ["001-introduction"] },
    { "title": "Architecture", "chunkIds": ["002-architecture"] }
  ],
  "coverageNotes": [
    "Document covers X, Y, Z in depth.",
    "Assumes reader already knows <prereq> — not explained in the doc.",
    "Mentions <topic> only briefly — candidate for a web gap-fill."
  ]
}
```

Each `chunks/*.md` file starts with a small front-matter header, then the
cleaned text:
```markdown
---
id: 002-architecture
source: day-1
title: Architecture
pages: 4-9
---

<cleaned text of this section, faithful to the document>
```

---

## 5. Build the source outline (hand-off to the architect)

Produce a short **outline** (also stored in `manifest.json.outline`) that maps
the document's structure to a proposed teaching order. This is the raw material
the curriculum-architect turns into modules/lessons. Reorder for pedagogy if
needed (foundations first), but every outline node must point at real chunks.

Also record honest **coverage notes**:
- What the document teaches well (→ core modules).
- Prerequisites the document *assumes but does not explain* (→ a "Foundations"
  module, or a web gap-fill, or a noted prerequisite).
- Topics mentioned but not developed (→ optional/further-reading, or gap-fill).

---

## 6. Gap-filling policy (document-first)

When `webSupplement` is `gap-fill-only`:
- Teach from the corpus first. Only reach for the web to (a) define a term the
  document uses but never explains, (b) provide a runnable example the document
  describes but doesn't include, or (c) supply essential prerequisite context.
- Mark anything web-sourced clearly in lesson content (e.g. a callout:
  "📎 Background (not from the paper): …") so learners know what's from their
  document vs. added context.
- Never let web content contradict or override the document. If the web and the
  document disagree, present the document's position and note the discrepancy.

When `webSupplement` is `none`: stay strictly inside the corpus. If something is
missing, say so ("The document doesn't cover …") rather than inventing it.

---

## Quality checklist

Before handing off to the curriculum-architect:
- [ ] Every source file was extracted; no chunk is empty or garbled.
- [ ] Scanned/DRM PDFs were detected and OCR'd (or the user was told to supply text).
- [ ] Headers/footers/page numbers stripped; hyphenation rejoined.
- [ ] Chunks follow the document's real structure and are ordered.
- [ ] `manifest.json` validates and every chunk `file` exists.
- [ ] `outline` and `coverageNotes` reflect what's actually in the document.
- [ ] No paraphrasing in `raw/`; cleanup only in `chunks/`.
- [ ] Source URLs that were login-gated were replaced with local files/pasted text.
