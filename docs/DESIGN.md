---
name: DentalSite-v2 Plan
overview: Single-page dental clinic website inspired by lavadental.lv — light adaptation with lime green branding, geometric typography, and CSS scroll-driven animations throughout.
todos: []
isProject: false
---

# DentalSite-v2 Plan

## Context

A dental clinic in Lachenaie/Terrebonne, Quebec (established 2000) needs a modern single-page website. The existing scraped content from their live site (`dentistelachenaie.com`) provides the source material. Two dentists: Dr Nathalie Vaillancourt and Dr Marie-Christine St-Onge. Services include orthodontics, prevention, pediatric care, restorations, implants, emergency, surgery, and cosmetic dentistry.

**Reference site:** lavadental.lv — a premium dental studio with sophisticated scroll-driven animations and distinctive typography. This plan adapts that site's design language (notably its animation style and typographic approach) to this client's lime-green brand on a light background.

**Core direction:** Light/white adaptation of lavadental.lv's aesthetic. Keep the geometric typography feel, the scroll-driven animation style, and the premium card-based layouts — but swap dark green backgrounds for white/light gray, and use lime green `#B0D64E` as the primary accent instead of mint.

**Language direction:** Fully bilingual (**Quebec French + English**), with **French (Quebec)** as the default on first load. All sections, form labels, validation messages, microcopy, metadata, and accessibility strings must exist in both languages with parity.

## Brand Colors (from client branding)


| Token                  | Hex       | Use                                                     |
| ---------------------- | --------- | ------------------------------------------------------- |
| `--color-accent`       | `#B0D64E` | Lime green — CTAs, highlights, active nav, hover states |
| `--color-accent-dark`  | `#8fb335` | Darker lime for hover states                            |
| `--color-bg`           | `#FFFFFF` | Main background                                         |
| `--color-bg-alt`       | `#F4F4F4` | Alternating sections, cards                             |
| `--color-bg-dark`      | `#1a1a1a` | Dark sections (hero, contact, footer)                   |
| `--color-text`         | `#333333` | Body text, headings                                     |
| `--color-text-light`   | `#666666` | Secondary text                                          |
| `--color-text-inverse` | `#FFFFFF` | Text on dark backgrounds                                |


## Typography

Google Fonts substitutes for LAVA's custom fonts:


| Role                | Font             | Weights       | Notes                                                            |
| ------------------- | ---------------- | ------------- | ---------------------------------------------------------------- |
| Headings            | **Syne**         | 500, 700      | Geometric, distinctive — closest Google Font to PP Neue Montreal |
| Nav / labels / caps | **Josefin Sans** | 300, 400, 500 | Narrow, elegant — same as LAVA's nav font                        |
| Body                | **DM Sans**      | 400, 500      | Clean, readable — similar to Jost                                |
| Accent / numbers    | **Syne Mono**    | 400           | For hours, phone numbers                                         |


**Type scale (fluid, using clamp):**

- `--font-size-hero`: `clamp(3rem, 8vw, 7rem)`
- `--font-size-section-title`: `clamp(2rem, 4vw, 3.5rem)`
- `--font-size-card-title`: `clamp(1.25rem, 2vw, 1.5rem)`
- `--font-size-body`: `clamp(0.9rem, 1.5vw, 1rem)`
- `--font-size-nav`: `clamp(0.65rem, 1vw, 0.75rem)` — uppercase, tracked

**Letter-spacing:** Nav and labels use `0.1em–0.15em` tracking (uppercase, Josefin Sans).

## Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: CSS Modules + CSS custom properties for design tokens
- **Animations**: Pure CSS scroll-driven (`animation-timeline: scroll()`, `view-timeline`) + CSS `@keyframes`. No JS animation libraries.
- **3D**: **Three.js** via `@react-three/fiber` + `@react-three/drei` (GLTF/GLB). Client-only dynamic import (`ssr: false`) for the tooth showcase — not a "motion library," but a WebGL runtime.
- **Text measurement**: `@chenglou/pretext` — Canvas-based glyph measurement for zero-DOM-read layout (services equal-height cards, procedure step alignment, optional accordion bios)
- **Deployment**: Static export

## Localization & Copy Requirements

- Primary audience is **Quebec French** speakers; use `fr-CA` vocabulary and phrasing, not France-only idioms.
- Every user-visible string must have `fr-CA` and `en-CA` entries: nav, headings, body copy, CTA text, form labels/placeholders, validation errors, aria-labels, alt text, metadata.
- Default render is French (`fr-CA`), with an explicit EN toggle.
- Keep semantic parity across locales (same meaning and section hierarchy), while allowing natural phrasing (not literal word-for-word translations).
- Add a content QA pass in plan: native-level Quebec French review before launch.

## Existing Client Site Structure (multi-page)


| Client page       | URL slug                                      | Maps to single-page section                   |
| ----------------- | --------------------------------------------- | --------------------------------------------- |
| Home              | `/index.html`                                 | `#hero`, `#services` preview, `#team` preview |
| About Us          | `/centre-dentaire-lachenaie.html`             | `#about`                                      |
| Our Team          | `/team-dental-clinic-lachenaie.html`          | `#team` (expanded)                            |
| Photo Gallery     | `/dental-clinic-lachenaie-photo-gallery.html` | `#gallery`                                    |
| Our Services      | `/dental-services-lachenaie.html`             | `#services` (expanded)                        |
| Your First Dental | `/first-dental-visit-new-patient.html`        | `#first-visit`                                |
| Contact Us        | `/dentist-lachenaie.html`                     | `#contact`                                    |
| Appointment       | `/appointment-dentist-lachenaie.html`         | `#appointment`                                |

