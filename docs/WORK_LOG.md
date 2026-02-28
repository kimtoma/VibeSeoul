# Vibe Seoul — 오늘 하루 개발 세션 로그

> 2026-02-28 / Claude Code + Cloudflare Pages

---

## 시작 전 상태

[kimtoma/VibeSeoul](https://github.com/kimtoma/VibeSeoul) — 해커톤에서 만든 프로토타입이 GitHub에 올라가 있었다. API 키가 `index.html`에 그대로 노출된 채로.

---

## Phase 1 — 보안 수정 + 배포

### 프롬프트

> "내 Github 에서 vibeseoul 로컬로 클론해줘"

로컬로 클론 완료. 코드를 열어보니 `index.html` 안에 Gemini 키, Google 키가 전부 하드코딩되어 있었다.

> "지금 코드가 구려서 api키가 노출되는데 그것부터 수정해줘 그리고 나서 Vercel이나 clouflare pages로 라이브 배포해줘"

**변경 내용:**
- `functions/api/gemini.js` — Gemini API 프록시
- `functions/api/youtube-search.js` — YouTube 검색 프록시
- `functions/api/maps-script.js` — Maps 키 서버사이드 주입
- `api/` — Vercel 포맷 폴백도 생성

Vercel 배포를 먼저 시도했지만 CLI 인증이 non-interactive 환경에서 막혔다.

> "Vercel에서도 잘안되는거 같은데 clouflare pages로 라이브 배포해줘"

Cloudflare Pages로 전환. `wrangler` OAuth 토큰을 `~/.wrangler/config/default.toml`에서 추출해 환경변수로 주입하는 방식으로 배포 성공.

---

## Phase 2 — API 키 교체 + 구글 지도 디버깅

### 프롬프트

> "API 키 교체해줘"
> "Gemini 키: AIzaSy... / Google 키: AIzaSyBeU3zX23ZwJjKIavELM5j0x9Sgpi"

Cloudflare REST API로 Secrets 업데이트. 그런데 지도가 계속 안 뜸.

> "구글 지도가 제대로 로드가 안돼 뭔가 새로 키 발급할때 설정을 잘못했나?"

키 길이를 비교해보니 39자여야 하는데 34자가 들어온 것. 키가 잘려서 복붙됐던 거다.

> *(전체 키 붙여넣기)*

재설정 후 지도 정상 로드.

---

## Phase 3 — UI 완전 재설계 (검색창 → 플로팅 포스터)

### 프롬프트

> "검색창을 아예 없애고 첫 진입화면에서 커버플로우같은 인터페이스의 포스터가 둥둥 떠나니면 좋겠어. 기존에 작업했던 kimtoma.com 사이트의 홈 화면에서 위젯이 떠다니는 느낌을 참고해줘. 그리고 선택하면 전체화면 배경으로 맵이 보이고 그 위에 카드처럼 스팟정보랑 음악재생기가 보이면 좋겠어."

검색창 UI를 완전히 없애고 포스터 배치를 커버플로우 방식으로 구현. 그런데 다음 피드백이 이어진다.

> "내가 말했던 포스트는 실제 사진으로 구성된 포스터였어 그리고 내 홈페이지의 widget처럼 랜덤하고 자유 분방한 배치로 포스터가 날아다니는 느낌이면 좋겠어"

**재설계 방향:**
- 커버플로우 → **자유 스캐터 배치** (각 포스터가 독립적인 float 애니메이션)
- 더미 이미지 → **TMDB 실제 포스터**
- 포스터마다 고유한 CSS `@keyframes` 생성
- `kimtoma.com` 홈의 atmospheric orb 스타일 차용

> "TMDB 토큰 발급했어, 설정해줘"
> *(토큰 붙여넣기)*

`functions/api/poster.js` 추가. TMDB 검색 결과가 없으면 그라디언트+이모지 폴백.

---

## Phase 4 — 포스터 크기 + 이머시브 경험

### 프롬프트

> "포스터 크기가 너무 작아서 더 크게 수정해줘. 화면에서 되도록 안잘리게 표현해줘 / 결과화면에서도 마커를 선택하면 해당 생성되는 이미지가 더 크게 보이게 수정해줘 지금은 너무 작게 보여"

LAYOUT `w` 값 1차 증가 (180px대 → 220-260px대).

> "포스터 크기를 지금보다 더 키워줘 ㅎㅎ 홈 화면에서도 배경에 서울 지도가 보이게 해줘 대신 투명도를 낮춰서 희미하게 보이게 해줘 그리고 로딩중에 보이는 포스터 크기도 키워줘 아직 결과화면에서 마커를 선택하거나 카드를 선택해도 생성한 이미지가 작게 보이는데 emmersive 한 경험을 할수있게 전체 화면 스케일로 키워줘"

한 번에 요청이 몰아쳤다. 처리한 변경사항:

| 항목 | Before | After |
|------|--------|-------|
| 포스터 최대 폭 | ~268px | ~335px (+25%) |
| 로딩 프리뷰 | 110×165px | 200×300px |
| 랜딩 배경 | 단색 #0a0a0f | 서울 지도 28% opacity |
| 이미지 뷰어 | 작은 모달 | 전체화면 이머시브 뷰 |

**이머시브 뷰 기능:**
- 카드/마커 탭 → 풀스크린 오픈
- 좌우 스와이프 (mobile)
- 키보드 ←→ / Escape
- 닷 네비게이션
- 이미지 생성 중이면 자동 폴링 (최대 18초)

---

## Phase 5 — 콘텐츠 수정 + OST 픽스

### 프롬프트

> "K-pop demon hunters 노래가 자꾸 이상한게 나와 ost golden 하이라이트 부분으로 나오게 해줘 그리고 포스터가 안보이는 귤이 익는 시절은 폭삭 속았수다로 수정해서 업데이트해줘"

- K-Pop Demon Hunters: CONTENTS에 `ost` 하드코딩 필드 추가 → Gemini가 뭘 추천하든 무시
- 귤이 익는 시절 → **폭삭 속았수다** (TMDB 쿼리 포함)

처음엔 정국(Jungkook)의 Golden으로 잘못 설정.

> "정국의 golden이 아니라 케이팝데몬헌터스의 golden ost로 바꿔줘"

**Huntrix — Golden** (EJAE, AUDREY NUNA, REI AMI)
실제 K-Pop Demon Hunters Netflix 영화 OST. 빌보드 글로벌 200 1위, Grammy Best Song for Visual Media 수상곡.

검색 쿼리: `Huntrix Golden KPop Demon Hunters official MV`, startSeconds: 48

---

## Phase 6 — GitHub + README

### 프롬프트

> "깃허브에 최종버전으로 올려주고 readme는 한글이랑 영문으로 업데이트해줘"

README 전면 재작성 (한국어 + 영문 양쪽). 실제 기술 스택 반영:
- Tone.js → YouTube IFrame API
- "Gemini 3.1 Pro" → Gemini 2.5 Flash (텍스트) + Gemini Flash Image (이미지)
- TMDB, Cloudflare Pages Functions 추가

---

## 최종 파일 구조

```
vibeseoul/
├── index.html                    ← 단일 페이지 앱 (프레임워크 없음)
├── functions/
│   └── api/
│       ├── gemini.js             ← Gemini 프록시 (텍스트 + 이미지)
│       ├── youtube-search.js     ← YouTube 검색 프록시
│       ├── maps-script.js        ← Maps 키 서버사이드 주입
│       └── poster.js             ← TMDB 포스터 조회
├── wrangler.toml
└── README.md                     ← 한국어/영문 양쪽
```

## 배포

**https://vibeseoul.pages.dev** — Cloudflare Pages (main 브랜치 자동 반영)

---

## 오늘의 교훈

- `wrangler login`은 non-interactive 환경에서 안 된다 → API 토큰으로 해결
- OAuth 토큰은 만료된다 → 영구 API 토큰 생성이 낫다
- Gemini가 OST를 틀리게 추천하면 CONTENTS에 `ost` 필드로 하드코딩 오버라이드
- API 키 길이는 항상 확인할 것 (34자 vs 39자)
