# Syllabus

This project is **Syllabus**, an interactive tutorial builder. The full,
tool-neutral orchestration brief lives in [AGENTS.md](../AGENTS.md), which VS Code
loads automatically.

When the user says anything like "I want to learn [topic]", "Teach me [topic]",
"Build a tutorial on [topic]", or "Build a course from this [document]", switch to
the **@Syllabus** agent. It orchestrates the whole pipeline — research → review →
write → quiz → design → build → narrate → audit → deploy — by delegating to the
specialist subagents in `.github/agents/`.

Output goes to `syllabus-output/`, a working Vite + React app the user runs with
`cd syllabus-output && npm run dev`. If the build fails, fix it. The app includes
audio narration and is deployed live at the end for a shareable URL.
