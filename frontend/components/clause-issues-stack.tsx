"use client"

import { useState, useEffect } from "react"
import { AlertCircle } from "lucide-react"
import { GlassPanel } from "./glass-panel"

export function ClauseIssuesStack() {
  const [visibleIssues, setVisibleIssues] = useState<number[]>([])

  const issues = [
    { id: 1, label: "Indefinite Confidentiality", severity: "high" },
    { id: 2, label: "Liability Cap Missing", severity: "medium" },
    { id: 3, label: "Payment Acceleration", severity: "medium" },
  ]

  useEffect(() => {
    issues.forEach((_, index) => {
      setTimeout(() => {
        setVisibleIssues((prev) => [...prev, index])
      }, index * 200)
    })
  }, [])

  return (
    <div className="space-y-3">
      {issues.map((issue, index) => (
        <GlassPanel
          key={issue.id}
          className={`p-4 rounded-lg border transition-all duration-500 ${
            visibleIssues.includes(index) ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          } ${
            issue.severity === "high"
              ? "border-primary/30 bg-primary/5 hover:bg-primary/10"
              : "border-accent/20 bg-card/50 hover:bg-card/80"
          }`}
        >
          <div className="flex items-start gap-2">
            <AlertCircle
              className={`w-4 h-4 mt-0.5 flex-shrink-0 ${issue.severity === "high" ? "text-primary" : "text-accent"}`}
            />
            <div>
              <p className="text-sm font-medium text-foreground">{issue.label}</p>
              <p className="text-xs text-muted-foreground">{issue.severity === "high" ? "High Priority" : "Review"}</p>
            </div>
          </div>
        </GlassPanel>
      ))}
    </div>
  )
}
