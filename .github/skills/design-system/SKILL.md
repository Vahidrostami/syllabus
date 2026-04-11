---
name: design-system
description: "Visual design system and component library for Syllabus tutorials. Includes 4 theme presets with glassmorphism, gradient systems, micro-interactions, component specs, spacing scale, and icon conventions."
---

# Design System Skill

## Theme Presets

Each theme defines base colors **plus** gradient, glass, and glow tokens.

### Midnight Scholar (Dark - Default for coding topics)
```css
--bg: #0a0e1a; --surface: #131829; --surface-hover: #1a2035;
--primary: #6366f1; --primary-hover: #818cf8; --accent: #22d3ee;
--success: #34d399; --warning: #fbbf24; --error: #f87171;
--text: #e2e8f0; --text-secondary: #94a3b8; --text-muted: #64748b;
--border: #1e293b; --code-bg: #0f1320;
/* Gradient system */
--gradient-hero: linear-gradient(135deg, #6366f1 0%, #22d3ee 50%, #34d399 100%);
--gradient-surface: linear-gradient(180deg, rgba(99,102,241,0.05) 0%, transparent 100%);
--gradient-card: linear-gradient(135deg, rgba(99,102,241,0.08) 0%, rgba(34,211,238,0.04) 100%);
--mesh-bg: radial-gradient(ellipse at 20% 50%, rgba(99,102,241,0.15) 0%, transparent 50%), radial-gradient(ellipse at 80% 20%, rgba(34,211,238,0.1) 0%, transparent 50%), radial-gradient(ellipse at 50% 80%, rgba(52,211,153,0.08) 0%, transparent 50%);
/* Glass tokens */
--glass-bg: rgba(19,24,41,0.7); --glass-blur: 16px; --glass-border: rgba(255,255,255,0.08);
/* Glow */
--glow-primary: 0 0 20px rgba(99,102,241,0.3); --glow-accent: 0 0 20px rgba(34,211,238,0.2);
/* Surface RGB for alpha compositing */
--surface-rgb: 19,24,41;
```

### Paper & Ink (Light - For general topics)
```css
--bg: #fafaf9; --surface: #ffffff; --surface-hover: #f5f5f4;
--primary: #2563eb; --primary-hover: #3b82f6; --accent: #0891b2;
--success: #16a34a; --warning: #d97706; --error: #dc2626;
--text: #1c1917; --text-secondary: #57534e; --text-muted: #a8a29e;
--border: #e7e5e4; --code-bg: #f5f5f4;
--gradient-hero: linear-gradient(135deg, #2563eb 0%, #0891b2 50%, #16a34a 100%);
--gradient-surface: linear-gradient(180deg, rgba(37,99,235,0.03) 0%, transparent 100%);
--gradient-card: linear-gradient(135deg, rgba(37,99,235,0.04) 0%, rgba(8,145,178,0.02) 100%);
--mesh-bg: radial-gradient(ellipse at 20% 50%, rgba(37,99,235,0.06) 0%, transparent 50%), radial-gradient(ellipse at 80% 20%, rgba(8,145,178,0.04) 0%, transparent 50%);
--glass-bg: rgba(255,255,255,0.8); --glass-blur: 12px; --glass-border: rgba(0,0,0,0.06);
--glow-primary: 0 4px 20px rgba(37,99,235,0.12); --glow-accent: 0 4px 20px rgba(8,145,178,0.1);
--surface-rgb: 255,255,255;
```

### Terminal Green (For DevOps/CLI topics)
```css
--bg: #0c0c0c; --surface: #1a1a1a; --surface-hover: #222222;
--primary: #22c55e; --primary-hover: #4ade80; --accent: #a3e635;
--success: #22c55e; --warning: #eab308; --error: #ef4444;
--text: #d4d4d4; --text-secondary: #a3a3a3; --text-muted: #737373;
--border: #2a2a2a; --code-bg: #111111;
--gradient-hero: linear-gradient(135deg, #22c55e 0%, #a3e635 50%, #22d3ee 100%);
--gradient-surface: linear-gradient(180deg, rgba(34,197,94,0.05) 0%, transparent 100%);
--gradient-card: linear-gradient(135deg, rgba(34,197,94,0.06) 0%, rgba(163,230,53,0.03) 100%);
--mesh-bg: radial-gradient(ellipse at 30% 50%, rgba(34,197,94,0.12) 0%, transparent 50%), radial-gradient(ellipse at 70% 30%, rgba(163,230,53,0.06) 0%, transparent 50%);
--glass-bg: rgba(26,26,26,0.75); --glass-blur: 16px; --glass-border: rgba(34,197,94,0.15);
--glow-primary: 0 0 20px rgba(34,197,94,0.3); --glow-accent: 0 0 15px rgba(163,230,53,0.2);
--surface-rgb: 26,26,26;
```

