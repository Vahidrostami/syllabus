---
name: react-coding
description: "Write production React code with Vite, Tailwind, Framer Motion. Covers project setup, component patterns, data-driven rendering, progress persistence, and performance optimization."
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

### Animation Conventions
```jsx
const pageVariants = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.2 } },
  exit: { opacity: 0, transition: { duration: 0.1 } }
};

// Respect reduced motion
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
```

## File Organization Rules
- One component per file
- Co-locate styles with components (Tailwind classes inline)
- Data files in `src/data/` as JSON
- Hooks in `src/hooks/`
- Utility functions in `src/lib/`
- Page-level components in `src/pages/`

## Performance Checklist
- Lazy load lesson content (React.lazy + Suspense)
- Memoize expensive renders (React.memo for lesson list items)
- Debounce localStorage writes
- Use CSS transitions where possible (Framer Motion for complex sequences)
