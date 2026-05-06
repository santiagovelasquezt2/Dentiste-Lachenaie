# PROJECT HANDOFF PROMPT

You are building a dental clinic website for Centre Dentaire Vaillancourt St-Onge in Lachenaie/Terrebonne, Quebec.

## YOUR SOURCE OF TRUTH
Read this design specification first and follow it exactly — everything below this section is the plan.

## VISUAL REFERENCE (live HTML mockups)
These are approved visual mockups generated during a design-shotgun session. Open each HTML file in a browser to see the actual layout, spacing, colors, and typography. Read the CSS in those files alongside this spec.

Primary approved direction (R1, final):
~/.gstack/projects/DentalSite-v2/designs/homepage-directions-20260401/variant-R1.html

All variants for reference (A/B/C + remix R1):
~/.gstack/projects/DentalSite-v2/designs/homepage-directions-20260401/design-board.html

## WHAT WAS DECIDED DURING DESIGN (context for ambiguity)
The spec is complete, but here is what shaped it — a new AI should know this to avoid re-litigating settled decisions:

1. Three initial variants (A/B/C) were generated and reviewed. A was strong on structure, B on warmth and bottom CTA, C on editorial typography.
2. The final direction (R1) is a deliberate blend: A's clinic name treatment, B's bottom CTA block, C's nav typography style.
3. The nav bar uses a gradient from nearly opaque at the top fading into lime green at the bottom (not a flat color). Iterated — earlier versions were too transparent.
4. The Meet the Dentists section went through two iterations: light premium cards first, then dark premium (charcoal gradient, lime border, lime-tinted names) after the light version felt too generic.
5. The hero uses the clinic exterior photo near the top of the page immediately — a deliberate choice to build trust before the user scrolls. The image uses object-fit: contain (not cover/crop) because the original is a wide horizontal photo.
6. The clinic logo appears in the nav bar to the left of the clinic name wordmark.
7. Both CTAs in the hero are kept: "Request Appointment" (primary lime pill) and the phone number as a secondary action.
8. Services section uses dark background (not light gray) per approved direction.
9. All images on disk were renamed from generic French filenames to descriptive kebab-case names. The plan reflects the renamed paths — use those paths exactly.
10. Language: fr-CA is the default locale. en-CA is the toggle. Quebec French phrasing (not France French). All UI strings must exist in both with full parity.
11. The horizontal-scroll storytelling section (clinic interior photos as the user scrolls) is a required feature — explicitly requested and locked during design review.
12. The 3D molar tooth section uses Three.js with idle spin + inverse cursor parallax. No extra JS animation libraries.

## CONTENT SOURCE FILES (real clinic content)
All real content lives under:
/Users/santiagovelasquez/Desktop/SWE/Personal/DentalSite-v2/

Key subfolders:
- DentalContent/Images/ — all photos (renamed per plan media inventory)
- DentalContent/Video/ — the scroll-scrubbed .mp4 hero video
- DentalContent/3D models/molar_tooth.glb — the Three.js asset (copy to public/models/)
- DentalContent/WebINFO/Branding of the website of my client/Colors/ — brand color palette XML

## WHAT TO DO
1. Read this spec in full
2. Open variant-R1.html in a browser and take a screenshot to see the approved visual direction
3. Initialize the Next.js 14 project with TypeScript
4. Implement every section, component, animation, i18n dictionary, and asset as specified
5. Copy assets to public/ using the renamed paths from the plan
6. Run a Quebec French copy review and English parity QA pass before declaring done

Do not simplify, skip, or reinterpret the design. If something in the spec is ambiguous, look at the HTML mockups to resolve it.

---

# DENTAL SITE V2 — DESIGN SPECIFICATION

---
name: DentalSite-v2 Plan
overview: Single-page dental clinic website inspired by lavadental.lv — light adaptation with lime green branding, geometric typography, and CSS scroll-driven animations throughout.
todos: []
isProject: false
---

## Context

A dental clinic in Lachenaie/Terrebonne, Quebec (established 2000) needs a modern single-page website. The existing scraped content from their live site (`dentistelachenaie.com`) provides the source material. Two dentists: Dr Nathalie Vaillancourt and Dr Marie-Christine St-Onge. Services include orthodontics, prevention, pediatric care, restorations, implants, emergency, surgery, and cosmetic dentistry.

