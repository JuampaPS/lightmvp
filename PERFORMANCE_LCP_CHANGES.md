# Mobile Lighthouse LCP & Media Optimizations

## Prioritized List of Changes (Impact on LCP)

| # | Change | Why it affects LCP |
|---|--------|--------------------|
| 1 | **BunkerSlider hero: priority `next/image` + deferred video** | The hero video was the LCP element. Video decoding blocks painting. Replacing it with a **priority** static image (same asset as poster) lets the browser paint LCP immediately. Video loads after `requestIdleCallback`, then fades in. |
| 2 | **Remove render-blocking `@import` Teko font** | `@import url('https://fonts.googleapis.com/css?family=Teko')` in `globals.css` blocked rendering until the font loaded. Teko is already provided via `next/font` in `layout.tsx` (`--font-teko`). Removing the import eliminates this blocking request. |
| 3 | **Videos: `preload="none"` everywhere** | `preload="metadata"` (or default `auto`) causes the browser to fetch video data early, competing with LCP image and parser. Using `preload="none"` avoids video network work until the element is in use. |
| 4 | **`next/image` for below-the-fold images** | Gallery, CommunityHub, CardFactory: all `<img>` replaced with `next/image` + `loading="lazy"` + `sizes`. Reduces initial bytes, enables AVIF/WebP, and prevents off-screen images from delaying LCP. |
| 5 | **`next.config.js`: images + cache headers** | Smaller `deviceSizes` for mobile (390, 430), higher `minimumCacheTTL`, and `Cache-Control` for `/_next/static` and `/images` improve repeat loads and ensure optimized variants are cached. |
| 6 | **`experimental.optimizePackageImports`** | `framer-motion` and `gsap` added so Next.js can tree-shake barrel imports. Less JS reduces main-thread work and helps TTI/TBT, indirectly helping LCP stability on slow devices. |

---

## Code Diffs

### 1. `components/BunkerSlider.tsx`

- **Hero media:** New `HeroMedia` component.
  - Renders a **priority** `next/image` (hero poster) as the immediate LCP asset.
  - Video has `preload="none"`, no `src` initially. `src` is set and `load()` called inside `requestIdleCallback` (or `setTimeout` fallback).
  - Video fades in on `canplay` via `opacity` transition.
- **Non-hero slides:** Use `next/image` with `fill`, `sizes="100vw"`, `loading="lazy"`.

### 2. `components/SectionHero.tsx`

- `preload="metadata"` → `preload="none"`.
- Optional `poster` prop added for future use (e.g. first frame or custom poster).

### 3. `components/Gallery.tsx`

- Single image (gallery2) uses `next/image` with `fill`, `sizes="70vw"`, `loading="lazy"`.
- All videos use `preload="none"`.

### 4. `components/CommunityHubHorizontalScroll.tsx`

- Image cards use `next/image` with `fill`, `sizes="100vw"`, `loading="lazy"`.
- Videos use `preload="none"`.

### 5. `components/portfolio/CardFactory.tsx`

- `SimpleImage`: `next/image` with `fill`, `sizes="(max-width: 768px) 100vw, 50vw"`, `loading="lazy"`.
- `SimpleVideo`: `preload="none"`, optional `poster`; `FullscreenLayout` passes `videoPoster` when available.

### 6. `app/globals.css`

- Removed `@import url('https://fonts.googleapis.com/css?family=Teko');`.
- Replaced `font-family: 'Teko', sans-serif` with `font-family: var(--font-teko), sans-serif` (3 uses).

### 7. `next.config.js`

- **images:** `deviceSizes` + `[390, 430]`, `minimumCacheTTL: 86400`.
- **headers:**
  - `/_next/static/:path*` → `Cache-Control: public, max-age=31536000, immutable`.
  - `/images/:path*` → `Cache-Control: public, max-age=86400, stale-while-revalidate=604800`.
- **experimental.optimizePackageImports:** `['framer-motion', 'gsap']`.

---

## Root Causes Addressed

1. **LCP blocked by hero video**  
   Video was the LCP element; decoding delays first paint. Using a priority image for the same frame and deferring video removes that bottleneck.

2. **Render-blocking font**  
   Teko `@import` blocked rendering. Dropping it and using `var(--font-teko)` from `next/font` removes the blocking request.

3. **Video preload competing with LCP**  
   `preload="metadata"` / `auto` triggered early video fetches. `preload="none"` everywhere stops video from competing with the LCP image.

4. **Heavy, unoptimized images**  
   Raw `<img>` and multiple full-size images increased payload and work. `next/image` + lazy loading + `sizes` cut initial load and use modern formats.

5. **Missing cache headers**  
   Static and image assets had no explicit caching. Headers in `next.config.js` improve repeat-visit performance.

---

## Recommended Follow-ups

- **Loader overlay:** The full-screen loader hides content until `load`. Consider shortening it or making it optional so LCP isn’t delayed by the loader.
- **Posters for SectionHero videos:** Where useful, add `poster` (e.g. first frame or a dedicated image) so sections show something before video plays.
- **LCP preload (optional):** If the hero image URL is known at build time, a `<link rel="preload" as="image" href="...">` in the root layout can further reduce LCP; `next/image` with `priority` already adds a preload in many setups.

---

## How to Verify

1. **Lighthouse (mobile):** Run Performance on a mobile profile. LCP should improve; the hero image should be the LCP element.
2. **Network:** Confirm the hero image is requested early and that video requests start only after idle (or when the video is visible).
3. **No blocking fonts:** In the Performance panel, ensure there’s no blocking `@import` for Teko.
