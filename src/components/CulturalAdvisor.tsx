import React, { useState, useEffect, useRef } from 'react';
import { Send, RefreshCw, MessageCircle } from 'lucide-react';
import { ChatMessage, DestinationData } from '../types';

interface CulturalAdvisorProps {
  destination?: DestinationData;
}

export default function CulturalAdvisor({ destination }: CulturalAdvisorProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const SUGGESTIONS = destination
    ? [
        { text: `How do I greet elders respectfully in ${destination.name}?`, label: '🙏 Greetings' },
        { text: `What are the customs at temples and religious sites in ${destination.name}?`, label: '🛕 Temple Etiquette' },
        { text: `What local dishes must I try in ${destination.name} and where?`, label: '🍛 Local Cuisine' },
        { text: `What is the best way to interact respectfully with local artisans?`, label: '🪡 Artisan Protocol' },
        { text: `What Hindi or local phrases should I know for ${destination.name}?`, label: '🗣️ Useful Phrases' },
      ]
    : [
        { text: 'What is the best way to respect community boundaries while traveling in India?', label: '🙏 Respectful Travel' },
        { text: 'How can I discover authentic local festivals and oral traditions?', label: '🎊 Festivals' },
      ];

  useEffect(() => {
    const greeting = destination
      ? `Namaste 🙏 I am **Pandit Ji**, your cultural guide to **${destination.name}, ${destination.country}**.\n\nI carry deep knowledge of local customs, sacred etiquette, traditional phrases, and authentic cultural experiences. Ask me anything — from temple protocols to tipping conventions to hidden street food spots!`
      : `Namaste 🙏 I am **Pandit Ji**, your Cultural Concierge for Incredible India.\n\nSearch for a destination to unlock hyper-local wisdom, or ask me anything about Indian culture, customs, and travel etiquette!`;

    setMessages([
      {
        id: 'welcome',
        role: 'model',
        text: greeting,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
  }, [destination]);

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
        throw new Error('No response returned');
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: Math.random().toString(),
          role: 'model',
          text: 'Kshama kijiye (apologies) — the connection with the ancient scrolls is hazy right now. Please try again!',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const renderMessageText = (text: string) => {
    return text.split('\n\n').map((para, pIdx) => (
      <p key={pIdx} className="mb-2 last:mb-0 text-sm font-body leading-relaxed">
        {para.split('**').map((chunk, cIdx) =>
          cIdx % 2 === 1
            ? <strong key={cIdx} className="font-semibold">{chunk}</strong>
            : chunk
        )}
      </p>
    ));
  };

  return (
    <div
      id="cultural-advisor-root"
      className="india-card flex flex-col"
      style={{ height: '600px' }}
    >
      {/* Header */}
      <div className="p-5 flex items-center justify-between"
        style={{ borderBottom: '1px solid rgba(201,150,12,0.15)' }}>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full flex items-center justify-center text-xl"
            style={{ background: 'linear-gradient(135deg, rgba(232,132,26,0.15), rgba(201,150,12,0.15))', border: '1px solid rgba(201,150,12,0.3)' }}>
            🧙‍♂️
          </div>
          <div>
            <h3 className="font-display font-bold text-base" style={{ color: 'var(--text-dark)' }}>
              Pandit Ji
            </h3>
            <span className="text-xs font-body" style={{ color: 'var(--saffron)' }}>
              {destination ? `Cultural Guide · ${destination.name}` : 'India Cultural Concierge'}
            </span>
          </div>
        </div>
        <button
          onClick={() => {
            const greeting = destination
              ? `Namaste 🙏 I am **Pandit Ji**, your guide to **${destination.name}**. How may I assist you?`
              : `Namaste 🙏 I am **Pandit Ji**. Ask me about Indian culture!`;
            setMessages([{ id: 'reset', role: 'model', text: greeting, timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }]);
          }}
          className="p-2 rounded-full transition-all"
          style={{ border: '1px solid rgba(201,150,12,0.2)', color: 'var(--text-muted)' }}
          title="Reset conversation"
        >
          <RefreshCw size={13} />
        </button>
      </div>

      {/* Messages */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-4 space-y-4 custom-scroll"
        id="chat-messages-container"
      >
        {messages.map((m) => {
          const isModel = m.role === 'model';
          return (
            <div key={m.id} className={`flex flex-col ${isModel ? 'items-start' : 'items-end'} gap-1`}>
              <div
                className={`max-w-[85%] px-4 py-3 ${isModel ? 'chat-model' : 'chat-user'}`}
              >
                {renderMessageText(m.text)}
              </div>
              <span className="text-[10px] px-1 font-body" style={{ color: 'var(--text-muted)' }}>
                {m.timestamp}
              </span>
            </div>
          );
        })}

        {loading && (
          <div className="flex items-center gap-2 text-sm font-body" style={{ color: 'var(--text-muted)' }}>
            <div className="flex gap-1">
              <div className="w-2 h-2 rounded-full animate-bounce" style={{ background: 'var(--saffron)', animationDelay: '0ms' }} />
              <div className="w-2 h-2 rounded-full animate-bounce" style={{ background: 'var(--gold)', animationDelay: '150ms' }} />
              <div className="w-2 h-2 rounded-full animate-bounce" style={{ background: 'var(--saffron)', animationDelay: '300ms' }} />
            </div>
            <span>Thinking...</span>
          </div>
        )}
      </div>

      {/* Suggestion pills */}
      {messages.length === 1 && !loading && (
        <div className="px-4 pt-2 pb-1">
          <div className="text-[10px] font-body font-semibold uppercase tracking-wider mb-2" style={{ color: 'var(--text-muted)' }}>
            Quick Inquiries
          </div>
          <div className="flex flex-wrap gap-1.5">
            {SUGGESTIONS.map((s, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(s.text)}
                className="text-xs font-body px-2.5 py-1 rounded-full transition-all"
                style={{
                  background: 'rgba(232,132,26,0.08)',
                  border: '1px solid rgba(232,132,26,0.25)',
                  color: 'var(--saffron-dark)',
                }}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input */}
      <div className="p-4 flex gap-2" style={{ borderTop: '1px solid rgba(201,150,12,0.15)' }}>
        <input
          id="advisor-chat-input"
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend(inputValue)}
          placeholder={destination ? `Ask about ${destination.name} customs...` : 'Ask Pandit Ji about India...'}
          disabled={loading}
          className="flex-1 px-4 py-2.5 rounded-full text-sm font-body transition-all focus:outline-none"
          style={{
            background: 'rgba(232,132,26,0.06)',
            border: '1.5px solid rgba(232,132,26,0.2)',
            color: 'var(--text-dark)',
          }}
          onFocus={(e) => {
            (e.currentTarget as HTMLInputElement).style.borderColor = 'var(--saffron)';
            (e.currentTarget as HTMLInputElement).style.boxShadow = '0 0 0 3px rgba(232,132,26,0.12)';
          }}
          onBlur={(e) => {
            (e.currentTarget as HTMLInputElement).style.borderColor = 'rgba(232,132,26,0.2)';
            (e.currentTarget as HTMLInputElement).style.boxShadow = 'none';
          }}
        />
        <button
          id="advisor-chat-send-btn"
          onClick={() => handleSend(inputValue)}
          disabled={loading || !inputValue.trim()}
          className="btn-saffron p-2.5 rounded-full"
        >
          <Send size={15} />
        </button>
      </div>
    </div>
  );
}
