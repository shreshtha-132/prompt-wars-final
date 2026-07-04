import React from 'react';
import { BookOpen, Utensils, Palette, Mountain, Sparkles, Footprints, Flame, Zap, Coins, Wallet, Award } from 'lucide-react';
import { TravelPreference } from '../types';

interface PreferenceBarProps {
  preferences: TravelPreference;
  onChange: (prefs: TravelPreference) => void;
}

export default function PreferenceBar({ preferences, onChange }: PreferenceBarProps) {
  const updateInterest = (interest: TravelPreference['interest']) => {
    onChange({ ...preferences, interest });
  };

  const updatePace = (pace: TravelPreference['pace']) => {
    onChange({ ...preferences, pace });
  };

  const updateBudget = (budget: TravelPreference['budget']) => {
    onChange({ ...preferences, budget });
  };

  const INTERESTS = [
    { value: 'history' as const, label: 'Historical Lore', icon: BookOpen, color: 'text-amber-600 bg-amber-50 border-amber-200' },
    { value: 'culinary' as const, label: 'Culinary Heritage', icon: Utensils, color: 'text-rose-600 bg-rose-50 border-rose-200' },
    { value: 'arts' as const, label: 'Artisanship & Crafts', icon: Palette, color: 'text-violet-600 bg-violet-50 border-violet-200' },
    { value: 'adventure' as const, label: 'Ethno-Adventure', icon: Mountain, color: 'text-sky-600 bg-sky-50 border-sky-200' },
    { value: 'spiritual' as const, label: 'Sacred & Spiritual', icon: Sparkles, color: 'text-blue-600 bg-blue-50 border-blue-200' },
  ];

  const PACES = [
    { value: 'slow' as const, label: 'Immersive (Slow)', icon: Footprints, desc: 'Deep-dive' },
    { value: 'moderate' as const, label: 'Balanced (Moderate)', icon: Flame, desc: 'Steeped rhythm' },
    { value: 'fast' as const, label: 'Highlights (Fast)', icon: Zap, desc: 'Energetic loops' },
  ];

  const BUDGETS = [
    { value: 'budget' as const, label: 'Local-Centric', icon: Coins, desc: 'Public & Homestays' },
    { value: 'moderate' as const, label: 'Mid-Tier Comfort', icon: Wallet, desc: 'Boutique lodgings' },
    { value: 'luxury' as const, label: 'Heritage Luxury', icon: Award, desc: 'Palaces & Ryokans' },
  ];

  return (
    <div id="preference-bar-wrapper" className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-6">
      <div>
        <h3 className="text-sm font-bold font-sans uppercase tracking-wider text-slate-900">
          Personalize Your Cultural Lens
        </h3>
        <p className="text-xs text-slate-500 mt-1">
          Adjusting these dynamically filters and shapes the attractions, stories, and connections recommended by our AI.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Travel Interests */}
        <div className="space-y-3">
          <label className="text-xs font-semibold font-mono text-slate-500 uppercase tracking-wider block">
            Focus Theme
          </label>
          <div className="flex flex-col gap-2">
            {INTERESTS.map((item) => {
              const Icon = item.icon;
              const isSelected = preferences.interest === item.value;
              return (
                <button
                  key={item.value}
                  id={`pref-interest-${item.value}`}
                  onClick={() => updateInterest(item.value)}
                  className={`flex items-center gap-3 w-full p-2.5 rounded-xl border text-left transition-all ${
                    isSelected
                      ? 'bg-blue-50 border-blue-400 text-blue-900 shadow-sm font-semibold'
                      : 'bg-slate-50/50 border-slate-200 text-slate-600 hover:bg-slate-100/70 hover:text-slate-900'
                  }`}
                >
                  <div className={`p-1.5 rounded-lg border ${item.color}`}>
                    <Icon size={16} />
                  </div>
                  <span className="text-sm">{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Exploration Pace */}
        <div className="space-y-3">
          <label className="text-xs font-semibold font-mono text-slate-500 uppercase tracking-wider block">
            Exploration Rhythm
          </label>
          <div className="flex flex-col gap-2">
            {PACES.map((item) => {
              const Icon = item.icon;
              const isSelected = preferences.pace === item.value;
              return (
                <button
                  key={item.value}
                  id={`pref-pace-${item.value}`}
                  onClick={() => updatePace(item.value)}
                  className={`flex items-center gap-3 w-full p-2.5 rounded-xl border text-left transition-all ${
                    isSelected
                      ? 'bg-blue-50 border-blue-400 text-blue-900 shadow-sm font-semibold'
                      : 'bg-slate-50/50 border-slate-200 text-slate-600 hover:bg-slate-100/70 hover:text-slate-900'
                  }`}
                >
                  <div className={`p-1.5 rounded-lg border ${isSelected ? 'text-blue-600 border-blue-200 bg-blue-50/50' : 'text-slate-400 border-slate-200 bg-slate-50'}`}>
                    <Icon size={16} />
                  </div>
                  <div>
                    <span className="text-sm block">{item.label}</span>
                    <span className="text-[10px] text-slate-500 block">{item.desc}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Travel Budget Style */}
        <div className="space-y-3">
          <label className="text-xs font-semibold font-mono text-slate-500 uppercase tracking-wider block">
            Immersion tier (Budget Style)
          </label>
          <div className="flex flex-col gap-2">
            {BUDGETS.map((item) => {
              const Icon = item.icon;
              const isSelected = preferences.budget === item.value;
              return (
                <button
                  key={item.value}
                  id={`pref-budget-${item.value}`}
                  onClick={() => updateBudget(item.value)}
                  className={`flex items-center gap-3 w-full p-2.5 rounded-xl border text-left transition-all ${
                    isSelected
                      ? 'bg-blue-50 border-blue-400 text-blue-900 shadow-sm font-semibold'
                      : 'bg-slate-50/50 border-slate-200 text-slate-600 hover:bg-slate-100/70 hover:text-slate-900'
                  }`}
                >
                  <div className={`p-1.5 rounded-lg border ${isSelected ? 'text-blue-600 border-blue-200 bg-blue-50/50' : 'text-slate-400 border-slate-200 bg-slate-50'}`}>
                    <Icon size={16} />
                  </div>
                  <div>
                    <span className="text-sm block">{item.label}</span>
                    <span className="text-[10px] text-slate-500 block">{item.desc}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
