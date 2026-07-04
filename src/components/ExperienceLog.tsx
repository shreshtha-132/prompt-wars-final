import React from 'react';
import { UserCheck, ShieldAlert, Calendar, Star } from 'lucide-react';
import { LocalExperience, HeritageEvent } from '../types';

interface ExperienceLogProps {
  experiences: LocalExperience[];
  events: HeritageEvent[];
  showEvents: boolean;
}

const TYPE_CONFIG: Record<string, { label: string; emoji: string; badgeClass: string }> = {
  artisanship: { label: 'Artisanship', emoji: '🪡', badgeClass: 'badge-cultural' },
  culinary:    { label: 'Culinary',    emoji: '🍛', badgeClass: 'badge-culinary' },
  performance: { label: 'Performance', emoji: '🎭', badgeClass: 'badge-cultural' },
  nature:      { label: 'Nature',      emoji: '🌿', badgeClass: 'badge-nature'   },
  community:   { label: 'Community',   emoji: '🤝', badgeClass: 'badge-spiritual' },
};

export default function ExperienceLog({ experiences, events, showEvents }: ExperienceLogProps) {
  if (!showEvents) {
    // Render experiences
    if (experiences.length === 0) {
      return (
        <div className="text-center py-12 font-body" style={{ color: 'var(--text-muted)' }}>
          <div className="text-4xl mb-3">🎭</div>
          <p>No local experiences listed for this destination.</p>
        </div>
      );
    }

    return (
      <div id="experience-log-wrapper" className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {experiences.map((exp, idx) => {
          const config = TYPE_CONFIG[exp.type] || { label: exp.type, emoji: '✨', badgeClass: 'badge-adventure' };
          return (
            <div
              key={exp.id}
              id={`experience-card-${exp.id}`}
              className="india-card p-5 flex flex-col animate-slide-up"
              style={{ animationDelay: `${idx * 0.06}s`, opacity: 0, animationFillMode: 'forwards' }}
            >
              {/* Header */}
              <div className="flex items-start justify-between gap-2 mb-3">
                <div className="flex-1">
                  <span className={`text-[10px] font-body font-semibold uppercase tracking-wider px-2.5 py-0.5 rounded-full ${config.badgeClass}`}>
                    {config.emoji} {config.label}
                  </span>
                  <h3 className="font-display font-bold text-lg mt-2" style={{ color: 'var(--text-dark)' }}>
                    {exp.title}
                  </h3>
                </div>
              </div>

              <p className="text-sm font-body leading-relaxed mb-4 flex-1" style={{ color: 'var(--text-medium)' }}>
                {exp.description}
              </p>

              <div className="space-y-3">
                {/* How to connect */}
                <div className="rounded-xl p-3"
                  style={{ background: 'rgba(14,95,108,0.06)', border: '1px solid rgba(14,95,108,0.15)' }}>
                  <div className="flex items-center gap-1.5 mb-1.5">
                    <UserCheck size={11} style={{ color: 'var(--teal)' }} />
                    <span className="text-[10px] font-body font-semibold uppercase tracking-wider"
                      style={{ color: 'var(--teal)' }}>How to Connect</span>
                  </div>
                  <p className="text-xs font-body leading-relaxed" style={{ color: 'var(--text-medium)' }}>
                    {exp.howToConnect}
                  </p>
                </div>

                {/* Cultural etiquette */}
                <div className="rounded-xl p-3"
                  style={{ background: 'rgba(232,132,26,0.06)', border: '1px solid rgba(232,132,26,0.15)' }}>
                  <div className="flex items-center gap-1.5 mb-1.5">
                    <ShieldAlert size={11} style={{ color: 'var(--saffron)' }} />
                    <span className="text-[10px] font-body font-semibold uppercase tracking-wider"
                      style={{ color: 'var(--saffron)' }}>Cultural Etiquette</span>
                  </div>
                  <p className="text-xs font-body leading-relaxed" style={{ color: 'var(--text-medium)' }}>
                    {exp.culturalEtiquette}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  // Render events / festivals
  if (events.length === 0) {
    return (
      <div className="text-center py-12 font-body" style={{ color: 'var(--text-muted)' }}>
        <div className="text-4xl mb-3">🎊</div>
        <p>No festivals or events listed for this destination.</p>
      </div>
    );
  }

  return (
    <div id="heritage-events-container" className="grid grid-cols-1 md:grid-cols-2 gap-5">
      {events.map((evt, idx) => (
        <div
          key={evt.id}
          id={`event-card-${evt.id}`}
          className="india-card p-5 flex flex-col animate-slide-up"
          style={{ animationDelay: `${idx * 0.06}s`, opacity: 0, animationFillMode: 'forwards' }}
        >
          {/* Header */}
          <div className="flex items-start justify-between gap-2 mb-3">
            <div className="flex-1">
              <h3 className="font-display font-bold text-xl leading-tight" style={{ color: 'var(--text-dark)' }}>
                {evt.name}
              </h3>
              <div className="flex items-center gap-1.5 mt-2">
                <Calendar size={11} style={{ color: 'var(--saffron)' }} />
                <span className="text-xs font-body px-2.5 py-0.5 rounded-full badge-culinary">
                  {evt.timeOfYear}
                </span>
              </div>
            </div>
            <div className="text-3xl" style={{ opacity: 0.7 }}>🎊</div>
          </div>

          {/* Significance */}
          <div className="rounded-xl p-3 mb-3 flex-1"
            style={{ background: 'rgba(155,28,28,0.05)', border: '1px solid rgba(155,28,28,0.12)' }}>
            <div className="text-[10px] font-body font-semibold uppercase tracking-wider mb-1.5"
              style={{ color: 'var(--crimson)' }}>
              ✦ Cultural Significance
            </div>
            <p className="text-xs font-body leading-relaxed" style={{ color: 'var(--text-medium)' }}>
              {evt.significance}
            </p>
          </div>

          {/* Traditions as tags */}
          {evt.localTraditions && evt.localTraditions.length > 0 && (
            <div>
              <div className="text-[10px] font-body font-semibold uppercase tracking-wider mb-2 flex items-center gap-1.5"
                style={{ color: 'var(--gold-dark)' }}>
                <Star size={10} fill="currentColor" />
                Rituals, Foods & Traditions
              </div>
              <div className="flex flex-wrap gap-1.5">
                {evt.localTraditions.map((trad, i) => (
                  <span
                    key={i}
                    id={`tradition-tag-${evt.id}-${i}`}
                    className="text-[11px] font-body px-2.5 py-1 rounded-full"
                    style={{ background: 'rgba(201,150,12,0.1)', border: '1px solid rgba(201,150,12,0.2)', color: 'var(--gold-dark)' }}>
                    {trad}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
