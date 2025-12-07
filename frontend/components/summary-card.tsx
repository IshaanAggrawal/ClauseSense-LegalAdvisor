"use client"

import { useState, useEffect } from "react"
import { GlassPanel } from "./glass-panel"

export function SummaryCard() {
  const [displayedText, setDisplayedText] = useState("")
  const fullText =
    "This is a 3-year SaaS agreement with a $50k annual commitment. Key concerns: unusually broad confidentiality clause, indefinite post-termination obligations, and payment acceleration on breach."

  useEffect(() => {
    let charIndex = 0
    const interval = setInterval(() => {
      if (charIndex < fullText.length) {
        setDisplayedText(fullText.slice(0, charIndex + 1))
        charIndex++
      } else {
        clearInterval(interval)
      }
    }, 30)
    return () => clearInterval(interval)
  }, [])

  return (
    <GlassPanel className="p-6 rounded-xl bg-card/40 border border-accent/10 backdrop-blur-md group hover:border-primary/20 transition-colors duration-500">
      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-foreground">Summary</h3>
        <p className="text-sm text-muted-foreground leading-relaxed">{displayedText}</p>
        {displayedText.length === fullText.length && (
          <div className="pt-2 border-t border-accent/10">
            <p className="text-xs text-accent font-medium">Analysis complete</p>
          </div>
        )}
      </div>
    </GlassPanel>
  )
}
