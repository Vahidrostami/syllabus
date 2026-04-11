---
name: design-system
description: "Visual design system and component library for Syllabus tutorials. Includes 4 theme presets, component specs, spacing scale, and icon conventions."
---

# Design System Skill

## Theme Presets

### Midnight Scholar (Dark - Default for coding topics)
```css
--bg: #0a0e1a; --surface: #131829; --primary: #6366f1; --accent: #22d3ee;
--success: #34d399; --text: #e2e8f0; --text-muted: #64748b; --border: #1e293b; --code-bg: #0f1320;
```

### Paper & Ink (Light - For general topics)
```css
--bg: #fafaf9; --surface: #ffffff; --primary: #2563eb; --accent: #0891b2;
--success: #16a34a; --text: #1c1917; --text-muted: #78716c; --border: #e7e5e4; --code-bg: #f5f5f4;
```

### Terminal Green (For DevOps/CLI topics)
```css
--bg: #0c0c0c; --surface: #1a1a1a; --primary: #22c55e; --accent: #a3e635;
--success: #22c55e; --text: #d4d4d4; --text-muted: #737373; --border: #2a2a2a; --code-bg: #111111;
```

### Notebook (For data science/research)
```css
--bg: #fffbeb; --surface: #ffffff; --primary: #7c3aed; --accent: #f59e0b;
--success: #10b981; --text: #292524; --text-muted: #78716c; --border: #e7e5e4; --code-bg: #f5f5f0;
```

## Component Specs

### Sidebar Navigation
- Width: 280px (desktop), full-screen drawer (mobile)
- Sections: Progress ring, module list, settings
- Active item: primary color left border + background tint
- Completed items: success checkmark icon

### Lesson Content Area
- Max width: 760px, centered
- Line height: 1.75 for body text
- Paragraph spacing: 1.5rem
- Code blocks: full-width with rounded corners, distinct background

### Quiz Cards
- Rounded container with subtle border
- Options as clickable cards (not radio buttons)
- Correct: green border + check icon + explanation slide-down
- Incorrect: red border + x icon + explanation slide-down

### Progress Indicators
- Overall: SVG ring with percentage center
- Per-module: horizontal bar with label
- Per-lesson: simple checkmark or dot indicator

## Spacing Scale (based on 0.5rem unit)
```
xs: 0.25rem (4px) | sm: 0.5rem (8px) | md: 1rem (16px) | lg: 1.5rem (24px)
xl: 2rem (32px) | 2xl: 3rem (48px) | 3xl: 4rem (64px)
```

## Icon Usage (Lucide React)
- Navigation: `ChevronLeft`, `ChevronRight`, `Menu`, `X`
- Status: `Check`, `X`, `AlertCircle`, `Info`, `Lightbulb`
- Content: `Code`, `BookOpen`, `Puzzle`, `Trophy`, `Clock`
- Actions: `Copy`, `Play`, `RotateCcw`, `ChevronDown`
