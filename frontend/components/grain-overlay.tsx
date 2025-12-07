export function GrainOverlay() {
  return (
    <>
      {/* Simple gradient background */}
      <div className="fixed inset-0 -z-10 bg-gradient-to-br from-background via-background/95 to-accent/5" />
      
      {/* Grain overlay */}
      <div className="fixed inset-0 pointer-events-none opacity-3 z-50 mix-blend-overlay">
        <svg width="100%" height="100%">
          <filter id="grain">
            <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="4" seed="1" result="noise" />
            <feColorMatrix in="noise" type="saturate" values="0" result="desaturated" />
            <feBlend in="SourceGraphic" in2="desaturated" mode="overlay" />
          </filter>
          <rect width="100%" height="100%" filter="url(#grain)" opacity="0.05" />
        </svg>
      </div>
    </>
  )
}
