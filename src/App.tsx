import React, { useState } from 'react';
import { DestinationData, TravelPreference } from './types';
import HomePage from './components/HomePage';
import DestinationPage from './components/DestinationPage';

type View = 'home' | 'destination';

export default function App() {
  const [view, setView] = useState<View>('home');
  const [destinationData, setDestinationData] = useState<DestinationData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [loadingDestinationName, setLoadingDestinationName] = useState<string>('');

  const handleSearch = async (name: string, preferences?: TravelPreference) => {
    const trimmed = name.trim();
    if (!trimmed) return;

    setLoading(true);
    setError(null);
    setLoadingDestinationName(trimmed);

    const prefs = preferences || { interest: 'history', pace: 'moderate', budget: 'moderate' };

    try {
      const res = await fetch('/api/destination', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: trimmed, preferences: prefs }),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || 'Failed to generate cultural profile.');
      }

      const data: DestinationData = await res.json();
      setDestinationData(data);
      setView('destination');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'An unexpected error occurred.');
    } finally {
      setLoading(false);
      setLoadingDestinationName('');
    }
  };

  const handleBack = () => {
    setView('home');
    setDestinationData(null);
    setError(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen parchment-bg">
      <a href="#main-content" className="skip-link sr-only focus:not-sr-only">
        Skip to content
      </a>
      {view === 'home' && (
        <HomePage
          onSearch={handleSearch}
          loading={loading}
          loadingDestinationName={loadingDestinationName}
          error={error}
        />
      )}
      {view === 'destination' && destinationData && (
        <DestinationPage
          data={destinationData}
          onBack={handleBack}
          onSearch={handleSearch}
          loading={loading}
        />
      )}
    </div>
  );
}
