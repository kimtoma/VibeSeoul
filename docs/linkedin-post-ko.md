# LinkedIn Post (한국어)

---

해커톤 프로토타입을 하루 만에 제대로 된 서비스로 다시 만들었습니다. 코딩보다 대화가 더 많았던 작업이었어요.

**Vibe Seoul**은 K-드라마, K-팝, 한국 영화의 감성을 서울의 실제 장소로 연결해주는 앱입니다. "오징어 게임의 그 긴장감을 서울 어디서 느낄 수 있지?" — AI가 답을 찾고, 각 장소의 시네마틱 아트워크를 생성해줍니다.

원본은 API 키가 코드에 그대로 박혀 있고, 검색창 하나 달린 밋밋한 UI였습니다. 오늘 바뀐 것들:

**→ 보안부터**
모든 API 키를 Cloudflare Pages Functions로 서버사이드 처리. 클라이언트에 민감한 정보 없음.

**→ 진입점 재설계**
검색창 대신, K-콘텐츠 포스터 7개가 서울 지도 배경 위에 자유롭게 떠다닙니다. 각 포스터마다 고유한 float 경로를 JS로 동적 생성. 탭하면 바로 그 세계로.

**→ 실제 포스터 이미지**
TMDB API 연결로 실제 드라마/영화 포스터 사용. 검색 결과 없으면 이모지+그라디언트 폴백.

**→ 이머시브 풀스크린 뷰**
AI가 생성한 서울 장소 이미지를 전체화면으로. 좌우 스와이프, 닷 네비게이션, 이미지 생성 중이면 자동 대기 후 표시.

**→ OST 정밀 제어**
Gemini가 K-Pop Demon Hunters에 엉뚱한 노래를 계속 추천해서, 콘텐츠 설정에 `ost` 오버라이드 필드를 직접 추가했습니다. 이제 항상 Huntrix의 "Golden"(실제 Grammy 수상 OST) 코러스부터 재생.

---

흥미로웠던 건 작업 방식입니다. "이 함수를 이렇게 짜줘"가 아니라:

> *"포스터가 날아다니는 느낌이면 좋겠어"*

> *"emmersive 한 경험을 할수있게 전체 화면 스케일로 키워줘"*

의도를 말하면 구현이 따라왔습니다. 기술 명세보다 감각적 방향이 먼저였고, 코드는 그걸 해석한 결과물이었어요. 이게 지금 AI 코딩 도구가 바꾸고 있는 실제 워크플로우라고 생각합니다.

---

**스택:** Gemini 2.5 Flash · Gemini Flash Image · TMDB · Google Maps · YouTube IFrame API · Cloudflare Pages Functions · Vanilla JS

**라이브:** [vibeseoul.pages.dev](https://vibeseoul.pages.dev)
**코드:** [github.com/kimtoma/VibeSeoul](https://github.com/kimtoma/VibeSeoul)

---

*매년 1,700만 명이 서울을 찾습니다. 그중 60% 이상이 K-콘텐츠를 보고 옵니다. Vibe Seoul은 그들이 찾아온 '그 느낌'과 실제 도시 사이의 간극을 좁히려 합니다.*
