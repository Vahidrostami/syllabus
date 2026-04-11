/**
 * Syllabus Configuration
 * 
 * Place this file as syllabus.config.js in your project root
 * to customize how tutorials are generated.
 */
export default {
  // Learner preferences — how YOU like to learn
  learner: {
    level: 'intermediate',        // beginner | intermediate | advanced
    style: 'hands-on',            // hands-on | conceptual | project-based | interview-prep
    goals: ['skill-acquisition'], // career-preparation | portfolio-building | certification | skill-acquisition
    timeCommitment: '2h/day',     // Used to estimate total course duration
  },

  // Output preferences — what gets generated
  output: {
    framework: 'react',           // react (more frameworks coming)
    theme: 'dark',                // dark | light | terminal | notebook
    includePlayground: true,      // Interactive code blocks
    includeQuizzes: true,         // Quizzes after each module
    includeDiagrams: true,        // SVG diagrams for visual concepts
    progressTracking: true,       // localStorage-based progress
  },

  // Audio narration — listen to lessons while reading or on the go
  audio: {
    enabled: true,                // Generate audio for all lessons
    provider: 'edge-tts',         // edge-tts (free, neural voices) | web-speech (browser-only) | none
    voice: 'en-US-AriaNeural',    // Microsoft neural voice (see edge-tts --list-voices)
    speed: 1.0,                   // Default playback speed (user can change in player)
    fallback: 'web-speech',       // Fallback if edge-tts unavailable
  },

  // Deployment — auto-deploy to free hosting after build
  deploy: {
    enabled: true,                // Deploy after quality audit passes
    provider: 'auto',             // auto | vercel | netlify | surge | github-pages | cloudflare
    autoPrompt: true,             // Ask user before deploying (set false to deploy silently)
  },

  // Agent configuration — how the AI pipeline runs
  agents: {
    model: 'claude-sonnet-4-20250514', // Model for agent execution
    maxRetries: 3,                      // Retries per agent on failure
    parallelAgents: true,               // Run lesson-writer & quiz-master in parallel
  }
}
