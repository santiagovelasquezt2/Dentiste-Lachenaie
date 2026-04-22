import React, { useEffect, useMemo, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, ZoomControl, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useLanguage } from '../context/LanguageContext';
import { clinicData } from '../content/clinic';
import mapMarkerClinicLogo from '@/DentalContent/Images/Map/map-marker-clinic-logo.png';
import { Phone, MapPin, LocateFixed } from 'lucide-react';

// Leaflet coords = [lat, lng] (opposite of MapLibre's [lng, lat])
const LAT = clinicData.mapCenter[1];
const LNG = clinicData.mapCenter[0];
const CENTER: [number, number] = [LAT, LNG];
const ZOOM = clinicData.mapZoom;
const WEEKDAY_KEYS = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'] as const;

const parseHoursRange = (hours: string) => {
  const match = hours.match(/^(\d{1,2}):(\d{2})\s*-\s*(\d{1,2}):(\d{2})$/);
  if (!match) return null;

  const start = Number(match[1]) * 60 + Number(match[2]);
  const end = Number(match[3]) * 60 + Number(match[4]);

  if (!Number.isFinite(start) || !Number.isFinite(end)) return null;

  return { start, end };
};

const getClinicOpenState = (now = new Date()) => {
  const dayKey = WEEKDAY_KEYS[now.getDay()];
  const hours = clinicData.hours[dayKey];

  if (hours === 'Fermé' || hours === 'Closed') {
    return { open: false };
  }

  const range = parseHoursRange(hours);
  if (!range) {
    return { open: false };
  }

  const currentMinutes = now.getHours() * 60 + now.getMinutes();
  return { open: currentMinutes >= range.start && currentMinutes < range.end };
};

// ---------------------------------------------------------------------------
// Custom clinic logo on map (DentalContent/Images/Map/map-marker-clinic-logo.png)
// ---------------------------------------------------------------------------
function makeIcon(markerSrc: string): L.DivIcon {
  const size = 108;
  return L.divIcon({
    html: `<div class="clinic-map-pin" style="width:${size}px;height:${size}px;">
             <div class="clinic-map-pin-inner">
               <img src="${markerSrc}" alt="" decoding="async" />
             </div>
           </div>`,
    className: '', // clear Leaflet's default white-box class
    iconSize: [size, size],
    iconAnchor: [size / 2, size], // bottom center on the coordinate
    popupAnchor: [0, -(size + 10)],
  });
}

