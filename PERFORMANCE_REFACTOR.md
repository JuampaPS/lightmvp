# Performance + UX Refactor Summary

## Files Changed

| File | Changes |
|------|---------|
| `components/BunkerSlider.tsx` | HeroMedia: poster-first LCP (priority Image), video mounts after rAF, fades in on canplay; `<source media>` for hero-mobile/hero-desktop |
| `components/SectionHero.tsx` | Poster always (Image); priority only for first; video mounts on IO (rootMargin 300px); poster-first fade-in; `noSection` prop |
| `components/LazyVideo.tsx` | **New.** IntersectionObserver: mount `<video>` only when near viewport; poster placeholder until then |
| `components/LazyMount.tsx` | **New.** IntersectionObserver: delay mounting children until near viewport; `onReveal` (e.g. ScrollTrigger.refresh) |
| `components/CommunityHubHorizontalScroll.tsx` | LazyVideo for video cards; `isMobile` default `true`; C/S/S stay JPEG-only |
| `components/Gallery.tsx` | `/videos-hero/` paths; `noSection` prop; single active item (already), no autoplay on mobile, controls |
| `components/VisionAboutUs.tsx` | `noSection` prop; Wrapper div/section |
| `components/LightshowAudioLanding.tsx` | LazyMount wrappers for Portfolio, SectionHero x2, CommunityHub x2, Vision, Gallery; `onReveal` → deferOnIdle(ScrollTrigger.refresh); section wrappers with id for scroll targets; `/videos-hero/` URLs |
| `data/portfolio-config.ts` | `mediaSrc` for videos → `/videos-hero/` |
| `next.config.js` | Headers for `/videos-hero/:path*`; rewrites `/videos-hero/*` → `/images/gallery/videos-hero/*` |
| `public/videos-hero/` | **New.** hero-mobile.mp4, hero-desktop.mp4 (copied from hero.mp4) |

## Why Each Change Helps

- **BunkerSlider poster-first:** LCP is the priority Image, not the video. Video loads after first paint (rAF) and fades in on `canplay`, so LCP stays fast and we avoid video blocking.
- **SectionHero poster + IO video:** Poster is always in HTML (priority for first only). Video mounts only when section is near viewport, then fades in on canplay. No offscreen video downloads.
- **LazyVideo:** Videos in CommunityHub only mount when the card is near viewport. C/S/S use JPEG only → no video there.
- **LazyMount:** Heavy sections (Portfolio, SectionHero, CommunityHub, Vision, Gallery) mount only when near viewport. First screen (navbar + slider) stays immediate. Less initial JS/layout work.
- **ScrollTrigger.refresh on reveal:** Deferred via `deferOnIdle` so layouts pin correctly after LazyMount reveals.
- **Gallery single active + no autoplay mobile:** Only one media in DOM; mobile uses controls, no autoplay. Lower payload and TBT.
- **`/videos-hero/` paths + rewrites:** Single place for video URLs; rewrites map to existing files. Cache headers for `/videos-hero/` and `/images/` improve repeat loads.
- **Navbar/footer (existing):** 44px menu button, footer IO, social `target="_blank"`, privacy `/privacy`, close top-right. Unchanged in this refactor.

## Verification (mental checklist)

- **Initial load (mobile):** Only hero poster is LCP; hero video starts after first paint and fades in.
- **No other MP4 requests** until user scrolls near the related section (SectionHero IO, LazyVideo, LazyMount).
- **Lighthouse:** LCP tied to poster Image; TBT kept low.
- **Scroll-to-section:** `#portfolio`, `#servicios`, `#space-design`, `#vision-about`, `#gallery` always exist (section wrappers); inner content lazy-mounts.
