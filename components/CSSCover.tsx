"use client"

type Props = {
  kind: "crm" | "tg" | "ops" | "verify"
  className?: string
}

const palettes: Record<Props["kind"], string> = {
  crm: "from-emerald-400/25 via-cyan-300/20 to-transparent",
  tg: "from-sky-400/25 via-indigo-400/20 to-transparent",
  ops: "from-teal-300/25 via-emerald-300/20 to-transparent",
  verify: "from-amber-400/25 via-rose-400/20 to-transparent",
}

export default function CSSCover({ kind, className = "" }: Props) {
  return (
    <div className={`relative aspect-[16/9] overflow-hidden rounded-xl ${className}`}>
      {/* base */}
      <div className="absolute inset-0 bg-zinc-800/30" />
      {/* aurora */}
      <div className={`absolute inset-0 bg-gradient-to-br ${palettes[kind]} blur-2xl`} />
      {/* second glow */}
      <div className="absolute inset-0 bg-[radial-gradient(60%_80%_at_80%_20%,rgba(255,255,255,.06),transparent)]" />
      {/* grid hint */}
      <div className="absolute inset-0 bg-[linear-gradient(transparent_95%,rgba(255,255,255,.06)_96%),linear-gradient(90deg,transparent_95%,rgba(255,255,255,.06)_96%)] bg-[length:20px_20px]" />
      {/* dark veil */}
      <div className="absolute inset-0 bg-black/25" />
    </div>
  )
}

