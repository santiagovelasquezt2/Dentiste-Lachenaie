# Project Intent

> **Read this first.** This file explains *why* this codebase exists. The companion file [`CLINIC_TEMPLATE.md`](./CLINIC_TEMPLATE.md) explains *how* to re-skin it for a new clinic.

## What this is

A reusable, animation-rich dental clinic website **template**, built in Vite + React 19 + Tailwind v4 + TypeScript. It was originally designed and built for one specific clinic (Centre Dentaire Vaillancourt St-Onge, Terrebonne QC), with a lime-green / mint brand palette. That clinic passed on the offer, so the codebase is being repurposed as a one-size-fits-all template that can be rapidly re-skinned for any dental clinic.

## The business model

The operator (single person, project manager / orchestrator) uses this template to:

1. Pick a target dental clinic.
2. Re-skin the template with that clinic's branding, content, photos, team, and contact info.
3. Deploy a finished demo site.
4. Cold-email the clinic with a yes/no offer: "Want this site? Yes or no."
5. Repeat at volume.

Speed of re-skin matters more than bespoke design. The template should look polished and finished out of the box; per-clinic work should be substitution, not redesign.

## What's intentionally generic (don't change per clinic)

These are template-stable. Don't redesign them when re-skinning a new clinic — preserving them is the whole point of the template.

- **Page structure & section order** — Nav, Hero, "Our Goal", Services, Cutting-edge tech carousel, Team, Gallery, "Come Visit Us" (hours), First Visit, Contact, Reviews, Footer.
- **Animations & interactions** — hero reveal, scroll-driven background fills, team-bubble reveal, gloved-fingers fade for the team section, carousel auto-advance, etc.
- **Copy scaffolding** — taglines like "Des sourires qui durent" and "personalized quality and excellent" remain on the hero. They are template defaults; the clinic-specific clinic *name* is what swaps in around them.
- **Interaction patterns & motion** — feel, timing curves, hover behavior.

## What changes per clinic

The exhaustive list lives in [`CLINIC_TEMPLATE.md`](./CLINIC_TEMPLATE.md). At a glance:

- **Branding** — primary brand color, accent / soft tint, deep hover color, mint surface background; logo image; hero reveal video.
- **Photography** — exterior building shot, interior shots (reception / waiting / treatment / sterilization), dentist headshots, staff photos, team group photo.
- **Text content** — clinic name (incl. hero top/bottom split), dentist bios, service descriptions, gallery captions.
- **Contact data** — phone, email, address, map coordinates (Leaflet pin), hours, embedded map.
- **Team roster** — dentists (name, role, bio, photo, team association) and staff (hygienists, assistants, secretaries) per dentist team.
- **Stats** — "Since YYYY" founding year, "+N employees" headcount.
- **PDF asset** — first-visit patient intake form (clinic-branded).

## Working principles for agents on this repo

When editing this codebase as part of a re-skin or template improvement:

1. **Centralize, never hardcode.** Clinic-specific values belong in `src/content/clinic.ts` and `src/content/i18n/*` — not embedded in component JSX. If you find yourself typing a phone number or hex value into a component, that's a smell; lift it.
2. **Preserve the `font-display` title treatment.** Per `.claude/CLAUDE.md`: all heading-like title text uses the established `font-display` style — vertical scale, tracking, and spacing. Don't introduce parallel heading styles.
3. **Animations and section structure are template-stable.** Don't redesign them when re-skinning. Color changes, asset swaps, copy edits — yes. Structural / motion redesigns — no, unless the user explicitly asks.
4. **Default to fewer brand colors, not more.** The clinic provides ~3 brand colors; everything else (gradient stops, soft tints, hover shades) should be derived from those tokens, not added as new bespoke hex values.
5. **Keep clinic-specific assets out of the imported component tree where possible.** Prefer pulling from a config-mapped path over a static `import` — see the refactor proposal in `CLINIC_TEMPLATE.md` §5.