**Reference site:** lavadental.lv — a premium dental studio with sophisticated scroll-driven animations and distinctive typography. This plan adapts that site's design language (notably its animation style and typographic approach) to this client's lime-green brand on a light background.

**Core direction:** Light/white adaptation of lavadental.lv's aesthetic. Keep the geometric typography feel, the scroll-driven animation style, and the premium card-based layouts — but swap dark green backgrounds for white/light gray, and use lime green `#B0D64E` as the primary accent instead of mint.

**Language direction:** Fully bilingual (**Quebec French + English**), with **French (Quebec)** as the default on first load. All sections, form labels, validation messages, microcopy, metadata, and accessibility strings must exist in both languages with parity.

## Brand Colors (from client branding)

**Primary brand lime:** `#B0D64E` — canonical token `--color-brand-lime` in `src/styles/variables.css` (Tailwind: `bg-brand-lime`, `text-brand-lime`, `border-brand-lime`, …). Use for bold lime surfaces and high-energy brand accents; the softer `--color-accent` mint is for large quiet fills.

| Token                  | Hex       | Use                                                     |
| ---------------------- | --------- | ------------------------------------------------------- |
| `--color-brand-lime`   | `#B0D64E` | Vibrant lime — primary brand green, full-bleed sections, map accents |
| `--color-accent`       | `#D1E8D1` | Softer mint — UI fills, subtle highlights               |
| `--color-accent-dark`  | `#B8D1B8` | Darker mint — hover on mint surfaces                    |
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
- **3D**: **Three.js** via `@react-three/fiber` + `@react-three/drei` (GLTF/GLB). Client-only dynamic import (`ssr: false`) for the tooth showcase.
- **Text measurement**: `@chenglou/pretext` — Canvas-based glyph measurement for zero-DOM-read layout
- **Deployment**: Static export

## Localization & Copy Requirements

- Primary audience is **Quebec French** speakers; use `fr-CA` vocabulary and phrasing, not France-only idioms.
- Every user-visible string must have `fr-CA` and `en-CA` entries: nav, headings, body copy, CTA text, form labels/placeholders, validation errors, aria-labels, alt text, metadata.
- Default render is French (`fr-CA`), with an explicit EN toggle.
- Keep semantic parity across locales (same meaning and section hierarchy), while allowing natural phrasing.
- Add a content QA pass: native-level Quebec French review before launch.

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

Source folder: `DentalContent/Images/Elements I want to recreate/`

| Reference file | What it shows | How we mirror it (client brand) |
| --- | --- | --- |
| `lava-reference-header-nav.png` | Full-width dark bar: geometric mark left, **centered** text nav, thin **horizontal rule**, **EN** + chevron right | **Nav.tsx**: logo + wordmark left; **centered anchor row** + **1px hairline**; clear FR/EN pill switcher; FR is default. **Gradient bar**: solid top → transparent bottom (not flat). Lime accent for active/hover (`#B0D64E`). |
| `lava-reference-about-band-1.png` | **Pale mint/sage** full-bleed; **large left headline**; tall **portrait image** left, **right column** copy with **vertical rule**; bold lead + body | **AboutSection** first band: `#E8EDE3` background; Syne headline + DM Sans body; `border-left` in accent or dark gray |
| `lava-reference-about-band-2.png` | **Light gray textured** band; **square image** left with **carousel** UI (pause + dots); **mission copy** right with **vertical rule** | **AboutSection** second band: CSS noise/texture on `#F4F4F4`; static hero image + optional manual carousel |
| `lava-reference-about-band-3.png` | **Dark olive-gray** full-width; **centered white headline**; **three photos** in **asymmetric collage** | **AboutSection** third band: `--color-bg-dark` background; editorial 3-photo grid with scroll-driven fade/slide |

**Implementation notes:** Recreating LAVA's **exact** carousel and collage timing is optional; priority is **layout, hierarchy, texture, and scroll feel** on **client colors**. Reference PNGs are **design targets**, not assets to ship in `public/`.

## Page Sections (top to bottom)