**Nav structure (client site):** Home | About Us (dropdown) | Our Services | Your First Dental | Contact Us (dropdown) | francais

## Single-Page Adaptation

All content collapses into one long-scrolling page. 7 section anchors in the nav.

**Nav links:** `Home | About | Services | Gallery | First Visit | Appointment | Contact`

## LAVA Dental reference screenshots → UI patterns

Source folder: [DentalContent/Images/Elements I want to recreate/](DentalContent/Images/Elements%20I%20want%20to%20recreate/) (PNG references; `team.avif` is a supplementary asset — convert to WebP/PNG for implementation if used).

| Reference file | What it shows | How we mirror it (client brand) |
| --- | --- | --- |
| `lava-reference-header-nav.png` | Full-width dark bar: geometric mark left, **centered** text nav (About us, Portfolio, Services, Team, Price list, FAQ, Contacts), thin **horizontal rule** under the whole menu row, **EN** + chevron right, subtle blurred imagery on the right edge | **Nav.tsx**: same layout (logo + wordmark left is fine for clinic branding); replicate **centered anchor row** + **1px hairline** under links + generous horizontal padding. Map labels to our 7 anchors (no Portfolio/Price/FAQ unless you add sections later). Include a clear FR/EN language switcher in nav; FR is default. **Scroll-responsive bar** (see §1 below): **vertical gradient** on the nav chrome — **more opaque at the top**, **softer / more transparent toward the bottom edge** of the nav strip + `backdrop-filter`; **on scroll**, blend toward a **more solid, uniform** bar over light content. Lime accent for active/hover (`#B0D64E`) instead of LAVA's pale sage logo color |
| `lava-reference-about-band-1.png` | **Pale mint/sage** full-bleed section; **large left headline** ("There's a team behind every smile"); **two columns** — tall **portrait image** left (artistic hands / human touch), **right column** copy with a **vertical rule** beside text; **lead paragraph bold**, body smaller | **AboutSection** first band: background `#E8EDE3` or similar (still "light" site — alternate with white). Headline + client story. **Image**: prefer **real team or clinic** photo; if no suitable crop, use **gloved hands + patient** stock only with license. Typography: Syne headline + DM Sans body; `border-left` on text column in accent or dark gray |
| `lava-reference-about-band-2.png` | **Light gray textured** (stone/plaster) background; **square image** left with **carousel** UI (pause + dot track); **mission copy** right with **vertical rule**; bold intro + two paragraphs | **AboutSection** second band (stack below first): CSS **noise or subtle texture** on `#F4F4F4`. **Image strip**: start with **static hero image** + optional **manual carousel** (accessibility: pause, keyboard) — swap slides with **interior / chair / instruments** photos when assets decode reliably. Copy = clinic values + "comfort / atmosphere" from scraped content |
| `lava-reference-about-band-3.png` | **Dark olive-gray** full-width band; **large fabric/curtain** texture **left third**; **centered white headline**; **three photos** in **asymmetric collage** (treatment, hands/prep, patient comfort with headphones) | **AboutSection** third band **or** a dedicated **ExperienceCollage** block **without** a new nav item (still under `#about` anchor): background `#2a2f2c` or reuse `--color-bg-dark`; optional **CSS mask or background image** for drape texture; **absolute-positioned** editorial grid of **3 photos** with scroll-driven fade/slide (same CSS timeline system). Use **client** treatment room / team / patient comfort shots when available; avoid anonymous stock for this collage if possible |

**Implementation notes:** Recreating LAVA's **exact** carousel and collage timing is optional; priority is **layout, hierarchy, texture, and scroll feel** on **client colors**. Reference PNGs are **design targets**, not assets to ship in `public/`.

## Page Sections (top to bottom)

```
[Sticky Nav]  ← fixed top, scroll progress bar, 7 section anchors
     │
     ├── #hero         — Full-height hero, clinic name, tagline, phone + CTA
     ├── #logo-video   — Scroll-scrubbed hero video (teeth animation + magic wand)
     ├── #about        — Clinic story + values (2-column layout)
     ├── #services     — 8 service cards (horizontal scroll within sticky container)
     ├── #tooth-3d     — Three.js molar GLB: idle spin + cursor parallax tilt (optional text carousel beside model)
     ├── #team         — Two dentist profiles + staff photos (scroll-reveal)
     ├── #gallery      — Clinic photo grid (interior/exterior images)
     ├── #hours        — Clinic hours table
     ├── #first-visit  — First-visit instructions + PDF download + procedure steps
     ├── #appointment  — Appointment request form
     ├── #contact      — Contact info + dark strip with lime accents
     └── #footer       — Dark footer, copyright, Calytek credit
```

## Animation System (from lavadental.lv)

**Default:** CSS-native, scroll-driven. No JS animation libraries.

