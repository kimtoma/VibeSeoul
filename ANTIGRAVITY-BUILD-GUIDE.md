# Vibe Seoul - Antigravity Build Prompt

아래 프롬프트를 Antigravity에 단계별로 붙여넣으세요.

---

## 🚀 STEP 1: 프로젝트 생성 (Antigravity에 첫 프롬프트)

```
Create a web project called "vibe-seoul" with this structure:

/vibe-seoul
├── index.html          (main SPA - all CSS/JS inline)
├── manifest.json       (PWA manifest)
├── sw.js              (minimal service worker)
├── icons/
│   ├── icon-192.png   (generate a simple neon "V" logo)
│   └── icon-512.png   (same logo, larger)
└── README.md

This is "Vibe Seoul" - a K-content tourism app. Users input Korean entertainment titles (K-drama, K-pop, movies) and get:
1. 5 Seoul locations on Google Maps that match the content's mood
2. AI-generated artwork for each location (via Gemini image generation)
3. Ambient soundscape that matches the mood

Tech: Vanilla HTML/CSS/JS only. No frameworks. No build tools. Mobile-first dark theme.
```

---

## 🚀 STEP 2: 메인 UI 구조 (가장 중요!)

```
Build the index.html with this exact layout and functionality:

## UI LAYOUT (Mobile-first, dark cinematic theme)

### Header (fixed top)
- Logo: "Vibe Seoul" in stylish font
- Subtitle: "Feel K-Content Through Seoul"

### Search Section (hero area)
- Large text input: placeholder "Enter K-content... (도깨비, Squid Game, BTS...)"
- Search button with pulsing animation
- Quick-pick chips below: "🦑 Squid Game", "👻 Goblin", "🎵 BTS Dynamite", "😈 K-Pop Demon Hunters", "🍊 When Life Gives You Tangerines"
- Clicking a chip fills the input and auto-searches

### Results Section (appears after search)
- Split layout:
  - LEFT (60%): Google Maps embed showing 5 location markers
  - RIGHT (40%): Scrollable panel with location cards
- Each location card shows:
  - Location name (Korean + English)
  - Neighborhood
  - Why this location matches the content's mood (1 sentence)
  - AI-generated artwork thumbnail (loading skeleton while generating)
  - Click to expand: full artwork + mood description

### Audio Controls (floating bottom bar)
- Play/Pause button for ambient soundscape
- Current mood label (e.g., "🌙 Romantic Night Seoul")
- Volume slider

## DESIGN SPECS
- Background: #0a0a0f (deep dark)
- Card background: rgba(255,255,255,0.05) with backdrop-blur
- Font: Google Fonts "Outfit" (headings) + "Noto Sans KR" (Korean)
- Accent colors change per mood:
  - romantic → #FFB800 (warm gold)
  - tense → #FF2D55 (red)
  - bright → #00D4FF (cyan)
  - melancholy → #A78BFA (purple)
  - energetic → #34D399 (green)
- Smooth CSS transitions when mood changes (accent color, glow effects)
- Loading states: skeleton screens with shimmer animation
- Google Maps dark theme (styles: dark mode)

## API KEY PLACEHOLDERS
Use these constants at the top of the script:
const GEMINI_API_KEY = 'YOUR_GEMINI_API_KEY';
const GOOGLE_MAPS_API_KEY = 'YOUR_GOOGLE_MAPS_API_KEY';

## GOOGLE MAPS
- Load via script tag: https://maps.googleapis.com/maps/api/js?key=KEY&callback=initMap
- Dark mode map style
- Custom markers with mood-colored dots
- Click marker → scroll to corresponding card + highlight

## IMPORTANT
- Everything in ONE index.html file (inline <style> and <script>)
- Mobile responsive: on mobile, map goes full width on top, cards below
- Must look premium and polished, not like a hackathon prototype
```

---

## 🚀 STEP 3: Gemini API 연동 (위치 추천)

```
Add Gemini 3.1 Pro API integration for location recommendations.

When user searches for K-content, call Gemini API:

Endpoint: https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}

Request body:
{
  "contents": [{
    "parts": [{
      "text": `You are a Seoul tourism expert who deeply understands K-content culture.

Given this K-content: "${userInput}"

Analyze the emotional mood and atmosphere of this content, then recommend 5 real Seoul locations where someone could FEEL the same atmosphere.

Respond in this exact JSON format:
{
  "contentTitle": "the content name",
  "mood": "one word mood (romantic/tense/bright/melancholy/energetic)",
  "moodDescription": "2 sentence description of the content's atmosphere in English",
  "locations": [
    {
      "nameKo": "Korean name",
      "nameEn": "English name",
      "neighborhood": "district/area name",
      "lat": latitude as number,
      "lng": longitude as number,
      "reason": "1 sentence why this place matches the mood, in English",
      "imagePrompt": "A cinematic photorealistic artwork of [specific location details] in Seoul, [mood-specific visual description]. Hyper-detailed, 4K, atmospheric lighting. Text overlay: '[Content Title] — [Location Korean name]'"
    }
  ],
  "soundMood": "one of: romantic_night, tense_urban, bright_retro, melancholy_rain, energetic_street"
}`
    }]
  }],
  "generationConfig": {
    "temperature": 0.8,
    "topP": 0.95,
    "responseMimeType": "application/json"
  }
}

Parse the JSON response. Update the map markers, location cards, accent color, and trigger sound change.

IMPORTANT: Handle errors gracefully. If API fails, show a friendly error message.
Add a loading state with the text "Vibing with Seoul..." during the API call.
```

