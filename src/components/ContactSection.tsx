import React, { useMemo } from 'react';
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

  // Build the icon once — logo URL is stable across renders
  const clinicMarkerIcon = useMemo(() => makeIcon(mapMarkerClinicLogo as string), []);

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
            <div>
              <h2 className="mb-10 font-display text-[clamp(2.35rem,5vw,4.1rem)] font-normal leading-[1.12] tracking-[-0.055em] text-white md:mb-12">
                {t.contact.title}
              </h2>

              <div className="flex flex-col gap-10">
                {/* PHONE */}
                <div>
                  <h3 className="mb-1 text-xs uppercase tracking-widest text-white/55">{t.contact.phoneLabel}</h3>
                  <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:gap-4">
                    <a
                      href={`tel:${clinicData.phone.replace(/\D/g, '')}`}
                      className="break-words text-2xl font-medium tracking-tight text-white transition-colors hover:text-brand-lime sm:text-3xl md:text-4xl"
                    >
                      {clinicData.phone}
                    </a>
                    <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-sm font-medium text-bg-inverse backdrop-blur-sm">
                      <span className="relative flex h-2 w-2">
                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white/50 opacity-75"></span>
                        <span className="relative inline-flex h-2 w-2 rounded-full bg-white"></span>
                      </span>
                      {t.contact.openToday}
                    </div>
                  </div>
                </div>

                {/* ADDRESS */}
                <div>
                  <h3 className="mb-1 text-xs uppercase tracking-widest text-white/55">{t.contact.addressLabel}</h3>
                  <p className="max-w-sm text-base text-white/80 md:text-lg">{clinicData.address}</p>
                </div>

                {/* EMAIL */}
                <div>
                  <h3 className="mb-1 text-xs uppercase tracking-widest text-white/55">{t.contact.emailLabel}</h3>
                  <a
                    href={`mailto:${clinicData.email}`}
                    className="break-words text-base text-white/80 transition-colors hover:text-brand-lime md:text-lg"
                  >
                    {clinicData.email}
                  </a>
                </div>

                {/* CTAs */}
                <div className="mt-4 flex flex-col gap-4 sm:flex-row">
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

            {/* ── Map ───────────────────────────────────────────────────── */}
            {/*
              Explicit pixel height avoids the CSS layout race that caused
              MapLibre's canvas to initialise at 0×0.
            */}
            <div className="h-[320px] overflow-hidden rounded-[28px] border border-white/10 bg-[#1f1f1f] shadow-[0_24px_64px_rgba(0,0,0,0.35)] sm:h-[380px] sm:rounded-[32px] md:h-[460px] lg:h-[480px] lg:rounded-[40px]">
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
          </div>
        </div>
      </div>
    </section>
  );
};
