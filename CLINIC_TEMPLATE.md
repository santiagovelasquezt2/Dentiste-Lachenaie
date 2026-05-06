# Clinic Template — Re-skin Guide

> Companion to [`PROJECT_INTENT.md`](./PROJECT_INTENT.md). Read that first for the *why*. This doc is the *how*: every clinic-specific touchpoint in the codebase, the inputs needed from the orchestrator, and a refactor proposal to make future re-skins a one-file edit.

---

## 1. How to use this doc

When starting a new clinic:

1. The orchestrator (project manager) fills in the **Inputs Checklist** in §2.
2. An agent (or the orchestrator) walks **Touchpoints by Section** (§3) and **Brand-color & theming touchpoints** (§4) to apply the changes.
3. For volume work, execute the **Proposed Refactor** in §5 *once*. After that, every future re-skin is one config file + one asset folder swap.
4. Use the **Quick-start re-skin checklist** (§6) as the operating manual on each new clinic.

---

## 2. Inputs needed from the orchestrator (per clinic)

Fill this in before any work starts. Every field below has at least one corresponding place in the codebase that depends on it.

### Identity
- [ ] **Clinic legal name** (e.g. "Centre dentaire Vaillancourt St-Onge")
- [ ] **Hero display name** — the name as a top/bottom split for the hero headline (e.g. top: "Centre Dentaire", bottom: "Vaillancourt St-Onge")
- [ ] **Primary tagline** — current default: "Des sourires qui durent"
- [ ] **Hero overlay micro-copy** — three short phrases (current defaults: "personalized", "quality", "excellence")
- [ ] **Language** — `fr-CA`, `en-CA`, or both

### Brand (3 colors minimum, the rest derive)
- [ ] **Primary brand color** — vibrant accent, used on CTAs, map pins, key icons. *Currently `#B0D64E` (lime).*
- [ ] **Soft accent / tint color** — used for large mint-tinted UI fills. *Currently `#D1E8D1`.*
- [ ] **Deep accent / hover color** — used for hover states on lime elements. *Currently `#7E9C2F`.*
- [ ] *Optional:* mint surface background for large sections (Contact, Hours). *Currently `#E6EFE3`.* If omitted, derive from soft accent.

### Logo & video
- [ ] **Primary logo** — PNG with transparent background (used in Nav, possibly Footer).
- [ ] **Hero reveal video** — short clip of the logo on a white background (~3–5s), MP4. *Currently `public/assets/hero-reveal.mp4`.*

### Photography
- [ ] **Exterior building shot** — wide hero-quality photo of the clinic's storefront / signage.
- [ ] **Interior shots (4–6)** — reception, waiting room(s), treatment room, sterilization room.
- [ ] **Dentist headshots** — one per featured dentist.
- [ ] **Staff photos** — optional, one per staff member where available.
- [ ] **Team group photo** — optional, one group shot per dentist team.
- [ ] **Gloved-fingers reveal image** — the glove color in this image must match the new brand. *Currently `public/team-hands-reveal.png`.*

### Team
For each dentist:
- [ ] Name, role, bio, photo, team association (`team1` / `team2` / etc.), `featured` (bool), `status` (`active` | `coming-soon`)

For each staff member, grouped by team and role:
- [ ] Name, role bucket (`hygienists` | `assistants` | `secretaries`), photo (optional)

### Stats
- [ ] **Founding year** (for "Since YYYY") — *currently 2000.*
- [ ] **Employee count** (for "+N employees" bubble) — *currently +10.*

### Contact & location
- [ ] **Phone** — *currently `(450) 582-2219`.*
- [ ] **Email** — *currently `info@dentistelachenaie.com`.*
- [ ] **Full address** — *currently `355, Montée des Pionniers, suite 201, Terrebonne, Qc J6V 1N5`.*
- [ ] **Map coordinates** — `[longitude, latitude]` for the Leaflet pin. *Currently `[-73.5123831, 45.7138807]`.*
- [ ] **Map zoom** — *currently 15.*

### Hours
- [ ] **Mon–Sun schedule** in the format `"8:00 - 20:00"` or `"Fermé"` (per current data shape in `clinic.ts`).

