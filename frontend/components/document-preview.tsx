"use client"

import { useState } from "react"
import { GlassPanel } from "./glass-panel"

export function DocumentPreview() {
  const [hoveredClause, setHoveredClause] = useState<number | null>(null)

  // Mock document content with clauses
  const clauses = [
    {
      id: 1,
      title: "Term and Termination",
      content:
        "This Agreement shall commence on the date first written above and continue for a period of one (1) year, unless earlier terminated in accordance with the provisions hereof.",
      type: "standard",
    },
    {
      id: 2,
      title: "Payment Terms",
      content:
        "Customer shall pay Vendor an annual fee of $50,000 payable upfront. Late payments shall accrue interest at 2% per month or the maximum rate permitted by law, whichever is less.",
      type: "standard",
    },
    {
      id: 3,
      title: "Confidentiality & Restrictions",
      content:
        "All information disclosed shall be treated as proprietary. Recipient may use disclosed information for any purpose without restriction. Confidentiality obligations shall survive termination indefinitely.",
      type: "anomaly",
    },
    {
      id: 4,
      title: "Liability Limitations",
      content:
        "In no event shall either party be liable for indirect, incidental, or consequential damages. Each party's total liability shall not exceed the fees paid in the preceding 12 months.",
      type: "standard",
    },
  ]

  return (
    <GlassPanel className="p-8 rounded-2xl bg-card/40 border border-accent/10 backdrop-blur-md">
      <div className="space-y-6 max-h-[600px] overflow-y-auto pr-4">
        {clauses.map((clause, index) => (
          <div
            key={clause.id}
            className={`p-6 rounded-lg transition-all duration-500 border ${
              clause.type === "anomaly"
                ? "border-primary/40 bg-primary/5 hover:bg-primary/10"
                : "border-accent/20 bg-card/50 hover:bg-card/80"
            } ${hoveredClause === clause.id ? "shadow-lg shadow-primary/10" : ""}`}
            onMouseEnter={() => setHoveredClause(clause.id)}
            onMouseLeave={() => setHoveredClause(null)}
          >
            {/* Clause header with soft pulse on anomaly */}
            <div className={`flex items-start gap-3 mb-2 ${clause.type === "anomaly" ? "animate-glow-pulse" : ""}`}>
              <div
                className={`mt-1 w-2 h-2 rounded-full flex-shrink-0 ${
                  clause.type === "anomaly" ? "bg-primary/80" : "bg-accent/50"
                }`}
              />
              <h3 className="font-medium text-foreground">{clause.title}</h3>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed ml-5">{clause.content}</p>
          </div>
        ))}
      </div>
    </GlassPanel>
  )
}
