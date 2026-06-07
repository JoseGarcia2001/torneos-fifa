"use client";

import {
  resolveKnockout,
  type KnockoutSlot,
  type MatchResult,
  type TournamentState,
} from "@/lib/tournament";
import ScoreInput from "./ScoreInput";

interface Props {
  state: TournamentState;
  setResult: (id: string, patch: Partial<MatchResult>) => void;
  goToGroups: () => void;
}

export default function FinalsTab({ state, setResult, goToGroups }: Props) {
  const kb = resolveKnockout(state);

  if (!kb.ready) {
    return (
      <div className="grid place-items-center rounded-2xl border border-dashed border-zinc-700 bg-zinc-900/40 p-12 text-center">
        <p className="text-zinc-400">
          La fase final se habilita cuando los dos grupos terminen todos sus
          partidos.
        </p>
        <button
          onClick={goToGroups}
          className="mt-4 rounded-full bg-emerald-600 px-6 py-3 font-bold text-white transition hover:bg-emerald-500"
        >
          Completar los grupos →
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {kb.champion && (
        <div className="animate-pop rounded-2xl border border-amber-500/60 bg-gradient-to-b from-amber-500/20 to-zinc-900/40 p-6 text-center">
          <div className="text-4xl">🏆</div>
          <div className="mt-1 text-xs font-medium uppercase tracking-wider text-amber-300">
            Campeón
          </div>
          <div className="text-2xl font-extrabold text-amber-200">
            {kb.champion}
          </div>
          <div className="mt-2 text-sm text-zinc-400">
            🥈 {kb.runnerUp} · 🥉 {kb.thirdPlace ?? "—"}
          </div>
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        <KnockoutCard slot={kb.s1} result={state.results[kb.s1.id]} setResult={setResult} />
        <KnockoutCard slot={kb.s2} result={state.results[kb.s2.id]} setResult={setResult} />
      </div>

      <KnockoutCard
        slot={kb.final}
        result={state.results[kb.final.id]}
        setResult={setResult}
        variant="gold"
      />
      <KnockoutCard
        slot={kb.third}
        result={state.results[kb.third.id]}
        setResult={setResult}
        variant="bronze"
      />
    </div>
  );
}

function KnockoutCard({
  slot,
  result,
  setResult,
  variant = "default",
}: {
  slot: KnockoutSlot;
  result: MatchResult | undefined;
  setResult: (id: string, patch: Partial<MatchResult>) => void;
  variant?: "default" | "gold" | "bronze";
}) {
  const pending = !slot.home || !slot.away;
  const tied =
    result?.hg !== null &&
    result?.hg !== undefined &&
    result?.ag !== null &&
    result?.ag !== undefined &&
    result.hg === result.ag;

  const border =
    variant === "gold"
      ? "border-amber-500/60"
      : variant === "bronze"
        ? "border-orange-700/50"
        : "border-zinc-700/50";
  const title =
    variant === "gold"
      ? "text-amber-300"
      : variant === "bronze"
        ? "text-orange-300"
        : "text-zinc-300";

  return (
    <section className={`rounded-2xl border ${border} bg-zinc-900/60 p-5`}>
      <div className="flex items-center justify-between">
        <h3 className={`text-sm font-bold ${title}`}>
          {variant === "gold" ? "🏆 " : variant === "bronze" ? "🥉 " : ""}
          {slot.title}
        </h3>
        {slot.winner && (
          <span className="rounded-full bg-emerald-700/40 px-2 py-0.5 text-xs font-semibold text-emerald-200">
            Gana {slot.winner}
          </span>
        )}
      </div>

      {pending ? (
        <p className="mt-4 text-center text-sm text-zinc-500">
          Esperando resultados previos…
        </p>
      ) : (
        <>
          <div className="mt-4 flex items-center gap-2">
            <span
              className={`flex-1 truncate text-right text-sm font-semibold ${
                slot.winner === slot.home ? "text-emerald-300" : "text-zinc-100"
              }`}
            >
              {slot.home}
            </span>
            <ScoreInput
              ariaLabel={`Goles de ${slot.home}`}
              value={result?.hg ?? null}
              onChange={(v) => setResult(slot.id, { hg: v })}
              accent={variant === "gold" ? "amber" : "emerald"}
            />
            <span className="text-zinc-500">–</span>
            <ScoreInput
              ariaLabel={`Goles de ${slot.away}`}
              value={result?.ag ?? null}
              onChange={(v) => setResult(slot.id, { ag: v })}
              accent={variant === "gold" ? "amber" : "emerald"}
            />
            <span
              className={`flex-1 truncate text-left text-sm font-semibold ${
                slot.winner === slot.away ? "text-emerald-300" : "text-zinc-100"
              }`}
            >
              {slot.away}
            </span>
          </div>

          {tied && (
            <div className="mt-3 flex items-center justify-center gap-2 rounded-lg bg-zinc-800/60 py-2">
              <span className="text-xs font-medium text-zinc-400">Penales:</span>
              <ScoreInput
                ariaLabel={`Penales de ${slot.home}`}
                value={result?.ph ?? null}
                onChange={(v) => setResult(slot.id, { ph: v })}
                accent="amber"
              />
              <span className="text-zinc-500">–</span>
              <ScoreInput
                ariaLabel={`Penales de ${slot.away}`}
                value={result?.pa ?? null}
                onChange={(v) => setResult(slot.id, { pa: v })}
                accent="amber"
              />
            </div>
          )}
        </>
      )}
    </section>
  );
}
