---
name: audit-automation
description: "Automated quality auditing for generated tutorials. Covers accessibility checks, performance analysis, content validation, responsive testing, and auto-fix strategies."
---

# Audit Automation Skill

## Audit Pipeline Overview

After the React app builds successfully, run a multi-pass audit to catch and fix issues before delivery. The audit has 6 categories, each with check → diagnose → fix → verify cycles.

## 1. Accessibility Audit

### Checks
- **Contrast ratios**: All text meets WCAG 2.1 AA (4.5:1 normal, 3:1 large)
- **ARIA attributes**: All interactive elements have proper roles and labels
- **Focus management**: Visible focus indicators, no keyboard traps
- **Skip links**: "Skip to main content" link present and functional
- **Alt text**: All `<img>` and `<svg>` have descriptive alternatives
- **Language**: `lang` attribute on `<html>`
- **Headings**: Proper hierarchy (no skipping h1→h3)
- **Live regions**: Quiz feedback uses `aria-live`
- **Progress bars**: Have `role="progressbar"` + `aria-valuenow`
- **Glass overlays**: Text maintains contrast against glass backgrounds

### Auto-Fix Patterns
```jsx
// Missing aria-label on icon button
// Before:
<button onClick={handleClick}><Menu size={20} /></button>
// Fix:
<button onClick={handleClick} aria-label="Open menu"><Menu size={20} /></button>

// Missing alt text
// Before:
<img src={diagram} />
// Fix:
<img src={diagram} alt={`Diagram illustrating ${section.title}`} />

// Missing progressbar role
// Before:
<div className="progress-bar" style={{ width: pct + '%' }} />
// Fix:
<div className="progress-bar" style={{ width: pct + '%' }}
  role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100} />

// Glass contrast fallback
// Before:
<div className="glass"><p>Text content</p></div>
// Fix: Add solid background fallback
<div className="glass" style={{ background: 'var(--glass-bg, var(--surface))' }}><p>Text content</p></div>
```

### Verification
After applying fixes, re-check:
- Search all `<button>` elements → each has text content or `aria-label`
- Search all `<img>` elements → each has `alt`
- Search all `role="progressbar"` → each has `aria-valuenow`
- Verify heading hierarchy in each page component

## 2. Performance Audit

### Checks
- **Bundle size**: Total JS < 500KB gzipped
- **Code splitting**: Quiz and lesson pages use `React.lazy`
- **Image optimization**: No unoptimized images > 100KB
- **Font loading**: `font-display: swap` on all web fonts
- **CSS**: No unused Tailwind classes bloating the bundle
- **Animations**: Framer Motion components use `lazy` import where possible
- **Layout shifts**: No CLS-causing elements (fixed dimensions on images, skeletons)

### Auto-Fix Patterns
```jsx
// Add lazy loading to route components
// Before:
import Lesson from './pages/Lesson'
// Fix:
const Lesson = React.lazy(() => import('./pages/Lesson'))

// Wrap lazy routes in Suspense
<Suspense fallback={<div className="p-6">Loading...</div>}>
  <Route path="lesson/:lessonId" element={<Lesson />} />
</Suspense>

// Add loading="lazy" to images
// Before:
<img src={url} alt={alt} />
// Fix:
<img src={url} alt={alt} loading="lazy" width={width} height={height} />
```

### Verification
- Run `npm run build` and check `dist/` size
- Verify chunk splitting in build output
- Check that quiz components are in separate chunks

## 3. Content Validation

### Checks
- **Lesson data**: Every lesson referenced in `syllabus.json` has a matching file in `src/data/lessons/`
- **Quiz data**: Every module with `quiz` in syllabus has a matching file in `src/data/quizzes/`
- **Section types**: All section `type` values in lesson JSON match known renderers
- **Code examples**: All code blocks have `language` and `code` fields
- **No empty content**: No lesson sections with empty `body` or `code`
- **Quiz answers**: Every MCQ has exactly one correct option
- **Links**: No broken internal links or references

