import React from 'react';
import { Bookmark, Sparkles, AlertCircle, MapPin, Feather, Heart } from 'lucide-react';
import { Attraction, HiddenGem } from '../types';

interface DiscoveryDeckProps {
  attractions: Attraction[];
  hiddenGems: HiddenGem[];
  savedAttractionIds: string[];
  savedGemIds: string[];
  onToggleSaveAttraction: (id: string) => void;
  onToggleSaveGem: (id: string) => void;
  onSelectStorySpot: (spotName: string, spotDescription: string) => void;
}

export default function DiscoveryDeck({
  attractions,
  hiddenGems,
  savedAttractionIds,
  savedGemIds,
  onToggleSaveAttraction,
  onToggleSaveGem,
  onSelectStorySpot,
}: DiscoveryDeckProps) {
  return (
    <div id="discovery-deck-root" className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* 1. Tailored Attractions */}
      <div id="tailored-attractions-section" className="space-y-6">
        <div className="flex items-center justify-between border-b border-slate-200 pb-3">
          <div className="flex items-center gap-2">
            <Sparkles className="text-blue-600" size={18} />
            <h3 className="text-base font-bold font-sans text-slate-900">
              Curated Cultural Attractions
            </h3>
          </div>
          <span className="text-xs font-mono bg-slate-100 border border-slate-200/60 px-2 py-0.5 rounded text-slate-600">
            {attractions.length} Recommendations
          </span>
        </div>

        {attractions.length === 0 ? (
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 text-center text-slate-500">
            No attractions generated. Try searching for a destination.
          </div>
        ) : (
          <div className="space-y-4">
            {attractions.map((attr) => {
              const isSaved = savedAttractionIds.includes(attr.id);
              return (
                <div
                  key={attr.id}
                  id={`attraction-card-${attr.id}`}
                  className="bg-white border border-slate-200 rounded-xl p-5 hover:border-slate-300 shadow-sm transition-all flex flex-col justify-between group"
                >
                  <div>
                    <div className="flex justify-between items-start gap-2">
                      <div>
                        <span className="inline-block text-[10px] font-semibold font-mono uppercase bg-blue-50 text-blue-700 px-2 py-0.5 rounded-md mb-2 border border-blue-100">
                          {attr.category || 'Cultural Site'}
                        </span>
                        <h4 className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                          {attr.name}
                        </h4>
                      </div>
                      <button
                        onClick={() => onToggleSaveAttraction(attr.id)}
                        id={`save-attr-btn-${attr.id}`}
                        className={`p-1.5 rounded-lg transition-all ${
                          isSaved 
                            ? 'text-rose-500 bg-rose-50 border border-rose-200' 
                            : 'text-slate-400 hover:text-slate-600 bg-slate-50 border border-slate-200'
                        }`}
                        title={isSaved ? "Remove from Travel Diary" : "Bookmark to Travel Diary"}
                      >
                        <Heart size={14} fill={isSaved ? "currentColor" : "none"} />
                      </button>
                    </div>

                    <p className="text-xs text-slate-600 mt-2 line-clamp-3">
                      {attr.description}
                    </p>

                    <div className="bg-slate-50 border border-slate-200/60 rounded-lg p-3 mt-4 space-y-2">
                      <div className="text-[11px] text-slate-700">
                        <span className="font-semibold text-slate-400 block uppercase tracking-wider text-[9px] font-mono">
                          Historical Legacy
                        </span>
                        {attr.historicalSignificance}
                      </div>

                      <div className="text-[11px] text-slate-700 flex items-start gap-1.5 pt-1.5 border-t border-slate-200/60">
                        <AlertCircle size={12} className="text-blue-600 shrink-0 mt-0.5" />
                        <div>
                          <span className="font-semibold text-slate-400 block uppercase tracking-wider text-[9px] font-mono">
                            Visitor Etiquette & Tip
                          </span>
                          {attr.visitorTip}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-100">
                    <div className="flex items-center text-[11px] text-slate-500 gap-1 font-mono">
                      <MapPin size={11} className="text-slate-400" />
                      {attr.location}
                    </div>

                    <button
                      onClick={() => onSelectStorySpot(attr.name, attr.description)}
                      id={`narrative-btn-${attr.id}`}
                      className="text-xs text-blue-600 hover:text-blue-700 flex items-center gap-1 font-mono font-bold py-1 px-2.5 rounded hover:bg-blue-50 transition-all"
                    >
                      <Feather size={12} />
                      Weave Journal Story
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* 2. Hidden Gems Section */}
      <div id="hidden-gems-section" className="space-y-6">
        <div className="flex items-center justify-between border-b border-slate-200 pb-3">
          <div className="flex items-center gap-2">
            <Feather className="text-blue-600" size={18} />
            <h3 className="text-base font-bold font-sans text-slate-900">
              Uncovered Hidden Gems
            </h3>
          </div>
          <span className="text-xs font-mono bg-slate-100 border border-slate-200/60 px-2 py-0.5 rounded text-slate-600">
            Off-The-Beaten-Path
          </span>
        </div>

        {hiddenGems.length === 0 ? (
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 text-center text-slate-500">
            No hidden treasures uncovered yet. Select or search a city.
          </div>
        ) : (
          <div className="space-y-4">
            {hiddenGems.map((gem) => {
              const isSaved = savedGemIds.includes(gem.id);
              return (
                <div
                  key={gem.id}
                  id={`gem-card-${gem.id}`}
                  className="bg-white border border-slate-200 rounded-xl p-5 hover:border-slate-300 transition-all flex flex-col justify-between group shadow-sm"
                >
                  <div>
                    <div className="flex justify-between items-start gap-2">
                      <div>
                        <span className="inline-block text-[10px] font-semibold font-mono uppercase bg-emerald-50 text-emerald-750 px-2 py-0.5 rounded-md mb-2 border border-emerald-100">
                          Rare Cultural Encounter
                        </span>
                        <h4 className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                          {gem.name}
                        </h4>
                      </div>
                      <button
                        onClick={() => onToggleSaveGem(gem.id)}
                        id={`save-gem-btn-${gem.id}`}
                        className={`p-1.5 rounded-lg transition-all ${
                          isSaved 
                            ? 'text-rose-500 bg-rose-50 border border-rose-200' 
                            : 'text-slate-400 hover:text-slate-600 bg-slate-50 border border-slate-200'
                        }`}
                        title={isSaved ? "Remove from Travel Diary" : "Bookmark to Travel Diary"}
                      >
                        <Heart size={14} fill={isSaved ? "currentColor" : "none"} />
                      </button>
                    </div>

                    <p className="text-xs text-slate-600 mt-2 line-clamp-3">
                      {gem.description}
                    </p>

                    <div className="bg-slate-50 border border-slate-200/60 rounded-lg p-3 mt-4 space-y-3">
                      <div className="text-[11px] text-slate-700 leading-relaxed italic">
                        <span className="font-semibold text-slate-400 block uppercase tracking-wider text-[9px] font-mono not-italic">
                          Folklore & Oral History
                        </span>
                        "{gem.culturalStory}"
                      </div>

                      {gem.localLegend && (
                        <div className="text-[11px] text-amber-800 leading-relaxed pl-2 border-l border-amber-500/30">
                          <span className="font-semibold text-slate-400 block uppercase tracking-wider text-[9px] font-mono">
                            Local Lore & Whispers
                          </span>
                          {gem.localLegend}
                        </div>
                      )}

                      <div className="text-[11px] text-slate-700 border-t border-slate-200/60 pt-2">
                        <span className="font-semibold text-blue-600 block uppercase tracking-wider text-[9px] font-mono">
                          How to visit respectfully
                        </span>
                        {gem.howToExperience}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-end mt-4 pt-3 border-t border-slate-100">
                    <button
                      onClick={() => onSelectStorySpot(gem.name, gem.description + ". " + (gem.localLegend || ""))}
                      id={`narrative-gem-btn-${gem.id}`}
                      className="text-xs text-blue-600 hover:text-blue-700 flex items-center gap-1 font-mono font-bold py-1 px-2.5 rounded hover:bg-blue-50 transition-all"
                    >
                      <Feather size={12} />
                      Weave Journal Story
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
