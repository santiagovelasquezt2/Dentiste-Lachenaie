/**
 * Desktop HoursSection is a tall scroll-scrubbed block (Framer scrollYProgress).
 * Native #hours-card scroll hits a 1px anchor at a fixed vh offset while the card
 * may still be mid-animation (opacity/transform), or misaligned. Scroll using the
 * same progress range as HoursSectionDesktop content fade-in (see contentOpacity ~0.64–0.74).
 */

const HOURS_DESKTOP_MIN = '(min-width: 1024px)';
/** Progress where hours card content is fully visible / interactive (HoursSectionDesktop). */
const HOURS_DESKTOP_TARGET_PROGRESS = 0.8;
/** Match scroll-mt-24 (6rem) used on sections / anchors. */
const SCROLL_MARGIN_PX = 96;

export function scrollToHoursSection(behavior: ScrollBehavior = 'smooth'): void {
  const section = document.getElementById('hours');
  if (!section) return;

  const isDesktop = window.matchMedia(HOURS_DESKTOP_MIN).matches;

  if (!isDesktop) {
    const top = section.getBoundingClientRect().top + window.scrollY - SCROLL_MARGIN_PX;
    window.scrollTo({ top: Math.max(0, top), behavior });
    return;
  }

  const rectTop = section.getBoundingClientRect().top + window.scrollY;
  const sectionH = section.offsetHeight;
  const viewH = window.innerHeight;
  const scrollRange = Math.max(0, sectionH - viewH);
  const targetY = rectTop + scrollRange * HOURS_DESKTOP_TARGET_PROGRESS - SCROLL_MARGIN_PX;

  window.scrollTo({ top: Math.max(0, targetY), behavior });
}

export function isHoursHash(hash: string): boolean {
  return hash === '#hours' || hash === '#hours-card';
}
