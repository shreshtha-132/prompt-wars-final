import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, RefreshCw, X, Feather } from 'lucide-react';

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

  const fetchNarrative = async () => {
    if (!spotName) return;
    setLoading(true);
    setNarrative('');
    setIsPlaying(false);
    if (window.speechSynthesis) window.speechSynthesis.cancel();

    try {
      const res = await fetch('/api/narrative', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: destinationName, country, spotName, spotDescription }),
      });
      const data = await res.json();
      setNarrative(data.narrative || 'The winds of time are silent on this spot today. Try again.');
    } catch {
      setNarrative('Failed to channel the storyteller spirit. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNarrative();
    return () => {
      if (window.speechSynthesis) window.speechSynthesis.cancel();
    };
  }, [spotName]);

  const toggleSpeech = () => {
    if (!window.speechSynthesis) {
      alert('Speech synthesis is not supported in this browser, but you can read the journal below!');
      return;
    }
    if (isPlaying) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
      return;
    }
    const cleanText = narrative.replace(/[*#`_\-]/g, '');
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = 0.9;
    utterance.pitch = 1.0;
    utterance.onend = () => setIsPlaying(false);
    utterance.onerror = () => setIsPlaying(false);
    window.speechSynthesis.speak(utterance);
    setIsPlaying(true);
  };

  return (
    <div id="story-narrative-panel" className="p-6 md:p-8 story-scroll rounded-2xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Feather size={18} style={{ color: 'var(--saffron)' }} />
          <span className="text-xs font-body font-semibold uppercase tracking-widest"
            style={{ color: 'var(--text-muted)' }}>
            Immersive Cultural Chronicle
          </span>
        </div>
        <button
          id="close-story-panel-btn"
          onClick={onClose}
          className="p-1.5 rounded-full transition-all"
          style={{ border: '1px solid rgba(201,150,12,0.2)', color: 'var(--text-muted)' }}
        >
          <X size={16} />
        </button>
      </div>

      {/* Title */}
      <div className="mb-6">
        <h2 className="font-display font-bold italic"
          style={{ fontSize: 'clamp(1.5rem, 4vw, 2.25rem)', color: 'var(--text-dark)', lineHeight: 1.2 }}>
          The Legend of {spotName}
        </h2>
        <p className="text-sm font-body mt-1" style={{ color: 'var(--saffron)' }}>
          {destinationName}, {country}
        </p>
      </div>

      {loading ? (
        <div className="py-16 text-center">
          <div className="relative mx-auto mb-4" style={{ width: 56, height: 56 }}>
            <div className="mandala-spinner absolute inset-0" />
            <div className="absolute inset-0 flex items-center justify-center text-2xl">📜</div>
          </div>
          <p className="text-sm font-body" style={{ color: 'var(--text-muted)' }}>
            Weaving your cultural narrative...
          </p>
        </div>
      ) : (
        <>
          {/* Audio player */}
          <div className="rounded-2xl p-4 mb-6 flex items-center justify-between gap-4"
            style={{ background: 'rgba(232,132,26,0.08)', border: '1px solid rgba(232,132,26,0.2)' }}>
            <div className="flex items-center gap-3">
              <button
                id="play-speech-narrative-btn"
                onClick={toggleSpeech}
                className="w-11 h-11 rounded-full flex items-center justify-center transition-all"
                style={{
                  background: isPlaying
                    ? 'linear-gradient(135deg, var(--crimson), var(--crimson-dark))'
                    : 'linear-gradient(135deg, var(--saffron), var(--saffron-dark))',
                  boxShadow: isPlaying ? 'var(--shadow-crimson)' : 'var(--shadow-saffron)',
                }}
                title={isPlaying ? 'Stop narration' : 'Listen to story'}
              >
                {isPlaying ? <VolumeX size={18} className="text-white" /> : <Volume2 size={18} className="text-white" />}
              </button>
              <div>
                <span className="text-sm font-body font-semibold block" style={{ color: 'var(--text-dark)' }}>
                  {isPlaying ? 'Narrating...' : 'Voice Narration'}
                </span>
                <span className="text-xs font-body" style={{ color: 'var(--text-muted)' }}>
                  {isPlaying ? 'Click to stop' : 'Hear the story aloud'}
                </span>
              </div>
            </div>

            {/* Wave bars */}
            <div className="flex items-end gap-0.5 h-7">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((bar) => (
                <div
                  key={bar}
                  className={`wave-bar ${isPlaying ? 'playing' : ''}`}
                  style={{ opacity: isPlaying ? 1 : 0.3 }}
                />
              ))}
            </div>
          </div>

          {/* Narrative text — parchment scroll style */}
          <div className="custom-scroll" style={{ maxHeight: '380px', overflowY: 'auto', paddingRight: '8px' }}>
            {narrative.split('\n\n').map((paragraph, idx) => {
              const cleaned = paragraph.replace(/^[#* \t]+/, '').trim();
              if (!cleaned) return null;
              return (
                <p
                  key={idx}
                  className={`font-display text-base leading-loose mb-4 ${idx === 0 ? 'story-drop-cap' : ''}`}
                  style={{ color: 'var(--text-dark)', textAlign: 'justify' }}
                >
                  {cleaned}
                </p>
              );
            })}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between pt-4 mt-4"
            style={{ borderTop: '1px solid rgba(201,150,12,0.15)' }}>
            <span className="text-xs font-body" style={{ color: 'var(--text-muted)' }}>
              ✦ Immersive cultural narrative
            </span>
            <button
              id="regenerate-narrative-btn"
              onClick={fetchNarrative}
              className="flex items-center gap-1.5 text-xs font-body font-semibold transition-all px-3 py-1.5 rounded-full"
              style={{
                background: 'rgba(232,132,26,0.08)',
                border: '1px solid rgba(232,132,26,0.25)',
                color: 'var(--saffron-dark)',
              }}
            >
              <RefreshCw size={11} />
              Regenerate
            </button>
          </div>
        </>
      )}
    </div>
  );
}