### Notebook (For data science/research)
```css
--bg: #fffbeb; --surface: #ffffff; --surface-hover: #fef9c3;
--primary: #7c3aed; --primary-hover: #8b5cf6; --accent: #f59e0b;
--success: #10b981; --warning: #f59e0b; --error: #ef4444;
--text: #292524; --text-secondary: #57534e; --text-muted: #a8a29e;
--border: #e7e5e4; --code-bg: #f5f5f0;
--gradient-hero: linear-gradient(135deg, #7c3aed 0%, #f59e0b 50%, #10b981 100%);
--gradient-surface: linear-gradient(180deg, rgba(124,58,237,0.04) 0%, transparent 100%);
--gradient-card: linear-gradient(135deg, rgba(124,58,237,0.05) 0%, rgba(245,158,11,0.03) 100%);
--mesh-bg: radial-gradient(ellipse at 20% 40%, rgba(124,58,237,0.08) 0%, transparent 50%), radial-gradient(ellipse at 75% 60%, rgba(245,158,11,0.06) 0%, transparent 50%);
--glass-bg: rgba(255,255,255,0.85); --glass-blur: 12px; --glass-border: rgba(124,58,237,0.1);
--glow-primary: 0 4px 20px rgba(124,58,237,0.15); --glow-accent: 0 4px 20px rgba(245,158,11,0.12);
--surface-rgb: 255,255,255;
```

## Visual Effects System

### Mesh Gradient Backgrounds
Apply `var(--mesh-bg)` to the page body or hero sections. It creates depth with overlapping radial gradients. Always layer it behind content:
```css
body::before {
  content: '';
  position: fixed; inset: 0; z-index: 0;
  background: var(--mesh-bg);
  pointer-events: none;
}
```

### Glassmorphism
Use for sidebar, floating cards, top bar, and modal overlays:
```css
.glass {
  background: var(--glass-bg);
  backdrop-filter: blur(var(--glass-blur));
  -webkit-backdrop-filter: blur(var(--glass-blur));
  border: 1px solid var(--glass-border);
}
```

### Gradient Text (Headings)
Use on hero titles and section headers:
```css
.gradient-text {
  background: var(--gradient-hero);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
```

### Glow Effects
Use sparingly on hover states and active elements:
```css
.card:hover { box-shadow: var(--glow-primary); }
.active-nav-item { box-shadow: var(--glow-accent); }
```

### Noise Texture Overlay
Adds subtle grain for depth. Use a CSS-only noise pattern:
```css
body::after {
  content: '';
  position: fixed; inset: 0; z-index: 1;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");
  opacity: 0.015;
  pointer-events: none;
  mix-blend-mode: overlay;
}
```

## Component Specs

### Sidebar Navigation (Floating Glass)
- Width: 280px (desktop), full-screen drawer (mobile)
- Style: **floating** — detached from left edge by 12px, rounded-2xl, glass effect
- Desktop: `margin: 12px; border-radius: 16px; height: calc(100vh - 24px);`
- Sections: Progress ring, module list, settings
- Active item: primary color left border (3px) + glass highlight + subtle glow
- Completed items: animated checkmark with success color
- Hover: `transform: translateX(4px)` + surface-hover bg

### Lesson Content Area
- Max width: 760px, centered
- Line height: 1.75 for body text
- Paragraph spacing: 1.5rem
- Section headers: gradient text on module titles
- Content sections appear with staggered fade-in on scroll (IntersectionObserver)
- Code blocks: full-width with rounded corners, glass border, language badge top-right

