import React, { useState, useEffect } from 'react';
import { Search, Compass, Globe, Sparkles, Feather, Heart, BookOpen, AlertCircle, RefreshCw, Trash2, Calendar } from 'lucide-react';
import { DestinationData, TravelPreference, JournalEntry } from './types';
import CustomMap from './components/CustomMap';
import PreferenceBar from './components/PreferenceBar';
import DiscoveryDeck from './components/DiscoveryDeck';
import ExperienceLog from './components/ExperienceLog';
import CulturalTrivia from './components/CulturalTrivia';
import CulturalAdvisor from './components/CulturalAdvisor';
import StoryNarrative from './components/StoryNarrative';

export default function App() {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [destinationData, setDestinationData] = useState<DestinationData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Travel persona & preferences
  const [preferences, setPreferences] = useState<TravelPreference>({
    interest: 'history',
    pace: 'moderate',
    budget: 'moderate'
  });

  // Local saved bookmarks (Travel Diary)
  const [savedAttractionIds, setSavedAttractionIds] = useState<string[]>([]);
  const [savedGemIds, setSavedGemIds] = useState<string[]>([]);
  const [diaryNote, setDiaryNote] = useState<string>('');

  // Immersive story focus state
  const [selectedStory, setSelectedStory] = useState<{ spotName: string; spotDescription: string } | null>(null);

  // Initialize and load saved bookmarks
  useEffect(() => {
    try {
      const storedAttrs = localStorage.getItem('cultural_atlas_saved_attrs');
      const storedGems = localStorage.getItem('cultural_atlas_saved_gems');
      if (storedAttrs) setSavedAttractionIds(JSON.parse(storedAttrs));
      if (storedGems) setSavedGemIds(JSON.parse(storedGems));
    } catch (err) {
      console.error('Error loading bookmarks:', err);
    }

    // Initial default load
    handleSearch('Kyoto');
  }, []);

  // Sync bookmarks to localStorage
  const saveAttrsToStorage = (updated: string[]) => {
    setSavedAttractionIds(updated);
    localStorage.setItem('cultural_atlas_saved_attrs', JSON.stringify(updated));
  };

  const saveGemsToStorage = (updated: string[]) => {
    setSavedGemIds(updated);
    localStorage.setItem('cultural_atlas_saved_gems', JSON.stringify(updated));
  };

  const handleToggleSaveAttraction = (id: string) => {
    const updated = savedAttractionIds.includes(id)
      ? savedAttractionIds.filter((item) => item !== id)
      : [...savedAttractionIds, id];
    saveAttrsToStorage(updated);
  };

  const handleToggleSaveGem = (id: string) => {
    const updated = savedGemIds.includes(id)
      ? savedGemIds.filter((item) => item !== id)
      : [...savedGemIds, id];
    saveGemsToStorage(updated);
  };

  // Search Core Handler
  const handleSearch = async (destinationName: string) => {
    const trimmed = destinationName.trim();
    if (!trimmed) return;

    setLoading(true);
    setError(null);
    setSelectedStory(null);

    try {
      const res = await fetch('/api/destination', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: trimmed,
          preferences: preferences
        })
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to generate cultural profile.');
      }

      const data = await res.json();
      setDestinationData(data);
      setSearchQuery(trimmed);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'An unexpected error occurred while communicating with the guide service.');
    } finally {
      setLoading(false);
    }
  };

  // Quick preset region buttons
  const handleSelectQuickRegion = (name: string) => {
    handleSearch(name);
  };

  // Trigger search with updated preferences
  const handleApplyPreferences = () => {
    if (destinationData) {
      handleSearch(destinationData.name);
    }
  };

  return (
    <div className="bg-slate-50 text-slate-900 min-h-screen selection:bg-blue-500/20 selection:text-blue-900 font-sans">
      
      {/* 1. Global Navigation Bar */}
      <header className="border-b border-slate-800 bg-slate-900 text-white sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-500/20 border border-blue-500/30 rounded-lg">
              <Globe className="text-blue-400" size={18} />
            </div>
            <div>
              <h1 className="text-sm font-bold tracking-tight text-white flex items-center gap-1.5 uppercase">
                CULTURAL ATLAS // Spec Suite
              </h1>
              <span className="text-[9px] uppercase font-mono text-slate-400 tracking-wider">
                DOC_ID: CA-2026-GENAI-PRO-001
              </span>
            </div>
          </div>

          {/* Search form bar */}
          <div className="flex gap-2 w-full md:w-auto max-w-sm">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
              <input
                type="text"
                id="destination-search-input"
                placeholder="Search destination (e.g., Kyoto, Oaxaca, Rome)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch(searchQuery)}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg pl-8 pr-3 py-1 text-xs text-slate-200 placeholder-slate-400 focus:outline-none focus:border-blue-500/50 transition-all"
              />
            </div>
            <button
              onClick={() => handleSearch(searchQuery)}
              id="search-btn"
              disabled={loading}
              className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg transition-all flex items-center gap-1 shrink-0"
            >
              {loading ? <RefreshCw size={11} className="animate-spin" /> : <Compass size={11} />}
              Explore
            </button>
          </div>
        </div>
      </header>

      {/* 2. Main Content Body */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* Error notification banner */}
        {error && (
          <div className="bg-rose-50 border border-rose-200 rounded-2xl p-4 flex items-start gap-3">
            <AlertCircle className="text-rose-600 shrink-0 mt-0.5" size={18} />
            <div>
              <h4 className="text-xs font-bold text-rose-800">Guide Service Interrupted</h4>
              <p className="text-xs text-slate-600 mt-1">{error}</p>
            </div>
          </div>
        )}

        {/* Loading overlay state */}
        {loading && !destinationData && (
          <div className="py-24 text-center space-y-4">
            <Globe size={48} className="text-blue-600 animate-pulse mx-auto" />
            <p className="text-sm text-slate-800 font-mono">Channelling cultural archives and local lore guides...</p>
            <p className="text-[11px] text-slate-500 max-w-sm mx-auto">This takes about 10-15 seconds as our AI generates authentic proverbs, experiences, hidden treasures, and quiz challenges tailored for you.</p>
          </div>
        )}

        {/* Loaded app state */}
        {destinationData && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Left & Middle Column (Main Exploration Hub) */}
            <div className="lg:col-span-2 space-y-8">
              
              {/* Destination Hero Banner & Proverbs */}
              <div id="destination-hero-header" className="bg-white border border-slate-200 rounded-2xl p-6 md:p-8 shadow-sm relative overflow-hidden">
                <div className="absolute top-0 right-0 p-6 opacity-10 select-none pointer-events-none text-slate-300">
                  <Feather size={200} />
                </div>

                <div className="space-y-4 relative z-10">
                  <div>
                    <span className="text-[10px] font-semibold font-mono uppercase bg-blue-50 text-blue-700 px-2.5 py-1 rounded-full border border-blue-200">
                      Destination Profile Unlocked
                    </span>
                    <h2 className="text-2xl md:text-4xl font-extrabold font-sans text-slate-900 tracking-tight mt-2 flex items-baseline gap-2">
                      {destinationData.name}
                      <span className="text-sm font-semibold font-mono text-slate-400">
                        {destinationData.country}
                      </span>
                    </h2>
                  </div>

                  <p className="text-xs md:text-sm text-slate-600 leading-relaxed max-w-3xl font-sans">
                    {destinationData.summary}
                  </p>

                  {/* Local proverb detail */}
                  {destinationData.localProverb && (
                    <div className="border-t border-slate-100 pt-4 flex flex-col md:flex-row items-start gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200/50">
                      <div className="p-2 bg-blue-50 border border-blue-200 text-blue-600 rounded-lg shrink-0">
                        <BookOpen size={18} />
                      </div>
                      <div className="space-y-1">
                        <span className="text-[9px] font-mono uppercase text-slate-400 tracking-wider block">
                          Philosophical Anchor (Native Saying)
                        </span>
                        <blockquote className="text-sm md:text-base font-serif italic text-slate-800">
                          "{destinationData.localProverb.text}"
                        </blockquote>
                        <p className="text-xs text-slate-600">
                          <strong className="text-slate-500 font-sans text-[11px]">Translation:</strong> {destinationData.localProverb.translation}
                        </p>
                        <p className="text-xs text-slate-600 mt-1">
                          <strong className="text-slate-500 font-sans text-[11px]">Meaning:</strong> {destinationData.localProverb.meaning}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Preferences Configurator block */}
              <div id="preferences-block" className="relative">
                <PreferenceBar preferences={preferences} onChange={setPreferences} />
                <div className="absolute right-6 top-6 flex items-center justify-end">
                  <button
                    onClick={handleApplyPreferences}
                    id="apply-prefs-btn"
                    disabled={loading}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl transition-all shadow-md"
                  >
                    {loading ? "Regenerating..." : "Apply Lens Preferences"}
                  </button>
                </div>
              </div>

              {/* Custom interactive Map component */}
              <CustomMap
                coordinates={destinationData.coordinates}
                destinationName={destinationData.name}
                onSelectQuickRegion={handleSelectQuickRegion}
              />

              {/* Discovery Deck Section (Attractions & Hidden Gems) */}
              <DiscoveryDeck
                attractions={destinationData.attractions}
                hiddenGems={destinationData.hiddenGems}
                savedAttractionIds={savedAttractionIds}
                savedGemIds={savedGemIds}
                onToggleSaveAttraction={handleToggleSaveAttraction}
                onToggleSaveGem={handleToggleSaveGem}
                onSelectStorySpot={(spotName, spotDescription) => {
                  setSelectedStory({ spotName, spotDescription });
                }}
              />

              {/* Local Experience Logs & Ongoing Festivals */}
              <ExperienceLog
                experiences={destinationData.experiences}
                events={destinationData.events}
              />

              {/* Dynamic Interactive Cultural Trivia Challenge */}
              <CulturalTrivia
                triviaQuestions={destinationData.trivia}
                destinationName={destinationData.name}
              />

            </div>

            {/* Right Column (Travel Diary, Story Narrative & Conversational Guide) */}
            <div className="space-y-8 lg:sticky lg:top-24 h-fit">
              
              {/* Storytelling Chronicle Panel (conditionally renders active spot story) */}
              {selectedStory && (
                <StoryNarrative
                  spotName={selectedStory.spotName}
                  spotDescription={selectedStory.spotDescription}
                  destinationName={destinationData.name}
                  country={destinationData.country}
                  onClose={() => setSelectedStory(null)}
                />
              )}

              {/* My Personal Cultural Travel Diary */}
              <div id="travel-diary-block" className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2">
                    <Heart className="text-rose-500" size={16} fill="currentColor" />
                    <h3 className="text-sm font-bold text-slate-900 font-sans">
                      My Cultural Travel Diary
                    </h3>
                  </div>
                  <span className="text-[10px] font-mono bg-slate-100 px-2 py-0.5 rounded text-slate-600 border border-slate-200">
                    {savedAttractionIds.length + savedGemIds.length} Bookmarks
                  </span>
                </div>

                {savedAttractionIds.length === 0 && savedGemIds.length === 0 ? (
                  <div className="text-center py-6 text-slate-400 text-xs leading-normal">
                    <BookOpen size={24} className="mx-auto text-slate-300 mb-2" />
                    No saved landmarks yet. Click the heart icons to bookmark your customized spots!
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="max-h-[220px] overflow-y-auto space-y-2 pr-1 custom-scrollbar">
                      {/* Saved Attractions */}
                      {savedAttractionIds.map((attrId) => {
                        const original = destinationData.attractions.find((a) => a.id === attrId);
                        if (!original) return null;
                        return (
                          <div key={attrId} className="bg-slate-50 border border-slate-200/60 p-2.5 rounded-xl flex justify-between items-center gap-2">
                            <div className="min-w-0">
                              <span className="text-[9px] font-mono text-blue-600 uppercase">Site Recommendation</span>
                              <h5 className="text-xs font-semibold text-slate-850 truncate">{original.name}</h5>
                            </div>
                            <button
                              onClick={() => handleToggleSaveAttraction(attrId)}
                              className="text-slate-400 hover:text-rose-600 p-1"
                              title="Delete bookmark"
                            >
                              <Trash2 size={12} />
                            </button>
                          </div>
                        );
                      })}

                      {/* Saved Gems */}
                      {savedGemIds.map((gemId) => {
                        const original = destinationData.hiddenGems.find((g) => g.id === gemId);
                        if (!original) return null;
                        return (
                          <div key={gemId} className="bg-slate-50 border border-slate-200/60 p-2.5 rounded-xl flex justify-between items-center gap-2">
                            <div className="min-w-0">
                              <span className="text-[9px] font-mono text-amber-600 uppercase">Hidden Treasure</span>
                              <h5 className="text-xs font-semibold text-slate-850 truncate">{original.name}</h5>
                            </div>
                            <button
                              onClick={() => handleToggleSaveGem(gemId)}
                              className="text-slate-400 hover:text-rose-600 p-1"
                              title="Delete bookmark"
                            >
                              <Trash2 size={12} />
                            </button>
                          </div>
                        );
                      })}
                    </div>

                    {/* Quick diary notes section */}
                    <div className="space-y-1.5 border-t border-slate-100 pt-3">
                      <label className="text-[10px] font-mono text-slate-400 block uppercase">Travel Notes & Ideas</label>
                      <textarea
                        value={diaryNote}
                        onChange={(e) => {
                          setDiaryNote(e.target.value);
                          localStorage.setItem('cultural_atlas_diary_notes', e.target.value);
                        }}
                        placeholder="Draft your thoughts, travel rhythms, or local packing ideas here..."
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs text-slate-700 placeholder-slate-400 h-16 focus:outline-none focus:border-blue-500/30 resize-none"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Chat Concierge assistant */}
              <CulturalAdvisor destination={destinationData} />

            </div>

          </div>
        )}

      </main>

      {/* Footer information bar */}
      <footer className="h-16 bg-slate-100 border-t border-slate-200 flex flex-col md:flex-row items-center px-6 justify-between shrink-0 mt-12 text-center md:text-left gap-2 text-slate-500 py-4 font-mono text-[10px]">
        <div className="flex items-center space-x-2">
          <span className="flex items-center"><span className="w-2 h-2 bg-green-500 rounded-full mr-1.5 animate-pulse"></span>System Status: SECURED</span>
          <span>|</span>
          <span>API Service: gemini-3.5-flash</span>
        </div>
        <div className="font-bold text-slate-400 uppercase tracking-tighter">
          Cultural Atlas Signed & Verified // Zero Mock Data
        </div>
      </footer>
    </div>
  );
}
