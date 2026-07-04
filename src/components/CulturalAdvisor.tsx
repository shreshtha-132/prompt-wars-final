import React, { useState, useEffect, useRef } from 'react';
import { Send, Sparkles, MessageCircle, RefreshCw, Compass } from 'lucide-react';
import { ChatMessage, DestinationData } from '../types';

interface CulturalAdvisorProps {
  destination?: DestinationData;
}

export default function CulturalAdvisor({ destination }: CulturalAdvisorProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Suggested prompt quick buttons
  const SUGGESTIONS = destination ? [
    { text: `How do I say "Thank You" politely in the native language?`, label: "Local Phrases" },
    { text: `What is the customary tipping protocol and restaurant etiquette here?`, label: "Tipping & Dining" },
    { text: `What are the core protocols when visiting sacred or religious spaces in ${destination.name}?`, label: "Sacred Etiquette" },
    { text: `Tell me about a highly respectable way to interact with local artisans without interrupting their work.`, label: "Artisan Protocol" }
  ] : [
    { text: "What is the best way to respect community boundaries while traveling?", label: "Respectful Travel" },
    { text: "How can I discover authentic folklore and oral histories?", label: "Folklore Discovery" }
  ];

  // Initialize chat greeting
  useEffect(() => {
    if (destination) {
      setMessages([
        {
          id: 'welcome',
          role: 'model',
          text: `Greeting traveler. I am **Scribe**, your Cultural Concierge. I am deeply acquainted with the customs, lore, and community wisdom of **${destination.name}, ${destination.country}**. 

Ask me anything about local protocols, respectful phrases, culinary etiquette, or how to seek authentic cultural connections!`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        }
      ]);
    } else {
      setMessages([
        {
          id: 'welcome-generic',
          role: 'model',
          text: `Greetings. I am **Scribe**, your Cultural Concierge. Select a destination or type one above to map out local customs, wisdom, and proverbs together!`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        }
      ]);
    }
  }, [destination]);

  // Scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading]);

  const handleSend = async (textToSend: string) => {
    const trimmed = textToSend.trim();
    if (!trimmed || loading) return;

    const userMsg: ChatMessage = {
      id: Math.random().toString(),
      role: 'user',
      text: trimmed,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputValue('');
    setLoading(true);

    try {
      const chatHistory = [...messages, userMsg].map((m) => ({
        role: m.role,
        text: m.text,
      }));

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: chatHistory,
          destinationContext: destination || null,
        }),
      });

      const data = await res.json();
      if (data.text) {
        setMessages((prev) => [
          ...prev,
          {
            id: Math.random().toString(),
            role: 'model',
            text: data.text,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          },
        ]);
      } else {
        throw new Error('No text returned');
      }
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        {
          id: Math.random().toString(),
          role: 'model',
          text: 'Forgive me, the communication lines are slightly hazy. Please try asking again.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div id="cultural-advisor-root" className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm h-[550px] flex flex-col justify-between">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-3">
        <div className="flex items-center gap-2">
          <MessageCircle className="text-blue-600" size={18} />
          <div>
            <h3 className="text-sm font-bold text-slate-900 font-sans">
              Scribe: Cultural Advisor
            </h3>
            {destination ? (
              <span className="text-[10px] text-blue-600 font-mono">
                Concierge for {destination.name}
              </span>
            ) : (
              <span className="text-[10px] text-slate-400 font-mono">
                Universal Guidance
              </span>
            )}
          </div>
        </div>

        <button
          onClick={() => {
            if (destination) {
              setMessages([
                {
                  id: 'welcome',
                  role: 'model',
                  text: `Greeting traveler. I am **Scribe**, your Cultural Concierge. I am deeply acquainted with the customs, lore, and community wisdom of **${destination.name}, ${destination.country}**. \n\nAsk me anything about local protocols, respectful phrases, culinary etiquette, or how to seek authentic cultural connections!`,
                  timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                }
              ]);
            }
          }}
          className="p-1 rounded text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-all"
          title="Reset Concierge Conversation"
        >
          <RefreshCw size={12} />
        </button>
      </div>

      {/* Messages body */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto space-y-4 pr-1 mb-4 custom-scrollbar"
        id="chat-messages-container"
      >
        {messages.map((m) => {
          const isModel = m.role === 'model';
          return (
            <div
              key={m.id}
              className={`flex flex-col ${isModel ? 'items-start' : 'items-end'} space-y-1`}
            >
              <div
                className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-xs leading-relaxed ${
                  isModel
                    ? 'bg-slate-50 border border-slate-200/80 text-slate-700 rounded-tl-none'
                    : 'bg-blue-50 border border-blue-200 text-blue-900 rounded-tr-none'
                }`}
              >
                {/* Simplified markdown formatter for chat */}
                {m.text.split('\n\n').map((para, pIdx) => {
                  return (
                    <p key={pIdx} className="mb-2 last:mb-0">
                      {para.split('**').map((chunk, cIdx) => {
                        if (cIdx % 2 === 1) {
                          return <strong key={cIdx} className="text-blue-700 font-bold">{chunk}</strong>;
                        }
                        return chunk;
                      })}
                    </p>
                  );
                })}
              </div>
              <span className="text-[9px] text-slate-400 font-mono px-1">
                {m.timestamp}
              </span>
            </div>
          );
        })}

        {loading && (
          <div className="flex items-center gap-1.5 text-xs text-slate-400 font-mono py-1">
            <Sparkles size={11} className="text-blue-600 animate-spin" />
            Scribe is writing native guidelines...
          </div>
        )}
      </div>

      {/* Suggested Quick Prompt buttons */}
      <div className="space-y-3">
        {messages.length === 1 && !loading && (
          <div className="space-y-1.5">
            <span className="text-[9px] font-mono uppercase text-slate-400 tracking-wider flex items-center gap-1">
              <Compass size={10} />
              Quick Custom Inquiries
            </span>
            <div className="flex flex-wrap gap-1.5 max-h-[110px] overflow-y-auto">
              {SUGGESTIONS.map((s, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSend(s.text)}
                  className="text-[10px] bg-slate-50 border border-slate-200 text-slate-600 hover:text-blue-700 hover:bg-blue-50 hover:border-blue-300 px-2.5 py-1 rounded-lg transition-all text-left"
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input box */}
        <div className="flex gap-2">
          <input
            type="text"
            id="advisor-chat-input"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend(inputValue)}
            placeholder={destination ? `Inquire about ${destination.name} customs...` : "Type a custom travel query..."}
            className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500/50 transition-all"
            disabled={loading}
          />
          <button
            onClick={() => handleSend(inputValue)}
            id="advisor-chat-send-btn"
            className="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-all shadow-sm"
            disabled={loading}
          >
            <Send size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}
