export const BANNER = `
  ╔═╗╦ ╦╦  ╦  ╔═╗╔╗ ╦ ╦╔═╗
  ╚═╗╚╦╝║  ║  ╠═╣╠╩╗║ ║╚═╗
  ╚═╝ ╩ ╩═╝╩═╝╩ ╩╚═╝╚═╝╚═╝
                    Turn any topic into an interactive tutorial
`;

export const AGENT_STEPS = [
  {
    num: 1,
    agent: 'Curriculum Architect',
    icon: '🔍',
    action: 'Researching topic & building syllabus...',
    result: 'Syllabus ready: 8 modules, 24 lessons, ~6 hours',
    duration: 800
  },
  {
    num: 2,
    agent: 'Content Reviewer',
    icon: '🎯',
    action: 'Calibrating for your learning goals...',
    result: 'Adjusted: reordered 2 modules, added practical scenarios',
    duration: 500
  },
  {
    num: 3,
    agent: 'Lesson Writer',
    icon: '✍️',
    action: 'Composing lesson content...',
    result: '24 lessons written with code examples & diagrams',
    duration: 1200
  },
  {
    num: 4,
    agent: 'Quiz Master',
    icon: '🧩',
    action: 'Designing assessments & challenges...',
    result: '32 questions, 8 coding challenges, 4 scenarios',
    duration: 700
  },
  {
    num: 5,
    agent: 'UI Designer',
    icon: '🎨',
    action: 'Crafting the visual experience...',
    result: 'Dark theme, responsive layout, progress dashboard',
    duration: 500
  },
  {
    num: 6,
    agent: 'React Developer',
    icon: '⚛️',
    action: 'Building the interactive app...',
    result: '14 components, routing, state management, animations',
    duration: 1000
  }
];

export const THEMES = {
  dark: 'Midnight Scholar',
  light: 'Paper & Ink',
  terminal: 'Terminal Green',
  notebook: 'Notebook'
};

export const STYLES = {
  'hands-on': 'Practical, code-first learning with exercises',
  'conceptual': 'Deep understanding with mental models and diagrams',
  'project-based': 'Build a real project step by step',
  'interview-prep': 'Prepare for technical interviews with practice questions'
};
