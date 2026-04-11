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
- Lazy-load audio components (only mount AudioMiniPlayer when user first plays audio)

## Audio Player Patterns

### useAudioPlayer Hook
```jsx
import { useState, useRef, useEffect, useCallback } from 'react';

const AUDIO_STORAGE_KEY = 'syllabus-audio-state';

function useAudioPlayer(audioManifest, syllabus) {
  const audioRef = useRef(new Audio());
  const [state, setState] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(AUDIO_STORAGE_KEY));
      return {
        isPlaying: false,
        currentTime: saved?.lastPosition || 0,
        duration: 0,
        playbackRate: saved?.playbackRate || 1,
        volume: saved?.volume ?? 0.8,
        isMuted: saved?.isMuted || false,
        currentLessonId: saved?.lastLessonId || null,
        currentSection: null,
        isLoading: false,
        error: null,
        provider: audioManifest?.provider || 'edge-tts',
      };
    } catch {
      return {
        isPlaying: false, currentTime: 0, duration: 0,
        playbackRate: 1, volume: 0.8, isMuted: false,
        currentLessonId: null, currentSection: null,
        isLoading: false, error: null, provider: 'edge-tts',
      };
    }
  });

  // Persist state to localStorage (debounced)
  useEffect(() => {
    const timeout = setTimeout(() => {
      localStorage.setItem(AUDIO_STORAGE_KEY, JSON.stringify({
        lastLessonId: state.currentLessonId,
        lastPosition: state.currentTime,
        playbackRate: state.playbackRate,
        volume: state.volume,
        isMuted: state.isMuted,
      }));
    }, 500);
    return () => clearTimeout(timeout);
  }, [state.currentLessonId, state.currentTime, state.playbackRate, state.volume, state.isMuted]);

  const play = useCallback((lessonId) => {
    const lesson = audioManifest?.lessons?.find(l => l.lessonId === lessonId);
    if (!lesson) {
      // Fallback to Web Speech API
      playWithWebSpeech(lessonId);
      return;
    }
    const audio = audioRef.current;
    if (state.currentLessonId !== lessonId) {
      audio.src = lesson.audioFile;
      audio.currentTime = 0;
    }
    audio.playbackRate = state.playbackRate;
    audio.volume = state.isMuted ? 0 : state.volume;
    audio.play().catch(err => setState(s => ({ ...s, error: err.message })));
    setState(s => ({ ...s, isPlaying: true, currentLessonId: lessonId, isLoading: false }));
  }, [audioManifest, state.currentLessonId, state.playbackRate, state.volume, state.isMuted]);

  // ... (pause, toggle, seek, skipForward, skipBackward, setPlaybackRate, setVolume, toggleMute, nextLesson, prevLesson)
  
  return { ...state, play, pause, toggle, seek, skipForward, skipBackward, setPlaybackRate, setVolume, toggleMute, nextLesson, prevLesson, audioRef };
}
```

### useMediaSession Hook
```jsx
function useMediaSession({ title, isPlaying, onPlay, onPause, onSeekBackward, onSeekForward, onPrevTrack, onNextTrack }) {
  useEffect(() => {
    if (!('mediaSession' in navigator)) return;

    navigator.mediaSession.metadata = new MediaMetadata({
      title: title || 'Syllabus Tutorial',
      artist: 'Syllabus',
      album: 'Interactive Tutorial',
    });

    navigator.mediaSession.playbackState = isPlaying ? 'playing' : 'paused';

    const handlers = {
      play: onPlay,
      pause: onPause,
      seekbackward: () => onSeekBackward(15),
      seekforward: () => onSeekForward(15),
      previoustrack: onPrevTrack,
      nexttrack: onNextTrack,
    };

    for (const [action, handler] of Object.entries(handlers)) {
      try { navigator.mediaSession.setActionHandler(action, handler); } catch {}
    }

    return () => {
      for (const action of Object.keys(handlers)) {
        try { navigator.mediaSession.setActionHandler(action, null); } catch {}
      }
    };
  }, [title, isPlaying, onPlay, onPause, onSeekBackward, onSeekForward, onPrevTrack, onNextTrack]);
}
```

