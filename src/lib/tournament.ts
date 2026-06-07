// Lógica pura del torneo: sorteo, fixture, tablas y fase final.
// Sin React ni efectos secundarios — fácil de testear y razonar.

export type GroupId = "A" | "B";

export interface MatchResult {
  hg: number | null; // goles local
  ag: number | null; // goles visitante
  ph: number | null; // penales local (solo fase final, en caso de empate)
  pa: number | null; // penales visitante
}

export interface Match {
  id: string; // 'A-0', 'B-3', 'S1', 'S2', 'F', 'T'
  group: GroupId | null; // null = fase final
  home: string | null; // null = aún por definir (fase final)
  away: string | null;
}

export interface TournamentConfig {
  groupMinutes: number;
  finalMinutes: number;
  eventDate: string;
  food: string;
}

export interface TournamentState {
  players: string[]; // 8 jugadores
  groups: { A: string[]; B: string[] } | null; // null = sin sortear
  results: Record<string, MatchResult>; // por id de partido
  config: TournamentConfig;
}

export interface StandingRow {
  name: string;
  pj: number;
  g: number;
  e: number;
  p: number;
  gf: number;
  gc: number;
  dg: number;
  pts: number;
}

export const DEFAULT_PLAYERS = [
  "Jose",
  "Alejandra",
  "Anderson",
  "Ángel",
  "Camilo",
  "Edwin",
  "Sebastián",
  "Juan Pablo",
];

export function createInitialState(): TournamentState {
  return {
    players: [...DEFAULT_PLAYERS],
    groups: null,
    results: {},
    config: {
      groupMinutes: 6,
      finalMinutes: 10,
      eventDate: "Hoy · arranca 5:30 PM",
      food: "Picada al barril 🔥 panceta, costilla, res y chunchullo, con papa y arepa",
    },
  };
}

export function emptyResult(): MatchResult {
  return { hg: null, ag: null, ph: null, pa: null };
}

// Fisher-Yates — baraja una copia del arreglo.
export function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// Reparte 8 jugadores en 2 grupos de 4 de forma aleatoria.
export function drawGroups(players: string[]): { A: string[]; B: string[] } {
  const s = shuffle(players);
  return { A: s.slice(0, 4), B: s.slice(4, 8) };
}

// Emparejamientos round-robin para 4 equipos, ordenados por jornada.
const ROUND_ROBIN_PAIRS: [number, number][] = [
  [0, 1],
  [2, 3], // Jornada 1
  [0, 2],
  [1, 3], // Jornada 2
  [0, 3],
  [1, 2], // Jornada 3
];

function groupMatches(group: GroupId, names: string[]): Match[] {
  return ROUND_ROBIN_PAIRS.map(([h, a], i) => ({
    id: `${group}-${i}`,
    group,
    home: names[h],
    away: names[a],
  }));
}

// Fixture completo de grupos, intercalando A y B para repartir descansos.
export function buildGroupFixture(groups: {
  A: string[];
  B: string[];
}): Match[] {
  const a = groupMatches("A", groups.A);
  const b = groupMatches("B", groups.B);
  const out: Match[] = [];
  for (let i = 0; i < a.length; i++) {
    out.push(a[i], b[i]);
  }
  return out;
}

function isPlayed(r: MatchResult | undefined): r is MatchResult {
  return !!r && r.hg !== null && r.ag !== null;
}

// Calcula y ordena la tabla de un grupo a partir de los resultados.
export function computeStandings(
  names: string[],
  results: Record<string, MatchResult>,
  group: GroupId,
): StandingRow[] {
  const rows = new Map<string, StandingRow>();
  for (const name of names) {
    rows.set(name, {
      name,
      pj: 0,
      g: 0,
      e: 0,
      p: 0,
      gf: 0,
      gc: 0,
      dg: 0,
      pts: 0,
    });
  }

  for (const match of groupMatches(group, names)) {
    const r = results[match.id];
    if (!isPlayed(r) || !match.home || !match.away) continue;
    const home = rows.get(match.home)!;
    const away = rows.get(match.away)!;
    const hg = r.hg!;
    const ag = r.ag!;

    home.pj++;
    away.pj++;
    home.gf += hg;
    home.gc += ag;
    away.gf += ag;
    away.gc += hg;

    if (hg > ag) {
      home.g++;
      home.pts += 3;
      away.p++;
    } else if (ag > hg) {
      away.g++;
      away.pts += 3;
      home.p++;
    } else {
      home.e++;
      away.e++;
      home.pts++;
      away.pts++;
    }
  }

  for (const row of rows.values()) row.dg = row.gf - row.gc;

  return [...rows.values()].sort(
    (x, y) =>
      y.pts - x.pts ||
      y.dg - x.dg ||
      y.gf - x.gf ||
      x.name.localeCompare(y.name),
  );
}

