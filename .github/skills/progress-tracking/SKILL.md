---
name: progress-tracking
description: "Implement learner progress tracking with localStorage persistence, module unlocking, celebration triggers, and streak tracking."
---

# Progress Tracking Skill

## Data Model

```typescript
interface LearnerProgress {
  completedLessons: string[];
  quizScores: Record<string, {
    score: number;
    total: number;
    attempts: number;
    lastAttempt: string;
  }>;
  currentLesson: string | null;
  bookmarks: string[];
  startedAt: string;
  lastActiveAt: string;
  totalTimeSpent: number;
  streakDays: number;
  longestStreak: number;
}
```

## Progress Calculation

```javascript
// Overall completion
const overallProgress = completedLessons.length / totalLessons;

// Module completion  
const moduleProgress = (moduleId) => {
  const moduleLessons = syllabus.modules
    .find(m => m.id === moduleId).lessons;
  const completed = moduleLessons
    .filter(l => completedLessons.includes(l.id));
  return completed.length / moduleLessons.length;
};

// Module unlocking — a module is unlocked if the previous module is ≥80% complete
const isModuleUnlocked = (moduleIndex) => {
  if (moduleIndex === 0) return true;
  return moduleProgress(modules[moduleIndex - 1].id) >= 0.8;
};
```

## Celebration Triggers
- Complete a lesson → checkmark animation + "1 of N" counter update
- Complete a module → confetti + module badge unlock  
- Perfect quiz score → special animation + "Mastered" badge
- Complete the course → full celebration screen + certificate view
- Streak milestone (3, 7, 14, 30 days) → streak flame animation

## localStorage Schema
Key: `syllabus-progress`
Debounced writes (500ms) to avoid performance impact.
Clear progress option in settings with confirmation dialog.
