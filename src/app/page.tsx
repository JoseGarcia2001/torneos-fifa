"use client";

import { useState } from "react";
import { useTournament } from "@/lib/useTournament";
import HomeTab from "@/components/HomeTab";
import DrawTab from "@/components/DrawTab";
import GroupsTab from "@/components/GroupsTab";
import FinalsTab from "@/components/FinalsTab";
import MusicPlayer from "@/components/MusicPlayer";

type Tab = "inicio" | "sorteo" | "grupos" | "final";

const TABS: { id: Tab; label: string }[] = [
  { id: "inicio", label: "🏠 Inicio" },
  { id: "sorteo", label: "🎲 Sorteo" },
  { id: "grupos", label: "📊 Grupos" },
  { id: "final", label: "🏆 Final" },
];

export default function Page() {
  const t = useTournament();
  const [tab, setTab] = useState<Tab>("inicio");

  if (!t.mounted) {
    return (
      <div className="grid min-h-[60vh] place-items-center text-zinc-500">
        Cargando…
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-3xl px-4 pb-24 pt-6">
      <header className="text-center">
        <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
          ⚽ Copa Familiar <span className="text-emerald-400">FIFA</span>
        </h1>
        {t.state.config.eventDate && (
          <p className="mt-1 text-sm text-zinc-400">
            {t.state.config.eventDate}
          </p>
        )}
      </header>

      {/* Navegación */}
      <nav className="sticky top-2 z-10 mt-6 flex justify-center">
        <div className="flex gap-1 rounded-full border border-zinc-700/60 bg-zinc-900/80 p-1 backdrop-blur">
          {TABS.map((item) => (
            <button
              key={item.id}
              onClick={() => setTab(item.id)}
              className={`rounded-full px-3 py-2 text-sm font-semibold transition sm:px-4 ${
                tab === item.id
                  ? "bg-emerald-600 text-white"
                  : "text-zinc-400 hover:text-zinc-100"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </nav>

      <main className="mt-6">
        {tab === "inicio" && (
          <HomeTab state={t.state} setConfig={t.setConfig} />
        )}
        {tab === "sorteo" && (
          <DrawTab
            state={t.state}
            setPlayer={t.setPlayer}
            draw={t.draw}
            goToGroups={() => setTab("grupos")}
          />
        )}
        {tab === "grupos" && (
          <GroupsTab
            state={t.state}
            setResult={t.setResult}
            goToDraw={() => setTab("sorteo")}
          />
        )}
        {tab === "final" && (
          <FinalsTab
            state={t.state}
            setResult={t.setResult}
            goToGroups={() => setTab("grupos")}
          />
        )}
      </main>

      <footer className="mt-12 flex items-center justify-center gap-4 text-xs text-zinc-600">
        <button
          onClick={() => {
            if (window.confirm("¿Borrar TODO el torneo y empezar de cero?")) {
              t.resetAll();
              setTab("inicio");
            }
          }}
          className="transition hover:text-red-400"
        >
          ↺ Reiniciar torneo
        </button>
      </footer>

      <MusicPlayer />
    </div>
  );
}
