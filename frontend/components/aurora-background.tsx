"use client"

export function AuroraBackground() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      {/* Aurora gradient animations */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-background" />

      {/* Moving aurora light */}
      <div className="absolute top-0 -left-1/2 w-full h-96 bg-gradient-to-r from-primary/20 via-accent/10 to-transparent rounded-full blur-3xl animate-aurora" />
      <div className="absolute bottom-0 -right-1/2 w-full h-96 bg-gradient-to-l from-accent/20 via-secondary/10 to-transparent rounded-full blur-3xl animate-aurora-reverse" />

      {/* Grain texture overlay */}
      <div
        className="absolute inset-0 opacity-[0.025] mix-blend-overlay pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' result='noise'/%3E%3C/filter%3E%3Crect width='200' height='200' fill='white' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          backgroundSize: "200px 200px",
        }}
      />
    </div>
  )
}