### Code Blocks (Enhanced)
- Glass frame with rounded-xl corners
- Top bar: language badge (left), filename (center, if provided), copy button (right)
- Line numbers: subtle, muted color
- Hover: subtle glow effect (`box-shadow: var(--glow-primary)`)
- Copy button: animated checkmark on success
- Tab support for multi-file examples

### Quiz Cards (Interactive)
- Glass container with gradient-card background
- Options as hoverable cards with spring animation
- Hover: lift + glow (`transform: translateY(-2px); box-shadow: var(--glow-primary)`)
- Correct: green border + animated checkmark draw + explanation slide-down + particle burst
- Incorrect: gentle shake (3px, 300ms) + red border flash + encouragement text
- Score reveal: animated counter + grade ring

### Progress Indicators
- Overall: SVG ring with gradient stroke, animated dash-offset, percentage center with counter animation
- Per-module: horizontal bar with gradient fill + shine animation sweeping left-to-right
- Per-lesson: animated checkmark (draw-on) or pulsing dot for in-progress
- Completion celebration: confetti particle burst + achievement badge fly-in

### Module Hero Cards
- Gradient-card background with glass overlay
- Floating icon/illustration at top-right (subtle, decorative)
- Hover: card lifts 4px with glow shadow
- Completed: success border with shimmer animation

## Micro-Interactions Catalog

| Element | Trigger | Animation |
|---------|---------|-----------|
| Nav item | Hover | `translateX(4px)` + bg tint, 150ms ease-out |
| Nav item | Active | Left border grow + glow pulse |
| Card | Hover | `translateY(-2px)` + `box-shadow: var(--glow-primary)`, 200ms spring |
| Card | Click | `scale(0.98)` then release, 100ms |
| Code block | Copy | Button → check icon, 200ms; reset after 2s |
| Progress bar | Update | Width transition 600ms ease-out + shine sweep |
| Progress ring | Update | Stroke-dashoffset 800ms ease-out + number counter |
| Quiz option | Hover | `translateY(-2px)` + border color, 150ms |
| Quiz correct | Submit | Border → green, check draw-on 400ms, confetti burst |
| Quiz wrong | Submit | Shake 300ms, border flash red 500ms |
| Page | Enter | Fade-in + `translateY(16px)` → 0, 250ms ease-out |
| Section | Scroll-in | Staggered fade-up, 100ms delay per item, IntersectionObserver |
| Lesson complete | Click | Check draw animation + progress bar fill |
| Module complete | All done | Confetti burst + badge fly-in from bottom |
| Heading | Scroll-in | Gradient text reveal, clip-path left→right 400ms |
| Button (primary) | Hover | Gradient shift + subtle glow |
| Toast | Appear | Slide-in from right + fade, 200ms spring |

## Spacing Scale (based on 0.5rem unit)
```
xs: 0.25rem (4px) | sm: 0.5rem (8px) | md: 1rem (16px) | lg: 1.5rem (24px)
xl: 2rem (32px) | 2xl: 3rem (48px) | 3xl: 4rem (64px) | 4xl: 6rem (96px)
```

## Shadow Scale
```
sm: 0 1px 3px rgba(0,0,0,0.1)
md: 0 4px 12px rgba(0,0,0,0.1)
lg: 0 8px 30px rgba(0,0,0,0.12)
xl: 0 16px 50px rgba(0,0,0,0.15)
glow: var(--glow-primary) — per-theme
```

## Icon Usage (Lucide React)
- Navigation: `ChevronLeft`, `ChevronRight`, `Menu`, `X`
- Status: `Check`, `X`, `AlertCircle`, `Info`, `Lightbulb`
- Content: `Code`, `BookOpen`, `Puzzle`, `Trophy`, `Clock`
- Actions: `Copy`, `Play`, `RotateCcw`, `ChevronDown`
- Progress: `Flame`, `Target`, `Award`, `Sparkles`
- Audio: `Headphones`, `Play`, `Pause`, `SkipBack`, `SkipForward`, `Volume2`, `VolumeX`, `ChevronUp`, `ChevronDown`

## Audio Player Design Specs

