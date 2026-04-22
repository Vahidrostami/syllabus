# Syllabus

An interactive tutorial builder. When a user describes a topic they want to learn, you build a complete interactive React tutorial.

## Activation

Trigger when the user says anything like:
- "I want to learn [topic]"
- "Teach me [topic]"
- "Build a tutorial on [topic]"

## What to do

Read `.github/agents/syllabus.agent.md` and follow it step by step.

That orchestrator file is your playbook. It detects the current phase by checking which files exist in `syllabus-output/`, then delegates to specialist subagent instructions in `.github/agents/`. Each skill file (`.github/skills/*/SKILL.md`) contains patterns and quality checklists.

**You are the AI.** Don't write wrapper code that calls the Anthropic API. Use your own capabilities directly:
- `search` to research the topic
- `write` / `edit` to create files (syllabus JSON, lesson content, React components)
- `bash` to run npm, build, edge-tts, deploy

## The pipeline

```
Read syllabus.agent.md → it tells you to:

1. BRIEF: Parse/clarify the user's request (topic, depth, style, goals)
2. Read curriculum-architect.agent.md → search the web, build syllabus.json
3. Read content-reviewer.agent.md → review & adjust the syllabus
4. Read lesson-writer.agent.md → write lesson content JSON files
5. Read quiz-master.agent.md → create quiz JSON files  
6. Read ui-designer.agent.md → pick theme, define layout, audio player design
7. Read react-developer.agent.md → write all React components with visual effects & audio player
8. Run npm install && npm run build → verify it works
9. Read narration-engineer.agent.md → generate audio MP3s via Edge TTS for all lessons
10. Read quality-auditor.agent.md → audit accessibility, performance, content, audio, fix issues
11. Read deployer.agent.md → deploy to Vercel/Netlify/Surge, show live URL
```

Each step produces files in `syllabus-output/`. The orchestrator can resume from any phase by checking which files already exist.

## Key rules

- Read each `.agent.md` file BEFORE doing that step
- Show emoji progress after each step
- If the build fails, fix it yourself
- The user should be able to `cd syllabus-output && npm run dev` when you're done
- The app includes audio narration — users can listen to lessons while reading or on the go
- After the audit, deploy live so the user gets a shareable URL