### AudioMiniPlayer Component Pattern
```jsx
function AudioMiniPlayer({ audioState, onToggle, onSkipBack, onSkipForward, onExpand, onDismiss }) {
  if (!audioState.currentLessonId) return null;

  return (
    <motion.div
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 100, opacity: 0 }}
      className="fixed bottom-0 left-0 right-0 z-40 border-t"
      style={{
        background: 'var(--glass-bg)',
        backdropFilter: 'blur(var(--glass-blur))',
        WebkitBackdropFilter: 'blur(var(--glass-blur))',
        borderColor: 'var(--glass-border)',
      }}
    >
      {/* Thin progress bar at top edge */}
      <div className="h-1 w-full" style={{ background: 'var(--border)' }}>
        <div className="h-full transition-all duration-300"
          style={{
            width: `${(audioState.currentTime / audioState.duration) * 100}%`,
            background: 'var(--gradient-hero)',
          }}
        />
      </div>

      <div className="flex items-center justify-between px-4 py-3 max-w-screen-xl mx-auto">
        {/* Lesson info */}
        <div className="flex-1 min-w-0 mr-4">
          <p className="text-sm font-medium truncate" style={{ color: 'var(--text)' }}>
            {audioState.currentTitle}
          </p>
          <p className="text-xs truncate" style={{ color: 'var(--text-muted)' }}>
            {formatTime(audioState.currentTime)} / {formatTime(audioState.duration)}
          </p>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-2">
          <button onClick={onSkipBack} aria-label="Skip back 15 seconds"
            className="p-2 rounded-full hover:bg-white/5 transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center">
            <SkipBack size={18} />
          </button>
          <button onClick={onToggle} aria-label={audioState.isPlaying ? 'Pause' : 'Play'}
            className="p-3 rounded-full transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
            style={{ background: 'var(--primary)', color: '#fff' }}>
            {audioState.isPlaying ? <Pause size={20} /> : <Play size={20} />}
          </button>
          <button onClick={onSkipForward} aria-label="Skip forward 15 seconds"
            className="p-2 rounded-full hover:bg-white/5 transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center">
            <SkipForward size={18} />
          </button>
        </div>

        {/* Speed + expand */}
        <div className="flex items-center gap-2 ml-4">
          <button aria-label={`Playback speed: ${audioState.playbackRate}x`}
            className="text-xs px-2 py-1 rounded min-w-[44px] min-h-[44px] flex items-center justify-center"
            style={{ color: 'var(--accent)' }}>
            {audioState.playbackRate}x
          </button>
          <button onClick={onExpand} aria-label="Expand player"
            className="p-2 rounded-full hover:bg-white/5 transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center">
            <ChevronUp size={18} />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
```

### Web Speech API Fallback Pattern
```jsx
function useWebSpeechFallback() {
  const utteranceRef = useRef(null);

  const speak = useCallback((text, { rate = 1, onEnd } = {}) => {
    if (!('speechSynthesis' in window)) return false;

    window.speechSynthesis.cancel(); // Stop any current speech
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = rate;
    utterance.onend = onEnd;
    utteranceRef.current = utterance;

    // Try to find a good voice
    const voices = window.speechSynthesis.getVoices();
    const preferred = voices.find(v => v.name.includes('Samantha')) // macOS
      || voices.find(v => v.name.includes('Google'))               // Chrome
      || voices.find(v => v.lang.startsWith('en'));                // Any English
    if (preferred) utterance.voice = preferred;

    window.speechSynthesis.speak(utterance);
    return true;
  }, []);

  const stop = useCallback(() => {
    window.speechSynthesis.cancel();
  }, []);

  return { speak, stop, isSupported: 'speechSynthesis' in window };
}
```

### Audio Keyboard Shortcuts (integrate with useKeyboardNav)
```jsx
useEffect(() => {
  const handleKeyDown = (e) => {
    // Don't intercept when user is typing in an input
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
    
    switch (e.key) {
      case ' ':
        if (!e.target.closest('[role="option"]')) { // Don't conflict with quiz
          e.preventDefault();
          toggle();
        }
        break;
      case 'ArrowLeft':
        if (e.target.closest('.audio-player')) {
          e.preventDefault();
          skipBackward(15);
        }
        break;
      case 'ArrowRight':
        if (e.target.closest('.audio-player')) {
          e.preventDefault();
          skipForward(15);
        }
        break;
      case '[': setPlaybackRate(Math.max(0.75, playbackRate - 0.25)); break;
      case ']': setPlaybackRate(Math.min(2, playbackRate + 0.25)); break;
      case 'm': case 'M': toggleMute(); break;
    }
  };
  window.addEventListener('keydown', handleKeyDown);
  return () => window.removeEventListener('keydown', handleKeyDown);
}, [toggle, skipBackward, skipForward, setPlaybackRate, toggleMute, playbackRate]);
```
