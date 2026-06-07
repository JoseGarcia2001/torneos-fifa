"use client";

import { useEffect, useRef, useState } from "react";
import { drawGroups, type TournamentState } from "@/lib/tournament";

interface Props {
  state: TournamentState;
  setPlayer: (index: number, name: string) => void;
  draw: () => void;
  goToGroups: () => void;
}

export default function DrawTab({
  state,
  setPlayer,
  draw,
  goToGroups,
}: Props) {
  const [drawing, setDrawing] = useState(false);
  const [preview, setPreview] = useState<{ A: string[]; B: string[] } | null>(
    null,
  );
  const timers = useRef<number[]>([]);

  useEffect(() => {
    return () => timers.current.forEach((t) => window.clearTimeout(t));
  }, []);

  const runDraw = () => {
    if (drawing) return;
    if (state.groups && !window.confirm("Volver a sortear borra todos los resultados. ¿Seguro?")) {
      return;
    }
    setDrawing(true);
    const interval = window.setInterval(() => {
      setPreview(drawGroups(state.players));
    }, 90);
    const stop = window.setTimeout(() => {
      window.clearInterval(interval);
      draw();
      setPreview(null);
      setDrawing(false);
    }, 1600);
    timers.current.push(interval, stop);
  };

  const shown = preview ?? state.groups;

  return (
    <div className="space-y-6">
      {/* Editor de jugadores */}
      <section className="rounded-2xl border border-zinc-700/50 bg-zinc-900/60 p-6">
        <h2 className="text-lg font-bold text-zinc-200">Jugadores</h2>
        <p className="mt-1 text-sm text-zinc-400">
          Ajusta los nombres si hace falta. Cuando estén todos reunidos, dale a
          sortear.
        </p>
        <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2">
          {state.players.map((p, i) => (
            <div key={i} className="flex items-center gap-2">
              <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-emerald-700/40 text-xs font-bold text-emerald-200">
                {i + 1}
              </span>
              <input
                value={p}
                disabled={drawing}
                onChange={(e) => setPlayer(i, e.target.value)}
                className="h-10 w-full rounded-lg bg-zinc-800 px-3 text-zinc-50 outline-none ring-2 ring-transparent focus:ring-emerald-400/70 disabled:opacity-50"
              />
            </div>
          ))}
        </div>
      </section>

      {/* Botón de sorteo */}
      <div className="flex flex-col items-center gap-3">
        <button
          onClick={runDraw}
          disabled={drawing}
          className="rounded-full bg-gradient-to-r from-emerald-500 to-emerald-700 px-8 py-4 text-lg font-extrabold text-white shadow-lg shadow-emerald-900/50 transition hover:scale-[1.03] active:scale-95 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {drawing ? "🎲 Sorteando…" : state.groups ? "🔄 Volver a sortear" : "🎲 Sortear grupos"}
        </button>
        {state.groups && !drawing && (
          <button
            onClick={goToGroups}
            className="text-sm font-medium text-emerald-300 underline-offset-4 hover:underline"
          >
            Ir a los partidos →
          </button>
        )}
      </div>

      {/* Resultado del sorteo */}
      {shown && (
        <div className="grid gap-4 sm:grid-cols-2">
          <GroupCard
            title="Grupo A"
            color="emerald"
            names={shown.A}
            flicker={drawing}
          />
          <GroupCard
            title="Grupo B"
            color="amber"
            names={shown.B}
            flicker={drawing}
          />
        </div>
      )}
    </div>
  );
}

function GroupCard({
  title,
  color,
  names,
  flicker,
}: {
  title: string;
  color: "emerald" | "amber";
  names: string[];
  flicker: boolean;
}) {
  const border = color === "emerald" ? "border-emerald-600/50" : "border-amber-600/50";
  const head = color === "emerald" ? "text-emerald-300" : "text-amber-300";
  const dot = color === "emerald" ? "bg-emerald-500" : "bg-amber-500";
  return (
    <section className={`rounded-2xl border ${border} bg-zinc-900/60 p-5`}>
      <h3 className={`text-base font-bold ${head}`}>{title}</h3>
      <ul className="mt-3 space-y-2">
        {names.map((n, i) => (
          <li
            key={i}
            className={`flex items-center gap-3 rounded-lg bg-zinc-800/70 px-3 py-2 ${
              flicker ? "opacity-80" : "animate-pop"
            }`}
          >
            <span className={`h-2.5 w-2.5 rounded-full ${dot}`} />
            <span className="font-medium text-zinc-100">{n}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