### Services
- [ ] Confirm which of the 8 default services apply: `orthodontics`, `prevention`, `pediatric`, `restoration`, `implants`, `emergency`, `surgery`, `cosmetic`. Provide per-service description overrides if any.

### Documents
- [ ] **First-visit PDF** — clinic-branded patient intake form for the download button. *Currently `public/assets/formulaire-premiere-visite.pdf`.*

---

## 3. Touchpoints by section — what changes & where

The site is a single page composed of 12+ stacked components in `src/components/`. All clinic data flows from `src/content/clinic.ts` (structured data) and `src/content/i18n/{fr-CA,en-CA}.ts` (text/labels). Asset imports come from `src/DentalContent/` (via the `@/DentalContent` alias) or `public/`.

> **Note on line numbers.** Where given, line numbers reflect the codebase at the time this doc was written and will drift. Trust **file paths and symbol names** first; line numbers are orientation hints, not addresses.

### 1. Navbar — `src/components/Nav.tsx`
- Logo asset → `public/assets/clinic-logo-primary.png`
- Phone → `clinicData.phone` (`src/content/clinic.ts`)
- Nav link labels → `t.nav.*` in `src/content/i18n/fr-CA.ts`
- Brand colors → inline `bg-[#b0d64e]` (contact icon), `text-[#7e9c2f]` (hover) — sweep these to tokens

### 2. Hero — `src/components/Hero.tsx`
- Exterior photo (left) → import path to `DentalContent/Images/Ouside of the building/...`
- Hero reveal video (right) → `public/assets/hero-reveal.mp4`
- Tagline & overlay copy → `t.hero.slogan`, `t.hero.overlayPersonalized/Quality/Excellence` in i18n
- Top/bottom split clinic name → `t.hero.clinicNameTop`, `t.hero.clinicNameBottom` in i18n
- CTA button color → inline `#b0d64e` with hover `#9cbd42`

### 3. "Our Goal" / Team Bubbles — `src/components/TeamBubbles.tsx`
- Dentist images in the bubbles → imports from `DentalContent/Images/Team/Dentists/...`
- "+N employees" count → hardcoded number; lift to `clinicData.stats.employeeCount`
- "Since YYYY" → currently embedded in animated reveal text; lift to `clinicData.stats.foundingYear`
- Bubble background palette → light beige-green (`#e4e2e0` and similar); should track soft accent token
- Reveal text → `t.team.bubblesReveal`

### 4. About — `src/components/AboutSection.tsx`
- Photography from `DentalContent/Images/About/`
- Mint-surface background → uses `--color-mint-surface` (already tokenized — good)

### 5. Services — `src/components/ServicesSection.tsx` + `src/content/clinic.ts`
- Service IDs → `clinicData.services` array
- Per-service title/description/highlights → `serviceDetails` object **inside `ServicesSection.tsx`** (not externalized; refactor target — see §5)
- Card hover highlight color → inline lime values; sweep to tokens

### 6. Cutting-edge tech carousel — `src/components/Tooth3DSection.tsx`
- Carousel images → `public/tool-dentist-display/` (self-hosted) — **glove color in these photos is brand-specific and must be replaced with images that match the new brand color**
- Auto-advance interval → `AUTO_ADVANCE_MS` constant
- Brand-lime controls (progress bar, focus ring) → inline lime values

### 7. Team section — `src/components/TeamSection.tsx`
- Dentist & staff data → `clinicData.dentists` + `clinicData.teams` in `clinic.ts`
- Bios → `t.team.dentist1Bio`, `t.team.dentist2Bio` (note: also a duplicate copy of bios inside `clinic.ts` — keep one source)
- Card gradient palettes → inline `from-[#dce8b7] via-[#b8d95f] to-[#5c6f26]` and friends; sweep to tokens
- "Fingers/glove" reveal image → `public/team-hands-reveal.png` — glove color must match brand

### 8. Gallery — `src/components/GallerySection.tsx`
- 6 hardcoded image imports from `DentalContent/Images/Inside of the practice/` and `DentalContent/Images/Ouside of the building/`
- Captions → `t.gallery.images.*` in i18n

### 9. "Come Visit Us" / Hours — `src/components/HoursSection.tsx`
- Hours data → `clinicData.hours`
- Address → `clinicData.address`
- Scroll-driven background fill → inline `#E7F1E3` mint; should track mint-surface token
- Decorative pattern → `src/components/HoursContourPattern.tsx` (geometric, not clinic-specific)

