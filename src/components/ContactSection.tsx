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
            <h2 className="mb-12 text-section-title font-bold">{t.contact.title}</h2>

            <div className="flex flex-col gap-10">
              <div className="group flex items-start gap-6">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-accent/10 transition-colors group-hover:bg-accent">
                  <MapPin className="text-accent group-hover:text-bg-dark" />
                </div>
                <div>
                  <h3 className="text-nav mb-2 text-accent/60">Adresse</h3>
                  <p className="text-xl font-medium leading-relaxed">{clinicData.address}</p>
                </div>
              </div>

              <div className="group flex items-start gap-6">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-accent/10 transition-colors group-hover:bg-accent">
                  <Phone className="text-accent group-hover:text-bg-dark" />
                </div>
                <div>
                  <h3 className="text-nav mb-2 text-accent/60">Téléphone</h3>
                  <a
                    href={`tel:${clinicData.phone.replace(/\D/g, '')}`}
                    className="text-2xl font-mono transition-colors hover:text-accent md:text-3xl"
                  >
                    {clinicData.phone}
                  </a>
                </div>
              </div>

              <div className="group flex items-start gap-6">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-accent/10 transition-colors group-hover:bg-accent">
                  <Mail className="text-accent group-hover:text-bg-dark" />
                </div>
                <div>
                  <h3 className="text-nav mb-2 text-accent/60">Courriel</h3>
                  <a
                    href={`mailto:${clinicData.email}`}
                    className="text-xl font-medium transition-colors hover:text-accent"
                  >
                    {clinicData.email}
                  </a>
                </div>
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
