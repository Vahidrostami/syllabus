---
name: audio-narration
description: "Generate audio narration for tutorial lessons using Edge TTS. Covers script conversion from lesson JSON, voice selection, audio generation, manifest creation, section timestamping, and Web Speech API fallback."
---

# Audio Narration Skill

## Overview

Convert structured lesson content into natural-sounding audio narration. The primary provider is **Edge TTS** (free, no API key, Microsoft neural voices). The fallback is the **Web Speech API** (browser-built-in, no pre-generation needed).

## Script Conversion Rules

### Section Type → Spoken Text

| Section Type | Conversion Strategy |
|---|---|
| `intro` | Read body verbatim (after markdown stripping) |
| `concept` | "**[heading].**" + body + "**Key point:** [keyPoint]" |
| `code-example` | "Here's a code example: [heading]." + read each annotation note. Skip raw code entirely |
| `callout` | Map style to spoken prefix, then body |
| `summary` | "Let's recap the key takeaways." + numbered list of bullets |
| `diagram` | "There's a visual here showing [diagram.description]." |

### Callout Style → Spoken Prefix

| Style | Spoken Prefix |
|---|---|
| `interview-tip` | "Interview tip:" |
| `pro-tip` | "Pro tip:" |
| `common-mistake` | "Watch out for this common mistake:" |
| `deep-dive` | "Going deeper:" |
| `warning` | "Important warning:" |

### Markdown Stripping Rules

1. Remove `**bold**` markers → keep inner text
2. Remove `*italic*` markers → keep inner text
3. Remove `[link text](url)` → keep "link text"
4. Remove inline code backticks `` `code` `` → keep inner text
5. Remove heading markers `#`, `##`, etc.
6. Remove bullet markers `- `, `* `, `1. `
7. Remove code fence markers ` ``` `
8. Remove HTML tags `<br>`, `<em>`, etc.

### Abbreviation Expansion

| Written | Spoken |
|---|---|
| e.g. | for example |
| i.e. | that is |
| vs | versus |
| etc. | et cetera |
| API | A P I |
| URL | U R L |
| HTML | H T M L |
| CSS | C S S |
| JS | JavaScript |
| ML | machine learning |
| AI | A I |
| CLI | command line interface |
| SLM | small language model |
| LLM | large language model |
| GPU | G P U |
| CPU | C P U |
| RAM | ram |
| npm | N P M |

### Pause Insertion

Insert SSML-style pauses between logical segments:
- Between sections: 1.5 second pause (use `...` in plain text or `<break time="1500ms"/>` in SSML)
- Between paragraphs within a section: 0.8 second pause
- After a heading before body: 0.5 second pause
- After "Key takeaways": 0.5 second pause
- Between list items: 0.4 second pause

## Voice Selection

### By Topic Language (auto-detect from syllabus)

| Language | Recommended Voice | Backup Voice |
|---|---|---|
| English | `en-US-AriaNeural` | `en-US-GuyNeural` |
| Spanish | `es-ES-ElviraNeural` | `es-MX-DaliaNeural` |
| French | `fr-FR-DeniseNeural` | `fr-FR-HenriNeural` |
| German | `de-DE-KatjaNeural` | `de-DE-ConradNeural` |
| Portuguese | `pt-BR-FranciscaNeural` | `pt-BR-AntonioNeural` |
| Japanese | `ja-JP-NanamiNeural` | `ja-JP-KeitaNeural` |
| Korean | `ko-KR-SunHiNeural` | `ko-KR-InJoonNeural` |
| Chinese | `zh-CN-XiaoxiaoNeural` | `zh-CN-YunxiNeural` |

### Voice Quality Tips

- Aria Neural is the highest quality English voice — clear, warm, professional
- For technical content, Aria's pacing handles jargon well
- For conversational content, consider Guy Neural for variety
- Don't mix voices within a single lesson — pick one for the whole tutorial

## Edge TTS CLI Commands

### Single Lesson Generation
```bash
edge-tts \
  --voice "en-US-AriaNeural" \
  --rate "+0%" \
  --file scripts/les-01-01.txt \
  --write-media public/audio/les-01-01.mp3 \
  --write-subtitles public/audio/les-01-01.vtt
```

### Batch Generation Script
```bash
#!/bin/bash
VOICE="en-US-AriaNeural"
RATE="+0%"

for script in scripts/les-*.txt; do
  base=$(basename "$script" .txt)
  echo "Generating audio for $base..."
  edge-tts \
    --voice "$VOICE" \
    --rate "$RATE" \
    --file "$script" \
    --write-media "public/audio/${base}.mp3" \
    --write-subtitles "public/audio/${base}.vtt"
done

