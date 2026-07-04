import React, { useState, useEffect } from 'react';
import { Feather, Volume2, VolumeX, RefreshCw, X, Sparkles, BookOpen } from 'lucide-react';

interface StoryNarrativeProps {
  spotName: string | null;
  spotDescription: string | null;
  destinationName: string;
  country: string;
  onClose: () => void;
}

export default function StoryNarrative({
  spotName,
  spotDescription,
  destinationName,
  country,
  onClose,
}: StoryNarrativeProps) {
  const [narrative, setNarrative] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [speechUtterance, setSpeechUtterance] = useState<SpeechSynthesisUtterance | null>(null);

  // Fetch long-form story from server
  const fetchNarrative = async () => {
    if (!spotName) return;
    setLoading(true);
    setNarrative('');
    setIsPlaying(false);
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }

    try {
      const res = await fetch('/api/narrative', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: destinationName,
          country: country,
          spotName: spotName,
          spotDescription: spotDescription,
        }),
      });
      const data = await res.json();
      if (data.narrative) {
        setNarrative(data.narrative);
      } else {
        setNarrative('The winds of time are silent on this spot today. Try again.');
      }
    } catch (err) {
      console.error(err);
      setNarrative('Failed to channel the storyteller spirit. Check your connection.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNarrative();
    return () => {
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, [spotName]);

  // Read aloud voice integration
  const toggleSpeech = () => {
    if (!window.speechSynthesis) {
      alert("Speech synthesis is not supported on this device/frame, but you can read the journal below!");
      return;
    }

    if (isPlaying) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
      return;
    }

    // Strip Markdown symbols for a cleaner reading voice
    const cleanText = narrative.replace(/[*#`_\-]/g, '');
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = 0.95; // slightly slower, storytelling pace
    utterance.pitch = 1.0;

    // Handle end of speech
    utterance.onend = () => {
      setIsPlaying(false);
    };
    utterance.onerror = () => {
      setIsPlaying(false);
    };

    setSpeechUtterance(utterance);
    window.speechSynthesis.speak(utterance);
    setIsPlaying(true);
  };

  return (
    <div id="story-narrative-panel" className="bg-white border border-slate-200 rounded-2xl p-6 shadow-md relative overflow-hidden transition-all duration-300">
      {/* Background glow elements */}
      <div className="absolute -top-12 -left-12 w-24 h-24 rounded-full bg-blue-500/[0.03] blur-xl pointer-events-none" />
      <div className="absolute -bottom-12 -right-12 w-24 h-24 rounded-full bg-amber-500/[0.03] blur-xl pointer-events-none" />

      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2">
          <Feather className="text-blue-600" size={18} />
          <span className="text-xs font-mono font-bold uppercase tracking-widest text-slate-500">
            Immersive Cultural Chronicles
          </span>
        </div>
        <button
          onClick={onClose}
          id="close-story-panel-btn"
          className="p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-all"
        >
          <X size={18} />
        </button>
      </div>

      <div className="space-y-4">
        <div>
          <h3 className="text-xl font-bold font-sans text-slate-900 tracking-tight">
            The Legend of {spotName}
          </h3>
          <p className="text-xs text-blue-600 font-mono mt-1">
            Setting: {destinationName}, {country}
          </p>
        </div>

        {loading ? (
          <div className="py-16 text-center space-y-4">
            <RefreshCw className="text-blue-600 animate-spin mx-auto" size={24} />
            <p className="text-xs text-slate-500 font-mono">
              Consulting historical archives and local folklore...
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Immersive Soundwave Visualizer & Speech Controller */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <button
                  onClick={toggleSpeech}
                  id="play-speech-narrative-btn"
                  className={`p-3 rounded-full transition-all ${
                    isPlaying 
                      ? 'bg-rose-50 text-rose-700 border border-rose-200' 
                      : 'bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100'
                  }`}
                  title={isPlaying ? "Mute Narration" : "Listen to Story"}
                >
                  {isPlaying ? <VolumeX size={18} /> : <Volume2 size={18} />}
                </button>

                <div>
                  <span className="text-xs font-bold text-slate-800 block">
                    {isPlaying ? "Chanting Chronicles..." : "Voice Storytelling"}
                  </span>
                  <span className="text-[10px] text-slate-500 block">
                    {isPlaying ? "Built-in synthetic audio reader active" : "Listen to a warm sensory readout"}
                  </span>
                </div>
              </div>

              {/* Soundwaves animation */}
              <div className="flex items-end gap-1 h-6">
                {[1, 2, 3, 4, 5, 6, 7, 8].map((bar) => {
                  let heightClass = "h-1";
                  if (isPlaying) {
                    // Randomize height categories for simulation
                    const randomHeights = ["h-3", "h-5", "h-2", "h-6", "h-4"];
                    heightClass = randomHeights[bar % randomHeights.length];
                  }
                  return (
                    <div
                      key={bar}
                      className={`w-0.75 bg-blue-600 rounded-full transition-all duration-300 ${heightClass} ${
                        isPlaying ? 'animate-pulse' : 'opacity-40'
                      }`}
                    />
                  );
                })}
              </div>
            </div>

            {/* Narrative text display */}
            <div className="prose prose-sm text-slate-750 font-serif leading-relaxed text-sm space-y-4 max-h-[380px] overflow-y-auto pr-2 custom-scrollbar">
              {narrative.split('\n\n').map((paragraph, idx) => {
                // If it starts with some markdown title, render it nicely or clean it
                const cleanedPara = paragraph.replace(/^[#* \t]+/, '');
                return (
                  <p key={idx} className="indent-4 first:indent-0 first-letter:text-2xl first-letter:font-bold first-letter:text-blue-600 first-letter:mr-1">
                    {cleanedPara}
                  </p>
                );
              })}
            </div>

            <div className="border-t border-slate-100 pt-4 flex justify-between items-center text-[10px] text-slate-400 font-mono">
              <span className="flex items-center gap-1">
                <BookOpen size={10} />
                Spoken narrative available offline
              </span>
              <button
                onClick={fetchNarrative}
                id="regenerate-narrative-btn"
                className="hover:text-blue-600 transition-colors flex items-center gap-1 font-bold"
              >
                <RefreshCw size={10} />
                Regenerate Voice Entry
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