### AudioMiniPlayer (Floating Bottom Bar)
- **Position**: Fixed bottom, full width, z-40
- **Height**: 64px (compact)
- **Style**: Glass-morphism matching the active theme
- **Background**: `var(--glass-bg)` with `backdrop-filter: blur(var(--glass-blur))`
- **Border**: 1px top border using `var(--glass-border)`
- **Progress bar**: 2px thin bar at very top edge, gradient fill (`var(--gradient-hero)`)
- **Layout**: 3 zones — left (lesson info), center (controls), right (speed + expand)
- **Animation**: Slides up from bottom (Framer Motion `y: 100 → 0`)
- **Collapse**: When no audio active, fully hidden (not just minimized)
- **Mobile**: Full width, slightly taller (72px) for touch targets

```css
.audio-mini-player {
  position: fixed;
  bottom: 0; left: 0; right: 0;
  z-index: 40;
  background: var(--glass-bg);
  backdrop-filter: blur(var(--glass-blur));
  -webkit-backdrop-filter: blur(var(--glass-blur));
  border-top: 1px solid var(--glass-border);
}
```

### AudioPlayer (Expanded View)
- **Style**: Glass card, centered, max-width 500px
- **Appears**: Slides up from mini-player position (sheet/modal style)
- **Backdrop**: Semi-transparent overlay (click to dismiss)
- **Controls**: Large seek bar, play/pause (56px button), ±15s skip, volume slider, speed selector
- **Section indicator**: Shows current section name with subtle highlight
- **Seek bar**: Gradient fill matching `--gradient-hero`, 8px height, rounded-full
- **Speed selector**: Pill buttons (0.75x, 1x, 1.25x, 1.5x, 2x), active = primary color
- **Volume**: Smaller slider, with mute toggle icon

### ListenMode (Full-Screen Mobile)
- **Background**: Solid `var(--bg)` with mesh gradient (not glass — too blurry on full screen)
- **Center**: Large album-art style card with gradient background + lesson icon
- **Play button**: 80px circular button, gradient background, play/pause icon
- **Layout**: Vertical stack — lesson title, module name, progress bar, controls, key takeaways
- **Key takeaways**: Displayed as readable text below controls (useful while walking)
- **Swipe**: Left/right for prev/next lesson (Framer Motion drag gesture)
- **Transition**: Slides up from mini-player (full height sheet)

### Audio Toggle in TopBar
- **Icon**: `Headphones` icon (lucide-react)
- **Placement**: Right side of TopBar, next to settings/theme toggle
- **States**: Default (inactive), Active (playing — icon pulses gently)
- **Click**: If no audio playing → start current lesson audio. If playing → show/hide mini-player
- **Badge**: Small dot indicator when audio is available but not playing

### Theme Integration
The audio player inherits ALL theme variables — no hardcoded colors. In each theme:

| Theme | Player Accent |
|---|---|
| Midnight Scholar | Indigo play button with cyan progress bar |
| Paper & Ink | Blue play button with teal progress bar |
| Terminal Green | Green play button with lime progress bar |
| Notebook | Purple play button with amber progress bar |

### Micro-Interactions (Audio)

| Element | Trigger | Animation |
|---|---|---|
| Mini-player | Audio starts | Slide up from bottom, 300ms spring |
| Mini-player | Dismiss | Slide down, 200ms ease-out |
| Play button | Tap | Scale 0.95 → 1.0, 100ms |
| Play button | Playing | Subtle pulse glow (2s infinite, reduced-motion: none) |
| Progress bar | Seek | Thumb grows on hover/drag |
| Speed button | Select | Background transition 150ms |
| Listen mode | Enter | Sheet slides up from bottom, 400ms spring |
| Listen mode | Leave | Slides down, 250ms ease-out |
| Section label | Change | Crossfade text, 200ms |

### Content Area Padding Adjustment
When the audio mini-player is visible, the main content area needs bottom padding to avoid the player overlapping content:

```css
.content-area--audio-active {
  padding-bottom: 80px; /* 64px player + 16px breathing room */
}

@media (max-width: 767px) {
  .content-area--audio-active {
    padding-bottom: 88px; /* 72px player + 16px */
  }
}
```
