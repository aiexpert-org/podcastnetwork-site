"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

/**
 * Shared playhead state (day 0-180) for the six-month arc. Consumed by the
 * hero entity graph and the playhead slider on both `/` and `/the-method/`.
 * Persists to sessionStorage so a scrub on one page carries to the other.
 *
 * Default is Day 180: visitors see the finished graph first, then discover
 * they can scrub back to watch it build.
 */

const STORAGE_KEY = "pn-playhead-day";
export const FULL_DAY = 180;

type PlayheadState = {
  day: number;
  setDay: (day: number) => void;
};

const PlayheadContext = createContext<PlayheadState>({
  day: FULL_DAY,
  setDay: () => {},
});

export function PlayheadProvider({ children }: { children: React.ReactNode }) {
  const [day, setDayState] = useState(FULL_DAY);

  useEffect(() => {
    try {
      const stored = sessionStorage.getItem(STORAGE_KEY);
      if (stored !== null) {
        const parsed = Number(stored);
        if (!Number.isNaN(parsed)) {
          setDayState(Math.max(0, Math.min(FULL_DAY, parsed)));
        }
      }
    } catch {
      // Private-mode browsers: state stays in memory only.
    }
  }, []);

  const setDay = useCallback((next: number) => {
    const clamped = Math.max(0, Math.min(FULL_DAY, Math.round(next)));
    setDayState(clamped);
    try {
      sessionStorage.setItem(STORAGE_KEY, String(clamped));
    } catch {
      // Ignore storage failures.
    }
  }, []);

  return (
    <PlayheadContext.Provider value={{ day, setDay }}>
      {children}
    </PlayheadContext.Provider>
  );
}

export function usePlayhead() {
  return useContext(PlayheadContext);
}