---

## 🚀 STEP 4: Nano Banana 2 이미지 생성

```
Add image generation using Gemini's image generation capability.

For each of the 5 locations, generate an artwork using the imagePrompt from the location data.

Endpoint: https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp-image-generation:generateContent?key=${GEMINI_API_KEY}

Request body:
{
  "contents": [{
    "parts": [{
      "text": "${location.imagePrompt}"
    }]
  }],
  "generationConfig": {
    "responseModalities": ["TEXT", "IMAGE"]
  }
}

The response will contain an image in base64 format in the response parts.
Look for parts with "inlineData" containing "mimeType" and "data" (base64).

Display workflow:
1. Show skeleton loading with shimmer for each card
2. Generate images one by one (don't wait for all 5)
3. As each image arrives, fade it into the corresponding card
4. If image generation fails for a location, show a gradient placeholder with the location name

CRITICAL: Generate images sequentially (not in parallel) to avoid rate limiting.
Add a 1-second delay between each image generation request.
```

---

## 🚀 STEP 5: Tone.js 사운드스케이프

```
Add ambient soundscapes using Tone.js.

Load Tone.js from CDN:
<script src="https://cdnjs.cloudflare.com/ajax/libs/tone/14.8.49/Tone.js"></script>

Create 5 mood-based ambient sound presets using Tone.js synthesizers:

1. romantic_night:
   - Soft pad synth with reverb
   - Chord progression: Cmaj7 → Am7 → Fmaj7 → G7
   - Slow tempo, warm filter
   - Occasional gentle bell notes

2. tense_urban:
   - Low drone with distortion
   - Dissonant intervals: C3+Eb3, Gb3+A3
   - Pulsing rhythm, industrial feel
   - Random metallic percussion hits

3. bright_retro:
   - Bright synth lead
   - Major chord progression: D → F#m → A → C#m
   - Upbeat tempo with groove
   - Sparkly high-frequency arpeggios

4. melancholy_rain:
   - Ambient pad with lots of reverb
   - Minor progression: Am → C → Em → G
   - White noise filtered to sound like rain
   - Slow piano-like plucks

5. energetic_street:
   - Punchy bass synth
   - Energetic rhythm pattern
   - Major chords with movement
   - Electronic hi-hat patterns

Implementation:
- Create a SoundManager class
- Method: changeMood(moodName) - crossfade to new mood
- Method: toggle() - play/pause
- Method: setVolume(0-1)
- Auto-start when first results appear (after user interaction for browser autoplay policy)
- Crossfade between moods over 2 seconds when user searches new content
- Start volume at 30%

Connect to the floating audio bar UI at the bottom.
When user clicks Play, call Tone.start() first (required for browser audio policy).
```

---

## 🚀 STEP 6: PWA + 마무리

```
Create minimal PWA files:

manifest.json:
{
  "name": "Vibe Seoul",
  "short_name": "VibeSL",
  "description": "Feel K-Content Through Seoul",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#0a0a0f",
  "theme_color": "#FFB800",
  "icons": [
    { "src": "icons/icon-192.png", "sizes": "192x192", "type": "image/png" },
    { "src": "icons/icon-512.png", "sizes": "512x512", "type": "image/png" }
  ]
}

sw.js (minimal):
self.addEventListener('install', e => self.skipWaiting());
self.addEventListener('activate', e => e.waitUntil(clients.claim()));

Register in index.html:
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js');
}

Also add to index.html <head>:
<link rel="manifest" href="/manifest.json">
<meta name="theme-color" content="#0a0a0f">
<meta name="apple-mobile-web-app-capable" content="yes">
```

---

## ⏱ 3시간 타임라인

| 시간 | 작업 | Antigravity Step |
|------|------|-----------------|
| 0:00-0:30 | 프로젝트 생성 + UI 구조 | Step 1 + 2 |
| 0:30-1:00 | Gemini API 연동 + 테스트 | Step 3 |
| 1:00-1:30 | 이미지 생성 연동 | Step 4 |
| 1:30-2:00 | 사운드스케이프 | Step 5 |
| 2:00-2:20 | PWA + 디자인 다듬기 | Step 6 |
| 2:20-2:40 | 데모 영상 촬영 | 폰으로 촬영 |
| 2:40-3:00 | GitHub push + 제출 | 완료! |

---

## 🎬 데모 영상 시나리오 (1분)

0:00-0:10 "17 million tourists visit Seoul because of K-content. But they can't find the feeling."
0:10-0:15 앱 화면 보여주며 "Vibe Seoul changes that."
0:15-0:30 "K-Pop Demon Hunters" 입력 → 지도 + 이미지 + 사운드 나오는 화면
0:30-0:45 "Squid Game" 입력 → 완전히 다른 분위기로 전환
0:45-0:55 "Every K-content has a soul. Vibe Seoul maps it to the city."
0:55-1:00 로고 + "Built with Gemini 3.1 Pro + Nano Banana 2"
