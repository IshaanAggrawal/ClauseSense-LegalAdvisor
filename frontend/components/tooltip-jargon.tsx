"use client"

import type React from "react"

import { useState } from "react"

interface TooltipJargonProps {
  term: string
  definition: string
  children: React.ReactNode
}

export function TooltipJargon({ term, definition, children }: TooltipJargonProps) {
  const [isVisible, setIsVisible] = useState(false)

  return (
    // Changed from div to span to avoid HTML nesting violations
    // span is an inline element that can be nested inside p tags
    <span className="relative inline-block">
      <button
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
        className="underline underline-offset-2 text-accent hover:text-primary transition-colors cursor-help"
      >
        {children}
      </button>
      {isVisible && (
        <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-card border border-accent/30 rounded-lg text-xs text-muted-foreground whitespace-nowrap animate-fade-in shadow-lg backdrop-blur-sm z-50">
          <p className="font-medium text-foreground mb-1">{term}</p>
          <p>{definition}</p>
          <span className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-card" />
        </span>
      )}
    </span>
  )
}