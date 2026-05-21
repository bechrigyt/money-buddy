export function LogoMark({ size = 40 }: { size?: number }) {
  return (
    <img
      src="/logo.png"
      alt="Money Buddy"
      width={size}
      height={size}
      style={{ objectFit: 'contain' }}
    />
  )
}

export function LogoFull({ markSize = 56 }: { markSize?: number }) {
  return (
    <div className="flex flex-col items-center gap-1">
      <img
        src="/logo.png"
        alt="Money Buddy mark"
        width={markSize}
        height={markSize}
        style={{ objectFit: 'contain' }}
      />
      <div style={{ fontFamily: "'Poppins', sans-serif" }} className="text-2xl font-bold tracking-tight leading-none">
        <span style={{ color: '#1F2229' }}>Money </span>
        <span style={{ color: '#2B8EEE' }}>Buddy</span>
      </div>
    </div>
  )
}
