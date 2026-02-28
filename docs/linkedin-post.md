# LinkedIn Post

---

I spent a day rebuilding a hackathon prototype into something I'm actually proud of — and the entire workflow was a conversation.

**Vibe Seoul** maps K-content (K-dramas, K-pop, Korean films) to real Seoul locations that match their emotional atmosphere. Think: "Where in Seoul do you go to *feel* like you're inside Squid Game?" — then AI finds the answer and generates cinematic artwork for each spot.

The original had hardcoded API keys, a plain search bar, and no real design. Here's what changed in one session:

**→ Security first**
Moved all API keys server-side via Cloudflare Pages Functions. Nothing sensitive in the client.

**→ Rethought the entry point**
Instead of a search bar, 7 K-content posters now drift freely across a Seoul map background — each with its own float animation path generated dynamically. Tap one to dive in.

**→ Real poster images**
Connected TMDB API to pull actual drama/film posters. Graceful emoji fallback when none found.

**→ Immersive image viewing**
The AI-generated location artwork now opens fullscreen with swipe navigation, dot indicators, and a polling mechanism that waits for images still being generated. Small detail, big difference in feel.

**→ OST precision**
When Gemini kept picking the wrong track for K-Pop Demon Hunters, I hardcoded an `ost` override field in the content config — so it always plays Huntrix's "Golden" (the actual Grammy-winning OST) at the chorus.

---

The part I find interesting: most of this was directed through natural language. Not "write a function that does X" — more like:

> *"포스터가 날아다니는 느낌이면 좋겠어"*
> ("I want the posters to feel like they're flying around")

Or:

> *"emmersive 한 경험을 할수있게 전체 화면 스케일로 키워줘"*
> ("Make it immersive — fullscreen scale")

The implementation details followed from the intent. That's the workflow shift that's genuinely new.

---

**Stack:** Gemini 2.5 Flash · Gemini Flash Image · TMDB · Google Maps · YouTube IFrame API · Cloudflare Pages Functions · Vanilla JS

**Live:** [vibeseoul.pages.dev](https://vibeseoul.pages.dev)
**Code:** [github.com/kimtoma/VibeSeoul](https://github.com/kimtoma/VibeSeoul)

---

*17 million tourists visit Seoul every year. Over 60% come because of K-content. Vibe Seoul tries to close the gap between the feeling they came for and the city they find.*
