---
title: "하루 만에 만든 K-콘텐츠 서울 여행 앱 — Vibe Seoul"
date: 2026-02-28
tags: [AI, 개발, Claude, Gemini, K-콘텐츠, 사이드프로젝트]
---

# 하루 만에 만든 K-콘텐츠 서울 여행 앱

해커톤에서 뚝딱 만든 프로토타입이 GitHub 구석에 쳐박혀 있었다. 코드는 돌아가는데, API 키가 `index.html`에 그대로 박혀 있고, UI는 검색창 하나 달랑 있고. 오늘 Claude Code 켜고 하루 동안 제대로 만들어봤다.

---

## 아이디어

17만 명의 해외 관광객이 매년 서울을 찾는다. 그 중 60% 이상이 K-드라마, K-팝, 한국 영화를 보고 온다. 근데 막상 서울에 도착하면 "그 느낌"을 어디서 찾아야 할지 모른다.

> "오징어 게임 보면서 숨이 막혔는데, 서울 가면 어디 가야 그 감성이 느껴지지?"

그게 Vibe Seoul의 출발점이다. K-콘텐츠의 무드를 분석해서, 그 감성과 가장 잘 맞는 서울 명소를 연결해주는 앱.

---

## 시작: 보안 구멍부터 막기

첫 번째로 한 건 API 키 정리다. 해커톤 때 빠르게 만드느라 키를 그냥 클라이언트 코드에 때려넣었는데, 당연히 GitHub에 올리면 안 된다. Cloudflare Pages Functions로 서버사이드 프록시를 만들어서 키를 환경변수로 관리하도록 바꿨다.

```
functions/api/gemini.js        ← Gemini API 프록시
functions/api/youtube-search.js ← YouTube 검색 프록시
functions/api/maps-script.js   ← Maps 키 서버사이드 주입
functions/api/poster.js        ← TMDB 포스터 조회
```

Vercel을 먼저 써보려다가 CLI 인증이 막혀서 Cloudflare Pages로 갔다. wrangler가 이미 로그인되어 있어서 훨씬 수월했다.

---

## UI 변신: 검색창 → 떠다니는 포스터

처음 UI는 단순했다. 검색창에 콘텐츠 이름 치면 결과 나오는 방식. 근데 이건 "여행 앱"보다는 "검색 엔진"에 가깝다. 바꾸고 싶었던 방향은 이거였다:

> "검색창을 아예 없애고 첫 진입화면에서 커버플로우같은 인터페이스의 포스터가 둥둥 떠나니면 좋겠어. 기존에 작업했던 kimtoma.com 사이트의 홈 화면에서 위젯이 떠다니는 느낌을 참고해줘."

처음엔 커버플로우 형태로 만들었는데, 이게 뭔가 너무 정갈했다.

> "내가 말했던 포스트는 실제 사진으로 구성된 포스터였어 그리고 내 홈페이지의 widget처럼 랜덤하고 자유 분방한 배치로 포스터가 날아다니는 느낌이면 좋겠어"

**자유 스캐터 배치**로 재설계했다. 포스터마다 고유한 CSS keyframes를 JS로 동적 생성해서 각자 다른 경로로 떠다니게 했다. TMDB API를 연결해서 실제 드라마/영화 포스터 이미지가 나오도록.

```javascript
// 포스터마다 독립적인 float 경로 생성
const kfName = `posterFloat${i}`;
styleEl.textContent = `
  @keyframes ${kfName} {
    0%   { transform: rotate(${rot}deg) translate(0px, 0px); }
    50%  { transform: rotate(${rot}deg) translate(${dx}px, ${dy}px); }
    100% { transform: rotate(${rot}deg) translate(0px, 0px); }
  }
`;
```

---

## 크기와 경험: 더 크게, 더 깊게

포스터를 보고 나서 첫 반응이 "작다"였다.

> "포스터 크기를 지금보다 더 키워줘 ㅎㅎ 홈 화면에서도 배경에 서울 지도가 보이게 해줘 대신 투명도를 낮춰서 희미하게 보이게 해줘 그리고 로딩중에 보이는 포스터 크기도 키워줘 아직 결과화면에서 마커를 선택하거나 카드를 선택해도 생성한 이미지가 작게 보이는데 emmersive 한 경험을 할수있게 전체 화면 스케일로 키워줘"

한 번에 여러 가지를 요청했는데, 정리하면:

1. **포스터 25% 더 크게** — 최대 335px
2. **랜딩 배경에 서울 지도** — 28% 투명도로 희미하게
3. **로딩 프리뷰 확대** — 110×165 → 200×300px
4. **이머시브 풀스크린 뷰** — 카드나 마커 탭하면 전체화면으로 이미지 열림

이머시브 뷰가 제일 만족스러운 부분이다. AI가 생성한 서울 장소 이미지를 화면 꽉 채워서 보면, 진짜 그 공간에 들어와 있는 느낌이 든다. 좌우 스와이프로 장소를 넘길 수 있고, 이미지가 아직 생성 중이면 자동으로 기다렸다가 뜬다.

---

## 세부 수정: OST 잘못 잡히는 문제

> "K-pop demon hunters 노래가 자꾸 이상한게 나와 ost golden 하이라이트 부분으로 나오게 해줘"

Gemini한테 OST 추천을 맡겼더니 엉뚱한 걸 계속 가져왔다. 해결 방법은 단순했다 — CONTENTS 배열에 `ost` 필드를 직접 하드코딩하고, Gemini 응답보다 우선하도록:

```javascript
// Gemini 추천 무시하고 하드코딩 OST 우선 사용
try { await soundManager.changeMood(content.ost || data.ost); }
```

처음엔 정국의 Golden으로 잘못 설정했다가, 실제 K-Pop Demon Hunters OST인 Huntrix의 Golden(EJAE, AUDREY NUNA, REI AMI)으로 수정. 빌보드 글로벌 200 1위에 Grammy까지 받은 곡이었다.

---

## 결과물

**[vibeseoul.pages.dev](https://vibeseoul.pages.dev)**

오징어 게임, 도깨비, BTS, K-Pop Demon Hunters, 폭삭 속았수다, 기생충, 응답하라 1988 — 7개의 K-콘텐츠 포스터가 서울 지도 위에 떠다닌다. 하나를 탭하면 AI가 그 콘텐츠의 감성과 닮은 서울 명소 5곳을 추천하고, 각 장소의 시네마틱 아트워크를 생성하고, OST가 자동으로 흘러나온다.

---

## 쓴 것들

| 역할 | 기술 |
|------|------|
| 장소 추천 | Gemini 2.5 Flash |
| 이미지 생성 | Gemini Flash Image |
| 포스터 | TMDB API |
| 지도 | Google Maps JavaScript API |
| 음악 | YouTube IFrame API |
| 배포 | Cloudflare Pages + Functions |
| 코딩 어시스턴트 | Claude Code |

---

하루 작업치고 꽤 됐다. 다음엔 더 많은 K-콘텐츠를 추가하고, 커스텀 도메인도 붙여볼 예정.
