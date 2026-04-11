/**
 * Parse a user's learning request into a structured LearningBrief.
 * Infers depth, style, and goals from natural language cues.
 */
export function parseRequest(topic, options = {}) {
  const brief = {
    topic: topic.trim(),
    depth: options.depth || inferDepth(topic),
    style: options.style || inferStyle(topic),
    theme: options.theme || 'dark',
    output: options.output || './syllabus-output',
    includePlayground: options.playground !== false,
    includeQuizzes: options.quizzes !== false,
    duration: options.duration || 'auto',
    goals: inferGoals(topic),
    createdAt: new Date().toISOString()
  };

  // Auto-detect depth if not specified
  if (brief.depth === 'auto') {
    brief.depth = inferDepth(topic);
  }

  // Auto-detect style if not specified
  if (brief.style === 'auto') {
    brief.style = inferStyle(topic);
  }

  return brief;
}

/**
 * Infer difficulty level from topic keywords
 */
function inferDepth(topic) {
  const lower = topic.toLowerCase();
  
  const advancedSignals = [
    'advanced', 'deep dive', 'internals', 'optimization', 'distributed',
    'architecture', 'system design', 'performance tuning', 'at scale'
  ];
  
  const beginnerSignals = [
    'beginner', 'intro', 'basics', 'getting started', 'first',
    'learn', '101', 'fundamentals', 'what is', 'for beginners'
  ];

  if (advancedSignals.some(s => lower.includes(s))) return 'advanced';
  if (beginnerSignals.some(s => lower.includes(s))) return 'beginner';
  return 'intermediate';
}

/**
 * Infer learning style from topic keywords
 */
function inferStyle(topic) {
  const lower = topic.toLowerCase();
  
  if (lower.includes('interview') || lower.includes('job') || lower.includes('prepare')) {
    return 'interview-prep';
  }
  if (lower.includes('build') || lower.includes('project') || lower.includes('create')) {
    return 'project-based';
  }
  if (lower.includes('theory') || lower.includes('understand') || lower.includes('how does')) {
    return 'conceptual';
  }
  return 'hands-on';
}

/**
 * Extract learning goals from topic description
 */
function inferGoals(topic) {
  const goals = [];
  const lower = topic.toLowerCase();

  if (lower.includes('interview') || lower.includes('job')) {
    goals.push('career-preparation');
  }
  if (lower.includes('portfolio') || lower.includes('project') || lower.includes('build')) {
    goals.push('portfolio-building');
  }
  if (lower.includes('certification') || lower.includes('exam')) {
    goals.push('certification');
  }
  
  if (goals.length === 0) {
    goals.push('skill-acquisition');
  }

  return goals;
}
