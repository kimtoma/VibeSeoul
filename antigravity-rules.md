# Vibe Seoul - Antigravity Project Rules

## Project Overview
Vibe Seoul is a K-content tourism web app that transforms Korean entertainment (K-drama, K-pop, movies) into sensory experiences mapped to Seoul locations. Users input K-content → get mood-matched Seoul locations on a map with AI-generated artwork and ambient soundscapes.

## Tech Stack (STRICT)
- **Frontend**: Vanilla HTML/CSS/JavaScript (NO frameworks, NO React, NO build tools)
- **API**: Gemini 3.1 Pro (location reasoning) + Gemini 3.1 Flash Image aka Nano Banana 2 (image generation)
- **Maps**: Google Maps JavaScript API
- **Audio**: Tone.js via CDN (https://cdnjs.cloudflare.com/ajax/libs/tone/14.8.49/Tone.js)
- **Hosting**: Static files, deployable to Vercel/Netlify/GitHub Pages
- **PWA**: Minimal manifest.json + service worker for app-like experience

## Architecture
- Single Page Application (SPA)
- All code in ONE index.html file (inline CSS + JS) for simplicity
- ES modules where needed
- Mobile-first responsive design
- Dark theme (cinematic feel)

## Code Style
- Clean, readable ES6+
- async/await for all API calls
- Error handling with user-friendly fallbacks
- Korean + English bilingual UI text
- Comments in English

## Design Direction
- **Theme**: Cinematic dark mode, immersive, premium feel
- **Typography**: Google Fonts - "Outfit" for headings, "Noto Sans KR" for Korean text
- **Colors**: Deep dark background (#0a0a0f), neon accent colors that change per mood
  - Romantic: warm gold (#FFB800)
  - Tense: deep red (#FF2D55)
  - Bright: electric blue (#00D4FF)
  - Melancholy: soft purple (#A78BFA)
- **Layout**: Full viewport, map takes 60% of screen, side panel for content
- **Animations**: Smooth transitions between moods, fade-in for images

## API Keys (User will replace)
- Gemini API: `GEMINI_API_KEY` placeholder
- Google Maps: `GOOGLE_MAPS_API_KEY` placeholder

## Critical Constraints
- NO npm, NO node_modules, NO build step
- Must work offline-ish after first load (PWA)
- Image generation must feel fast (show loading animation)
- Total project must be understandable in under 5 minutes
- Demo flow: input K-content → see results in under 5 seconds
