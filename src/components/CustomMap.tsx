import React from 'react';
import { MapPin, Compass, Globe } from 'lucide-react';
import { LocationCoordinates } from '../types';

interface CustomMapProps {
  coordinates?: LocationCoordinates;
  destinationName?: string;
  onSelectQuickRegion: (name: string) => void;
}

const PRESETS = [
  { name: 'Kyoto', country: 'Japan', lat: 35.0116, lng: 135.7681, desc: 'East Asian Heritage' },
  { name: 'Oaxaca', country: 'Mexico', lat: 17.0732, lng: -96.7266, desc: 'Mesoamerican Arts' },
  { name: 'Luxor', country: 'Egypt', lat: 25.6872, lng: 32.6396, desc: 'Ancient Nile Civilization' },
  { name: 'Marrakesh', country: 'Morocco', lat: 31.6295, lng: -7.9811, desc: 'North African Medina' },
  { name: 'Cusco', country: 'Peru', lat: -13.5319, lng: -71.9675, desc: 'Inca Trail & Culture' },
];

export default function CustomMap({ coordinates, destinationName, onSelectQuickRegion }: CustomMapProps) {
  // Normalize coordinates to SVG viewbox (800x400)
  // Mercator-like projection logic for mapping lat/lng to SVG
  const getXY = (lat: number, lng: number) => {
    // Lat range: 90 to -90 -> SVG Y range: 0 to 400
    // Lng range: -180 to 180 -> SVG X range: 0 to 800
    const x = ((lng + 180) * 800) / 360;
    const y = ((90 - lat) * 400) / 180;
    return { x, y };
  };

  const activePoint = coordinates ? getXY(coordinates.lat, coordinates.lng) : null;

  return (
    <div id="custom-map-container" className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm overflow-hidden relative">
      <div className="absolute top-0 right-0 p-4 opacity-[0.03] pointer-events-none text-slate-400">
        <Globe size={180} />
      </div>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4 relative z-10">
        <div>
          <h2 className="text-base font-bold font-sans text-slate-900 flex items-center gap-2 uppercase tracking-tight">
            <Compass className="text-blue-600" size={18} />
            Cultural Atlas Visualizer
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            {destinationName 
              ? `Currently centered on ${destinationName} (${coordinates?.lat.toFixed(4)}°, ${coordinates?.lng.toFixed(4)}°)` 
              : 'Select an iconic cultural center or search for your destination'}
          </p>
        </div>

        <div className="flex flex-wrap gap-1.5">
          {PRESETS.map((p) => (
            <button
              key={p.name}
              id={`preset-btn-${p.name.toLowerCase()}`}
              onClick={() => onSelectQuickRegion(p.name)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                destinationName?.toLowerCase() === p.name.toLowerCase()
                  ? 'bg-blue-50 text-blue-700 border border-blue-200 shadow-sm'
                  : 'bg-slate-50 text-slate-600 border border-slate-200 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              {p.name}
            </button>
          ))}
        </div>
      </div>

      {/* Stylized Vector World Map Grid */}
      <div className="relative bg-slate-950 rounded-xl border border-slate-800 h-56 md:h-72 flex items-center justify-center overflow-hidden">
        <svg viewBox="0 0 800 400" className="w-full h-full opacity-35 select-none pointer-events-none">
          {/* Latitude & Longitude Grid Lines */}
          <line x1="0" y1="100" x2="800" y2="100" stroke="#1e293b" strokeDasharray="3,3" />
          <line x1="0" y1="200" x2="800" y2="200" stroke="#334155" strokeDasharray="5,5" />
          <line x1="0" y1="300" x2="800" y2="300" stroke="#1e293b" strokeDasharray="3,3" />
          <line x1="200" y1="0" x2="200" y2="400" stroke="#1e293b" strokeDasharray="3,3" />
          <line x1="400" y1="0" x2="400" y2="400" stroke="#334155" strokeDasharray="5,5" />
          <line x1="600" y1="0" x2="600" y2="400" stroke="#1e293b" strokeDasharray="3,3" />

          {/* Abstract landmass representation to ground the cartography */}
          <path d="M 120 120 Q 180 80 220 130 T 280 200 T 200 300 Z" fill="#1e293b" opacity="0.4" />
          <path d="M 380 150 Q 450 100 520 120 T 600 200 T 500 280 Z" fill="#1e293b" opacity="0.4" />
          <path d="M 280 220 Q 320 180 340 240 T 300 320 Z" fill="#1e293b" opacity="0.3" />
          <path d="M 600 120 Q 650 90 700 150 T 720 220 Z" fill="#1e293b" opacity="0.3" />
          <path d="M 150 250 Q 160 280 180 320 T 140 350 Z" fill="#1e293b" opacity="0.2" />

          {/* Preset location static reference dots */}
          {PRESETS.map((p) => {
            const pos = getXY(p.lat, p.lng);
            return (
              <g key={`static-${p.name}`}>
                <circle cx={pos.x} cy={pos.y} r="3" fill="#475569" />
                <text x={pos.x + 6} y={pos.y + 3} fill="#475569" fontSize="9" fontFamily="monospace">{p.name}</text>
              </g>
            );
          })}
        </svg>

        {/* Dynamic active pinpoint overlay */}
        {activePoint && (
          <div
            className="absolute transition-all duration-1000 ease-out"
            style={{
              left: `${(activePoint.x / 800) * 100}%`,
              top: `${(activePoint.y / 400) * 100}%`,
              transform: 'translate(-50%, -50%)',
            }}
          >
            <div className="relative flex items-center justify-center">
              <span className="absolute inline-flex h-10 w-10 rounded-full bg-blue-400 opacity-20 animate-ping" />
              <span className="absolute inline-flex h-6 w-6 rounded-full bg-blue-500 opacity-40 animate-pulse" />
              <MapPin className="text-blue-400 relative z-10 filter drop-shadow-[0_2px_8px_rgba(59,130,246,0.5)]" size={28} />
              
              <div className="absolute top-8 left-1/2 -translate-x-1/2 bg-slate-900 border border-blue-500/30 text-white text-[10px] font-mono px-2 py-1 rounded shadow-xl whitespace-nowrap z-20">
                <span className="font-bold text-blue-300">{destinationName}</span>
                <span className="text-slate-400 block">{coordinates?.lat.toFixed(2)}N, {coordinates?.lng.toFixed(2)}E</span>
              </div>
            </div>
          </div>
        )}

        {!coordinates && (
          <div className="absolute text-center px-4 max-w-sm pointer-events-none">
            <p className="text-sm text-slate-400">Search for a destination above or select a preset to begin mapping cultural stories.</p>
          </div>
        )}
      </div>
    </div>
  );
}