**Exceptions:** (1) **Scroll-scrubbed video** in `#logo-video` — vanilla JS `currentTime` mapping (§8). (2) **3D tooth** — `useFrame` / pointer handlers in R3F (§9). Pretext is measurement-only, not animation.

### 1. Sticky Header + Scroll Progress Bar + Gradient Chrome

- Nav is `position: fixed`, **`backdrop-filter: blur()`** (with transparent fallback)
- **Gradient bar (LAVA-inspired):** Nav background is **not** a flat rgba slab. Use a **`linear-gradient(to bottom, …)`** so the **top** of the nav is **more solid** and the **bottom edge** of the nav strip is **more transparent**, feathering into the hero/light content below. Combine with blur for a frosted-glass effect.
- **Scroll-linked solidity:** As the user scrolls down (past hero / onto light sections), interpolate toward a **flatter, more opaque** background (e.g. higher min alpha or shorter gradient stop) so links stay readable over `#FFFFFF` / `#F4F4F4`. Implement with **CSS `animation-timeline: scroll(root)`** on custom properties **or** a tiny scroll listener toggling a `data-scrolled` / `--nav-solid` variable on `<html>` or the nav — whichever tracks design more faithfully in QA.
- A 2px lime green progress bar at the bottom of the nav grows left-to-right as the user scrolls (CSS `@keyframes` with `animation-timeline: scroll()`)
- Active section link highlighted via IntersectionObserver

### 2. Hero Text Reveal

- Heading text uses staggered word-by-word opacity fade-in on load
- `animation-timeline: view()` — words appear as hero scrolls into view

### 3. Services: Horizontal Scroll via Vertical Scroll

- A section with a **sticky container** — as user scrolls vertically, the services cards translate horizontally (CSS `transform` driven by scroll progress)
- Cards scale from 0.9 → 1.0 as they enter the visible area
- Same technique as LAVA's about-process carousel

### 4. Section Clip-Path Reveals

- Sections use `clip-path: polygon()` that animates from a collapsed state to full size as the user scrolls
- Applied to: about, services, team, gallery sections

### 5. Team / Gallery: Scroll-Reveal Entrance

- Each card has `--start-transform: translateY(20vmin)` and `--end-transform: translateY(-20vmin)` CSS custom properties
- Cards fade + slide into position as section scrolls into view
- Uses `animation-timeline: view()` with `animation-range`

### 6. Card Hover Animations

- Cards: `scale(1.02)` on hover, smooth transition with `cubic-bezier(0.16, 1, 0.3, 1)`
- Buttons: `scale(1.02)` on hover, `scale(0.98)` on active
- All transitions: `var(--transition-default-duration: 0.5s)`

### 7. Pretext Text Measurement (@chenglou/pretext)

Install: `npm install @chenglou/pretext`

Pretext measures text dimensions via Canvas `measureText()` and pure arithmetic — zero DOM reads, zero forced reflow. The core pattern: `prepare(text, font)` caches glyph widths once; `layout(prepared, width, lineHeight)` returns `{ height, lineCount }` instantly for any width.

Three targeted uses in this site:

**A. Services: Equal-Height Cards**
The 8 service cards in the horizontal scroll all share the same container height. Pretext computes each card's text height via `layout()`, finds the tallest, and sets all cards to that height. Without Pretext, equal-height cards require either `display: flex` stretching (inconsistent with horizontal scroll layout) or DOM measurement (triggers reflow). Pretext solves this exactly with zero cost.

**B. First Visit: Procedure Step Alignment**
The 6 numbered procedure steps have varying text lengths. Pretext computes each step's line count and height. This lets us:

- Ensure visual balance across steps even with unequal text
- Optionally animate step numbers with line-count-dependent styling

