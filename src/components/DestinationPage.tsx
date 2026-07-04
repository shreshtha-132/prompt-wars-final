import React, { useState } from 'react';
import { ArrowLeft, MapPin, Sparkles, Search, Compass } from 'lucide-react';
import { DestinationData, TravelPreference } from '../types';
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

  return (
    <div className="min-h-screen parchment-bg">
      {/* ── Top ornamental border ── */}
      <div className="india-border-strip" />

      {/* ── Navigation bar ── */}
      <nav className="india-nav sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
          {/* Back button + logo */}
          <div className="flex items-center gap-4">
            <button
              id="back-to-home-btn"
              onClick={onBack}
              className="flex items-center gap-2 text-amber-300/80 hover:text-amber-300 transition-colors text-sm font-body font-medium"
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

          {/* Inline search */}
          <div className="flex items-center gap-2 flex-1 max-w-sm">
            <div className="relative flex-1">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-amber-400/60" />
              <input
                id="dest-search-input"
                type="text"
                placeholder="Search another place..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleNewSearch()}
                className="india-search w-full pl-9 pr-3 py-2 text-xs"
                disabled={loading}
              />
            </div>
            <button
              id="dest-search-btn"
              onClick={handleNewSearch}
              disabled={loading || !searchQuery.trim()}
              className="btn-saffron px-3 py-2 rounded-full text-xs font-semibold"
            >
              {loading ? '...' : 'Go'}
            </button>
          </div>
        </div>
      </nav>

      {/* ── Destination Hero Banner ── */}
      <section className="hero-bg relative overflow-hidden py-16 px-6">
        {/* Decorative ring */}
        <div className="absolute right-[-80px] top-[-80px] w-[320px] h-[320px] rounded-full pointer-events-none"
          style={{ border: '1px solid rgba(201,150,12,0.15)' }} />
        <div className="absolute right-[-40px] top-[-40px] w-[240px] h-[240px] rounded-full pointer-events-none"
          style={{ border: '1px solid rgba(232,132,26,0.1)' }} />

        <div className="max-w-5xl mx-auto relative z-10">
          {/* Location badge */}
          <div className="flex items-center gap-2 mb-4">
            <MapPin size={14} style={{ color: 'var(--saffron)' }} />
            <span className="text-xs font-body font-semibold tracking-wider uppercase"
              style={{ color: 'var(--saffron-light)' }}>
              {data.country}
            </span>
            {data.coordinates && (
              <span className="text-xs font-mono" style={{ color: 'rgba(255,255,255,0.35)' }}>
                · {data.coordinates.lat.toFixed(2)}°N, {data.coordinates.lng.toFixed(2)}°E
              </span>
            )}
          </div>

          {/* Destination name */}
          <h1 className="font-display font-bold text-white mb-4"
            style={{ fontSize: 'clamp(2.5rem, 7vw, 5rem)', lineHeight: 1.05 }}>
            {data.name}
          </h1>

          {/* Summary */}
          <p className="font-body text-amber-100/70 max-w-2xl leading-relaxed mb-8"
            style={{ fontSize: '15px' }}>
            {data.summary}
          </p>

          {/* Proverb block */}
          {data.localProverb && (
            <div className="proverb-block p-5 max-w-2xl animate-slide-up" style={{ animationDelay: '0.2s' }}>
              <div className="text-xs font-body font-semibold tracking-widest uppercase mb-3"
                style={{ color: 'var(--saffron-light)' }}>
                ✦ Local Wisdom / स्थानीय ज्ञान
              </div>
              <blockquote className="font-display italic text-lg font-semibold mb-2"
                style={{ color: 'var(--gold-light)', lineHeight: 1.4 }}>
                "{data.localProverb.text}"
              </blockquote>
              <p className="text-xs font-body mb-1" style={{ color: 'rgba(255,255,255,0.6)' }}>
                <span className="font-semibold" style={{ color: 'rgba(255,255,255,0.5)' }}>Translation: </span>
                {data.localProverb.translation}
              </p>
              <p className="text-xs font-body" style={{ color: 'rgba(255,255,255,0.55)' }}>
                <span className="font-semibold" style={{ color: 'rgba(255,255,255,0.5)' }}>Meaning: </span>
                {data.localProverb.meaning}
              </p>
            </div>
          )}

          {/* Stats strip */}
          <div className="flex flex-wrap gap-6 mt-8">
            {[
              { label: 'Attractions', count: data.attractions?.length ?? 0, emoji: '🏛️' },
              { label: 'Hidden Gems', count: data.hiddenGems?.length ?? 0, emoji: '💎' },
              { label: 'Experiences', count: data.experiences?.length ?? 0, emoji: '🎭' },
              { label: 'Festivals', count: data.events?.length ?? 0, emoji: '🎊' },
            ].map((stat) => (
              <div key={stat.label} className="flex items-center gap-2">
                <span className="text-lg">{stat.emoji}</span>
                <div>
                  <div className="text-lg font-display font-bold" style={{ color: 'var(--gold-light)' }}>
                    {stat.count}
                  </div>
                  <div className="text-xs font-body" style={{ color: 'rgba(255,255,255,0.4)' }}>{stat.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Tab Navigation ── */}
      <div className="sticky z-40 px-6 py-4" style={{ top: '57px', background: 'rgba(253,246,227,0.95)', backdropFilter: 'blur(12px)', borderBottom: '1px solid rgba(201,150,12,0.15)' }}>
        <div className="max-w-5xl mx-auto">
          <div className="tab-nav" style={{ width: 'fit-content', maxWidth: '100%' }}>
            {TABS.map((tab) => (
              <button
                key={tab.id}
                id={`tab-${tab.id}`}
                onClick={() => setActiveTab(tab.id)}
                className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`}
              >
                {tab.emoji} {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Tab Content ── */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-10 space-y-8">

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
        <div className="modal-overlay" onClick={() => setSelectedStory(null)}>
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
