// Sidebar icon — SVG graphic only (no text), scales cleanly at any size
export function LogoMark({ size = 40 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 90"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Green figure */}
      <circle cx="24" cy="13" r="10" fill="#2DC64A" />
      <path d="M20 22 Q14 52 12 82" stroke="#2DC64A" strokeWidth="8" strokeLinecap="round" />
      <path d="M28 22 Q36 44 50 57" stroke="#2DC64A" strokeWidth="8" strokeLinecap="round" />
      {/* Blue figure */}
      <circle cx="76" cy="13" r="10" fill="#2B8EEE" />
      <path d="M80 22 Q86 52 88 82" stroke="#2B8EEE" strokeWidth="8" strokeLinecap="round" />
      <path d="M72 22 Q64 44 50 57" stroke="#2B8EEE" strokeWidth="8" strokeLinecap="round" />
      {/* Handshake dot */}
      <circle cx="50" cy="57" r="6" fill="#1BA038" />
    </svg>
  )
}

// Login page — uses the real PNG (mark + wordmark at full resolution)
export function LogoFull({ markSize = 180 }: { markSize?: number }) {
  return (
    <img
      src="/logo.png"
      alt="Money Buddy"
      width={markSize}
      style={{ objectFit: 'contain' }}
    />
  )
}
