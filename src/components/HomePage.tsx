import React, { useState } from 'react';
import { Search, MapPin, ArrowRight, Compass } from 'lucide-react';
import { TravelPreference } from '../types';

interface HomePageProps {
  onSearch: (name: string, preferences?: TravelPreference) => void;
  loading: boolean;
  loadingDestinationName: string;
  error: string | null;
}

const FEATURED_DESTINATIONS = [
  {
    name: 'Varanasi',
    region: 'Uttar Pradesh',
    emoji: '🕯️',
    tagline: 'The eternal city on the sacred Ganga — where life meets moksha',
    category: 'Spiritual',
    color: 'from-red-950 to-orange-900',
    badge: 'badge-spiritual',
  },
  {
    name: 'Jaipur',
    region: 'Rajasthan',
    emoji: '🏰',
    tagline: 'The Pink City of royal palaces, bustling bazaars & Rajput grandeur',
    category: 'Heritage',
    color: 'from-amber-900 to-orange-800',
    badge: 'badge-heritage',
  },
  {
    name: 'Kerala Backwaters',
    region: 'Kerala',
    emoji: '🌴',
    tagline: 'Emerald canals threading through coconut groves & spice-laden air',
    category: 'Nature',
    color: 'from-teal-900 to-emerald-900',
    badge: 'badge-nature',
  },
  {
    name: 'Hampi',
    region: 'Karnataka',
    emoji: '🪨',
    tagline: 'Ruins of the mighty Vijayanagara empire amid surreal boulder landscapes',
    category: 'Heritage',
    color: 'from-stone-900 to-amber-950',
    badge: 'badge-heritage',
  },
  {
    name: 'Darjeeling',
    region: 'West Bengal',
    emoji: '🍵',
    tagline: 'Queen of Hills — Himalayan vistas, colonial charm & first-flush teas',
    category: 'Scenic',
    color: 'from-slate-800 to-teal-950',
    badge: 'badge-nature',
  },
  {
    name: 'Udaipur',
    region: 'Rajasthan',
    emoji: '🏛️',
    tagline: 'City of Lakes — floating palaces, romantic sunsets & royal Mewar culture',
    category: 'Heritage',
    color: 'from-blue-950 to-indigo-900',
    badge: 'badge-heritage',
  },
  {
    name: 'Mysore',
    region: 'Karnataka',
    emoji: '🎪',
    tagline: 'City of Dasara, sandalwood, Carnatic music & Wadiyar royal splendour',
    category: 'Cultural',
    color: 'from-purple-950 to-red-950',
    badge: 'badge-cultural',
  },
  {
    name: 'Pondicherry',
    region: 'Tamil Nadu',
    emoji: '🌺',
    tagline: 'French colonial boulevards meet Tamil soul — yoga, cafés & the Bay of Bengal',
    category: 'Coastal',
    color: 'from-cyan-950 to-blue-950',
    badge: 'badge-coastal',
  },
  {
    name: 'Ladakh',
    region: 'Jammu & Kashmir',
    emoji: '🏔️',
    tagline: 'Roof of the world — ancient monasteries, glacier lakes & Buddhist serenity',
    category: 'Adventure',
    color: 'from-sky-950 to-slate-950',
    badge: 'badge-adventure',
  },
  {
    name: 'Khajuraho',
    region: 'Madhya Pradesh',
    emoji: '🏛️',
    tagline: 'UNESCO-listed medieval temple art — Chandela dynasty & timeless stone poetry',
    category: 'Heritage',
    color: 'from-orange-950 to-red-950',
    badge: 'badge-heritage',
  },
];

const HOW_IT_WORKS = [
  { step: '01', icon: '🔍', title: 'Choose a Destination', desc: 'Search any Indian city, region, or landmark. From Varanasi to Vizag, every place has a story.' },
  { step: '02', icon: '📜', title: 'Unlock Its Culture', desc: 'Receive an immersive guide — authentic proverbs, hidden gems, festivals, local wisdom, and folklore.' },
  { step: '03', icon: '🗺️', title: 'Explore Deeply', desc: 'Discover attractions, read sensory travel narratives, take cultural trivia, and consult your guide.' },
];