### 10. First Visit — `src/components/FirstVisitSection.tsx`
- Procedure steps (incl. PDF link) → `t.firstVisit.steps` array in i18n
- "Download PDF" button → links to `public/assets/formulaire-premiere-visite.pdf`
- Button colors → inline lime; sweep to tokens

### 11. Appointment form — `src/components/AppointmentForm.tsx`
- Form labels & button text → `t.appointment.*` in i18n
- Submit button color → inline lime

### 12. Contact / Map — `src/components/ContactSection.tsx`
- Phone, email, address, hours table → `clinicData.*`
- Map → Leaflet, centered on `clinicData.mapCenter`, zoom `clinicData.mapZoom`
- Multiple inline lime CTAs and "recenter map" button → sweep to tokens
- Leaflet popup styling → `src/index.css` (search for `leaflet-popup`) hardcodes `#B0D64E`

### 13. Reviews — `src/components/ReviewSection.tsx`
- Review content → currently hardcoded in component
- Accent colors on cards → inline lime/accent

### 14. Footer — `src/components/Footer.tsx`
- Minimal: copyright line. Richer footer-style content (full hours, map, contact) lives in `ContactSection.tsx`.

---

## 4. Brand-color & theming touchpoints (consolidated)

If you only had to do a color swap and nothing else, you would touch all of the following:

### Token definitions (the right place to change)
- `src/styles/variables.css` — `--color-brand-lime`, `--color-accent`, `--color-accent-dark`, `--color-mint-surface`, `--color-mint-surface-deep`, etc. *Update these and a portion of the site reflows automatically.*
- `src/index.css` — shadcn semantic mapping (`--accent`, `--ring`, `--chart-2`, etc.) under `:root`. Also Leaflet popup styles with hardcoded hex (`#B0D64E`).

### Inline arbitrary Tailwind / hex values (the wrong place — sweep these to tokens)
Search the codebase for these hex values; each occurrence should be replaced with a token reference.

| Hex | Meaning | Files where it appears |
|---|---|---|
| `#B0D64E` / `#b0d64e` | Primary brand lime | `Nav.tsx`, `Hero.tsx`, `Button.tsx`, `FirstVisitSection.tsx`, `ContactSection.tsx`, `Tooth3DSection.tsx`, `index.css` (Leaflet) |
| `#9cbd42` | Brand-lime hover | `Hero.tsx`, `index.css` (`--chart-2`) |
| `#7e9c2f` | Subdued green hover (Nav) | `Nav.tsx` |
| `#5c6f26`, `#b8d95f`, `#dce8b7` | Team card gradient stops | `TeamSection.tsx` |
| `#5f7f1f` | Card border hover | `TeamSection.tsx` |
| `#17352D` | Deep teal text (paired with lime buttons) | `FirstVisitSection.tsx`, `Button.tsx` |
| `#E7F1E3`, `#eff4e5`, `#f7faf2`, `#E8EDE3` | Mint surface backgrounds | `HoursSection.tsx`, `AboutSection.tsx`, `Nav.tsx` (hover) |
| `#e4e2e0` | Bubble background | `TeamBubbles.tsx` |
| `#112133`, `#1a1a1a` | Dark hero/review surfaces | `Hero.tsx`, `ReviewSection.tsx` |

### Asset folders
| Folder | What lives there |
|---|---|
| `src/DentalContent/Images/Logo/` | Clinic logo source files |
| `src/DentalContent/Images/Team/Dentists/` | Dentist headshots |
| `src/DentalContent/Images/Team/Team/` | Staff headshots |
| `src/DentalContent/Images/Team/Dr. ...'s Team/` | Team group photos |
| `src/DentalContent/Images/Inside of the practice/` | Reception, waiting, treatment, sterilization |
| `src/DentalContent/Images/Ouside of the building/` | Exterior shots |
| `src/DentalContent/Images/About/` | About-section imagery |
| `src/DentalContent/Images/Map/` | Map marker graphics |
| `src/DentalContent/Video/` | Hero reveal video sources |
| `src/DentalContent/3D models/molar_tooth_gltf/` | 3D tooth model |
| `public/assets/` | Runtime assets — primary logo PNG, hero-reveal MP4, first-visit PDF |
| `public/tool-dentist-display/` | Carousel glove images |
| `public/team-hands-reveal.png` | Gloved-fingers reveal image |
| `public/models/` | Runtime 3D model |

