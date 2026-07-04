import React, { useState, useCallback } from 'react';
import { Search, MapPin, AlertCircle, Compass, Mountain, Landmark, Trees, Camera } from 'lucide-react';
import { motion } from 'motion/react';
import { TravelPreference } from '../types';

// Import local assets
import indiaBg from '../assets/india_bg_v3.png';
import spicesImg from '../assets/spices.jpg';
import tajImg from '../assets/taj.jpg';
import rickshawImg from '../assets/rickshaw.jpg';
import varanasiImg from '../assets/varanasi.jpg';
import jaipurImg from '../assets/jaipur.jpg';
import munnarImg from '../assets/munnar.jpg';
import ladakhImg from '../assets/ladakh.jpg';

/**
 * Props for the HomePage component
 */
interface HomePageProps {
  /** Callback fired when a search is submitted */
  onSearch: (destination: string) => void;
  /** Whether a search is currently in progress */
  loading: boolean;
  /** Any error message to display */
  error: string | null;
}

const FEATURED = [
  { 
    name: 'Varanasi', region: 'Uttar Pradesh', category: 'Spiritual', 
    image: varanasiImg,
    icon: <Landmark className="w-6 h-6" /> 
  },
  { 
    name: 'Jaipur', region: 'Rajasthan', category: 'Heritage', 
    image: jaipurImg,
    icon: <Camera className="w-6 h-6" /> 
  },
  { 
    name: 'Munnar', region: 'Kerala', category: 'Nature', 
    image: munnarImg,
    icon: <Trees className="w-6 h-6" /> 
  },
  { 
    name: 'Ladakh', region: 'Jammu & Kashmir', category: 'Adventure', 
    image: ladakhImg,
    icon: <Mountain className="w-6 h-6" /> 
  },
];

/**
 * HomePage Component
 * Displays the landing page with a search bar and featured destinations.
 * Wrapped in React.memo for performance optimization.
 * 
 * @param {HomePageProps} props - Component props
 * @returns {JSX.Element} The rendered home page
 */