```
[Sticky Nav]  ← fixed top, scroll progress bar, 7 section anchors
     │
     ├── #hero         — Full-height hero, clinic name, tagline, phone + CTA
     ├── #logo-video   — Scroll-scrubbed hero video (teeth animation + magic wand)
     ├── #about        — Clinic story + values (2-column layout)
     ├── #services     — 8 service cards (horizontal scroll within sticky container)
     ├── #tooth-3d     — Three.js molar GLB: idle spin + cursor parallax tilt
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

**Exceptions:** (1) **Scroll-scrubbed video** in `#logo-video` — vanilla JS `currentTime` mapping. (2) **3D tooth** — `useFrame` / pointer handlers in R3F. Pretext is measurement-only, not animation.

### 1. Sticky Header + Scroll Progress Bar + Gradient Chrome

- Nav is `position: fixed`, **`backdrop-filter: blur()`** (with transparent fallback)
- **Gradient bar:** `linear-gradient(to bottom, rgba(255,255,255, 0.92) 0%, rgba(176,214,78, 0.35) 100%)` — solid top → transparent lime bottom
- **Scroll-linked solidity:** as user scrolls, interpolate toward flatter/opaquer bar via `animation-timeline: scroll(root)` or `data-scrolled` toggle
- 2px lime green progress bar at nav bottom grows left-to-right (CSS `@keyframes` with `animation-timeline: scroll()`)
- Active section link highlighted via IntersectionObserver

### 2. Hero Text Reveal

- Heading text uses staggered word-by-word opacity fade-in on load
- `animation-timeline: view()` — words appear as hero scrolls into view

### 3. Services: Horizontal Scroll via Vertical Scroll

- Sticky container: services cards translate horizontally as user scrolls vertically
- Cards scale from 0.9 → 1.0 as they enter visible area

### 4. Section Clip-Path Reveals

- Sections use `clip-path: polygon()` animating from collapsed to full size on scroll
- Applied to: about, services, team, gallery sections

### 5. Team / Gallery: Scroll-Reveal Entrance

- `--start-transform: translateY(20vmin)` → `--end-transform: translateY(-20vmin)`
- Cards fade + slide as section scrolls into view
- `animation-timeline: view()` with `animation-range`

### 6. Card Hover Animations

- Cards: `scale(1.02)` on hover; `cubic-bezier(0.16, 1, 0.3, 1)` transition
- Buttons: `scale(1.02)` hover, `scale(0.98)` active

### 7. Pretext Text Measurement (@chenglou/pretext)

`npm install @chenglou/pretext`

Three uses: (A) Services equal-height cards, (B) First Visit step alignment, (C) optional Team bio expand/collapse.

```ts
import { prepare, layout } from '@chenglou/pretext'
const prepared = prepare(bioText, '16px Syne')
const { height, lineCount } = layout(prepared, cardWidth, 24)
```

### 8. Logo Video: Scroll-Scrubbed Playback

- Video paused at `currentTime = 0` on load
- IntersectionObserver starts tracking when section enters viewport
- Scroll progress (0→1) maps to `video.currentTime` (0→duration)
- Scroll down: plays forward. Scroll up: rewinds.
- `muted`, `playsinline`

### 9. 3D Molar Tooth (Three.js / React Three Fiber)

**Asset:** `DentalContent/3D models/molar_tooth.glb` → `public/models/molar_tooth.glb`. Verify Sketchfab license; add attribution if required.

**Stack:** `three`, `@react-three/fiber`, `@react-three/drei` with `ssr: false` via `next/dynamic`.

