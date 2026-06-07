"use client";

import type { TournamentState } from "@/lib/tournament";

interface Props {
  state: TournamentState;
  setConfig: (patch: Partial<TournamentState["config"]>) => void;
}

export default function HomeTab({ state, setConfig }: Props) {
  const { config } = state;
  return (
    <div className="space-y-6">
      <section className="rounded-2xl border border-emerald-800/40 bg-zinc-900/60 p-6">
        <h2 className="text-lg font-bold text-emerald-300">El formato</h2>
        <p className="mt-2 text-sm text-zinc-300">
          8 jugadores · 2 grupos de 4 · todos contra todos · luego semifinales
          cruzadas, tercer puesto y gran final.
        </p>
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <Stat label="Jugadores" value="8" />
          <Stat label="Grupos" value="2 × 4" />
          <Stat label="Partidos grupo" value={`${config.groupMinutes} min`} />
          <Stat label="Finales" value={`${config.finalMinutes} min`} />
        </div>
      </section>

      <section className="rounded-2xl border border-amber-800/40 bg-zinc-900/60 p-6">
        <h2 className="text-lg font-bold text-amber-300">🍢 La comida</h2>
        <p className="mt-2 text-base text-zinc-100">{config.food}</p>
      </section>

      <section className="rounded-2xl border border-zinc-700/50 bg-zinc-900/60 p-6">
        <h2 className="text-lg font-bold text-zinc-200">Reglas</h2>
        <ul className="mt-3 space-y-2 text-sm text-zinc-300">
          <li>⏱️ Grupos: mitades de {Math.round(config.groupMinutes / 2)} min ({config.groupMinutes} min total). Finales: {config.finalMinutes} min.</li>
          <li>🥅 Victoria 3 pts · Empate 1 · Derrota 0.</li>
          <li>📊 Desempate: diferencia de gol → goles a favor → orden alfabético.</li>
          <li>🤝 En grupos los empates quedan así. En semis/final → penales directo.</li>
          <li>🚑 Lesiones OFF, tarjetas mínimas, mismo nivel de equipos.</li>
          <li>🚫 Prohibido usar el mismo equipo en un partido.</li>
        </ul>
      </section>

      <section className="rounded-2xl border border-zinc-700/50 bg-zinc-900/60 p-6">
        <h2 className="text-lg font-bold text-zinc-200">Ajustes</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <Field label="Minutos por partido (grupos)">
            <input
              type="number"
              min={2}
              max={20}
              value={config.groupMinutes}
              onChange={(e) =>
                setConfig({ groupMinutes: Number(e.target.value) || 6 })
              }
              className="h-10 w-full rounded-lg bg-zinc-800 px-3 text-zinc-50 outline-none ring-2 ring-transparent focus:ring-emerald-400/70"
            />
          </Field>
          <Field label="Minutos por partido (finales)">
            <input
              type="number"
              min={2}
              max={20}
              value={config.finalMinutes}
              onChange={(e) =>
                setConfig({ finalMinutes: Number(e.target.value) || 10 })
              }
              className="h-10 w-full rounded-lg bg-zinc-800 px-3 text-zinc-50 outline-none ring-2 ring-transparent focus:ring-amber-400/70"
            />
          </Field>
          <Field label="Fecha del evento">
            <input
              type="text"
              placeholder="Ej. Sábado 14 de junio"
              value={config.eventDate}
              onChange={(e) => setConfig({ eventDate: e.target.value })}
              className="h-10 w-full rounded-lg bg-zinc-800 px-3 text-zinc-50 outline-none ring-2 ring-transparent focus:ring-emerald-400/70"
            />
          </Field>
          <Field label="Comida / menú">
            <input
              type="text"
              value={config.food}
              onChange={(e) => setConfig({ food: e.target.value })}
              className="h-10 w-full rounded-lg bg-zinc-800 px-3 text-zinc-50 outline-none ring-2 ring-transparent focus:ring-amber-400/70"
            />
          </Field>
        </div>
      </section>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-zinc-800/60 p-3 text-center">
      <div className="text-xl font-extrabold text-emerald-300">{value}</div>
      <div className="text-xs text-zinc-400">{label}</div>
    </div>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-medium text-zinc-400">
        {label}
      </span>
      {children}
    </label>
  );
}