export function isGroupComplete(
  names: string[],
  results: Record<string, MatchResult>,
  group: GroupId,
): boolean {
  return groupMatches(group, names).every((m) => isPlayed(results[m.id]));
}

// Ganador de un partido considerando penales en la fase final.
export function matchWinner(r: MatchResult | undefined): "home" | "away" | null {
  if (!isPlayed(r)) return null;
  if (r.hg! > r.ag!) return "home";
  if (r.ag! > r.hg!) return "away";
  // Empate → penales
  if (r.ph !== null && r.pa !== null && r.ph !== r.pa) {
    return r.ph > r.pa ? "home" : "away";
  }
  return null;
}

export interface KnockoutSlot {
  id: "S1" | "S2" | "F" | "T";
  title: string;
  home: string | null;
  away: string | null;
  winner: string | null;
  loser: string | null;
}

export interface KnockoutBracket {
  ready: boolean; // ambos grupos completos
  s1: KnockoutSlot;
  s2: KnockoutSlot;
  final: KnockoutSlot;
  third: KnockoutSlot;
  champion: string | null;
  runnerUp: string | null;
  thirdPlace: string | null;
}

function resolveSlot(
  id: KnockoutSlot["id"],
  title: string,
  home: string | null,
  away: string | null,
  results: Record<string, MatchResult>,
): KnockoutSlot {
  const w = matchWinner(results[id]);
  let winner: string | null = null;
  let loser: string | null = null;
  if (w && home && away) {
    winner = w === "home" ? home : away;
    loser = w === "home" ? away : home;
  }
  return { id, title, home, away, winner, loser };
}

// Construye toda la fase final a partir de los grupos y resultados.
export function resolveKnockout(state: TournamentState): KnockoutBracket {
  const blank: KnockoutSlot = {
    id: "S1",
    title: "",
    home: null,
    away: null,
    winner: null,
    loser: null,
  };
  if (!state.groups) {
    return {
      ready: false,
      s1: { ...blank, id: "S1", title: "Semifinal 1" },
      s2: { ...blank, id: "S2", title: "Semifinal 2" },
      final: { ...blank, id: "F", title: "Final" },
      third: { ...blank, id: "T", title: "Tercer puesto" },
      champion: null,
      runnerUp: null,
      thirdPlace: null,
    };
  }

  const standA = computeStandings(state.groups.A, state.results, "A");
  const standB = computeStandings(state.groups.B, state.results, "B");
  const ready =
    isGroupComplete(state.groups.A, state.results, "A") &&
    isGroupComplete(state.groups.B, state.results, "B");

  const a1 = ready ? standA[0].name : null;
  const a2 = ready ? standA[1].name : null;
  const b1 = ready ? standB[0].name : null;
  const b2 = ready ? standB[1].name : null;

  const s1 = resolveSlot("S1", "Semifinal 1", a1, b2, state.results);
  const s2 = resolveSlot("S2", "Semifinal 2", b1, a2, state.results);

  const final = resolveSlot(
    "F",
    "Final",
    s1.winner,
    s2.winner,
    state.results,
  );
  const third = resolveSlot(
    "T",
    "Tercer puesto",
    s1.loser,
    s2.loser,
    state.results,
  );

  return {
    ready,
    s1,
    s2,
    final,
    third,
    champion: final.winner,
    runnerUp:
      final.winner && final.home && final.away
        ? final.winner === final.home
          ? final.away
          : final.home
        : null,
    thirdPlace: third.winner,
  };
}