**Core interaction:**
- Idle Y-axis rotation (`useFrame`: `mesh.rotation.y += delta * k`)
- Inverse cursor parallax tilt (±0.12–0.2 rad Euler, opposite to cursor)
- Lerp back to idle on pointer leave
- Respect `prefers-reduced-motion`
- Lazy mount on `#tooth-3d` viewport intersection
- Cap `dpr` at `Math.min(devicePixelRatio, 2)`

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
  --nav-solid-alpha: 0.96;

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
│   │   - Background: vertical gradient (solid top → transparent bottom) + scroll-linked solidity
│   │   - Left: clinic logo (clinic-logo-primary.png) + clinic name wordmark
│   │   - Links: Home, About, Services, Gallery, First Visit, Appointment, Contact
│   │   - FR/EN pill toggle in nav — fr-CA default, persisted in localStorage
│   │   - Mobile: hamburger → full-screen overlay
│   │   - Scroll progress bar (2px lime green, grows left-to-right)
│   │
│   ├── Hero.tsx / Hero.module.css
│   │   - Full viewport height (100svh)
│   │   - Dark background (#1a1a1a)
│   │   - Large centered logo
│   │   - Clinic name (Syne 700, large) + tagline (Josefin Sans caps)
│   │   - Phone (click-to-call tel: link)
│   │   - Lime green pill CTA ("Request Appointment")
│   │   - Clinic exterior image near top (object-fit: contain, no crop)
│   │   - Word-by-word staggered text reveal on scroll
│   │
│   ├── LogoVideoSection.tsx / LogoVideoSection.module.css
│   │   - Positioned after Hero, before About
│   │   - Full-width video player (no controls, muted, loop)
│   │   - Scroll-scrubbed: scroll down → plays; scroll up → rewinds
│   │   - IntersectionObserver + scroll listener
│   │
│   ├── AboutSection.tsx / AboutSection.module.css
│   │   - Stacked bands per LAVA references:
│   │     1) Mint/sage band — large Syne headline, 2-col (portrait | text + vertical rule)
│   │     2) Textured light-gray band — feature image or carousel + mission copy
│   │     3) Dark "experience" band — 3-photo editorial collage
│   │   - Scroll-reveal / clip-path on each band
│   │
│   ├── ServicesSection.tsx / ServicesSection.module.css
│   │   - Dark background
│   │   - Section title: "Our Services" / "Nos services"
│   │   - Sticky horizontal scroll: 8 cards scroll left as user scrolls down
│   │   - Clip-path reveal on section enter
│   │
│   ├── Tooth3DSection.tsx / Tooth3DSection.module.css
│   │   - Anchor id: `#tooth-3d`
│   │   - Client-only Canvas (dynamic import, ssr: false)
│   │   - Idle Y rotation + inverse cursor parallax tilt
│   │   - Respects prefers-reduced-motion
│   │   - Lazy mount on viewport intersection
│   │
│   ├── ToothCanvas.tsx                   # R3F scene
│   │
│   ├── ServiceCard.tsx / ServiceCard.module.css
│   │   - White card, border-radius: 16px
│   │   - Icon (inline SVG lime dot — not emoji)
│   │   - Name (Syne, bold) + description (DM Sans)
│   │   - Pretext: equal-height layout
│   │   - Hover: scale(1.02) + shadow lift
│   │
│   ├── TeamSection.tsx / TeamSection.module.css
│   │   - Dark background
│   │   - Section title: "Meet the Dentists" / "Rencontrez les dentistes"
│   │   - 2 dentist cards: dark premium style (charcoal #1f1f1f→#2a2a2a gradient, rgba(176,214,78,.42) border, lime-tinted names)
│   │   - 4 staff photo cards below: photo + name only
│   │   - Scroll-reveal entrance per card
│   │
│   ├── GallerySection.tsx / GallerySection.module.css
│   │   - Light gray background (#F4F4F4)
│   │   - Section title: "Our Clinic"
│   │   - Grid: exterior + interior practice photos
│   │   - Scroll-reveal per photo
│   │
│   ├── HoursSection.tsx / HoursSection.module.css
│   │   - White background
│   │   - Section title: "Clinic Hours"
│   │   - Mon-Sat table in Syne Mono
│   │   - Fade-in on scroll
│   │
│   ├── FirstVisitSection.tsx / FirstVisitSection.module.css
│   │   - Light gray background (#F4F4F4)
│   │   - Section title: "Your First Visit"
│   │   - Split: intro + PDF CTA left; 6-step procedure list right
│   │   - Pretext: step height alignment
│   │   - Cancellation policy alert box
│   │   - "Make an appointment" CTA at bottom
│   │
│   ├── AppointmentForm.tsx / AppointmentForm.module.css
│   │   - White background
│   │   - Section title: "Request an Appointment"
│   │   - Fields: Full name, Email, Phone, Preferred date, Reason (textarea)
│   │   - Lime green pill submit button
│   │   - mailto: submit (static site)
│   │   - Inline validation (red border error, green valid)
│   │
│   ├── ContactSection.tsx / ContactSection.module.css
│   │   - Dark background (#1a1a1a)
│   │   - Lime green accent divider line
│   │   - Address, email (mailto:), phone (tel:), map placeholder
│   │   - Fade-in on scroll
│   │
│   ├── Footer.tsx / Footer.module.css
│   │   - Dark background (#1a1a1a)
│   │   - Logo, nav links, hours summary
│   │   - Dynamic copyright `new Date().getFullYear()`
│   │   - "Designed and powered by Calytek" link
│   │
│   └── Button.tsx / Button.module.css
│       - Variants: primary (lime green fill), secondary (outlined), ghost (text)
│       - Pill-shaped (border-radius: 9999px)
│       - Hover: scale(1.02); Active: scale(0.98)
│       - Transition: 0.3s cubic-bezier(0.16, 1, 0.3, 1)

├── utils/
│   └── pretext.ts                  # @chenglou/pretext wrapper
│       - measureHeight(text, font, width, lineHeight)
│       - measureLineCount(text, font, width, lineHeight)
│       - prepareText(text, font)

├── styles/
│   ├── globals.css              # CSS reset, base typography, scroll-behavior: smooth
│   └── variables.css            # All design tokens

└── content/
    ├── i18n/
    │   ├── fr-CA.ts             # French (Quebec) strings — default locale
    │   └── en-CA.ts             # Canadian English strings — full parity
    └── clinic.ts                # Static content (hours, addresses, service list)
```

## Content Sources

| Content                      | Source                                                                                                                   |
| ---------------------------- | ------------------------------------------------------------------------------------------------------------------------ |
| Clinic story / values        | `www_dentistelachenaie_com_en_index.html.2026-03-28...md` (scraped home page)                                    |
| Service names + descriptions | Same scraped home page (8 services)                                                                              |
| Team bios                    | Same scraped home page + `Scrape/www_dentistelachenaie_com.html`                                               |
| Staff photos                 | `DentalContent/Images/Team/Team/staff-*.jpg`                                                                      |
| Dentist photos               | `DentalContent/Images/Team/Dentists/dentist-dr-*.jpg`                                                             |
| Clinic interior photos       | `DentalContent/Images/Inside of the practice/clinic-*.jpg`                                                         |
| Clinic exterior photo        | `DentalContent/Images/Outside of the building/clinic-exterior-front-signage-01.jpg`                             |
| Clinic logo                  | `DentalContent/Images/Logo/clinic-logo-primary.png`                                                               |
| Clinic video                 | `DentalContent/Video/Dentist Teeth Video centre dentaire vaillancourt st-onge logo (1).mp4`                      |
| 3D molar (GLB)               | `DentalContent/3D models/molar_tooth.glb` → `public/models/molar_tooth.glb`; verify license + attribution |
| Hours                        | Scraped home page footer (Mon-Fri + Sat)                                                                         |
| Address / contact            | Scraped home page footer                                                                                             |
| First visit steps            | `Scrape/www_dentistelachenaie_com.html`                                                                          |

## Media inventory & fit (client + stock)

All images renamed to descriptive kebab-case. Source root: `DentalContent/Images/`.

| Asset (renamed) | Role on site | Fit |
| --- | --- | --- |
| `Logo/clinic-logo-primary.png` | Nav, Hero, Footer, OG image | **Primary brand** |
| `Outside of the building/clinic-exterior-front-signage-01.jpg` | Hero, Gallery, Contact | **Strong** — real clinic exterior |
| `Inside of the practice/clinic-reception-01.jpg` | Gallery, About | Valid JPEG |
| `Inside of the practice/clinic-waiting-room-01.jpg` | Gallery, About, hero alt | Valid JPEG |
| `Inside of the practice/clinic-waiting-room-02.jpg` | Gallery | — |
| `Inside of the practice/clinic-waiting-room-03.jpg` | Gallery | — |
| `Inside of the practice/clinic-treatment-room-01.jpg` | Gallery, About collage | Valid JPEG |
| `Inside of the practice/clinic-sterilization-room-01.jpg` | Gallery, About collage | Valid JPEG |
| `Team/Dentists/dentist-dr-nathalie-vaillancourt.jpg` | Team lead card | **Strong** |
| `Team/Dentists/dentist-dr-marie-christine-st-onge.jpg` | Team lead card | **Strong** |
| `Team/Dr. Marie-Christine St-Onge's Team/team-dr-st-onge-group-photo.jpg` | Team group hero | **Strong** |
| `Team/Team/staff-audrey-roy.jpg` | Staff grid | — |
| `Team/Team/staff-elizabeth-ciricillo.jpg` | Staff grid | — |
| `Team/Team/staff-virginie-curadeau.jpg` | Staff grid | — |
| `Team/Team/staff-yamina-bounessis.jpg` | Staff grid | — |
| `Teeth before after/teeth-whitening-*.jpg` | Optional Results strip | Add disclaimer if used |
| `Smiling Patient/smiling-patient-*.jpg` | Stock, secondary | Confirm license |
| `Smiling People/smiling-people-*.jpg` | Stock, secondary | Confirm license |
| `Elements I want to recreate/lava-reference-*.png` | Design reference only | Do not ship to `public/` |

**Summary:** Lead with **logo + dentists + staff + exterior + interiors**. Use stock/before-after sparingly. Interior JPEGs confirmed valid.

## Not in Scope

- Backend/database (static site only)
- Actual appointment booking (form emails via `mailto:`)
- Additional locales beyond `fr-CA` and `en-CA`
- Payment/insurance features
- Video editing (use .mp4 as provided)
- Staff full bios (photos + names only)
- JS motion libs (GSAP, Framer Motion, etc.) — CSS scroll-driven only; exceptions: scroll-scrubbed video + R3F

## Estimated Files

~32-38 files. Single developer: ~4-5 days.

## Todo List

- Initialize Next.js project with TypeScript
- Set up Google Fonts (Syne, Josefin Sans, DM Sans, Syne Mono)
- Set up design tokens in variables.css
- Set up globals.css (reset, base typography, scroll-behavior: smooth)
- Set up i18n dictionaries for `fr-CA` (default) and `en-CA` (full parity strings)
- Build Nav component (sticky, backdrop-blur, gradient + scroll-solidity, progress bar, 7 anchors, FR/EN toggle, mobile hamburger)
- Build Button component (primary, secondary, ghost variants)
- Build Hero section (dark bg, logo, text reveal, both CTAs, exterior image)
- Build LogoVideoSection component (scroll-scrubbed .mp4)
- Build About section (3 stacked bands per LAVA references)
- Verify interior JPEGs load in browser; re-export any broken files
- Build ServiceCard component (inline SVG lime dot icon)
- Build Services section (sticky horizontal scroll + clip-path reveal, dark bg)
- Add Three.js + R3F; copy molar_tooth.glb to public/models/
- Build Tooth3DSection + ToothCanvas (lazy R3F, idle spin, inverse cursor tilt, reduced-motion)
- Build Team section (dark bg, dark premium dentist cards, 4 staff cards, scroll-reveal)
- Build Gallery section (light gray, clinic photo grid, scroll-reveal)
- Build Hours section (white, table in Syne Mono)
- Build First Visit section (light gray, split layout, Pretext step alignment)
- Build Appointment form (white, mailto submit, inline validation)
- Build Contact section (dark, lime accents, map placeholder)
- Build Footer component
- Build `src/utils/pretext.ts` helper
- Apply Pretext to Services cards + First Visit steps
- Copy all assets to public/ using renamed paths
- Compose all sections in page.tsx
- Add responsive styles (mobile-first breakpoints)
- Add scroll-driven animations (CSS view-timeline + @keyframes)
- Add favicon and meta tags (SEO, Open Graph)
- Run Quebec French copy review pass + English parity QA

## Key Design Decisions (approved, do not change)

- Nav gradient: transparent top fading to lime (#B0D64E at ~56% opacity bottom)
- Meet the Dentists: dark premium cards (charcoal #1f1f1f→#2a2a2a gradient, rgba(176,214,78,.42) border, lime-tinted names)
- Bottom CTA: dark card with "Need an appointment this week?" / "Besoin d'un rendez-vous cette semaine?"
- Both hero CTAs: "Request Appointment" + phone number
- Clinic exterior image in hero near top (object-fit: contain)
- Light/dark alternation across sections for visual rhythm
- FR/EN pill toggle in nav — fr-CA default, localStorage persistence
