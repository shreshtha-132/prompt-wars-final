import React, { useState } from 'react';
import { ArrowLeft, MapPin, Sparkles, Search, Compass, BookOpen } from 'lucide-react';
import { motion } from 'motion/react';
import { DestinationData, TravelPreference } from '../types';
import indiaBg from '../assets/india_bg_v2.png';
import DiscoveryDeck from './DiscoveryDeck';
import ExperienceLog from './ExperienceLog';
import CulturalTrivia from './CulturalTrivia';
import CulturalAdvisor from './CulturalAdvisor';
import StoryNarrative from './StoryNarrative';

interface DestinationPageProps {
  data: DestinationData;
  onBack: () => void;
  onSearch: (name: string, preferences?: TravelPreference) => void;
  loading: boolean;
}

type Tab = 'attractions' | 'gems' | 'experiences' | 'festivals' | 'trivia' | 'concierge';

const TABS: { id: Tab; label: string; emoji: string }[] = [
  { id: 'attractions', label: 'Attractions', emoji: '🏛️' },
  { id: 'gems', label: 'Hidden Gems', emoji: '💎' },
  { id: 'experiences', label: 'Experiences', emoji: '🎭' },
  { id: 'festivals', label: 'Festivals', emoji: '🎊' },
  { id: 'trivia', label: 'Trivia', emoji: '🧩' },
  { id: 'concierge', label: 'Concierge', emoji: '💬' },
];

