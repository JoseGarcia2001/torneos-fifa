"use client";

import { useCallback, useEffect, useState } from "react";
import {
  createInitialState,
  drawGroups,
  emptyResult,
  type MatchResult,
  type TournamentState,
} from "./tournament";

const STORAGE_KEY = "torneos-fifa:v1";

function load(): TournamentState {
  if (typeof window === "undefined") return createInitialState();
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return createInitialState();
    const parsed = JSON.parse(raw) as Partial<TournamentState>;
    const base = createInitialState();
    // Merge defensivo por si cambia el shape entre versiones.
    return {
      players: parsed.players ?? base.players,
      groups: parsed.groups ?? base.groups,
      results: parsed.results ?? base.results,
      config: { ...base.config, ...(parsed.config ?? {}) },
    };
  } catch {
    return createInitialState();
  }
}

export function useTournament() {
  const [state, setState] = useState<TournamentState>(createInitialState);
  const [mounted, setMounted] = useState(false);

  // Hidratamos desde localStorage tras montar para evitar mismatch SSR.
  useEffect(() => {
    setState(load());
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state, mounted]);

  const setPlayer = useCallback((index: number, name: string) => {
    setState((s) => {
      const players = [...s.players];
      players[index] = name;
      return { ...s, players };
    });
  }, []);

  const draw = useCallback(() => {
    setState((s) => ({
      ...s,
      groups: drawGroups(s.players),
      results: {}, // un nuevo sorteo reinicia los resultados
    }));
  }, []);

  const setResult = useCallback(
    (id: string, patch: Partial<MatchResult>) => {
      setState((s) => ({
        ...s,
        results: {
          ...s.results,
          [id]: { ...emptyResult(), ...s.results[id], ...patch },
        },
      }));
    },
    [],
  );

  const setConfig = useCallback(
    (patch: Partial<TournamentState["config"]>) => {
      setState((s) => ({ ...s, config: { ...s.config, ...patch } }));
    },
    [],
  );

  const resetResults = useCallback(() => {
    setState((s) => ({ ...s, results: {} }));
  }, []);

  const resetAll = useCallback(() => {
    setState(createInitialState());
  }, []);

  return {
    state,
    mounted,
    setPlayer,
    draw,
    setResult,
    setConfig,
    resetResults,
    resetAll,
  };
}
