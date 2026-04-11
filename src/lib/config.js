import fs from 'fs-extra';
import path from 'path';

const CONFIG_FILENAME = 'syllabus.config.js';

const DEFAULT_CONFIG = {
  learner: {
    level: 'intermediate',
    style: 'hands-on',
    goals: ['skill-acquisition'],
    timeCommitment: '2h/day',
  },
  output: {
    framework: 'react',
    theme: 'dark',
    includePlayground: true,
    includeQuizzes: true,
    includeDiagrams: true,
    progressTracking: true,
  },
  audio: {
    enabled: true,
    provider: 'edge-tts',
    voice: 'en-US-AriaNeural',
    speed: 1.0,
    fallback: 'web-speech',
  },
  deploy: {
    enabled: true,
    provider: 'auto',
    autoPrompt: true,
  },
  agents: {
    model: 'claude-sonnet-4-20250514',
    maxRetries: 3,
    parallelAgents: true,
  }
};

/**
 * Load Syllabus configuration from the project root.
 * Falls back to defaults if no config file exists.
 */
export async function loadConfig() {
  const configPath = path.resolve(CONFIG_FILENAME);
  
  if (await fs.pathExists(configPath)) {
    try {
      const userConfig = await import(configPath);
      return deepMerge(DEFAULT_CONFIG, userConfig.default || userConfig);
    } catch (err) {
      console.warn(`Warning: Could not load ${CONFIG_FILENAME}: ${err.message}`);
      return DEFAULT_CONFIG;
    }
  }

  return DEFAULT_CONFIG;
}

/**
 * Deep merge two objects, preferring values from the override.
 */
function deepMerge(base, override) {
  const result = { ...base };
  
  for (const key of Object.keys(override)) {
    if (
      override[key] &&
      typeof override[key] === 'object' &&
      !Array.isArray(override[key]) &&
      base[key] &&
      typeof base[key] === 'object'
    ) {
      result[key] = deepMerge(base[key], override[key]);
    } else {
      result[key] = override[key];
    }
  }

  return result;
}
