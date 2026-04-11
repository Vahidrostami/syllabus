---
name: react-coding
description: "Write production React code with Vite, Tailwind, Framer Motion. Covers project setup, component patterns, data-driven rendering, progress persistence, visual effects, scroll animations, and performance optimization."
---

# React Coding Skill

## Project Setup

### Vite + React + Tailwind
```bash
npm create vite@latest syllabus-output -- --template react
cd syllabus-output
npm install
npm install -D tailwindcss @tailwindcss/typography postcss autoprefixer
npm install react-router-dom framer-motion prismjs lucide-react
npx tailwindcss init -p
```

### Essential Dependencies
```json
{
  "dependencies": {
    "react": "^18.3.0",
    "react-dom": "^18.3.0",
    "react-router-dom": "^6.28.0",
    "framer-motion": "^11.11.0",
    "prismjs": "^1.29.0",
    "lucide-react": "^0.453.0"
  },
  "devDependencies": {
    "vite": "^6.0.0",
    "tailwindcss": "^3.4.0",
    "@tailwindcss/typography": "^0.5.0",
    "autoprefixer": "^10.4.0",
    "postcss": "^8.4.0"
  }
}
```

## Component Patterns

### Data-Driven Rendering
All content comes from JSON data files — components are pure renderers:
```jsx
function LessonView({ lesson }) {
  return lesson.content.sections.map(section => {
    switch (section.type) {
      case 'intro': return <IntroSection {...section} />;
      case 'concept': return <ConceptSection {...section} />;
      case 'code-example': return <CodeBlock {...section} />;
      case 'callout': return <Callout {...section} />;
      case 'summary': return <KeyTakeaways {...section} />;
    }
  });
}
```

### Progress Persistence
```jsx
const STORAGE_KEY = 'syllabus-progress';

function useProgress() {
  const [progress, setProgress] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY)) || defaultProgress;
    } catch { return defaultProgress; }
  });
  
  useEffect(() => {
    const timeout = setTimeout(() => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
    }, 500);
    return () => clearTimeout(timeout);
  }, [progress]);
  
  return { progress, /* ...methods */ };
}
```

### Animation Conventions (Framer Motion)
```jsx
// Page transitions
const pageVariants = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.25, ease: [0.25, 0.46, 0.45, 0.94] } },
  exit: { opacity: 0, transition: { duration: 0.1 } }
};

// Staggered children (for lists, cards, sections)
const staggerContainer = {
  animate: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } }
};
const staggerItem = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.35, ease: 'easeOut' } }
};

// Spring physics for interactive elements
const springHover = { scale: 1.02, transition: { type: 'spring', stiffness: 400, damping: 25 } };
const springTap = { scale: 0.98 };

// Respect reduced motion
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
```

### Scroll-Triggered Animations
Use IntersectionObserver via a custom hook for scroll-reveal effects:
```jsx
function useScrollReveal(options = {}) {
  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setIsVisible(true); },
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px', ...options }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);
  
  return { ref, isVisible };
}

// Usage in lesson sections:
function RevealSection({ children, delay = 0 }) {
  const { ref, isVisible } = useScrollReveal();
  return (
    <motion.div ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={isVisible ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.4, delay, ease: 'easeOut' }}
    >
      {children}
    </motion.div>
  );
}
```

### Glassmorphism Component Pattern
```jsx
function GlassCard({ children, className, glow = false, ...props }) {
  return (
    <div
      className={`rounded-2xl border ${className}`}
      style={{
        background: 'var(--glass-bg)',
        backdropFilter: `blur(var(--glass-blur))`,
        WebkitBackdropFilter: `blur(var(--glass-blur))`,
        borderColor: 'var(--glass-border)',
        boxShadow: glow ? 'var(--glow-primary)' : undefined,
      }}
      {...props}
    >
      {children}
    </div>
  );
}
```

### Enhanced Code Block Pattern
```jsx
function CodeBlock({ code, language, filename, tabs }) {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState(0);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="rounded-xl overflow-hidden border" style={{ borderColor: 'var(--glass-border)' }}>
      {/* Top bar */}
      <div className="flex items-center justify-between px-4 py-2 border-b"
        style={{ background: 'var(--glass-bg)', borderColor: 'var(--glass-border)' }}>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-red-400 opacity-60" />
          <span className="w-3 h-3 rounded-full bg-yellow-400 opacity-60" />
          <span className="w-3 h-3 rounded-full bg-green-400 opacity-60" />
          {filename && <span className="ml-2 text-xs" style={{ color: 'var(--text-muted)' }}>{filename}</span>}
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs px-2 py-0.5 rounded" style={{ color: 'var(--accent)' }}>{language}</span>
          <button onClick={handleCopy} className="p-1 rounded hover:bg-white/5 transition-colors">
            {copied ? <Check size={14} /> : <Copy size={14} />}
          </button>
        </div>
      </div>
      {/* Code body */}
      <pre style={{ background: 'var(--code-bg)', margin: 0, borderRadius: 0 }}>
        <code dangerouslySetInnerHTML={{ __html: Prism.highlight(code, Prism.languages[language], language) }} />
      </pre>
    </div>
  );
}
```

### Confetti Celebration Effect
```jsx
function ConfettiEffect({ trigger }) {
  const particles = useMemo(() =>
    Array.from({ length: 40 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      color: ['var(--primary)', 'var(--accent)', 'var(--success)', 'var(--warning)'][i % 4],
      delay: Math.random() * 0.3,
      angle: Math.random() * 360,
    })), [trigger]);

  if (!trigger) return null;
  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      {particles.map(p => (
        <motion.div key={p.id}
          className="absolute w-2 h-2 rounded-full"
          style={{ left: `${p.x}%`, top: '50%', background: p.color }}
          initial={{ y: 0, opacity: 1, scale: 1, rotate: 0 }}
          animate={{ y: -400 - Math.random() * 200, opacity: 0, scale: 0, rotate: p.angle }}
          transition={{ duration: 1.2 + Math.random() * 0.4, delay: p.delay, ease: 'easeOut' }}
        />
      ))}
    </div>
  );
}
```

## File Organization Rules
- One component per file
- Co-locate styles with components (Tailwind classes inline)
- Data files in `src/data/` as JSON
- Hooks in `src/hooks/`
- Utility functions in `src/lib/`
- Page-level components in `src/pages/`
- Shared UI primitives in `src/components/ui/`

## Tailwind Utility Extensions
The tailwind config should extend with these custom utilities:
```js
// tailwind.config.js extend
{
  colors: {
    surface: 'var(--surface)',
    primary: 'var(--primary)',
    accent: 'var(--accent)',
  },
  fontFamily: {
    display: ['Space Grotesk', 'sans-serif'],
    body: ['IBM Plex Sans', 'sans-serif'],
    mono: ['JetBrains Mono', 'monospace'],
  },
  backdropBlur: {
    glass: 'var(--glass-blur)',
  },
  boxShadow: {
    glow: 'var(--glow-primary)',
    'glow-accent': 'var(--glow-accent)',
  },
}
```

## Performance Checklist
- Lazy load lesson content (React.lazy + Suspense)
- Memoize expensive renders (React.memo for lesson list items)
- Debounce localStorage writes
- Use CSS transitions where possible (Framer Motion for complex sequences)
- Use IntersectionObserver for scroll animations (not scroll event listeners)
- Optimize images: use `loading="lazy"`, provide width/height
- Code-split quiz components (only load when navigating to quiz route)
