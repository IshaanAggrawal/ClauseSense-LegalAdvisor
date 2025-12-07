"use client"

import { GlassPanel } from "./glass-panel"

export function NegotiationInsights() {
  return (
    <GlassPanel className="p-6 rounded-xl bg-gradient-to-br from-accent/5 to-primary/5 border border-accent/10 backdrop-blur-md">
      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-foreground">Negotiation Tips</h3>
        <ul className="space-y-2">
          <li className="text-xs text-muted-foreground flex items-start gap-2">
            <span className="text-accent font-bold">→</span>
            <span>Request 3-year term instead of 5-year</span>
          </li>
          <li className="text-xs text-muted-foreground flex items-start gap-2">
            <span className="text-accent font-bold">→</span>
            <span>Add liability cap of $250k</span>
          </li>
          <li className="text-xs text-muted-foreground flex items-start gap-2">
            <span className="text-accent font-bold">→</span>
            <span>Limit confidentiality to 2 years post-term</span>
          </li>
        </ul>
      </div>
    </GlassPanel>
  )
}
