import { useState, useEffect, useCallback } from 'react';

const MAX_HEARTS = 5;
const HEART_REGENERATION_MS = 15 * 60 * 1000; // 15 minutes per heart
const STORAGE_KEY = 'quiz_hearts';

interface HeartsState {
  hearts: number;
  lastLostAt: number | null;
}

export function useHearts() {
  const [hearts, setHearts] = useState(MAX_HEARTS);
  const [lastLostAt, setLastLostAt] = useState<number | null>(null);
  const [timeUntilNextHeart, setTimeUntilNextHeart] = useState<number>(0);

  // Load state from localStorage
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const state: HeartsState = JSON.parse(saved);
      
      // Calculate regenerated hearts
      if (state.lastLostAt && state.hearts < MAX_HEARTS) {
        const elapsed = Date.now() - state.lastLostAt;
        const regeneratedHearts = Math.floor(elapsed / HEART_REGENERATION_MS);
        const newHearts = Math.min(MAX_HEARTS, state.hearts + regeneratedHearts);
        
        if (newHearts >= MAX_HEARTS) {
          setHearts(MAX_HEARTS);
          setLastLostAt(null);
        } else {
          setHearts(newHearts);
          // Adjust lastLostAt to account for partial regeneration
          const newLastLostAt = state.lastLostAt + (regeneratedHearts * HEART_REGENERATION_MS);
          setLastLostAt(newLastLostAt);
        }
      } else {
        setHearts(state.hearts);
        setLastLostAt(state.lastLostAt);
      }
    }
  }, []);

  // Save state to localStorage
  useEffect(() => {
    const state: HeartsState = { hearts, lastLostAt };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [hearts, lastLostAt]);

  // Timer for heart regeneration
  useEffect(() => {
    if (hearts >= MAX_HEARTS || !lastLostAt) {
      setTimeUntilNextHeart(0);
      return;
    }

    const interval = setInterval(() => {
      const elapsed = Date.now() - lastLostAt;
      const timeForNextHeart = HEART_REGENERATION_MS - (elapsed % HEART_REGENERATION_MS);
      setTimeUntilNextHeart(timeForNextHeart);

      // Check if a heart should regenerate
      const regeneratedHearts = Math.floor(elapsed / HEART_REGENERATION_MS);
      if (regeneratedHearts > 0) {
        const newHearts = Math.min(MAX_HEARTS, hearts + regeneratedHearts);
        setHearts(newHearts);
        
        if (newHearts >= MAX_HEARTS) {
          setLastLostAt(null);
        } else {
          setLastLostAt(lastLostAt + (regeneratedHearts * HEART_REGENERATION_MS));
        }
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [hearts, lastLostAt]);

  // Use a heart when completing a stage
  const useHeart = useCallback((): boolean => {
    if (hearts > 0) {
      setHearts(prev => prev - 1);
      if (!lastLostAt) {
        setLastLostAt(Date.now());
      }
      return true; // Successfully used a heart
    }
    return false; // No hearts available
  }, [hearts, lastLostAt]);

  // Check if user can start a stage (has hearts)
  const canStartStage = useCallback((): boolean => {
    return hearts > 0;
  }, [hearts]);

  const watchAd = useCallback(() => {
    // Simulate watching an ad - in production, integrate with ad SDK
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        setHearts(prev => Math.min(MAX_HEARTS, prev + 1));
        resolve();
      }, 3000); // Simulate 3 second ad
    });
  }, []);

  const refillHearts = useCallback(() => {
    setHearts(MAX_HEARTS);
    setLastLostAt(null);
  }, []);

  const formatTime = (ms: number): string => {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return {
    hearts,
    maxHearts: MAX_HEARTS,
    hasHearts: hearts > 0,
    useHeart,
    canStartStage,
    watchAd,
    refillHearts,
    timeUntilNextHeart,
    formattedTimeUntilNextHeart: formatTime(timeUntilNextHeart),
    isRegenerating: hearts < MAX_HEARTS && lastLostAt !== null
  };
}
