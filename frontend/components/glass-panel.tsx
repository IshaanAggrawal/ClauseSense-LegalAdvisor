import type React from "react"
// 1. We removed the import for 'cn'

interface GlassPanelProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
}

export function GlassPanel({ className, children, ...props }: GlassPanelProps) {
  return (
    <div
      // 2. We use backticks (`) to combine the strings manually.
      // We add " ${className || ''}" at the end to include any custom classes you pass in.
      className={`rounded-xl bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl shadow-primary/5 hover:border-white/20 hover:shadow-lg hover:shadow-primary/10 transition-all duration-500 ${className || ""}`}
      {...props}
    >
      {children}
    </div>
  )
}