**C. Team: Expand/Collapse Bios (if implemented)**
If dentist bios get a "read more" toggle, Pretext pre-computes the expanded height before the DOM exists. CSS transitions can then animate from collapsed to expanded with zero layout jump — the exact pattern from the [Pretext accordion demo](https://chenglou.me/pretext/accordion).

**Usage pattern:**

```ts
import { prepare, layout } from '@chenglou/pretext'

// Cache once per text+font pair
const prepared = prepare(bioText, '16px Syne')

// Query at any width — ~0.01ms, zero DOM reads
const { height, lineCount } = layout(prepared, cardWidth, 24)
```

**Files:** `src/utils/pretext.ts` — wrapper exporting ready-to-use `measureHeight(text, font, width, lineHeight)` helper. Consumed by `ServiceCard`, `FirstVisitSection`, and optionally `TeamSection`.

### 8. Logo Video: Scroll-Scrubbed Playback

The `.mp4` video plays forward as the user scrolls down and rewinds as the user scrolls up. Implemented with vanilla JS — no libraries needed.

**Behavior:**
- On page load, the video is paused at `currentTime = 0`
- As the `#logo-video` section scrolls into view, an `IntersectionObserver` starts tracking scroll position
- A `scroll` event listener maps the section's scroll progress (0 → 1) to `video.currentTime` (0 → video.duration)
- Scroll down: `currentTime` increases → video plays forward
- Scroll up: `currentTime` decreases → video rewinds
- Video is `muted`, `playsinline` for mobile compatibility

**Key JS logic:**
```ts
const video = videoRef.current
const section = sectionRef.current
const observer = new IntersectionObserver(([entry]) => {
  if (entry.isIntersecting) startTracking()
  else stopTracking()
}, { threshold: 0 })

function onScroll() {
  const rect = section.getBoundingClientRect()
  const viewportH = window.innerHeight
  // Progress: 0 when section top hits viewport bottom → 1 when section bottom hits viewport top
  const progress = 1 - (rect.bottom / (viewportH + rect.height))
  const clampedProgress = Math.max(0, Math.min(1, progress))
  video.currentTime = clampedProgress * video.duration
}
```

**Files:** `LogoVideoSection.tsx` — owns the video ref, IntersectionObserver, and scroll handler.

### 9. 3D Molar Tooth (Three.js / React Three Fiber)

**Asset:** `DentalContent/3D models/molar_tooth.glb` — **binary glTF (GLB)**, standard for web + Three.js; sourced from **Sketchfab** (should load via `useGLTF` / `GLTFLoader` like any compliant export). Copy to `public/models/molar_tooth.glb` at build/setup. **Licensing:** confirm the Sketchfab model's license (often **CC** or editor-only); add **required attribution** (creator name + Sketchfab link) in the footer or adjacent to `#tooth-3d` if terms require it.

**Placement:** Dedicated section **`#tooth-3d`** on the page flow **after `#services` and before `#team`** (visual break between "what we offer" and "who we are"). **Does not add an 8th nav label by default** — deep link only via `#tooth-3d` unless you later add e.g. "Technology" to the nav.

**Stack:** `three`, `@react-three/fiber`, `@react-three/drei` (`useGLTF`, `Environment` or minimal lights). Wrap canvas in `next/dynamic` with **`ssr: false`** to avoid hydration / WebGL issues on static export.

**Core interaction (recommended baseline):**

- **Idle:** Slow continuous **Y-axis rotation** (`useFrame`: `mesh.rotation.y += delta * k` with small `k`).
- **Pointer parallax:** While the cursor is over the canvas (or a padded hit region), map pointer **normalized device coordinates** (−1…1) to small **Euler tilts** on X/Y (e.g. ±0.12–0.2 rad), **opposite** to cursor approach so the tooth subtly "leans away" from the pointer. **Lerp** back to idle rotation when the pointer leaves.
- **Reduce motion:** Respect `prefers-reduced-motion: reduce` — disable parallax and slow or stop spin.

**Alternative layouts (pick one in implementation or A/B in content):**

- **Split + carousel:** Tooth on one side; **text or service highlights** on the other with a **dot carousel** (same inspiration as LAVA About band 2) — copy advances, tooth keeps spinning.
- **Scroll-modulated spin:** Slightly increase rotation speed or twist amount based on **section scroll progress** (optional; keep subtle to avoid nausea).

**Performance & quality:**

- **Mount lazily** when `#tooth-3d` intersects the viewport (`IntersectionObserver` → render canvas).
- Cap **`dpr`** (e.g. `Math.min(devicePixelRatio, 2)`), optional **lower shadow quality** on mobile.
- Materials: if GLB is untextured, use **drei** `MeshStandardMaterial` + studio `Environment` or neutral lights matching **lime + gray** brand.

**Files:** `Tooth3DSection.tsx` + `Tooth3DSection.module.css` + `ToothCanvas.tsx` (R3F scene) — keep GLB path in one constant.

## Design Tokens (variables.css)

```css
:root {
  /* Colors */
  --color-accent: #B0D64E;
  --color-accent-dark: #8fb335;
  --color-bg: #FFFFFF;
  --color-bg-alt: #F4F4F4;
  --color-bg-dark: #1a1a1a;
  --color-text: #333333;
  --color-text-light: #666666;
  --color-text-inverse: #FFFFFF;

  /* Nav chrome (tune in QA) */
  --nav-gradient-top-alpha: 0.92;
  --nav-gradient-bottom-alpha: 0.35;
  --nav-solid-alpha: 0.96; /* scrolled / flat state */

  /* Spacing scale */
  --space-size-xs: 0.5rem;
  --space-size-s: 0.75rem;
  --space-size-m: 1rem;
  --space-size-l: 1.5rem;
  --space-size-xl: 2rem;
  --space-size-2xl: 3rem;
  --space-size-3xl: 4rem;
  --space-size-4xl: 6rem;
  --space-size-5xl: 8rem;

  /* Border radius */
  --radius-s: 8px;
  --radius-m: 12px;
  --radius-l: 16px;
  --radius-pill: 9999px;

  /* Transitions */
  --transition-timing: cubic-bezier(0.16, 1, 0.3, 1);
  --transition-duration: 0.5s;
  --transition-fast: 0.2s;

  /* Animation */
  --start-transform: translateY(20vmin);
  --end-transform: translateY(-20vmin);

  /* Typography */
  --font-heading: 'Syne', sans-serif;
  --font-nav: 'Josefin Sans', sans-serif;
  --font-body: 'DM Sans', sans-serif;
  --font-mono: 'Syne Mono', monospace;
}
```

## Structure

```
src/
├── app/
│   ├── layout.tsx              # Root layout, Google Fonts, metadata, favicon
│   └── page.tsx                # Single page — all sections composed here
├── components/
│   ├── Nav.tsx / Nav.module.css
│   │   - Sticky, backdrop-blur
│   │   - Background: vertical gradient (more solid top → more transparent bottom of bar) + scroll-linked increase in overall opacity / flatten gradient for readability over light sections (see Animation §1)
│   │   - Left: clinic logo (clinic-logo-primary.png) + clinic name wordmark
│   │   - Links: Home, About, Services, Gallery, First Visit, Appointment, Contact
│   │   - Mobile: hamburger → full-screen overlay
│   │   - FR/EN pill toggle in nav — fr-CA default, persisted in localStorage
│   │   - Scroll progress bar (2px lime green, grows left-to-right)
│   │
│   ├── Hero.tsx / Hero.module.css
│   │   - Full viewport height (100svh)
│   │   - Dark background (#1a1a1a)
│   │   - Clinic logo centered (clinic-logo-primary.png, large)
│   │   - Clinic name (Syne 700, large) + tagline (Josefin Sans caps)
│   │   - Phone (click-to-call tel: link)
│   │   - Lime green pill CTA button ("Request Appointment")
│   │   - Clinic exterior image near top (object-fit: contain, no crop)
│   │   - Word-by-word staggered text reveal on scroll
│   │
│   ├── LogoVideoSection.tsx / LogoVideoSection.module.css
│   │   - Positioned immediately after Hero, before About
│   │   - Full-width video player (no controls, muted, loop)
│   │   - Video source: `DentalContent/Video/Dentist Teeth Video centre dentaire vaillancourt st-onge logo (1).mp4`
│   │   - Scroll-scrubbed: scroll down → video plays forward; scroll up → video rewinds
│   │   - Implemented via: IntersectionObserver tracks how much of the section is visible,
│   │     scroll event maps viewport position to `video.currentTime`
│   │   - Video fills container responsively (object-fit: cover or contained)
│   │   - Dark overlay on video for text legibility if overlaid text is added
│   │
│   ├── AboutSection.tsx / AboutSection.module.css
│   │   - Single `#about` anchor with **stacked bands** inspired by LAVA reference screenshots:
│   │     1) Mint/sage band — large Syne headline, 2-col (portrait image | text + vertical rule), bold lead + body
│   │     2) Textured light-gray band — square feature image or small carousel (pause + dots), mission copy + vertical rule
│   │     3) Dark "experience" band — optional curtain texture left, centered white headline, 3-photo editorial collage
│   │   - Scroll-reveal / clip-path on each band (CSS view-timeline)
│   │
│   ├── ServicesSection.tsx / ServicesSection.module.css
│   │   - Dark background (per approved direction)
│   │   - Section title: "Our Services" / "Nos services"
│   │   - Sticky horizontal scroll: 8 cards scroll left as user scrolls down
│   │   - Clip-path reveal on section enter
│   │
│   ├── Tooth3DSection.tsx / Tooth3DSection.module.css
│   │   - Anchor id: `#tooth-3d` (after Services, before Team)
│   │   - Client-only `<Canvas>` (dynamic import, ssr: false) loading `public/models/molar_tooth.glb`
│   │   - Idle Y rotation + inverse cursor parallax tilt; respects `prefers-reduced-motion`
│   │   - Optional: split layout with text/service carousel beside the model
│   │   - Lazy mount when section enters viewport
│   │
│   ├── ToothCanvas.tsx                   # R3F scene: lights, useGLTF, useFrame, pointer → tilt
│   │
│   ├── ServiceCard.tsx / ServiceCard.module.css
│   │   - White card, border-radius: 16px
│   │   - Icon (inline SVG lime dot — not emoji)
│   │   - Name (Syne, bold) + description (DM Sans)
│   │   - Pretext: `layout()` used to compute text height, all 8 cards set to equal tallest height
│   │   - Hover: scale(1.02) + shadow lift
│   │
│   ├── TeamSection.tsx / TeamSection.module.css
│   │   - Dark background (per approved direction)
│   │   - Section title: "Meet the Dentists" / "Rencontrez les dentistes"
│   │   - 2 main dentist cards: large photo, name, credentials, bio
│   │   - Dark premium card style: charcoal gradient, lime-accent border, lime-tinted names
│   │   - 4 staff photo cards below: photo + name only
│   │   - Scroll-reveal entrance per card (translateY + fade)
│   │
│   ├── GallerySection.tsx / GallerySection.module.css
│   │   - Light gray background (#F4F4F4)
│   │   - Section title: "Our Clinic"
│   │   - Grid: exterior + interior practice photos; optional small "results" row from `Teeth before after/` with disclaimer if not clinic-specific
│   │   - Scroll-reveal entrance per photo
│   │
│   ├── HoursSection.tsx / HoursSection.module.css
│   │   - White background
│   │   - Section title: "Clinic Hours"
│   │   - Clean table: Mon-Sat + Sunday (closed)
│   │   - Hours in Syne Mono for alignment
│   │   - Simple fade-in on scroll
│   │
│   ├── FirstVisitSection.tsx / FirstVisitSection.module.css
│   │   - Light gray background (#F4F4F4)
│   │   - Section title: "Your First Visit"
│   │   - Split layout: left = intro text + PDF download CTA; right = 6-step procedure list
│   │   - Pretext: `layout()` used to align step heights for visual balance
│   │   - Cancellation policy note (alert box)
│   │   - "Make an appointment" CTA at bottom
│   │
│   ├── AppointmentForm.tsx / AppointmentForm.module.css
│   │   - White background
│   │   - Section title: "Request an Appointment"
│   │   - Fields: Full name, Email, Phone, Preferred date, Reason (textarea)
│   │   - Lime green pill submit button
│   │   - Submit → `mailto:` action (static site, no backend)
│   │   - Inline validation styling (red border on error, green on valid)
│   │
│   ├── ContactSection.tsx / ContactSection.module.css
│   │   - Dark background (#1a1a1a)
│   │   - Lime green accent divider line
│   │   - Address, email (mailto:), phone (tel:), map placeholder div
│   │   - Fade-in on scroll
│   │
│   ├── Footer.tsx / Footer.module.css
│   │   - Dark background (#1a1a1a)
│   │   - Logo, nav links (same 7 anchors), hours summary
│   │   - Copyright with dynamic `new Date().getFullYear()`
│   │   - "Designed and powered by Calytek" link
│   │
│   └── Button.tsx / Button.module.css
│       - Variants: primary (lime green fill), secondary (outlined), ghost (text only)
│       - Pill-shaped (border-radius: 9999px)
│       - Hover: scale(1.02); Active: scale(0.98)
│       - Transition: 0.3s cubic-bezier(0.16, 1, 0.3, 1)

├── utils/
│   └── pretext.ts                  # Wrapper around @chenglou/pretext
│       - `measureHeight(text, font, width, lineHeight): number`
│       - `measureLineCount(text, font, width, lineHeight): number`
│       - `prepareText(text, font): PreparedText` (cached handle)

├── styles/
│   ├── globals.css              # CSS reset, base typography, scroll-behavior: smooth
│   └── variables.css            # All design tokens

└── content/
    ├── i18n/
    │   ├── fr-CA.ts             # All French (Quebec) strings — default locale
    │   └── en-CA.ts             # All Canadian English strings — full parity
    └── clinic.ts                # Static content (hours, addresses, service list)
```

## Content Sources


| Content                      | Source                                                                                                                   |
| ---------------------------- | ------------------------------------------------------------------------------------------------------------------------ |
| Clinic story / values        | `www.dentistelachenaie.com_en_index.html.2026-03-28...md` (scraped home page)                                            |
| Service names + descriptions | Same scraped home page (8 services with icons)                                                                           |
| Team bios                    | Same scraped home page + `Scrape/www_dentistelachenaie_com.html`                                                         |
| Staff photos                 | `DentalContent/Images/Team/Team/` (staff-*.jpg)                                                                          |
| Dentist photos               | `DentalContent/Images/Team/Dentists/` (dentist-dr-*.jpg)                                                                |
| Clinic interior photos       | `DentalContent/Images/Inside of the practice/` (clinic-*.jpg)                                                            |
| Clinic exterior photo        | `DentalContent/Images/Outside of the building/clinic-exterior-front-signage-01.jpg`                                      |
| Clinic logo                  | `DentalContent/Images/Logo/clinic-logo-primary.png` — Nav, Hero, Footer                                                 |
| Clinic video                 | `DentalContent/Video/Dentist Teeth Video centre dentaire vaillancourt st-onge logo (1).mp4`                               |
| 3D molar (GLB)               | `DentalContent/3D models/molar_tooth.glb` (Sketchfab) → `public/models/molar_tooth.glb`; verify license + attribution    |
| Hours                        | Scraped home page footer (Mon-Fri + Sat hours)                                                                           |
| Address / contact            | Scraped home page footer                                                                                                 |
| First visit steps            | `Scrape/www_dentistelachenaie_com.html` (first-visit form page)                                                          |

## Media inventory & fit (client + stock)

All images have been renamed to descriptive kebab-case. Source root: `DentalContent/Images/`. Logo is horizontal PNG: tooth-and-stem motif + "CENTRE DENTAIRE / VAILLANCOURT / ST-ONGE" — use in Nav, Hero, Footer, favicon.

| Asset (renamed) | Role on site | Fit |
| --- | --- | --- |
| `Logo/clinic-logo-primary.png` | Nav, Hero, Footer, OG image base | **Primary brand** — correct for all chrome |
| `Outside of the building/clinic-exterior-front-signage-01.jpg` | Hero image, Gallery, Contact | **Strong** — real clinic exterior; signage shows **450-582-2219** and "Vaillancourt et Assoc." — align copy with hours/phone |
| `Inside of the practice/clinic-reception-01.jpg` | Gallery, About bands | Valid JPEG confirmed |
| `Inside of the practice/clinic-waiting-room-01.jpg` | Gallery, About, hero alternate | Valid JPEG |
| `Inside of the practice/clinic-waiting-room-02.jpg` | Gallery | — |
| `Inside of the practice/clinic-waiting-room-03.jpg` | Gallery | — |
| `Inside of the practice/clinic-treatment-room-01.jpg` | Gallery, About collage | Valid JPEG |
| `Inside of the practice/clinic-sterilization-room-01.jpg` | Gallery, About collage | Valid JPEG |
| `Team/Dentists/dentist-dr-nathalie-vaillancourt.jpg` | Team lead card | **Strong** — professional headshot, gray backdrop, smile |
| `Team/Dentists/dentist-dr-marie-christine-st-onge.jpg` | Team lead card | **Strong** — white backdrop; works with circular or rounded crop |
| `Team/Dr. Marie-Christine St-Onge's Team/team-dr-st-onge-group-photo.jpg` | Team group hero or wide card | **Strong** — full team, black wardrobe reads "clinical premium" |
| `Team/Team/staff-audrey-roy.jpg` | Staff grid | — |
| `Team/Team/staff-elizabeth-ciricillo.jpg` | Staff grid | — |
| `Team/Team/staff-virginie-curadeau.jpg` | Staff grid | — |
| `Team/Team/staff-yamina-bounessis.jpg` | Staff grid | — |
| `Teeth before after/teeth-whitening-enlighten-before-after-01.jpg` | Optional Results strip | Treat as generic marketing; add disclaimer if used |
| `Teeth before after/teeth-whitening-enlighten-before-after-02.jpg` | Optional Results strip | — |
| `Teeth before after/teeth-whitening-philips-zoom-before-after-01.jpg` | Optional Results strip | — |
| `Smiling Patient/smiling-patient-*.jpg` | Deduplicated stock, secondary | Confirm license before commercial use |
| `Smiling People/smiling-people-*.jpg` | Deduplicated stock, secondary | Confirm license before commercial use |
| `Elements I want to recreate/lava-reference-*.png` | Design reference only | Do not ship to `public/` |

**Summary:** Lead with **logo + dentists + staff + exterior + interiors**. Use **stock / before-after** sparingly with **licensing and disclosure** clarity. Interior JPEGs confirmed valid; re-export any that fail to decode in a browser during implementation.

## Not in Scope

- Backend/database (static site only)
- Actual appointment booking system (form emails clinic via `mailto:`)
- Additional locales beyond `fr-CA` and `en-CA` (only these two in scope)
- Payment/insurance features
- Video editing/production (using the .mp4 as provided)
- Staff full bios (photos + names only for support staff)
- Third-party **JS motion libraries** (GSAP, Framer Motion, etc.) — keep motion **CSS scroll-driven**; **allowed:** scroll-scrubbed video + R3F `useFrame` / pointer logic for the 3D tooth only
- Full dental CAD / procedural animation inside the GLB beyond spin + tilt unless scope expands

## Estimated Files

~32-38 files (adds R3F tooth + nav gradient tuning). Single developer: ~4-5 days.

## Todo List

- Initialize Next.js project with TypeScript
- Set up Google Fonts (Syne, Josefin Sans, DM Sans, Syne Mono)
- Set up design tokens in variables.css
- Set up globals.css (reset, base typography, scroll-behavior: smooth)
- Set up i18n dictionaries for `fr-CA` (default) and `en-CA` (full parity strings)
- Build Nav component (sticky, backdrop-blur, **gradient + scroll-solidity**, progress bar, 7 anchors, FR/EN toggle, mobile hamburger)
- Build Button component (primary, secondary, ghost variants)
- Build Hero section (dark bg, logo, text reveal, CTA)
- Build LogoVideoSection component (scroll-scrubbed .mp4: scroll down plays, scroll up rewinds)
- Build About section (multi-band layout per LAVA reference screenshots: mint 2-col, textured + feature image/carousel, dark experience collage)
- Verify interior JPEGs load in browser; re-export any broken files; dedupe `Smiling People` vs `Smiling Patient` when copying to `public/`
- Build ServiceCard component
- Build Services section (sticky horizontal scroll + clip-path reveal)
- Add `three`, `@react-three/fiber`, `@react-three/drei`; copy `molar_tooth.glb` to `public/models/`; add Sketchfab/creator **attribution** if license requires
- Build Tooth3DSection + ToothCanvas (lazy R3F: idle spin, inverse cursor tilt, reduced-motion)
- Build Team section (2 dentist cards + 4 staff photo cards, scroll-reveal, dark premium card style)
- Build Gallery section (clinic photo grid, scroll-reveal per photo)
- Build Hours section (table layout, Syne Mono)
- Build First Visit section (split layout, PDF download, procedure steps)
- Build Appointment form (validation, mailto submit)
- Build Contact section (dark strip, lime accents, map placeholder)
- Build Footer component
- Build `src/utils/pretext.ts` helper (`measureHeight` wrapper around `@chenglou/pretext`)
- Apply Pretext to Services cards (equal-height layout), First Visit procedure steps (line-count-aware alignment)
- Copy client images, video, and 3D asset to public/ (clinic-logo-primary.png → ideally convert to .svg, dentist photos, staff photos, clinic photos, clinic .mp4 video, **models/molar_tooth.glb**)
- Compose all sections in page.tsx
- Add responsive styles (mobile-first breakpoints)
- Add scroll-driven animations (CSS view-timeline + @keyframes)
- Add favicon (from client logo) and meta tags (SEO, Open Graph)
- Run Quebec French copy review pass + English parity QA

## Implementation Prompt

```
Build the Centre Dentaire Vaillancourt St-Onge single-page bilingual (fr-CA default, en-CA) dental clinic website.

Stack: Next.js 14 App Router, TypeScript, CSS Modules + CSS custom properties, static export.
Animations: Pure CSS scroll-driven (animation-timeline: scroll(), view-timeline). No JS motion libs.
3D: @react-three/fiber + @react-three/drei (ssr: false), lazy mount via IntersectionObserver.
Text measurement: @chenglou/pretext for equal-height service cards and step alignment.

DESIGN TOKENS (variables.css):
--color-accent: #B0D64E; --color-accent-dark: #8fb335; --color-bg: #FFFFFF;
--color-bg-alt: #F4F4F4; --color-bg-dark: #1a1a1a; --color-text: #333333;
--color-text-light: #666666; --color-text-inverse: #FFFFFF;
Fonts: Syne (headings), Josefin Sans (nav/labels), DM Sans (body), Syne Mono (numbers).
Type scale uses clamp() for fluid sizing.

I18N: fr-CA is default. All user-visible strings (nav, headings, CTAs, form labels, validation, aria-labels, alt text, metadata) must exist in both fr-CA and en-CA with full parity. Language toggle in nav persists to localStorage. Page lang attribute updates dynamically.

PAGE SECTIONS (top → bottom):
1. Sticky Nav — frosted glass gradient (solid top → transparent bottom), scroll progress bar, 7 anchor links, FR/EN pill toggle (fr-CA default), clinic logo + wordmark left, mobile hamburger → full-screen overlay.
2. #hero — 100svh, dark bg (#1a1a1a), large centered logo, Syne headline, Josefin Sans tagline, phone tel: link, lime pill "Request Appointment" CTA, clinic exterior image near top (object-fit: contain, no crop).
3. #logo-video — Full-width scroll-scrubbed .mp4 (scroll down → plays, scroll up → rewinds), muted, playsinline, IntersectionObserver + scroll listener.
4. #about — Stacked bands: mint/sage 2-col band, textured gray band with carousel, dark experience band with 3-photo collage.
5. #services — Dark section. Sticky horizontal scroll: 8 service cards scroll left as user scrolls down. Lime dot icon (inline SVG, not emoji) per card. Pretext equal-height.
6. #tooth-3d — Three.js molar GLB. Idle Y rotation + inverse cursor parallax tilt. Respect prefers-reduced-motion. Lazy mount.
7. #team — Dark section. 2 dentist cards with dark premium style (charcoal gradient, lime border, lime-tinted names). 4 staff photo cards. Scroll-reveal entrance.
8. #gallery — Light gray (#F4F4F4). Clinic photo grid. Scroll-reveal per photo.
9. #hours — White. Mon-Sat table in Syne Mono.
10. #first-visit — Light gray. Split: intro + PDF CTA left, 6-step procedure list right. Pretext step alignment.
11. #appointment — White. Form: name, email, phone, preferred date, reason textarea. mailto: submit, inline validation.
12. #contact — Dark (#1a1a1a). Lime accent divider. Address, email, phone, map placeholder.
13. #footer — Dark, logo, nav links, hours summary, dynamic copyright, Calytek credit.

KEY DESIGN DECISIONS (approved, do not change):
- Nav gradient: transparent top fading to lime (#B0D64E at ~56% opacity bottom)
- Meet the Dentists: dark premium cards (charcoal #1f1f1f→#2a2a2a gradient, rgba(176,214,78,.42) border, lime-tinted names)
- Bottom CTA: dark card with "Need an appointment this week?" / "Besoin d'un rendez-vous cette semaine?"
- Both hero CTAs: "Request Appointment" + phone number
- Clinic exterior image in hero near top (object-fit: contain)
- Light/dark alternation across sections for visual rhythm

IMAGES (renamed, source: DentalContent/Images/):
Logo: Logo/clinic-logo-primary.png
Exterior: Outside of the building/clinic-exterior-front-signage-01.jpg
Interior: Inside of the practice/clinic-reception-01.jpg, clinic-waiting-room-01.jpg, clinic-waiting-room-02.jpg, clinic-waiting-room-03.jpg, clinic-treatment-room-01.jpg, clinic-sterilization-room-01.jpg
Dentists: Team/Dentists/dentist-dr-nathalie-vaillancourt.jpg, dentist-dr-marie-christine-st-onge.jpg
Team group: Team/Dr. Marie-Christine St-Onge's Team/team-dr-st-onge-group-photo.jpg
Staff: Team/Team/staff-audrey-roy.jpg, staff-elizabeth-ciricillo.jpg, staff-virginie-curadeau.jpg, staff-yamina-bounessis.jpg
3D: DentalContent/3D models/molar_tooth.glb → public/models/molar_tooth.glb
Video: DentalContent/Video/Dentist Teeth Video centre dentaire vaillancourt st-onge logo (1).mp4

ANIMATIONS (CSS only unless noted):
- Nav: gradient + backdrop-blur + scroll-solidity via animation-timeline: scroll()
- 2px lime progress bar: @keyframes with animation-timeline: scroll()
- Hero text: word-by-word fade-in, animation-timeline: view()
- Services: sticky horizontal scroll via vertical scroll progress
- Sections: clip-path polygon reveals, animation-timeline: view()
- Cards: scale(1.02) hover, cubic-bezier(0.16,1,0.3,1) transitions
- Logo video: vanilla JS IntersectionObserver + scroll (exception to CSS-only rule)
- 3D tooth: R3F useFrame + pointer handlers (exception to CSS-only rule)

Build everything. Compose in app/page.tsx. Add mobile breakpoints. Run Quebec French copy review + English parity QA before launch.
```