### Auto-Fix Patterns
```javascript
// Missing lesson file → create stub
const stub = {
  id: lessonId,
  title: lessonTitle,
  content: {
    sections: [
      { type: "intro", body: "Content coming soon." }
    ]
  }
};

// Missing quiz file → create from syllabus spec
const quizStub = {
  moduleId: modId,
  questions: mod.quiz.types.map((type, i) => ({
    id: `q-${modId}-${i+1}`,
    type,
    question: "Question placeholder",
    options: type === 'multiple-choice' ? [
      { id: 'a', text: 'Option A', correct: true },
      { id: 'b', text: 'Option B', correct: false },
    ] : undefined,
  }))
};

// MCQ with no correct answer → mark first as correct
question.options[0].correct = true;
```

### Verification
- Cross-reference syllabus.json modules/lessons against filesystem
- Parse every JSON file for valid structure
- Run component render check (import each page, verify no throw)

## 4. Responsive Layout Audit

### Checks at breakpoints: 320px, 768px, 1024px, 1440px
- **Sidebar**: Hidden on mobile (<768px), shown as overlay/drawer
- **Content width**: Doesn't exceed viewport
- **Code blocks**: Horizontal scroll, not overflow
- **Text size**: Body ≥ 16px at all breakpoints
- **Padding**: Adequate spacing (no text touching edges)
- **Quiz cards**: Stack vertically on narrow screens
- **Progress ring**: Visible and legible at all sizes
- **Touch targets**: All buttons ≥ 44x44px

### Auto-Fix Patterns
```jsx
// Sidebar responsive
// Add useMediaQuery hook usage
const isMobile = useMediaQuery('(max-width: 767px)');
// On mobile: sidebar = drawer overlay, default closed

// Code block overflow
pre { overflow-x: auto; max-width: 100vw; }

// Touch target size
button { min-height: 44px; min-width: 44px; }
```

### Verification
- Check all component files for responsive classes
- Verify sidebar uses media query or responsive wrapper
- Check code blocks have `overflow-x: auto`

## 5. Route & Navigation Audit

### Checks
- **All routes render**: Each `<Route>` path renders without error
- **404 handling**: Unknown paths show a helpful fallback
- **Navigation consistency**: Sidebar links correspond to valid routes
- **Back/forward**: Browser history navigation works
- **Deep linking**: Direct URL access to any lesson/quiz works
- **Active state**: Current page highlighted in sidebar

### Auto-Fix Patterns
```jsx
// Missing 404 route
<Route path="*" element={<Navigate to="/" />} />

// Missing error boundary
class ErrorBoundary extends React.Component {
  state = { hasError: false };
  static getDerivedStateFromError() { return { hasError: true }; }
  render() {
    if (this.state.hasError) return <div>Something went wrong. <a href="/">Go home</a></div>;
    return this.props.children;
  }
}
```

## 6. Build Integrity Audit

### Checks
- **No warnings**: `npm run build` produces zero warnings
- **No TypeScript/lint errors**: If applicable
- **All imports resolve**: No missing module errors
- **Environment agnostic**: No hardcoded localhost URLs
- **Base path**: Works with relative paths (deployable to subdirectory)

### Auto-Fix Patterns
```javascript
// Missing dependency → add to package.json and install
// Unused import → remove the import line
// Hardcoded URL → replace with relative path
```

## Audit Execution Strategy

### Self-Healing Loop
```
For each audit category:
  1. Run checks → collect failures
  2. For each failure:
     a. Identify the file and line
     b. Apply the known fix pattern
     c. Re-run the specific failing check
     d. If still failing, try alternative fix
  3. Max 3 fix cycles per issue
  4. If fix fails after 3 attempts, log as manual issue

Report format:
  ✅ Accessibility: 12/12 checks passed
  ✅ Performance: 8/8 checks passed
  ⚠️ Content: 11/12 checks passed (1 warning: lesson-03-02 has short intro)
  ✅ Responsive: 6/6 checks passed
  ✅ Routes: 5/5 checks passed
  ✅ Build: 4/4 checks passed
  
  Score: 96/100 — 3 issues fixed automatically, 1 warning
```

### Priority Order
1. Build integrity (must compile)
2. Content validation (must have data)
3. Accessibility (must be usable)
4. Routes (must navigate)
5. Responsive (must adapt)
6. Performance (should be fast)

### CLI Integration
When run via `syllabus audit`:
- Display each category with pass/fail counts
- Show auto-fixed issues with before/after
- Exit code 0 if all pass, 1 if manual issues remain
- `--fix` flag enables auto-fix mode
- `--report` flag generates `audit-report.json`