// ---------------------------------------------------------------------------
// Recenter button — must live inside <MapContainer> to call useMap()
// ---------------------------------------------------------------------------
function RecenterButton({ label }: { label: string }) {
  const map = useMap();
  return (
    <div className="absolute top-2 right-[3.25rem] z-[1000]">
      <div className="overflow-hidden rounded-md border border-[#ccc] bg-white shadow-sm">
        <button
          type="button"
          onClick={() => map.flyTo(CENTER, ZOOM, { duration: 1 })}
          title={label}
          aria-label={label}
          className="flex size-8 items-center justify-center text-[#333] transition-colors hover:bg-brand-lime hover:text-bg-dark"
        >
          <LocateFixed className="size-4" aria-hidden />
        </button>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// ContactSection
// ---------------------------------------------------------------------------
export const ContactSection: React.FC = () => {
  const { t } = useLanguage();
  const [isClinicOpen, setIsClinicOpen] = useState(() => getClinicOpenState().open);

  // Build the icon once — logo URL is stable across renders
  const clinicMarkerIcon = useMemo(() => makeIcon(mapMarkerClinicLogo as string), []);
  const hoursRows = [
    { key: 'monday', label: t.hours.monday },
    { key: 'tuesday', label: t.hours.tuesday },
    { key: 'wednesday', label: t.hours.wednesday },
    { key: 'thursday', label: t.hours.thursday },
    { key: 'friday', label: t.hours.friday },
    { key: 'saturday', label: t.hours.saturday },
    { key: 'sunday', label: t.hours.sunday },
  ] as const;
  const infoBlockClass =
    'rounded-[1.5rem] border border-white/8 bg-white/[0.03] px-5 py-5 shadow-[0_1px_0_rgba(255,255,255,0.04)_inset]';
  const infoLabelClass = 'text-[0.68rem] uppercase tracking-[0.24em] text-white/42';

  useEffect(() => {
    const updateOpenState = () => setIsClinicOpen(getClinicOpenState().open);

    updateOpenState();
    const intervalId = window.setInterval(updateOpenState, 60_000);

    window.addEventListener('focus', updateOpenState);

    return () => {
      window.clearInterval(intervalId);
      window.removeEventListener('focus', updateOpenState);
    };
  }, []);

  return (
    <section
      id="contact"
      className="relative scroll-mt-24 overflow-hidden bg-[#1a1a1a] py-20 text-bg-inverse md:py-32"
    >
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(176,214,78,0.1),_transparent_40%),radial-gradient(circle_at_bottom_left,_rgba(176,214,78,0.05),_transparent_40%)]"
        aria-hidden
      />
      <div className="relative">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="relative grid items-center gap-12 md:gap-16 lg:grid-cols-2 lg:gap-20">

            {/* ── Contact info ──────────────────────────────────────────── */}
            <div className="max-w-[34rem]">
              <h2 className="mb-8 font-display text-[clamp(2.35rem,5vw,4.1rem)] font-normal leading-[1.02] tracking-[-0.06em] text-white md:mb-10">
                {t.contact.title}
              </h2>

              <div className="flex flex-col gap-5">
                {/* PHONE */}
                <div className={infoBlockClass}>
                  <h3 className={infoLabelClass}>{t.contact.phoneLabel}</h3>
                  <div className="mt-3 flex flex-wrap items-center gap-3">
                    <a
                      href={`tel:${clinicData.phone.replace(/\D/g, '')}`}
                      className="break-words text-[clamp(1.35rem,2.2vw,1.9rem)] font-medium leading-tight tracking-[-0.03em] text-white transition-colors hover:text-brand-lime"
                    >
                      {clinicData.phone}
                    </a>
                    {isClinicOpen ? (
                      <div className="inline-flex items-center gap-2 rounded-full bg-brand-lime px-3 py-1 text-[0.72rem] font-semibold text-bg-dark shadow-[0_10px_20px_rgba(176,214,78,0.18)]">
                        <span className="relative flex h-2 w-2">
                          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-bg-dark/40 opacity-75"></span>
                          <span className="relative inline-flex h-2 w-2 rounded-full bg-bg-dark"></span>
                        </span>
                        {t.contact.openToday}
                      </div>
                    ) : null}
                  </div>
                </div>

                {/* ADDRESS */}
                <div className={infoBlockClass}>
                  <h3 className={infoLabelClass}>{t.contact.addressLabel}</h3>
                  <p className="mt-3 max-w-md text-[1.15rem] leading-[1.55] text-white/82 md:text-[1.3rem]">
                    {clinicData.address}
                  </p>
                </div>

                {/* EMAIL */}
                <div className={infoBlockClass}>
                  <h3 className={infoLabelClass}>{t.contact.emailLabel}</h3>
                  <a
                    href={`mailto:${clinicData.email}`}
                    className="mt-3 inline-block break-words text-[1.1rem] text-white/82 transition-colors hover:text-brand-lime md:text-[1.25rem]"
                  >
                    {clinicData.email}
                  </a>
                </div>

                {/* CTAs */}
                <div className="mt-3 flex flex-col gap-4 sm:flex-row">
                  <a
                    href={`tel:${clinicData.phone.replace(/\D/g, '')}`}
                    className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-brand-lime px-6 py-4 text-base font-semibold text-bg-dark transition-transform hover:scale-105 active:scale-95 sm:w-auto"
                  >
                    <Phone className="size-5" />
                    {t.contact.callNow}
                  </a>
                  <a
                    href={`https://maps.google.com/?q=${encodeURIComponent(clinicData.address)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-white/10 bg-white/5 px-6 py-4 text-base font-semibold text-white shadow-sm backdrop-blur-sm transition-colors hover:border-white/20 hover:bg-white/10 sm:w-auto"
                  >
                    <MapPin className="size-5" />
                    {t.contact.getDirections}
                  </a>
                </div>
              </div>
            </div>

            {/* ── Map + hours ───────────────────────────────────────────── */}
            <div className="flex flex-col gap-5 sm:gap-6">
              {/*
                Explicit pixel height avoids the CSS layout race that caused
                MapLibre's canvas to initialise at 0×0.
              */}
              <div className="relative isolate z-0 h-[320px] overflow-hidden rounded-[28px] border border-white/10 bg-[#1f1f1f] shadow-[0_24px_64px_rgba(0,0,0,0.35)] sm:h-[380px] sm:rounded-[32px] md:h-[460px] lg:h-[480px] lg:rounded-[40px]">
                <MapContainer
                  center={CENTER}
                  zoom={ZOOM}
                  zoomControl={false}
                  scrollWheelZoom={false}
                  style={{ height: '100%', width: '100%' }}
                >
                  {/* CARTO Positron — clean light basemap, free, no API key */}
                  <TileLayer
                    url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
                    subdomains="abcd"
                    maxZoom={20}
                  />

                  <ZoomControl position="bottomright" />
                  <RecenterButton label={t.contact.mapRecenter} />

                  <Marker position={CENTER} icon={clinicMarkerIcon}>
                    <Popup>
                      <div className="clinic-map-popup">
                        <strong>{clinicData.name}</strong>
                        <span>{clinicData.address}</span>
                      </div>
                    </Popup>
                  </Marker>
                </MapContainer>
              </div>

              <div className="rounded-[24px] border border-white/8 bg-[linear-gradient(180deg,rgba(255,255,255,0.045),rgba(255,255,255,0.03))] px-4 py-4 text-white shadow-[0_10px_28px_rgba(0,0,0,0.16)] backdrop-blur-sm sm:px-5 sm:py-5">
                <div className="mb-5 flex items-end justify-between gap-4">
                  <div>
                    <p className="text-[0.62rem] uppercase tracking-[0.26em] text-white/40">
                      {t.hours.scheduleLabel}
                    </p>
                    <h3 className="mt-1 text-lg font-medium tracking-[-0.02em] text-white/92">
                      {t.hours.cardTitle}
                    </h3>
                  </div>
                </div>

                <dl className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-7">
                  {hoursRows.map((day) => {
                    const value = clinicData.hours[day.key];
                    const displayValue = value === 'Fermé' || value === 'Closed' ? t.hours.closed : value;
                    const isClosed = value === 'Fermé' || value === 'Closed';

                    return (
                      <div
                        key={day.key}
                        className="flex min-h-[96px] flex-col justify-between rounded-[18px] border border-white/8 bg-white/[0.035] px-4 py-3.5 text-left shadow-[0_1px_0_rgba(255,255,255,0.05)_inset]"
                      >
                        <dt className="text-[0.7rem] uppercase tracking-[0.18em] text-white/48">
                          {day.label}
                        </dt>
                        <dd
                          className={`mt-4 text-[1.02rem] font-medium leading-[1.35] tabular-nums ${
                            isClosed ? 'text-white/66' : 'text-white/92'
                          }`}
                        >
                          {displayValue}
                        </dd>
                      </div>
                    );
                  })}
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
