import React, { useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup, ZoomControl, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useLanguage } from '../context/LanguageContext';
import { clinicData } from '../content/clinic';
import mapPinToothShield from '@/DentalContent/Images/Map/tooth-with-shield-map-lime.png';
import { Phone, Mail, MapPin, LocateFixed } from 'lucide-react';

// Leaflet coords = [lat, lng] (opposite of MapLibre's [lng, lat])
const LAT = clinicData.mapCenter[1];
const LNG = clinicData.mapCenter[0];
const CENTER: [number, number] = [LAT, LNG];
const ZOOM = clinicData.mapZoom;

// ---------------------------------------------------------------------------
// Tooth + health shield doodle (brand lime #B0D64E) — raster from client asset
// ---------------------------------------------------------------------------
function makeIcon(markerSrc: string): L.DivIcon {
  const size = 64;
  return L.divIcon({
    html: `<div class="clinic-map-pin">
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
          className="flex size-8 items-center justify-center text-[#333] transition-colors hover:bg-[#B0D64E] hover:text-[#1a1a1a]"
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
  const toothMarkerIcon = useMemo(() => makeIcon(mapPinToothShield as string), []);

  return (
    <section id="contact" className="overflow-hidden bg-bg-dark py-32 text-bg-inverse">
      <div className="container mx-auto px-6">
        <div className="grid items-center gap-20 lg:grid-cols-2">

          {/* ── Contact info ──────────────────────────────────────────── */}
          <div>
            <h2 className="mb-12 text-section-title font-heading font-semibold">{t.contact.title}</h2>

            <div className="flex flex-col gap-10">
              {/* PHONE */}
              <div>
                <h3 className="text-xs uppercase tracking-widest text-bg-inverse/40 mb-1">{t.contact.phoneLabel}</h3>
                <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:gap-4">
                  <a
                    href={`tel:${clinicData.phone.replace(/\D/g, '')}`}
                    className="text-3xl font-medium tracking-tight text-bg-inverse transition-colors hover:text-accent md:text-4xl"
                  >
                    {clinicData.phone}
                  </a>
                  <div className="inline-flex items-center gap-2 rounded-full border border-accent/20 bg-accent/10 px-3 py-1 text-sm font-medium text-accent">
                    <span className="relative flex h-2 w-2">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-75"></span>
                      <span className="relative inline-flex h-2 w-2 rounded-full bg-accent"></span>
                    </span>
                    {t.contact.openToday}
                  </div>
                </div>
              </div>

              {/* ADDRESS */}
              <div>
                <h3 className="text-xs uppercase tracking-widest text-bg-inverse/40 mb-1">{t.contact.addressLabel}</h3>
                <p className="text-base text-bg-inverse/80 md:text-lg max-w-sm">{clinicData.address}</p>
              </div>

              {/* EMAIL */}
              <div>
                <h3 className="text-xs uppercase tracking-widest text-bg-inverse/40 mb-1">{t.contact.emailLabel}</h3>
                <a
                  href={`mailto:${clinicData.email}`}
                  className="text-base text-bg-inverse/80 transition-colors hover:text-accent md:text-lg"
                >
                  {clinicData.email}
                </a>
              </div>

              {/* CTAs */}
              <div className="mt-4 flex flex-col gap-4 sm:flex-row">
                <a
                  href={`tel:${clinicData.phone.replace(/\D/g, '')}`}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-accent px-6 py-4 text-base font-semibold text-bg-dark transition-transform hover:scale-105 active:scale-95 sm:w-auto"
                >
                  <Phone className="size-5" />
                  {t.contact.callNow}
                </a>
                <a
                  href={`https://maps.google.com/?q=${encodeURIComponent(clinicData.address)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-accent/20 bg-bg-dark px-6 py-4 text-base font-semibold text-bg-inverse transition-colors hover:bg-accent/10 sm:w-auto"
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
          <div className="h-[380px] overflow-hidden rounded-[40px] border-2 border-accent/20 shadow-2xl md:h-[460px] lg:h-[480px]">
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

              <Marker position={CENTER} icon={toothMarkerIcon}>
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
    </section>
  );
};