echo "Done! Generated $(ls public/audio/*.mp3 | wc -l) audio files."
```

### Checking Available Voices
```bash
edge-tts --list-voices | grep "en-US"
```

## Audio Manifest Schema

```json
{
  "provider": "edge-tts",
  "voice": "en-US-AriaNeural",
  "generatedAt": "2026-04-11T12:00:00Z",
  "lessons": [
    {
      "lessonId": "les-01-01",
      "title": "The SLM Landscape",
      "audioFile": "/audio/les-01-01.mp3",
      "subtitleFile": "/audio/les-01-01.vtt",
      "duration": 495,
      "fileSize": "2.1MB",
      "sections": [
        {
          "type": "intro",
          "heading": null,
          "startTime": 0,
          "endTime": 45
        },
        {
          "type": "concept",
          "heading": "What Makes a Model Small?",
          "startTime": 45,
          "endTime": 180
        }
      ]
    }
  ],
  "totalDuration": 2400,
  "totalLessons": 24,
  "totalSize": "48MB"
}
```

### Web Speech Fallback Manifest
```json
{
  "provider": "web-speech",
  "voice": null,
  "generatedAt": "2026-04-11T12:00:00Z",
  "lessons": [
    {
      "lessonId": "les-01-01",
      "title": "The SLM Landscape",
      "audioFile": null,
      "subtitleFile": null,
      "script": [
        "Imagine you need a translator but don't have a data center budget...",
        "What Makes a Model Small. In the LLM world, small is relative...",
        "Let's recap the key takeaways. First, SLMs trade generality for efficiency..."
      ]
    }
  ]
}
```

## React Audio Player Component Specs

The narration engineer ensures the React app has these audio components. If react-developer hasn't added them, create them.

### Required Components

#### `src/components/audio/AudioPlayer.jsx`
Full-featured audio player with:
- Play/pause toggle (Space key)
- Skip backward 15s / forward 15s (← / → keys)
- Progress bar (clickable seek)
- Current time / total duration display
- Playback speed control (0.75x, 1x, 1.25x, 1.5x, 2x)
- Volume control with mute toggle
- Current section indicator (synced with lesson sections)
- Auto-advance to next lesson
- VTT subtitle track

#### `src/components/audio/AudioMiniPlayer.jsx`
Compact bottom bar (always visible when audio is playing):
- Glass-morphism styling matching theme
- Song title + lesson name
- Play/pause + skip buttons
- Thin progress bar
- Expand button → full AudioPlayer view
- Collapse/dismiss button
- Persists across page navigation

#### `src/components/audio/ListenMode.jsx`
Full-screen mobile listening experience:
- Large play/pause button
- Lesson title + module name
- Key takeaways text (readable while listening)
- Speed control (large touch targets)
- Swipe left/right for prev/next lesson
- Lock screen media controls (via Media Session API)
- Background playback support

### Required Hooks

#### `src/hooks/useAudioPlayer.js`
```javascript
// Core audio state management
{
  isPlaying: boolean,
  currentTime: number,
  duration: number,
  playbackRate: number,        // 0.75 | 1 | 1.25 | 1.5 | 2
  volume: number,              // 0-1
  isMuted: boolean,
  currentLessonId: string,
  currentSection: object | null,
  isLoading: boolean,
  error: string | null,
  
  // Actions
  play: (lessonId?) => void,
  pause: () => void,
  toggle: () => void,
  seek: (time) => void,
  skipForward: (seconds) => void,
  skipBackward: (seconds) => void,
  setPlaybackRate: (rate) => void,
  setVolume: (vol) => void,
  toggleMute: () => void,
  nextLesson: () => void,
  prevLesson: () => void,
}
```

#### `src/hooks/useMediaSession.js`
```javascript
// Lock screen / media control integration
// Sets up navigator.mediaSession with:
// - metadata (title, artist="Syllabus Tutorial", artwork)
// - action handlers (play, pause, seekbackward, seekforward, previoustrack, nexttrack)
// - playback state ('playing' | 'paused' | 'none')
```

### Keyboard Shortcuts (when audio player is active)

| Key | Action |
|---|---|
| `Space` | Play / Pause (when not in a text input) |
| `←` | Skip back 15 seconds |
| `→` | Skip forward 15 seconds |
| `[` | Decrease playback speed |
| `]` | Increase playback speed |
| `M` | Mute / unmute |
| `L` | Toggle listen mode (mobile) |

### localStorage Persistence

Key: `syllabus-audio-state`
```json
{
  "lastLessonId": "les-02-03",
  "lastPosition": 142.5,
  "playbackRate": 1.25,
  "volume": 0.8,
  "isMuted": false
}
```

Resume playback position when returning to a lesson.

## Quality Checklist

- [ ] Every lesson has audio (MP3 or Web Speech script)
- [ ] No raw code in spoken scripts
- [ ] No markdown symbols in spoken text  
- [ ] Abbreviations expanded for natural speech
- [ ] Pauses inserted between sections
- [ ] Audio manifest has correct section timestamps
- [ ] VTT subtitle files validate
- [ ] Total audio < 200MB
- [ ] Audio player handles missing files gracefully (shows "Audio unavailable")
- [ ] Keyboard shortcuts don't conflict with quiz interactions
- [ ] Media Session API configured for mobile lock screen controls
- [ ] Playback position persists in localStorage
- [ ] Audio auto-advances to next lesson
