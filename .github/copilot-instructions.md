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
2. Delegates to specialist subagents (curriculum-architect, content-reviewer, lesson-writer, quiz-master, ui-designer, react-developer, narration-engineer, quality-auditor, deployer)
3. Each subagent reads its own skills from `.github/skills/`
4. Output goes to `syllabus-output/`
5. Verifies the build works
6. Generates audio narration for all lessons (Edge TTS or Web Speech fallback)
7. Audits for accessibility, performance, and quality — auto-fixes issues
8. Deploys to free hosting (Vercel/Netlify/Surge) and provides a live URL

The user only interacts with @Syllabus. The 9 specialist agents are invisible subagents.

## Important

- If the build fails, fix it. Don't just report errors.
- The final output must be a working React app the user can run with `cd syllabus-output && npm run dev`.
- The app includes an audio player for listening to lessons on the go.
- After the audit, the tutorial is deployed live — the user gets a shareable URL.