---

## 5. Proposed refactor — make re-skinning a single-file edit

This is a recommendation, not yet implemented. Done once, it converts every future re-skin into a config-file edit + an asset-folder swap.

1. **Single `clinic.config.ts`.** Create one config file (suggested: `src/config/clinic.config.ts`) that holds *everything* clinic-specific:
   - identity (name, hero name split, tagline, language)
   - brand (3 colors → derive the rest)
   - contact (phone, email, address, mapCenter, mapZoom)
   - hours
   - team roster (dentists + staff)
   - stats (foundingYear, employeeCount)
   - services (IDs + per-service copy overrides)
   - asset paths (logo, hero video, gloved-fingers reveal, exterior, gallery photos, dentist photos, staff photos, team group photos, first-visit PDF)

   Keep `src/content/clinic.ts` and `src/content/i18n/*` for the long-form copy that stays in i18n; have `clinic.config.ts` *compose* over them so a re-skin overrides only what changes.

2. **Sweep inline hex values into CSS variables.** Every `bg-[#b0d64e]`, `text-[#7e9c2f]`, gradient stop, `from-[#dce8b7]`, etc., should resolve to a `var(--color-brand)`, `var(--color-brand-deep)`, etc. The bridge between `clinic.config.ts` and CSS is a tiny runtime that injects the config's brand colors as `:root` custom properties at app boot.

3. **Consolidate `serviceDetails`** out of `ServicesSection.tsx` into the config / i18n layer. Service copy belongs with the rest of the content.

4. **Asset-path indirection.** Replace direct imports like `import dr from '@/DentalContent/Images/Team/Dentists/dentist-dr-x.jpg'` with `clinicConfig.assets.dentists[i].photo`. Per-clinic assets can then live in `src/DentalContent/<clinic-slug>/...` with one config field selecting the active clinic.

5. **Glove carousel.** Replace `public/tool-dentist-display/` images with self-hosted, color-swappable versions, or render gloves as CSS-tintable SVGs. Same for `public/team-hands-reveal.png`. The goal: glove color is not baked into a JPEG.

6. **Leaflet popup colors.** Move the hardcoded `#B0D64E` in `src/index.css` Leaflet popup styles to `var(--color-brand-lime)`.

**Outcome after refactor:** new clinic = edit one config file + drop in one asset folder + replace the first-visit PDF. No grep-and-replace across components.

---

## 6. Quick-start re-skin checklist

Once §5 is done, the per-clinic flow is:

1. Fill in §2 **Inputs Checklist** with the new clinic's data.
2. Create `src/DentalContent/<clinic-slug>/` and drop in: logo, hero video, exterior, interior shots, dentist photos, staff photos, team group photo, gloved-fingers reveal, first-visit PDF.
3. Create `src/config/<clinic-slug>.config.ts` (or duplicate the active config and rename), populated from §2.
4. Update the active-clinic selector (single env var or top-level config import) to point at the new config.
5. Re-skin the Tooth3DSection carousel images (gloves) to match the new brand color.
6. Run `npm run dev`, walk every section, verify: logo, phone, email, address, hours, map pin, team names/photos, gallery, hero CTA color, button colors, glove color in carousel and team-reveal, first-visit PDF download.
7. Run `npm run build` to confirm production build succeeds.
8. Deploy.

---

## 7. Verification — before sending the demo

- [ ] No occurrences of `#b0d64e` (case-insensitive) remain in `src/components/` outside of token definitions.
- [ ] `src/content/clinic.ts` and i18n files reflect the new clinic, not the old one.
- [ ] All photos visible in the rendered site come from the new clinic's asset folder.
- [ ] Map pin lands on the new address (not Terrebonne).
- [ ] Hero reveal video shows the new clinic's logo.
- [ ] First-visit PDF download links to the new clinic's form.
- [ ] Glove color in the tools carousel and the team-reveal image matches the new brand.
- [ ] No "Vaillancourt", "St-Onge", "Terrebonne", or `(450) 582-2219` strings remain anywhere in `src/`.
