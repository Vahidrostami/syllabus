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

  // Agent configuration — how the AI pipeline runs
  agents: {
    model: 'claude-sonnet-4-20250514', // Model for agent execution
    maxRetries: 3,                      // Retries per agent on failure
    parallelAgents: true,               // Run lesson-writer & quiz-master in parallel
  }
}
