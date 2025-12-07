import type React from "react"
import { GlassPanel } from "./glass-panel"

interface FeatureCardProps {
  icon: React.ReactNode
  title: string
  description: string
}

export function FeatureCard({ icon, title, description }: FeatureCardProps) {
  return (
    <GlassPanel className="p-8 group hover:shadow-xl hover:shadow-primary/15 transition-all duration-500">
      <div className="space-y-4">
        <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center text-primary group-hover:scale-110 transition-transform duration-500">
          {icon}
        </div>
        <h3 className="font-space-grotesk text-xl font-semibold">{title}</h3>
        <p className="text-muted-foreground leading-relaxed">{description}</p>
      </div>
    </GlassPanel>
  )
}