export default function DestinationPage({ data, onBack, onSearch, loading }: DestinationPageProps) {
  const [activeTab, setActiveTab] = useState<Tab>('attractions');
  const [selectedStory, setSelectedStory] = useState<{ spotName: string; spotDescription: string } | null>(null);
  const [savedAttractionIds, setSavedAttractionIds] = useState<string[]>([]);
  const [savedGemIds, setSavedGemIds] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  const handleToggleSaveAttraction = (id: string) => {
    setSavedAttractionIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };
  const handleToggleSaveGem = (id: string) => {
    setSavedGemIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const handleNewSearch = () => {
    if (searchQuery.trim()) onSearch(searchQuery.trim());
  };

  const [bgImage, setBgImage] = useState<string>(indiaBg);

  React.useEffect(() => {
    let active = true;
    const fetchWikiImage = async () => {
      // 1. Check curated stunning images for popular cities
      const name = data.name.toLowerCase();
      if (name.includes('varanasi')) return setBgImage('https://images.unsplash.com/photo-1561361513-2d000a50f0dc?q=80&w=2070&auto=format&fit=crop');
      if (name.includes('jaipur')) return setBgImage('https://images.unsplash.com/photo-1477587458883-47145ed94245?q=80&w=2070&auto=format&fit=crop');
      if (name.includes('kerala')) return setBgImage('https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?q=80&w=2070&auto=format&fit=crop');
      if (name.includes('ladakh')) return setBgImage('https://images.unsplash.com/photo-1623910271000-47b198889989?q=80&w=2070&auto=format&fit=crop');
      if (name.includes('hampi')) return setBgImage('https://images.unsplash.com/photo-1620766165457-a80fe5921709?q=80&w=2070&auto=format&fit=crop');
      if (name.includes('agra') || name.includes('taj')) return setBgImage('https://images.unsplash.com/photo-1564507592224-2004d0af21f0?q=80&w=2070&auto=format&fit=crop');
      if (name.includes('udaipur')) return setBgImage('https://images.unsplash.com/photo-1615836245337-f5b9b2306c59?q=80&w=2070&auto=format&fit=crop');
      
      // 2. Fetch original high-res image from Wikipedia!
      try {
        const res = await fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(data.name)}`);
        if (res.ok) {
          const wikiData = await res.json();
          if (active && wikiData.originalimage && wikiData.originalimage.source) {
            setBgImage(wikiData.originalimage.source);
            return;
          }
        }
      } catch (err) {
        console.error('Failed to fetch wiki image:', err);
      }
      
      // 3. Fallback to maximalist background
      if (active) setBgImage(indiaBg);
    };

    setBgImage(indiaBg); // Reset while loading new one
    fetchWikiImage();
    
    return () => { active = false; };
  }, [data.name]);

  return (
    <div className="relative min-h-screen text-white">
      {/* ── Dynamic Background ── */}
      <div 
        className="bg-maximalist fixed inset-0 -z-10 animate-fade-in" 
        style={{ backgroundImage: `url('${bgImage}')` }}
      />

      {/* ── Navigation bar ── */}
      <nav className="relative z-20 flex justify-between items-center p-4 max-w-7xl mx-auto" role="navigation" aria-label="Destination navigation">
        <div className="flex items-center gap-4 w-full">
          {/* Back button + logo */}
          <div className="flex items-center gap-4">
            <button
              id="back-to-home-btn"
              onClick={onBack}
              className="flex items-center gap-2 text-white/80 hover:text-white transition-colors text-sm font-body font-medium"
              aria-label="Back to Bharat Darshan home"
            >
              <ArrowLeft size={16} />
              <span className="hidden sm:block">Bharat Darshan</span>
            </button>
            <div className="w-px h-5" style={{ background: 'rgba(201,150,12,0.3)' }} />
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full flex items-center justify-center"
                style={{ background: 'linear-gradient(135deg, #E8841A, #C9960C)' }}>
                <Compass size={14} className="text-white" />
              </div>
              <span className="font-devanagari text-sm text-amber-400">भारत दर्शन</span>
            </div>
          </div>

          {/* Search box (Glass) */}
          <div className="flex-1 max-w-sm hidden sm:block">
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/50" />
                <input
                  id="dest-search-input"
                  type="search"
                  placeholder="Search another place..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleNewSearch()}
                  className="glass-input w-full pl-9 pr-3 py-2 text-xs bg-transparent border-none outline-none text-white placeholder-white/50"
                  disabled={loading}
                  aria-label="Search for another destination"
                  autoComplete="off"
                />
              </div>
              <button
                id="dest-search-btn"
                onClick={handleNewSearch}
                disabled={loading || !searchQuery.trim()}
                className="btn-saffron px-3 py-2 rounded-full text-xs font-semibold"
                aria-label="Search"
              >
                {loading ? '...' : 'Go'}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* ── Hero Banner (Glass) ── */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-5xl mx-auto px-4 sm:px-6 pt-12 pb-8"
      >
        <div className="glass-panel-dark p-8 md:p-12 relative overflow-hidden flex flex-col md:flex-row items-center gap-8 shadow-2xl">
          <div className="flex-1 text-center md:text-left z-10 relative">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-4 text-xs font-semibold tracking-widest text-saffron-light bg-black/30 border border-saffron-light/20">
              <MapPin size={12} /> {data.country}
            </div>
            <h1 className="font-display text-5xl md:text-6xl font-black text-white mb-4 drop-shadow-lg">
              {data.name}
            </h1>
            <p className="font-body text-base md:text-lg text-white/90 leading-relaxed drop-shadow-md">
              {data.summary}
            </p>
          </div>
          
          {data.localProverb && (
            <div className="w-full md:w-80 shrink-0 z-10 relative">
              <div className="glass-card p-6 rounded-2xl relative text-center border-saffron-light/30">
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-saffron text-white w-8 h-8 rounded-full flex items-center justify-center shadow-lg">
                  <BookOpen size={16} />
                </div>
                <div className="font-devanagari text-xl text-saffron-light mb-3 mt-2 font-bold drop-shadow-sm">
                  "{data.localProverb.text}"
                </div>
                <div className="font-body font-bold text-sm text-white mb-2">
                  "{data.localProverb.translation}"
                </div>
                <div className="font-body text-xs text-white/70 italic">
                  {data.localProverb.meaning}
                </div>
              </div>
            </div>
          )}
        </div>
      </motion.div>

      {/* ── Tab Navigation ── */}
      <div className="sticky z-40 px-6 py-4 mx-4" style={{ top: '80px' }}>
        <div className="max-w-5xl mx-auto">
          <div className="glass-panel p-2 flex overflow-x-auto custom-scroll" role="tablist" aria-label="Destination sections" style={{ background: 'rgba(15, 6, 2, 0.6)' }}>
            {TABS.map((tab) => (
              <button
                key={tab.id}
                id={`tab-${tab.id}`}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 py-3 px-4 text-sm font-bold font-body whitespace-nowrap transition-all rounded-xl ${
                  activeTab === tab.id 
                    ? 'bg-gradient-to-r from-saffron to-crimson text-white shadow-lg' 
                    : 'text-white/70 hover:text-white hover:bg-white/10'
                }`}
                role="tab"
                aria-selected={activeTab === tab.id}
                aria-controls={`tab-panel-${tab.id}`}
              >
                {tab.emoji} <span className="ml-2">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Tab Content ── */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-10 space-y-8" role="main" id="main-content">

        {activeTab === 'attractions' && (
          <section id="tab-panel-attractions" className="animate-fade-in">
            <div className="mb-8">
              <div className="lotus-divider mb-3">
                <span className="text-xs font-body font-semibold px-4" style={{ color: 'var(--saffron)' }}>
                  अन्वेषण करें
                </span>
              </div>
              <h2 className="section-title font-display text-2xl font-bold">
                Curated Attractions
              </h2>
              <p className="text-sm font-body mt-2" style={{ color: 'var(--text-muted)' }}>
                Handpicked cultural landmarks, temples, palaces, and natural wonders
              </p>
            </div>
            <DiscoveryDeck
              attractions={data.attractions}
              hiddenGems={[]}
              savedAttractionIds={savedAttractionIds}
              savedGemIds={[]}
              onToggleSaveAttraction={handleToggleSaveAttraction}
              onToggleSaveGem={handleToggleSaveGem}
              onSelectStorySpot={(spotName, spotDescription) => setSelectedStory({ spotName, spotDescription })}
              showGems={false}
            />
          </section>
        )}

        {activeTab === 'gems' && (
          <section id="tab-panel-gems" className="animate-fade-in">
            <div className="mb-8">
              <div className="lotus-divider mb-3">
                <span className="text-xs font-body font-semibold px-4" style={{ color: 'var(--saffron)' }}>
                  छुपे हुए खजाने
                </span>
              </div>
              <h2 className="section-title font-display text-2xl font-bold">
                Hidden Gems
              </h2>
              <p className="text-sm font-body mt-2" style={{ color: 'var(--text-muted)' }}>
                Off-the-beaten-path treasures with local legends and folklore
              </p>
            </div>
            <DiscoveryDeck
              attractions={[]}
              hiddenGems={data.hiddenGems}
              savedAttractionIds={[]}
              savedGemIds={savedGemIds}
              onToggleSaveAttraction={handleToggleSaveAttraction}
              onToggleSaveGem={handleToggleSaveGem}
              onSelectStorySpot={(spotName, spotDescription) => setSelectedStory({ spotName, spotDescription })}
              showGems={true}
            />
          </section>
        )}

        {activeTab === 'experiences' && (
          <section id="tab-panel-experiences" className="animate-fade-in">
            <div className="mb-8">
              <div className="lotus-divider mb-3">
                <span className="text-xs font-body font-semibold px-4" style={{ color: 'var(--saffron)' }}>
                  स्थानीय अनुभव
                </span>
              </div>
              <h2 className="section-title font-display text-2xl font-bold">
                Local Experiences
              </h2>
              <p className="text-sm font-body mt-2" style={{ color: 'var(--text-muted)' }}>
                Hands-on artisanship, culinary workshops, and community connections
              </p>
            </div>
            <ExperienceLog
              experiences={data.experiences}
              events={[]}
              showEvents={false}
            />
          </section>
        )}

        {activeTab === 'festivals' && (
          <section id="tab-panel-festivals" className="animate-fade-in">
            <div className="mb-8">
              <div className="lotus-divider mb-3">
                <span className="text-xs font-body font-semibold px-4" style={{ color: 'var(--saffron)' }}>
                  उत्सव और त्योहार
                </span>
              </div>
              <h2 className="section-title font-display text-2xl font-bold">
                Heritage Festivals
              </h2>
              <p className="text-sm font-body mt-2" style={{ color: 'var(--text-muted)' }}>
                Seasonal celebrations, rituals, and living cultural traditions
              </p>
            </div>
            <ExperienceLog
              experiences={[]}
              events={data.events}
              showEvents={true}
            />
          </section>
        )}

        {activeTab === 'trivia' && (
          <section id="tab-panel-trivia" className="animate-fade-in">
            <div className="mb-8">
              <div className="lotus-divider mb-3">
                <span className="text-xs font-body font-semibold px-4" style={{ color: 'var(--saffron)' }}>
                  सांस्कृतिक प्रश्नोत्तरी
                </span>
              </div>
              <h2 className="section-title font-display text-2xl font-bold">
                Cultural Trivia
              </h2>
              <p className="text-sm font-body mt-2" style={{ color: 'var(--text-muted)' }}>
                Test your knowledge of local customs, etiquette, and folklore
              </p>
            </div>
            <CulturalTrivia
              triviaQuestions={data.trivia}
              destinationName={data.name}
            />
          </section>
        )}

        {activeTab === 'concierge' && (
          <section id="tab-panel-concierge" className="animate-fade-in">
            <div className="mb-8">
              <div className="lotus-divider mb-3">
                <span className="text-xs font-body font-semibold px-4" style={{ color: 'var(--saffron)' }}>
                  आपका मार्गदर्शक
                </span>
              </div>
              <h2 className="section-title font-display text-2xl font-bold">
                Cultural Concierge
              </h2>
              <p className="text-sm font-body mt-2" style={{ color: 'var(--text-muted)' }}>
                Chat with your AI guide about local customs, phrases, and etiquette
              </p>
            </div>
            <CulturalAdvisor destination={data} />
          </section>
        )}
      </main>

      {/* ── Story Narrative Modal ── */}
      {selectedStory && (
        <div
          className="modal-overlay"
          onClick={() => setSelectedStory(null)}
          role="dialog"
          aria-modal="true"
          aria-label={`Cultural story for ${selectedStory.spotName}`}
        >
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <StoryNarrative
              spotName={selectedStory.spotName}
              spotDescription={selectedStory.spotDescription}
              destinationName={data.name}
              country={data.country}
              onClose={() => setSelectedStory(null)}
            />
          </div>
        </div>
      )}

      {/* ── Footer ── */}
      <footer style={{ background: 'linear-gradient(90deg, #1a0505 0%, #2d0c08 50%, #0a1f26 100%)', borderTop: '1px solid rgba(201,150,12,0.2)', marginTop: '4rem' }}>
        <div className="india-border-strip" style={{ opacity: 0.7 }} />
        <div className="max-w-7xl mx-auto px-6 py-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-center md:text-left">
            <div className="font-devanagari text-amber-400 font-semibold">भारत दर्शन</div>
            <div className="text-amber-300/40 text-xs font-body tracking-wide">
              Cultural Discovery Platform
            </div>
          </div>
          <div className="text-amber-300/40 text-xs font-body tracking-wide">
            Every story, every proverb, every gem — curated for the curious traveller.
          </div>
        </div>
      </footer>
    </div>
  );
}
