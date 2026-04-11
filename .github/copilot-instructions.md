# Syllabus

An interactive tutorial builder. When a user describes a topic they want to learn, switch to the **@Syllabus** agent — it orchestrates the entire pipeline automatically.

## Activation

Trigger when the user says anything like:
- "I want to learn [topic]"
- "Teach me [topic]"
- "Build a tutorial on [topic]"

## What to do

Switch to the **@Syllabus** agent. It handles everything:
1. Asks brief clarifying questions if needed
2. Delegates to specialist subagents (curriculum-architect, content-reviewer, lesson-writer, quiz-master, ui-designer, react-developer, quality-auditor)
3. Each subagent reads its own skills from `.github/skills/`
4. Output goes to `syllabus-output/`
5. Verifies the build works
6. Audits for accessibility, performance, and quality — auto-fixes issues

The user only interacts with @Syllabus. The 7 specialist agents are invisible subagents.

## Important

- If the build fails, fix it. Don't just report errors.
- The final output must be a working React app the user can run with `cd syllabus-output && npm run dev`.
