"use client";

import { useEffect, useRef, useState } from "react";

// Himno oficial del Mundial 2014 — "We Are One (Ole Ola)" de Pitbull.
const VIDEO_ID = "TGtWWb9emYI";

export default function MusicPlayer() {
  const [playing, setPlaying] = useState(true); // intenta sonar al entrar
  const [kick, setKick] = useState(0); // fuerza re-montar el iframe
  const kicked = useRef(false);

  // Los navegadores bloquean el autoplay con sonido hasta que el usuario
  // interactúa. En el primer toque/clic/tecla re-montamos el iframe DENTRO
  // del gesto para que el audio arranque sí o sí.
  useEffect(() => {
    const start = () => {
      if (kicked.current) return;
      kicked.current = true;
      setPlaying(true);
      setKick((k) => k + 1);
      cleanup();
    };
    const cleanup = () => {
      document.removeEventListener("pointerdown", start);
      document.removeEventListener("keydown", start);
      document.removeEventListener("touchstart", start);
    };
    document.addEventListener("pointerdown", start);
    document.addEventListener("keydown", start);
    document.addEventListener("touchstart", start);
    return cleanup;
  }, []);

  return (
    <>
      {playing && (
        <iframe
          key={kick}
          title="Música del torneo"
          src={`https://www.youtube-nocookie.com/embed/${VIDEO_ID}?autoplay=1&loop=1&playlist=${VIDEO_ID}&controls=0&modestbranding=1&playsinline=1`}
          allow="autoplay; encrypted-media"
          className="pointer-events-none fixed h-px w-px opacity-0"
          aria-hidden
        />
      )}

      <button
        onClick={() => {
          kicked.current = true; // ya hubo gesto manual
          setPlaying((p) => !p);
          setKick((k) => k + 1);
        }}
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
