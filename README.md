# 🎵 Vibe Seoul

**K-콘텐츠로 서울을 느끼다 — Feel K-Content Through Seoul**

> K-드라마, K-팝, 한국 영화의 감성을 서울의 실제 장소로 연결해주는 AI 감각 여행 경험

🌐 **Live:** [vibeseoul.pages.dev](https://vibeseoul.pages.dev)

---

## 한국어

### 무엇인가요?

포스터를 탭하면 그 K-콘텐츠의 감성과 분위기를 가장 잘 담은 서울 명소 5곳을 AI가 추천해줍니다. 장소마다 AI가 생성한 시네마틱 아트워크와 OST가 함께 흘러나와 마치 그 장면 속에 있는 듯한 경험을 선사합니다.

### 주요 기능

- **플로팅 포스터 랜딩** — 실제 K-콘텐츠 포스터들이 서울 지도 배경 위에 자유롭게 떠다님
- **AI 장소 추천** — Gemini 2.5 Flash가 콘텐츠 분위기를 분석해 서울 명소 5곳 추천
- **인터랙티브 지도** — Google Maps에 무드 컬러 마커로 표시
- **AI 아트워크** — Gemini Flash Image가 각 장소를 시네마틱하게 생성
- **이머시브 풀스크린 뷰** — 카드/마커 탭 시 전체화면으로 감상 (스와이프, 키보드 지원)
- **OST 자동 재생** — YouTube에서 콘텐츠 OST를 찾아 자동 재생
- **무드 반응형 UI** — romantic / tense / bright / melancholy / energetic 5가지 테마

### 기술 스택

| 역할 | 기술 |
|------|------|
| 장소 추천 AI | Gemini 2.5 Flash |
| 이미지 생성 AI | Gemini Flash Image (gemini-3.1-flash-image-preview) |
| 포스터 이미지 | TMDB API |
| 지도 | Google Maps JavaScript API |
| 음악 | YouTube IFrame API |
| 배포 | Cloudflare Pages + Functions |
| 프론트엔드 | Vanilla HTML/CSS/JS (빌드 도구 없음) |

### 직접 배포하기

1. 이 저장소를 클론합니다
2. [Cloudflare Pages](https://pages.cloudflare.com)에 배포합니다
3. Cloudflare Pages 대시보드에서 환경 변수(Secrets)를 설정합니다:

```
GEMINI_API_KEY        — Google AI Studio API 키
GOOGLE_API_KEY        — YouTube Data API v3 키 (Google Cloud Console)
GOOGLE_MAPS_API_KEY   — Google Maps JavaScript API 키
TMDB_READ_TOKEN       — TMDB API Read Access Token
```

> API 키는 `functions/api/` 서버사이드 함수에서만 사용되어 외부에 노출되지 않습니다.

---

## English

### What is it?

Tap any K-content poster and Vibe Seoul maps its emotional atmosphere to 5 real, visitable Seoul locations. Each spot comes alive with AI-generated cinematic artwork and the content's OST — putting you inside the feeling.

### Features

- **Floating poster landing** — Real K-content posters drift over a Seoul map background
- **AI location matching** — Gemini 2.5 Flash analyzes content mood and recommends 5 Seoul spots
- **Interactive map** — Google Maps with mood-colored markers
- **AI artwork** — Gemini Flash Image generates cinematic visuals for each location
- **Immersive fullscreen view** — Tap any card/marker to view full-screen (swipe & keyboard nav)
- **Auto OST playback** — Finds and plays the content's OST via YouTube
- **Mood-reactive UI** — 5 themes: romantic / tense / bright / melancholy / energetic

### Tech Stack

| Role | Technology |
|------|------------|
| Location AI | Gemini 2.5 Flash |
| Image generation | Gemini Flash Image (gemini-3.1-flash-image-preview) |
| Poster images | TMDB API |
| Map | Google Maps JavaScript API |
| Music | YouTube IFrame API |
| Deployment | Cloudflare Pages + Functions |
| Frontend | Vanilla HTML/CSS/JS (zero build tools) |

### Deploy Your Own

1. Clone this repo
2. Deploy to [Cloudflare Pages](https://pages.cloudflare.com)
3. Set the following secrets in your Cloudflare Pages dashboard:

```
GEMINI_API_KEY        — Google AI Studio API key
GOOGLE_API_KEY        — YouTube Data API v3 key (Google Cloud Console)
GOOGLE_MAPS_API_KEY   — Google Maps JavaScript API key
TMDB_READ_TOKEN       — TMDB API Read Access Token
```

> All API keys are handled server-side via `functions/api/` — never exposed to the client.

### Architecture

```
index.html                  ← Single-page app (no framework)
functions/
  api/
    gemini.js               ← Gemini proxy (text + image generation)
    youtube-search.js       ← YouTube search proxy
    maps-script.js          ← Google Maps key injection
    poster.js               ← TMDB poster lookup
wrangler.toml               ← Cloudflare Pages config
```

### Why Vibe Seoul?

17 million tourists visit Seoul each year, with over 60% motivated by K-content. But when they arrive, they can't find the *feeling* they fell in love with. Vibe Seoul transforms tourism from information to sensation.

> *"Squid Game made you hold your breath. Goblin made you cry. But when you land in Seoul... where do you go to feel that again?"*

---

🏆 Built for the **Google Gemini Seoul Hackathon 2026** — Entertainment category
