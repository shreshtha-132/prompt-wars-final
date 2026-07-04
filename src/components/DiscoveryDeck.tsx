import React from 'react';
import { MapPin, Feather, Heart, BookOpen, Eye } from 'lucide-react';
import { Attraction, HiddenGem } from '../types';

interface DiscoveryDeckProps {
  attractions: Attraction[];
  hiddenGems: HiddenGem[];
  savedAttractionIds: string[];
  savedGemIds: string[];
  onToggleSaveAttraction: (id: string) => void;
  onToggleSaveGem: (id: string) => void;
  onSelectStorySpot: (spotName: string, spotDescription: string) => void;
  showGems: boolean;
}

const getCategoryStyle = (category: string): string => {
  const c = category?.toLowerCase() || '';
  if (c.includes('spiritual') || c.includes('temple') || c.includes('religious')) return 'badge-spiritual';
  if (c.includes('culinary') || c.includes('food')) return 'badge-culinary';
  if (c.includes('nature') || c.includes('forest') || c.includes('wildlife')) return 'badge-nature';
  if (c.includes('art') || c.includes('music') || c.includes('dance')) return 'badge-cultural';
  if (c.includes('heritage') || c.includes('palace') || c.includes('fort')) return 'badge-heritage';
  return 'badge-adventure';
};

