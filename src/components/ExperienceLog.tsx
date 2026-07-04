import React from 'react';
import { Calendar, UserCheck, HeartHandshake, ShieldAlert, BookOpen } from 'lucide-react';
import { LocalExperience, HeritageEvent } from '../types';

interface ExperienceLogProps {
  experiences: LocalExperience[];
  events: HeritageEvent[];
}

export default function ExperienceLog({ experiences, events }: ExperienceLogProps) {
  const getTypeBadge = (type: LocalExperience['type']) => {
    switch (type) {
      case 'artisanship':
        return 'text-violet-600 bg-violet-50 border-violet-200';
      case 'culinary':
        return 'text-rose-600 bg-rose-50 border-rose-200';
      case 'performance':
        return 'text-amber-600 bg-amber-50 border-amber-200';
      case 'nature':
        return 'text-sky-600 bg-sky-50 border-sky-200';
      case 'community':
        return 'text-emerald-600 bg-emerald-50 border-emerald-200';
      default:
        return 'text-slate-600 bg-slate-50 border-slate-200';
    }
  };

  return (
    <div id="experience-log-wrapper" className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* 1. Authentic Cultural Experiences */}
      <div id="authentic-experiences-container" className="space-y-6">
        <div className="flex items-center justify-between border-b border-slate-200 pb-3">
          <div className="flex items-center gap-2">
            <HeartHandshake className="text-blue-600" size={18} />
            <h3 className="text-base font-bold font-sans text-slate-900">
              Community Connections & Experiences
            </h3>
          </div>
          <span className="text-xs font-mono text-slate-400">Local Workshops</span>
        </div>

        {experiences.length === 0 ? (
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 text-center text-slate-500">
            No cultural experiences listed. Try searching for a destination.
          </div>
        ) : (
          <div className="space-y-4">
            {experiences.map((exp) => (
              <div
                key={exp.id}
                id={`experience-card-${exp.id}`}
                className="bg-white border border-slate-200 rounded-xl p-5 space-y-4 hover:border-slate-300 transition-all shadow-sm"
              >
                <div>
                  <div className="flex justify-between items-start gap-2">
                    <h4 className="text-sm font-bold text-slate-900">{exp.title}</h4>
                    <span className={`text-[10px] uppercase font-mono font-bold px-2 py-0.5 rounded border ${getTypeBadge(exp.type)}`}>
                      {exp.type}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 mt-2">{exp.description}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-3 border-t border-slate-100">
                  <div className="space-y-1">
                    <span className="flex items-center gap-1 text-[10px] font-mono font-semibold text-slate-400 uppercase tracking-wider">
                      <UserCheck size={10} className="text-blue-600" />
                      How to Connect
                    </span>
                    <p className="text-[11px] text-slate-700 leading-normal">{exp.howToConnect}</p>
                  </div>

                  <div className="space-y-1">
                    <span className="flex items-center gap-1 text-[10px] font-mono font-semibold text-slate-400 uppercase tracking-wider">
                      <ShieldAlert size={10} className="text-amber-600" />
                      Social Etiquette
                    </span>
                    <p className="text-[11px] text-amber-800 leading-normal font-sans">{exp.culturalEtiquette}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 2. Traditional Ceremonies & Festivals */}
      <div id="heritage-events-container" className="space-y-6">
        <div className="flex items-center justify-between border-b border-slate-200 pb-3">
          <div className="flex items-center gap-2">
            <Calendar className="text-blue-600" size={18} />
            <h3 className="text-base font-bold font-sans text-slate-900">
              Heritage Festivals & seasonal events
            </h3>
          </div>
          <span className="text-xs font-mono text-slate-400">Living Celebrations</span>
        </div>

        {events.length === 0 ? (
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 text-center text-slate-500">
            No local festivals loaded. Provide a region above to explore cycles.
          </div>
        ) : (
          <div className="space-y-4">
            {events.map((evt) => (
              <div
                key={evt.id}
                id={`event-card-${evt.id}`}
                className="bg-white border border-slate-200 rounded-xl p-5 hover:border-slate-300 transition-all space-y-3 shadow-sm"
              >
                <div className="flex justify-between items-start gap-2">
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">{evt.name}</h4>
                    <span className="text-[10px] font-mono text-blue-700 bg-blue-50 border border-blue-100 px-2 py-0.5 rounded inline-block mt-1">
                      {evt.timeOfYear}
                    </span>
                  </div>
                  <BookOpen size={14} className="text-slate-400" />
                </div>

                <p className="text-xs text-slate-600 leading-relaxed">
                  <span className="font-semibold text-slate-500">Significance:</span> {evt.significance}
                </p>

                {evt.localTraditions && evt.localTraditions.length > 0 && (
                  <div className="bg-slate-50 border border-slate-200/60 rounded-lg p-3">
                    <span className="block text-[9px] font-mono font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                      Rituals, Foods, or Attire
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {evt.localTraditions.map((trad, idx) => (
                        <span
                          key={idx}
                          id={`tradition-tag-${evt.id}-${idx}`}
                          className="text-[10px] text-slate-600 bg-white border border-slate-250 px-2 py-0.5 rounded-md"
                        >
                          {trad}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