export default function HomePage({ onSearch, loading, loadingDestinationName, error }: HomePageProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearchSubmit = () => {
    if (searchQuery.trim()) {
      onSearch(searchQuery.trim());
    }
  };

  return (
    <div className="min-h-screen">
      {/* ── Top ornamental border ── */}
      <div className="india-border-strip" />

      {/* ── Navigation ── */}
      <nav className="india-nav sticky top-0 z-50" role="navigation" aria-label="Main navigation">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #E8841A, #C9960C)' }}>
              <Compass size={18} className="text-white" />
            </div>
            <div>
              <div className="font-devanagari text-sm font-semibold text-amber-400 leading-none">भारत दर्शन</div>
              <div className="text-[11px] tracking-widest text-amber-200/60 uppercase font-body leading-none mt-0.5">
                Bharat Darshan
              </div>
            </div>
          </div>
          <div className="text-xs font-body text-amber-300/50 tracking-wide">
            Cultural Discovery Platform
          </div>
        </div>
      </nav>

      {/* ── Hero Section ── */}
      <section className="hero-bg relative overflow-hidden" style={{ minHeight: '92vh' }} aria-label="Hero — Search for an Indian destination">
        {/* Decorative mandala SVG */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none opacity-10">
          <svg viewBox="0 0 500 500" className="w-[600px] h-[600px] animate-spin-slow" style={{ animationDuration: '60s' }}>
            {[1,2,3,4,5,6,7,8].map((i) => (
              <g key={i} transform={`rotate(${i * 45} 250 250)`}>
                <ellipse cx="250" cy="100" rx="18" ry="50" fill="none" stroke="#C9960C" strokeWidth="1" opacity="0.8" />
                <ellipse cx="250" cy="400" rx="18" ry="50" fill="none" stroke="#E8841A" strokeWidth="1" opacity="0.8" />
              </g>
            ))}
            {[50, 90, 130, 170, 210].map((r) => (
              <circle key={r} cx="250" cy="250" r={r} fill="none" stroke="#C9960C" strokeWidth="0.5" opacity={0.6 - r/500} />
            ))}
            {[1,2,3,4,5,6,7,8,9,10,11,12].map((i) => (
              <line key={i}
                x1="250" y1="40" x2="250" y2="460"
                stroke="#E8841A" strokeWidth="0.4"
                transform={`rotate(${i * 30} 250 250)`} opacity="0.5"
              />
            ))}
          </svg>
        </div>

        {/* Floating decorative elements */}
        <div className="absolute top-16 left-8 text-4xl opacity-20 animate-float" style={{ animationDelay: '0s' }}>🪷</div>
        <div className="absolute top-32 right-12 text-3xl opacity-15 animate-float" style={{ animationDelay: '1.5s' }}>🕌</div>
        <div className="absolute bottom-24 left-16 text-3xl opacity-15 animate-float" style={{ animationDelay: '0.8s' }}>🎋</div>
        <div className="absolute bottom-16 right-8 text-4xl opacity-20 animate-float" style={{ animationDelay: '2s' }}>🪔</div>

        {/* Hero content */}
        <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-6 text-center" style={{ paddingTop: '80px', paddingBottom: '80px' }}>
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-5 py-1.5 rounded-full mb-6 text-xs font-semibold font-body tracking-widest uppercase"
            style={{ background: 'rgba(232,132,26,0.12)', border: '1px solid rgba(232,132,26,0.35)', color: '#e6b020', letterSpacing: '0.12em' }}>
            Incredible India · Cultural Atlas
          </div>

          {/* Title */}
          <h1 className="font-display text-white mb-4" style={{ fontSize: 'clamp(2.5rem, 8vw, 6rem)', lineHeight: 1.1 }}>
            Discover the Soul of
          </h1>
          <h2 className="font-display font-bold italic mb-3"
            style={{ fontSize: 'clamp(3rem, 10vw, 8rem)', lineHeight: 1, color: '#f5a543', textShadow: '0 0 60px rgba(245,165,67,0.4)' }}>
            Bharat
          </h2>

          {/* Devanagari subtitle */}
          <p className="font-devanagari text-amber-200/80 text-lg md:text-2xl mb-4 tracking-wide">
            अतुल्य भारत की सांस्कृतिक यात्रा पर निकलें
          </p>

          {/* English subtitle */}
          <p className="text-amber-100/60 text-sm md:text-base max-w-xl mb-10 font-body leading-relaxed">
            Explore hidden temples, ancient proverbs, authentic festivals & untold stories<br className="hidden md:block" />
            of India's timeless culture — powered by AI.
          </p>

          {/* Search bar */}
          <div className="w-full max-w-2xl">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-amber-400/70" aria-hidden="true" />
                <input
                  id="home-search-input"
                  type="search"
                  placeholder="Search any Indian city or region... (e.g., Varanasi, Coorg)"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearchSubmit()}
                  className="india-search w-full pl-12 pr-5 py-4 text-sm"
                  disabled={loading}
                  aria-label="Search for an Indian destination"
                  aria-describedby="search-hint"
                  aria-busy={loading}
                  autoComplete="off"
                />
              </div>
              <button
                id="home-search-btn"
                onClick={handleSearchSubmit}
                disabled={loading || !searchQuery.trim()}
                className="btn-saffron px-8 py-4 rounded-full text-sm font-semibold flex items-center justify-center gap-2 shrink-0"
                aria-label={loading ? 'Searching...' : 'Search for destination'}
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Exploring...
                  </>
                ) : (
                  <>
                    <MapPin size={16} />
                    Explore
                  </>
                )}
              </button>
            </div>

            {/* Loading indicator */}
            {loading && loadingDestinationName && (
              <div
                id="search-hint"
                className="mt-4 text-amber-300/70 text-sm font-body animate-fade-in"
                role="status"
                aria-live="polite"
              >
                Preparing your guide to <span className="font-semibold text-amber-300">{loadingDestinationName}</span> — this takes a moment
              </div>
            )}

            {/* Error */}
            {error && (
              <div
                className="mt-4 px-4 py-3 rounded-xl text-sm font-body animate-fade-in"
                style={{ background: 'rgba(155,28,28,0.3)', border: '1px solid rgba(155,28,28,0.5)', color: '#fca5a5' }}
                role="alert"
                aria-live="assertive"
              >  ⚠️ {error}
              </div>
            )}
          </div>

          {/* Scroll hint */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-amber-400/40 text-xs font-body flex flex-col items-center gap-1.5 animate-float">
            <span>Browse destinations below</span>
            <div className="w-px h-6" style={{ background: 'linear-gradient(to bottom, rgba(232,132,26,0.4), transparent)' }} />
          </div>
        </div>
      </section>

      {/* ── Full-page loading overlay ── */}
      {loading && (
        <div
          className="fixed inset-0 z-50 flex flex-col items-center justify-center modal-overlay"
          role="dialog"
          aria-modal="true"
          aria-label="Loading cultural atlas"
          aria-live="polite"
        >
          <div className="text-center p-8 rounded-2xl animate-bloom"
            style={{ background: 'var(--parchment)', border: '1px solid rgba(201,150,12,0.3)', maxWidth: '380px' }}>
            {/* Spinning mandala */}
            <div className="relative mx-auto mb-6" style={{ width: 80, height: 80 }}>
              <div className="mandala-spinner absolute inset-0" />
              <div className="absolute inset-0 flex items-center justify-center text-3xl">🪷</div>
            </div>
            <h3 className="font-display text-xl font-bold mb-2" style={{ color: 'var(--text-dark)' }}>
              Preparing Your Guide
            </h3>
            <p className="text-sm font-body mb-1" style={{ color: 'var(--text-medium)' }}>
              Building the cultural atlas for
            </p>
            <p className="font-display font-bold italic text-xl" style={{ color: 'var(--saffron)' }}>
              {loadingDestinationName}
            </p>
            <p className="text-xs mt-3 font-body" style={{ color: 'var(--text-muted)' }}>
              Curating proverbs, hidden gems, local experiences & folklore — this takes a moment.
            </p>
          </div>
        </div>
      )}

      {/* ── How It Works ── */}
      <section className="py-16 px-6" style={{ background: 'var(--ivory)', borderTop: '1px solid rgba(201,150,12,0.15)' }} aria-label="How it works">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <div className="lotus-divider mb-4">
              <span className="font-devanagari text-sm font-semibold px-4" style={{ color: 'var(--saffron)' }}>
                कैसे काम करता है
              </span>
            </div>
            <h2 className="font-display text-3xl font-bold" style={{ color: 'var(--text-dark)' }}>How It Works</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {HOW_IT_WORKS.map((item) => (
              <div key={item.step} className="text-center">
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-4"
                  style={{ background: 'linear-gradient(135deg, rgba(232,132,26,0.12), rgba(201,150,12,0.12))', border: '1px solid rgba(201,150,12,0.2)' }}>
                  {item.icon}
                </div>
                <div className="text-xs font-mono font-bold mb-2 tracking-widest" style={{ color: 'var(--saffron)' }}>
                  STEP {item.step}
                </div>
                <h3 className="font-display text-lg font-bold mb-2" style={{ color: 'var(--text-dark)' }}>{item.title}</h3>
                <p className="text-sm font-body leading-relaxed" style={{ color: 'var(--text-muted)' }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Featured Destinations ── */}
      <section className="py-16 px-6 parchment-bg" style={{ borderTop: '1px solid rgba(201,150,12,0.12)' }} aria-label="Featured destinations">
        <div className="max-w-7xl mx-auto">
          {/* Section header */}
          <div className="text-center mb-12">
            <div className="lotus-divider mb-4">
              <span className="font-devanagari text-sm font-semibold px-4" style={{ color: 'var(--saffron)' }}>
                प्रमुख गंतव्य
              </span>
            </div>
            <h2 className="font-display text-4xl font-bold mb-3" style={{ color: 'var(--text-dark)' }}>
              Featured Destinations
            </h2>
            <p className="text-sm font-body max-w-xl mx-auto" style={{ color: 'var(--text-muted)' }}>
              Select any destination to receive a complete cultural atlas — authentic proverbs, hidden gems, local experiences, festivals, and oral histories.
            </p>
          </div>

          {/* Destination cards grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {FEATURED_DESTINATIONS.map((dest, idx) => (
              <button
                key={dest.name}
                id={`dest-card-${dest.name.toLowerCase().replace(/\s+/g, '-')}`}
                onClick={() => onSearch(dest.name)}
                disabled={loading}
                className={`dest-card text-left animate-slide-up stagger-${Math.min(idx + 1, 5)}`}
                style={{ opacity: 0, animationFillMode: 'forwards', animationDelay: `${idx * 0.05}s` }}
                aria-label={`Explore ${dest.name}, ${dest.region} — ${dest.category} destination`}
                aria-disabled={loading}
              >
                {/* Card gradient header */}
                <div className={`bg-gradient-to-br ${dest.color} p-6 text-center relative overflow-hidden`} style={{ minHeight: '130px' }}>
                  {/* Pattern overlay */}
                  <div className="absolute inset-0 opacity-10"
                    style={{
                      backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255,255,255,0.1) 10px, rgba(255,255,255,0.1) 11px)',
                    }} />
                  <div className="text-5xl mb-2 relative z-10">{dest.emoji}</div>
                  <div className={`inline-block text-[10px] font-semibold font-body uppercase tracking-wider px-2.5 py-0.5 rounded-full relative z-10 ${dest.badge}`}
                    style={{ fontSize: '10px' }}>
                    {dest.category}
                  </div>
                </div>

                {/* Card body */}
                <div className="p-4">
                  <h3 className="font-display text-lg font-bold mb-0.5" style={{ color: 'var(--text-dark)' }}>{dest.name}</h3>
                  <div className="flex items-center gap-1 mb-2">
                    <MapPin size={10} style={{ color: 'var(--saffron)' }} />
                    <span className="text-xs font-body" style={{ color: 'var(--text-muted)' }}>{dest.region}</span>
                  </div>
                  <p className="text-xs font-body leading-relaxed mb-3" style={{ color: 'var(--text-medium)' }}>
                    {dest.tagline}
                  </p>
                  <div className="flex items-center gap-1 text-xs font-semibold font-body" style={{ color: 'var(--saffron)' }}>
                    <span>Explore Culture</span>
                    <ArrowRight size={12} />
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer style={{ background: 'linear-gradient(90deg, #1a0505 0%, #2d0c08 50%, #0a1f26 100%)', borderTop: '1px solid rgba(201,150,12,0.2)' }}>
        <div className="india-border-strip" style={{ opacity: 0.7 }} />
        <div className="max-w-7xl mx-auto px-6 py-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-center md:text-left">
            <div className="font-devanagari text-amber-400 font-semibold text-lg">भारत दर्शन</div>
            <div className="text-amber-200/40 text-xs font-body mt-1">India's Cultural Discovery Platform</div>
          </div>
          <div className="text-amber-300/40 text-xs font-body tracking-wide">
            Every story, every proverb, every gem — curated for the curious traveller.
          </div>
        </div>
      </footer>
    </div>
  );
}
