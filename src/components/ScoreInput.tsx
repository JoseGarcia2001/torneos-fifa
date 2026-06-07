"use client";

interface Props {
  value: number | null;
  onChange: (value: number | null) => void;
  ariaLabel: string;
  accent?: "emerald" | "amber";
}

export default function ScoreInput({
  value,
  onChange,
  ariaLabel,
  accent = "emerald",
}: Props) {
  const ring =
    accent === "amber"
      ? "focus:ring-amber-400/70"
      : "focus:ring-emerald-400/70";
  return (
    <input
      type="number"
      inputMode="numeric"
      min={0}
      max={99}
      aria-label={ariaLabel}
      value={value ?? ""}
      onChange={(e) => {
        const v = e.target.value;
        onChange(v === "" ? null : Math.max(0, Math.min(99, Number(v))));
      }}
      className={`h-11 w-12 rounded-lg bg-zinc-800/80 text-center text-lg font-bold text-zinc-50 outline-none ring-2 ring-transparent transition focus:bg-zinc-800 ${ring}`}
    />
  );
}
