// SVG recreation of the Money Buddy logo mark — two figures forming an "M"
export function LogoMark({ size = 40 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 90"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* ── Green figure (left) ── */}
      {/* Head */}
      <circle cx="24" cy="13" r="10" fill="#2DC64A" />
      {/* Outer leg — sweeps down-left */}
      <path
        d="M20 22 Q14 52 12 82"
        stroke="#2DC64A" strokeWidth="8" strokeLinecap="round" fill="none"
      />
      {/* Inner arm — curves down to centre valley */}
      <path
        d="M28 22 Q36 44 50 57"
        stroke="#2DC64A" strokeWidth="8" strokeLinecap="round" fill="none"
      />

      {/* ── Blue figure (right) ── */}
      {/* Head */}
      <circle cx="76" cy="13" r="10" fill="#2B8EEE" />
      {/* Outer leg — sweeps down-right */}
      <path
        d="M80 22 Q86 52 88 82"
        stroke="#2B8EEE" strokeWidth="8" strokeLinecap="round" fill="none"
      />
      {/* Inner arm — curves down to centre valley */}
      <path
        d="M72 22 Q64 44 50 57"
        stroke="#2B8EEE" strokeWidth="8" strokeLinecap="round" fill="none"
      />

      {/* ── Centre handshake dot ── */}
      <circle cx="50" cy="57" r="6" fill="#1BA038" />
    </svg>
  )
}

// Full logo — mark + wordmark
export function LogoFull({ markSize = 56 }: { markSize?: number }) {
  return (
    <div className="flex flex-col items-center gap-2">
      <LogoMark size={markSize} />
      <div className="text-2xl font-bold tracking-tight">
        <span className="text-[#1F2229]">Money </span>
        <span className="text-[#2B8EEE]">Buddy</span>
      </div>
    </div>
  )
}
