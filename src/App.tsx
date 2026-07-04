import React, { useState, useCallback } from 'react';
import { DestinationData, TravelPreference } from './types';
import HomePage from './components/HomePage';
import DestinationPage from './components/DestinationPage';
import LoadingOverlay from './components/LoadingOverlay';

type View = 'home' | 'destination';

/**
 * Main Application Component
 * Manages global state including the current view, loading state, and active destination data.
 * @returns {JSX.Element} The rendered application
 */
export default function App(): React.ReactElement {
  const [view, setView] = useState<View>('home');
  const [destinationData, setDestinationData] = useState<DestinationData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [loadingDestinationName, setLoadingDestinationName] = useState<string>('');

  /**
   * Handles the search submission and fetches destination data from the API.
   * @param {string} name - The destination name
   * @param {TravelPreference} [preferences] - Optional travel preferences
   */
  const handleSearch = useCallback(async (name: string, preferences?: TravelPreference) => {
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
    } catch (err: unknown) {
      console.error(err);
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unexpected error occurred.');
      }
    } finally {
      setLoading(false);
      setLoadingDestinationName('');
    }
  }, []);

  /**
   * Resets the view back to the home page.
   */
  const handleBack = useCallback(() => {
    setView('home');
    setDestinationData(null);
    setError(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return (
    <div className="min-h-screen">
      <LoadingOverlay isVisible={loading} destinationName={loadingDestinationName} />
      <a href="#main-content" className="skip-link sr-only focus:not-sr-only">
        Skip to content
      </a>
      {view === 'home' && (
        <HomePage
          onSearch={handleSearch}
          loading={loading}
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