export default function DiscoveryDeck({
  attractions,
  hiddenGems,
  savedAttractionIds,
  savedGemIds,
  onToggleSaveAttraction,
  onToggleSaveGem,
  onSelectStorySpot,
  showGems,
}: DiscoveryDeckProps) {

  if (!showGems) {
    // Render attractions only
    if (attractions.length === 0) {
      return (
        <div className="text-center py-12 font-body" style={{ color: 'var(--text-muted)' }}>
          <div className="text-4xl mb-3">🏛️</div>
          <p>No attractions generated for this destination.</p>
        </div>
      );
    }

    return (
      <div id="discovery-deck-root" className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {attractions.map((attr, idx) => {
          const isSaved = savedAttractionIds.includes(attr.id);
          return (
            <div
              key={attr.id}
              id={`attraction-card-${attr.id}`}
              className="india-card p-5 flex flex-col animate-slide-up"
              style={{ animationDelay: `${idx * 0.06}s`, opacity: 0, animationFillMode: 'forwards' }}
            >
              {/* Card header */}
              <div className="flex items-start justify-between gap-2 mb-3">
                <div className="flex-1 min-w-0">
                  <span className={`text-[10px] font-body font-semibold uppercase tracking-wider px-2.5 py-0.5 rounded-full ${getCategoryStyle(attr.category)}`}>
                    {attr.category || 'Cultural Site'}
                  </span>
                  <h3 className="font-display font-bold text-lg mt-2 leading-tight"
                    style={{ color: 'var(--text-dark)' }}>
                    {attr.name}
                  </h3>
                  <div className="flex items-center gap-1 mt-1">
                    <MapPin size={10} style={{ color: 'var(--saffron)' }} />
                    <span className="text-xs font-body" style={{ color: 'var(--text-muted)' }}>{attr.location}</span>
                  </div>
                </div>
                <button
                  id={`save-attr-btn-${attr.id}`}
                  onClick={() => onToggleSaveAttraction(attr.id)}
                  className="p-2 rounded-full transition-all shrink-0"
                  style={{
                    background: isSaved ? 'rgba(155,28,28,0.1)' : 'transparent',
                    border: `1px solid ${isSaved ? 'rgba(155,28,28,0.3)' : 'rgba(201,150,12,0.2)'}`,
                    color: isSaved ? 'var(--crimson)' : 'var(--text-muted)',
                  }}
                  title={isSaved ? 'Remove bookmark' : 'Bookmark this place'}
                >
                  <Heart size={14} fill={isSaved ? 'currentColor' : 'none'} />
                </button>
              </div>

              {/* Description */}
              <p className="text-sm font-body leading-relaxed mb-4"
                style={{ color: 'var(--text-medium)' }}>
                {attr.description}
              </p>

              {/* Historical significance */}
              <div className="rounded-xl p-3 mb-3 flex-1"
                style={{ background: 'rgba(232,132,26,0.06)', border: '1px solid rgba(232,132,26,0.15)' }}>
                <div className="text-[10px] font-body font-semibold uppercase tracking-wider mb-1.5"
                  style={{ color: 'var(--saffron)' }}>
                  ✦ Historical Significance
                </div>
                <p className="text-xs font-body leading-relaxed" style={{ color: 'var(--text-medium)' }}>
                  {attr.historicalSignificance}
                </p>
              </div>

              {/* Visitor tip */}
              <div className="rounded-xl p-3 mb-4"
                style={{ background: 'rgba(14,95,108,0.06)', border: '1px solid rgba(14,95,108,0.15)' }}>
                <div className="text-[10px] font-body font-semibold uppercase tracking-wider mb-1.5"
                  style={{ color: 'var(--teal)' }}>
                  🙏 Visitor Etiquette
                </div>
                <p className="text-xs font-body leading-relaxed" style={{ color: 'var(--text-medium)' }}>
                  {attr.visitorTip}
                </p>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between pt-3"
                style={{ borderTop: '1px solid rgba(201,150,12,0.15)' }}>
                <div className="flex items-center gap-1 text-xs font-body" style={{ color: 'var(--text-muted)' }}>
                  <BookOpen size={11} />
                  <span>Authentic site</span>
                </div>
                <button
                  id={`narrative-btn-${attr.id}`}
                  onClick={() => onSelectStorySpot(attr.name, attr.description)}
                  className="flex items-center gap-1.5 text-xs font-body font-semibold px-3 py-1.5 rounded-full transition-all"
                  style={{
                    background: 'linear-gradient(135deg, rgba(232,132,26,0.1), rgba(201,150,12,0.1))',
                    border: '1px solid rgba(232,132,26,0.3)',
                    color: 'var(--saffron-dark)',
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.background = 'linear-gradient(135deg, var(--saffron), var(--saffron-dark))';
                    (e.currentTarget as HTMLButtonElement).style.color = 'white';
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.background = 'linear-gradient(135deg, rgba(232,132,26,0.1), rgba(201,150,12,0.1))';
                    (e.currentTarget as HTMLButtonElement).style.color = 'var(--saffron-dark)';
                  }}
                >
                  <Feather size={12} />
                  Read Story
                </button>
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  // Render hidden gems only
  if (hiddenGems.length === 0) {
    return (
      <div className="text-center py-12 font-body" style={{ color: 'var(--text-muted)' }}>
        <div className="text-4xl mb-3">💎</div>
        <p>No hidden gems found for this destination.</p>
      </div>
    );
  }

  return (
    <div id="hidden-gems-root" className="grid grid-cols-1 md:grid-cols-2 gap-5">
      {hiddenGems.map((gem, idx) => {
        const isSaved = savedGemIds.includes(gem.id);
        return (
          <div
            key={gem.id}
            id={`gem-card-${gem.id}`}
            className="india-card p-5 flex flex-col animate-slide-up"
            style={{ animationDelay: `${idx * 0.06}s`, opacity: 0, animationFillMode: 'forwards' }}
          >
            <div className="flex items-start justify-between gap-2 mb-3">
              <div className="flex-1 min-w-0">
                <span className="text-[10px] font-body font-semibold uppercase tracking-wider px-2.5 py-0.5 rounded-full badge-heritage">
                  💎 Rare Cultural Encounter
                </span>
                <h3 className="font-display font-bold text-lg mt-2 leading-tight"
                  style={{ color: 'var(--text-dark)' }}>
                  {gem.name}
                </h3>
              </div>
              <button
                id={`save-gem-btn-${gem.id}`}
                onClick={() => onToggleSaveGem(gem.id)}
                className="p-2 rounded-full transition-all shrink-0"
                style={{
                  background: isSaved ? 'rgba(155,28,28,0.1)' : 'transparent',
                  border: `1px solid ${isSaved ? 'rgba(155,28,28,0.3)' : 'rgba(201,150,12,0.2)'}`,
                  color: isSaved ? 'var(--crimson)' : 'var(--text-muted)',
                }}
              >
                <Heart size={14} fill={isSaved ? 'currentColor' : 'none'} />
              </button>
            </div>

            <p className="text-sm font-body leading-relaxed mb-4" style={{ color: 'var(--text-medium)' }}>
              {gem.description}
            </p>

            {/* Cultural story */}
            <div className="rounded-xl p-3 mb-3 flex-1 relative overflow-hidden"
              style={{ background: 'rgba(155,28,28,0.05)', border: '1px solid rgba(155,28,28,0.15)', borderLeft: '3px solid var(--crimson)' }}>
              <div className="text-[10px] font-body font-semibold uppercase tracking-wider mb-1.5"
                style={{ color: 'var(--crimson)' }}>
                📜 Folklore & Oral History
              </div>
              <p className="text-xs font-body leading-relaxed italic" style={{ color: 'var(--text-medium)' }}>
                "{gem.culturalStory}"
              </p>
            </div>

            {/* Local legend */}
            {gem.localLegend && (
              <div className="rounded-xl p-3 mb-3"
                style={{ background: 'rgba(201,150,12,0.08)', border: '1px solid rgba(201,150,12,0.2)' }}>
                <div className="text-[10px] font-body font-semibold uppercase tracking-wider mb-1.5"
                  style={{ color: 'var(--gold-dark)' }}>
                  🌙 Local Whispers & Lore
                </div>
                <p className="text-xs font-body leading-relaxed" style={{ color: 'var(--text-medium)' }}>
                  {gem.localLegend}
                </p>
              </div>
            )}

            {/* How to experience */}
            <div className="rounded-xl p-3 mb-4"
              style={{ background: 'rgba(14,95,108,0.06)', border: '1px solid rgba(14,95,108,0.15)' }}>
              <div className="text-[10px] font-body font-semibold uppercase tracking-wider mb-1.5"
                style={{ color: 'var(--teal)' }}>
                🙏 How to Visit Respectfully
              </div>
              <p className="text-xs font-body leading-relaxed" style={{ color: 'var(--text-medium)' }}>
                {gem.howToExperience}
              </p>
            </div>

            <div className="flex items-center justify-end pt-3"
              style={{ borderTop: '1px solid rgba(201,150,12,0.15)' }}>
              <button
                id={`narrative-gem-btn-${gem.id}`}
                onClick={() => onSelectStorySpot(gem.name, gem.description + '. ' + (gem.localLegend || ''))}
                className="flex items-center gap-1.5 text-xs font-body font-semibold px-3 py-1.5 rounded-full transition-all"
                style={{
                  background: 'linear-gradient(135deg, rgba(232,132,26,0.1), rgba(201,150,12,0.1))',
                  border: '1px solid rgba(232,132,26,0.3)',
                  color: 'var(--saffron-dark)',
                }}
              >
                <Feather size={12} />
                Weave a Story
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
