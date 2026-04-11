---
name: accessibility
description: "Ensure WCAG 2.1 AA compliance for all generated tutorials. Covers perceivable, operable, understandable, and robust criteria plus reduced motion support."
---

# Accessibility Skill

## WCAG 2.1 AA Checklist

### Perceivable
- [ ] All images/diagrams have descriptive `alt` text
- [ ] Color contrast ≥ 4.5:1 for normal text, ≥ 3:1 for large text
- [ ] Information not conveyed by color alone (icons + labels)
- [ ] Code blocks have sufficient contrast for syntax highlighting
- [ ] Text resizable to 200% without loss of functionality

### Operable
- [ ] All interactive elements keyboard accessible
- [ ] Visible focus indicators on all focusable elements
- [ ] Skip to main content link
- [ ] No keyboard traps
- [ ] Quiz answers selectable via keyboard (Enter/Space)
- [ ] Drag-and-drop ordering has keyboard alternative (arrow keys)

### Understandable
- [ ] Page language declared (`lang="en"`)
- [ ] Consistent navigation across pages
- [ ] Error messages are descriptive and helpful
- [ ] Quiz feedback clearly associated with the question

### Robust
- [ ] Valid HTML structure
- [ ] ARIA landmarks: `main`, `nav`, `aside`, `banner`
- [ ] ARIA labels on all icon-only buttons
- [ ] `aria-live="polite"` on quiz feedback regions
- [ ] `aria-current="page"` on active navigation items
- [ ] `role="progressbar"` with `aria-valuenow`, `aria-valuemin`, `aria-valuemax`

## Reduced Motion
```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

## Screen Reader Testing Points
- Lesson title announced on navigation
- Quiz question and all options readable
- Progress percentage announced
- Code block content accessible (with language announced)