const HomePage: React.FC<HomePageProps> = React.memo(({ onSearch, loading, error }) => {
  const [searchQuery, setSearchQuery] = useState('');

  /**
   * Handles the search form submission.
   */
  const handleSearchSubmit = useCallback(() => {
    if (searchQuery.trim() && !loading) {
      onSearch(searchQuery.trim());
    }
  }, [searchQuery, loading, onSearch]);

  return (
    <div className="relative min-h-screen text-stone-900">
      {/* ── Fixed Maximalist Background ── */}
      <div 
        className="bg-maximalist fixed inset-0 -z-10 bg-cover bg-center" 
        style={{ backgroundImage: `url(${indiaBg})` }}
      />

      {/* ── Navigation ── */}
      <nav className="relative z-20 flex justify-between items-center p-4 max-w-7xl mx-auto">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full flex items-center justify-center bg-gradient-to-br from-saffron to-crimson shadow-lg">
            <Compass size={20} className="text-white" />
          </div>
          <span className="font-logo font-bold text-2xl tracking-wide text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
            Bharat Darshan
          </span>
        </div>
        
        <div className="hidden sm:flex items-center gap-6 text-sm font-body font-medium">
          <span className="text-white font-bold drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">Cultural Discovery Platform</span>
        </div>
      </nav>

      <main className="relative z-10 flex flex-col items-center justify-center pt-24 pb-16 px-4 min-h-[85vh] text-center overflow-hidden">
        
        {/* Decorative Floating Images (Collage) using local assets */}
        <motion.img 
          src={spicesImg} 
          alt="Indian Spices" 
          loading="lazy"
          className="collage-img hidden lg:block w-48 h-64 -left-12 top-20 fixed object-cover"
          initial={{ opacity: 0, y: 50, rotate: -15 }}
          animate={{ opacity: 0.85, y: 0, rotate: -8 }}
          transition={{ duration: 1, delay: 0.2 }}
        />
        <motion.img 
          src={tajImg} 
          alt="Taj Mahal" 
          loading="lazy"
          className="collage-img hidden lg:block w-56 h-40 right-10 top-32 fixed object-cover"
          initial={{ opacity: 0, x: 50, rotate: 10 }}
          animate={{ opacity: 0.85, x: 0, rotate: 6 }}
          transition={{ duration: 1, delay: 0.4 }}
        />
        <motion.img 
          src={rickshawImg} 
          alt="Auto Rickshaw" 
          loading="lazy"
          className="collage-img hidden md:block w-40 h-40 left-20 bottom-32 fixed rounded-full border-saffron object-cover"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 0.85, scale: 1, rotate: -12 }}
          transition={{ duration: 1, delay: 0.6 }}
        />

        <div className="relative w-full max-w-4xl mx-auto z-20">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="max-w-4xl mx-auto"
          >
            <h1 className="font-display text-4xl sm:text-6xl text-white mb-2 drop-shadow-[0_4px_8px_rgba(0,0,0,0.8)] font-bold leading-tight">
              Discover the Soul of
            </h1>
            <h2 className="font-display font-bold italic text-6xl sm:text-8xl mb-4 text-saffron drop-shadow-[0_4px_12px_rgba(0,0,0,0.9)] leading-tight">
              Bharat
            </h2>
            <p className="font-devanagari text-white font-medium text-lg sm:text-2xl mb-6 tracking-wide drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">
              अतुल्य भारत की सांस्कृतिक यात्रा पर निकलें
            </p>
            
            <p className="font-body text-lg sm:text-xl text-white/90 mb-12 max-w-2xl mx-auto text-shadow-hero">
              Every story, every proverb, every gem — curated for the curious traveller.
            </p>

            {/* Search Box (Glassmorphic) */}
            <div className="glass-panel-dark p-2 rounded-full mx-auto w-full max-w-2xl shadow-2xl relative overflow-visible">
              <div className="flex flex-col sm:flex-row gap-2 relative z-10">
                <div className="relative flex-1">
                  <Search size={20} className="absolute left-6 top-1/2 -translate-y-1/2 text-white/50" aria-hidden="true" />
                  <input
                    id="home-search-input"
                    type="search"
                    placeholder="Search any Indian city... (e.g., Varanasi, Coorg)"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSearchSubmit()}
                    className="glass-input w-full pl-14 pr-6 py-4 text-base bg-transparent border-none outline-none text-white placeholder-white/50"
                    disabled={loading}
                    aria-label="Search for an Indian destination"
                    autoComplete="off"
                  />
                </div>
                <button
                  id="home-search-btn"
                  onClick={handleSearchSubmit}
                  disabled={loading || !searchQuery.trim()}
                  className="btn-saffron px-10 py-4 rounded-full text-base font-bold flex items-center justify-center gap-2 shrink-0 transition-transform hover:scale-105"
                  aria-label={loading ? 'Searching...' : 'Search for destination'}
                >
                  <span>Explore</span>
                  <MapPin size={18} />
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="mt-6 px-6 py-4 rounded-xl text-sm font-medium glass-panel-dark border border-red-500/50 text-red-200 inline-flex items-center gap-2"
                role="alert"
                aria-live="assertive"
              >
                <AlertCircle size={18} className="text-red-400" />
                {error}
              </motion.div>
            )}
          </motion.div>
        </div>
      </main>

      {/* ── Featured Destinations (Arches) ── */}
      <section className="relative z-10 py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="font-display text-4xl text-white mb-2 text-shadow-hero">Inspiration Awaits</h2>
            <p className="font-body text-amber-200/80">Handpicked cultural gems across the subcontinent</p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {FEATURED.map((dest, i) => (
              <motion.button
                key={dest.name}
                onClick={() => onSearch(dest.name)}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="arch-card text-left group w-full h-96 flex flex-col justify-end p-6"
                style={{ 
                  backgroundImage: `linear-gradient(to top, rgba(10,2,0,0.95) 0%, rgba(20,5,2,0.4) 60%, transparent 100%), url(${dest.image})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center'
                }}
                aria-label={`Explore ${dest.name}`}
              >
                <div className="relative z-10 flex flex-col items-center w-full text-center">
                  <div className="w-12 h-12 rounded-full bg-saffron/20 backdrop-blur-md border border-saffron/50 flex items-center justify-center text-saffron-light mb-4 group-hover:scale-110 transition-transform">
                    {dest.icon}
                  </div>
                  <h3 className="font-display text-2xl text-white mb-1">{dest.name}</h3>
                  <p className="font-body text-sm text-amber-200/80 mb-2">{dest.region}</p>
                  <span className="inline-block px-3 py-1 rounded-full bg-white/10 text-xs text-white border border-white/20 backdrop-blur-sm">
                    {dest.category}
                  </span>
                </div>
              </motion.button>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
});

HomePage.displayName = 'HomePage';
export default HomePage;
