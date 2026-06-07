"use client";

import { useState } from "react";

// Himno oficial del Mundial 2014 — "We Are One (Ole Ola)" de Pitbull.
const VIDEO_ID = "TGtWWb9emYI";

export default function MusicPlayer() {
  const [playing, setPlaying] = useState(false);

  return (
    <>
      {/* El iframe se monta al darle play (gesto del usuario) para que el
          navegador permita el audio. Loop infinito sobre el mismo video. */}
      {playing && (
        <iframe
          title="Música del torneo"
          src={`https://www.youtube-nocookie.com/embed/${VIDEO_ID}?autoplay=1&loop=1&playlist=${VIDEO_ID}&controls=0&modestbranding=1`}
          allow="autoplay; encrypted-media"
          className="pointer-events-none fixed h-px w-px opacity-0"
          aria-hidden
        />
      )}

      <button
        onClick={() => setPlaying((p) => !p)}
        aria-label={playing ? "Pausar música" : "Poner música"}
        className={`fixed bottom-5 right-5 z-20 flex items-center gap-2 rounded-full px-4 py-3 text-sm font-bold shadow-lg transition active:scale-95 ${
          playing
            ? "bg-amber-500 text-zinc-900 shadow-amber-900/40"
            : "bg-zinc-800/90 text-amber-300 shadow-black/40 hover:bg-zinc-700"
        }`}
      >
        <span className={playing ? "animate-bounce" : ""}>
          {playing ? "🔊" : "🎵"}
        </span>
        <span className="hidden sm:inline">
          {playing ? "Ole Ola!" : "Música"}
        </span>
      </button>
    </>
  );
}
