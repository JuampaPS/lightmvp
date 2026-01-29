# TBT / TTI Performance Changes

## Summary of Code Changes

### 1. **`utils/deferOnIdle.ts`** (new)

- `deferOnIdle(cb, { timeout })`: runs `cb` via `requestIdleCallback` (fallback `setTimeout(0)`).
- Returns a `cancel` function for cleanup.
- Used to defer heavy GSAP/ScrollTrigger setup until after first paint, reducing main-thread blocking.

### 2. **`components/LightshowAudioLanding.tsx`**

**Dynamic imports (below-the-fold):**

- `SimplePortfolio`, `CommunityHubHorizontalScroll`, `SectionHero`, `VisionAboutUs`, `Gallery` are now `next/dynamic(..., { ssr: false })` with minimal loading placeholders (`<div>` with min-height, `aria-hidden`).
- **Effect:** Their JS (GSAP, Framer Motion, etc.) is split into separate chunks. The initial bundle is smaller, so parse/compile cost is lower and TTI improves. These sections load after the above-the-fold hero.

**Scroll-to-top simplification:**

- **Before:** Multiple `setTimeout(0,10,50,100)` + `forceScrollToTop`, plus `load` and `DOMContentLoaded` listeners.
- **After:** Single `scrollTop()`, one `load` listener with `{ once: true }`.
- **Effect:** Less main-thread work on load, fewer timers and listeners.

### 3. **`components/CommunityHubHorizontalScroll.tsx`**

- **Deferred init:** ScrollTrigger setup (card width reads, `gsap.to`, etc.) runs inside `deferOnIdle(initScroll, { timeout: 600 })` instead of `setTimeout(..., 400)`.
- **Layout thrashing:** Replaced `cards.forEach` with a `for` loop for width reads; kept batched reads then a single write (`container.style.width`). `ScrollTrigger.refresh()` deferred via `deferOnIdle` after setup.
- **Mounted guard:** `mounted` flag so we don’t run async work after unmount.
- **Resize:** `window` guard, simplified handler; still use `requestAnimationFrame` before `ScrollTrigger.refresh()`.

**Effect:** Heavy layout + GSAP work runs in idle time, so it blocks less during initial load and interaction.

### 4. **`components/VisionAboutUs.tsx`**

- **Deferred init:** GSAP masked-text setup (title lines, timeline, ScrollTrigger) runs in `deferOnIdle(setupAnimation, { timeout: 400 })` instead of `setTimeout(..., 500)`.
- **ScrollTrigger.refresh:** Deferred via `deferOnIdle` after setup.
- **Cleanup:** Properly kills ScrollTriggers and cancels the idle callback.

**Effect:** GSAP/ScrollTrigger work no longer runs immediately on mount; it’s deferred until the main thread is idle.

### 5. **`hooks/useStackingAnimation.ts`**

- **`useLayoutEffect` → `useEffect`:** Animation setup no longer runs synchronously before paint, avoiding extra main-thread blocking during layout.
- **Deferred setup:** Full GSAP context + ScrollTrigger timeline runs inside `deferOnIdle(setup, { timeout: 300 })`.
- **Cleanup:** Stores `gsap.context` in a ref, calls `ctx.revert()` and cancels the idle callback on unmount.
- **Window guard:** Early return if `typeof window === "undefined"`.

**Effect:** No layout-effect sync work; stacking animation init is deferred and doesn’t delay first paint or TTI.

### 6. **`components/BunkerNavbar.tsx`**

- **Window guards:** `typeof window === "undefined"` checks in the menu animation effect and the footer IntersectionObserver effect.
- Menu animation still runs on user open (already after first paint); no deferral there to keep perceived latency low.

**Effect:** Ensures no animation or DOM code runs during SSR; reinforces client-only behavior.

---

## Before vs After: What Reduces Main-Thread Blocking

| Before | After | Why it helps TBT/TTI |
|--------|-------|----------------------|
| GSAP/ScrollTrigger init runs in `useEffect`/`setTimeout` soon after mount | Init deferred with `requestIdleCallback` (via `deferOnIdle`) | Heavy work runs when the main thread is idle, so it blocks less during load and first interaction. |
| Below-the-fold components (Portfolio, CommunityHub, SectionHero, Vision, Gallery) in main chunk | Dynamic imports + `ssr: false` | Smaller initial JS bundle → less parse/compile up front, faster TTI. Animation code loads only when those sections are needed. |
| `useLayoutEffect` for stacking animation | `useEffect` + deferred setup | No sync layout-phase work; animation setup happens after paint and during idle. |
| Multiple scroll-to-top timers and listeners | Single scroll + one `load` listener | Fewer timers and less work on load → less main-thread blocking. |
| `ScrollTrigger.refresh()` immediately after setup | Deferred where possible (e.g. CommunityHub, Vision) | Avoids extra layout/reflow spikes during initial setup. |
| Layout reads in `forEach` + potential extra style reads | Batched reads (e.g. `for` loop), then single write | Reduces layout thrashing; fewer reflows. |
| No explicit guards for `window` in animation effects | Guards in BunkerNavbar, CommunityHub, useStackingAnimation, etc. | Prevents any animation or DOM access during SSR; avoids errors and unnecessary work. |

---

## How to Verify

### Lighthouse (TBT / TTI)

1. Open DevTools → **Lighthouse**.
2. Mode **Navigation**, device **Mobile**, categories **Performance**.
3. Run audit.
4. Check:
   - **Total Blocking Time (TBT):** Should decrease vs. before; less long main-thread work during load.
   - **Time to Interactive (TTI):** Should improve with a smaller initial bundle and deferred animation setup.

### Chrome Performance panel

1. **Record load:** DevTools → **Performance** → record → refresh page → stop.
2. **Main thread:**
   - Look for long tasks (red/yellow blocks > ~50 ms). There should be fewer and shorter ones during initial load.
   - GSAP/ScrollTrigger work for CommunityHub, Vision, Portfolio should appear **after** first paint and often in idle time.
3. **Network:**
   - Confirm separate chunks for dynamically imported components (e.g. `SimplePortfolio`, `CommunityHubHorizontalScroll`, `Gallery`) that load after the main bundle.

### Quick checks

- **Dynamic imports:** Disable cache, reload, inspect Network. You should see multiple JS chunks; below-the-fold components load after the main page chunk.
- **No SSR animation:** No `window`/`document` errors during SSR; all animation setup is either behind `typeof window` checks or in dynamically imported client-only components.

---

## Optional Follow-ups

- **Loader:** The full-screen loader can delay “visually ready” and affect when users perceive TTI. Consider shortening it or making it optional.
- **Gallery / Framer Motion:** `useScroll` / `useTransform` run when Gallery mounts. Gallery is dynamically imported, so they only run when that chunk loads. If needed, you could lazy-mount Gallery only when it’s near the viewport (e.g. IntersectionObserver) to defer that cost further.
- **`split-type`:** Currently in `package.json` but unused. Removing it will slightly reduce bundle size.
