"use client";

import {
  buildGroupFixture,
  computeStandings,
  type GroupId,
  type MatchResult,
  type Match,
  type TournamentState,
} from "@/lib/tournament";
import ScoreInput from "./ScoreInput";

interface Props {
  state: TournamentState;
  setResult: (id: string, patch: Partial<MatchResult>) => void;
  goToDraw: () => void;
}

export default function GroupsTab({ state, setResult, goToDraw }: Props) {
  if (!state.groups) {
    return (
      <EmptyState goToDraw={goToDraw} />
    );
  }

  const fixture = buildGroupFixture(state.groups);
  const matchesByGroup: Record<GroupId, Match[]> = {
    A: fixture.filter((m) => m.group === "A"),
    B: fixture.filter((m) => m.group === "B"),
  };

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {(["A", "B"] as GroupId[]).map((g) => (
        <div key={g} className="space-y-4">
          <GroupTable
            group={g}
            names={state.groups![g]}
            results={state.results}
          />
          <section className="rounded-2xl border border-zinc-700/50 bg-zinc-900/60 p-4">
            <h3 className="mb-3 text-sm font-bold text-zinc-300">
              Partidos · Grupo {g}
            </h3>
            <div className="space-y-2">
              {matchesByGroup[g].map((m) => (
                <MatchRow
                  key={m.id}
                  match={m}
                  result={state.results[m.id]}
                  onChange={(patch) => setResult(m.id, patch)}
                  accent={g === "A" ? "emerald" : "amber"}
                />
              ))}
            </div>
          </section>
        </div>
      ))}
    </div>
  );
}

function EmptyState({ goToDraw }: { goToDraw: () => void }) {
  return (
    <div className="grid place-items-center rounded-2xl border border-dashed border-zinc-700 bg-zinc-900/40 p-12 text-center">
      <p className="text-zinc-400">Todavía no has sorteado los grupos.</p>
      <button
        onClick={goToDraw}
        className="mt-4 rounded-full bg-emerald-600 px-6 py-3 font-bold text-white transition hover:bg-emerald-500"
      >
        🎲 Ir al sorteo
      </button>
    </div>
  );
}

function MatchRow({
  match,
  result,
  onChange,
  accent,
}: {
  match: Match;
  result: MatchResult | undefined;
  onChange: (patch: Partial<MatchResult>) => void;
  accent: "emerald" | "amber";
}) {
  return (
    <div className="flex items-center gap-2 rounded-lg bg-zinc-800/50 px-2 py-1.5">
      <span className="flex-1 truncate text-right text-sm font-medium text-zinc-100">
        {match.home}
      </span>
      <ScoreInput
        ariaLabel={`Goles de ${match.home}`}
        value={result?.hg ?? null}
        onChange={(v) => onChange({ hg: v })}
        accent={accent}
      />
      <span className="text-zinc-500">–</span>
      <ScoreInput
        ariaLabel={`Goles de ${match.away}`}
        value={result?.ag ?? null}
        onChange={(v) => onChange({ ag: v })}
        accent={accent}
      />
      <span className="flex-1 truncate text-left text-sm font-medium text-zinc-100">
        {match.away}
      </span>
    </div>
  );
}

function GroupTable({
  group,
  names,
  results,
}: {
  group: GroupId;
  names: string[];
  results: Record<string, MatchResult>;
}) {
  const rows = computeStandings(names, results, group);
  const headColor = group === "A" ? "text-emerald-300" : "text-amber-300";
  return (
    <section className="overflow-hidden rounded-2xl border border-zinc-700/50 bg-zinc-900/60">
      <h3 className={`px-4 pt-4 text-base font-bold ${headColor}`}>
        Grupo {group}
      </h3>
      <table className="mt-2 w-full text-sm">
        <thead>
          <tr className="border-b border-zinc-700/60 text-xs text-zinc-400">
            <th className="px-3 py-2 text-left font-medium">#</th>
            <th className="py-2 text-left font-medium">Jugador</th>
            <th className="px-1 py-2 text-center font-medium">PJ</th>
            <th className="px-1 py-2 text-center font-medium">DG</th>
            <th className="px-3 py-2 text-center font-medium">Pts</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => {
            const classifying = i < 2;
            return (
              <tr
                key={r.name}
                className={`border-b border-zinc-800/60 last:border-0 ${
                  classifying ? "bg-emerald-900/20" : ""
                }`}
              >
                <td className="px-3 py-2 text-zinc-500">
                  {classifying ? (
                    <span className="font-bold text-emerald-400">{i + 1}</span>
                  ) : (
                    i + 1
                  )}
                </td>
                <td className="py-2 font-medium text-zinc-100">{r.name}</td>
                <td className="px-1 py-2 text-center text-zinc-400">{r.pj}</td>
                <td className="px-1 py-2 text-center text-zinc-400">
                  {r.dg > 0 ? `+${r.dg}` : r.dg}
                </td>
                <td className="px-3 py-2 text-center font-bold text-zinc-50">
                  {r.pts}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <p className="px-4 py-2 text-[11px] text-zinc-500">
        Los 2 primeros (verde) clasifican a semifinales.
      </p>
    </section>
  );
}
