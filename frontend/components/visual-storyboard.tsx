"use client"

import { useEffect, useRef, useState } from "react"
import { GlassPanel } from "./glass-panel"

export function VisualStoryboard() {
  const [activeStep, setActiveStep] = useState(0)
  const sectionRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          const interval = setInterval(() => {
            setActiveStep((prev) => (prev + 1) % 3)
          }, 4000)
          return () => clearInterval(interval)
        }
      },
      { threshold: 0.3 },
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => observer.disconnect()
  }, [])

  const steps = [
    {
      title: "Upload Your Document",
      description: "Drop any legal document—contracts, NDAs, terms of service",
      demo: (
        <div className="space-y-4">
          <div className="border-2 border-dashed border-accent/30 rounded-lg p-8 text-center hover:border-accent/60 transition-colors">
            <p className="text-sm text-muted-foreground">Drop document here or click to upload</p>
          </div>
        </div>
      ),
    },
    {
      title: "AI Analyzes in Real-Time",
      description: "Watch as Clause Sense reads, understands, and highlights key information",
      demo: (
        <div className="space-y-3">
          <div className="space-y-2">
            <p className="text-xs text-muted-foreground">Sample Contract Analysis</p>
            <div className="text-sm leading-relaxed space-y-2 font-mono text-xs">
              <p>
                This Agreement is entered into on <span className="bg-accent/20 px-1 rounded">01/15/2025</span>
              </p>
              <p>
                between <span className="bg-primary/20 px-1 rounded">ACME Corp</span> and{" "}
                <span className="bg-primary/20 px-1 rounded">Client Inc</span>
              </p>
              <p>
                Payment terms: <span className="bg-accent/40 text-accent px-1 rounded font-semibold">NET 30</span>
              </p>
            </div>
          </div>
          <div className="border-t border-accent/10 pt-3">
            <p className="text-xs text-muted-foreground mb-2">Risk Flags</p>
            <p className="text-xs text-accent">⚠ Unusual termination clause detected</p>
          </div>
        </div>
      ),
    },
    {
      title: "Get Clear Insights",
      description: "Summary, risks, and key terms—all in one place",
      demo: (
        <div className="space-y-4">
          <div className="space-y-2">
            <p className="text-xs text-muted-foreground font-semibold">Executive Summary</p>
            <p className="text-sm leading-relaxed">
              Service agreement between ACME Corp and Client Inc. Duration: 2 years with auto-renewal. Payment: NET 30.
              Termination: 90-day notice.
            </p>
          </div>
          <div className="space-y-2">
            <p className="text-xs text-muted-foreground font-semibold">Key Metrics</p>
            <div className="grid grid-cols-2 gap-2">
              <div className="bg-primary/10 p-3 rounded">
                <p className="text-xs text-muted-foreground">Risk Score</p>
                <p className="text-lg font-bold text-primary">3/10</p>
              </div>
              <div className="bg-accent/10 p-3 rounded">
                <p className="text-xs text-muted-foreground">Clauses</p>
                <p className="text-lg font-bold text-accent">12</p>
              </div>
            </div>
          </div>
        </div>
      ),
    },
  ]

  return (
    <div ref={sectionRef} className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
      {/* Left: Steps */}
      <div className="space-y-4">
        {steps.map((step, index) => (
          <button
            key={index}
            onClick={() => setActiveStep(index)}
            className={`w-full text-left p-6 rounded-lg transition-all duration-500 ${
              activeStep === index
                ? "bg-primary/10 border border-primary/30"
                : "bg-muted/20 border border-transparent hover:border-accent/20"
            }`}
          >
            <div className="flex items-start gap-4">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold transition-all duration-500 ${
                  activeStep === index ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                }`}
              >
                {index + 1}
              </div>
              <div>
                <h3 className="font-semibold mb-1">{step.title}</h3>
                <p className="text-sm text-muted-foreground">{step.description}</p>
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* Right: Live Demo */}
      <GlassPanel className="p-8 rounded-2xl min-h-96 flex items-center justify-center">
        <div className="w-full transition-all duration-500 opacity-100" key={activeStep}>
          <div className="space-y-4">
            <h4 className="font-semibold text-lg">{steps[activeStep].title}</h4>
            {steps[activeStep].demo}
          </div>
        </div>
      </GlassPanel>
    </div>
  )
}
