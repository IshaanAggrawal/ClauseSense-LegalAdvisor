"use client"
import Link from "next/link"
import { Check, ChevronRight } from "lucide-react"
import { GlassPanel } from "./glass-panel"

interface PricingCardProps {
  name: string
  price: string
  period?: string
  description: string
  features: string[]
  cta: string
  ctaHref: string
  highlighted?: boolean
}

export function PricingCard({
  name,
  price,
  period,
  description,
  features,
  cta,
  ctaHref,
  highlighted,
}: PricingCardProps) {
  return (
    <div className={highlighted ? "lg:scale-105" : ""}>
      <GlassPanel
        className={`p-8 rounded-2xl h-full flex flex-col transition-all duration-500 ${
          highlighted ? "border-primary/50 shadow-lg shadow-primary/20" : ""
        }`}
      >
        <div className="space-y-4 flex-1">
          <div>
            <h3 className="font-space-grotesk text-2xl font-bold">{name}</h3>
            <p className="text-sm text-muted-foreground mt-1">{description}</p>
          </div>

          <div className="space-y-1">
            <div className="flex items-baseline gap-1">
              <span className="text-4xl font-bold">{price}</span>
              {period && <span className="text-sm text-muted-foreground">{period}</span>}
            </div>
          </div>

          <div className="space-y-3 pt-4">
            {features.map((feature, index) => (
              <div key={index} className="flex items-start gap-3">
                <Check className="w-4 h-4 text-accent mt-0.5 flex-shrink-0" />
                <span className="text-sm text-foreground">{feature}</span>
              </div>
            ))}
          </div>
        </div>

        <Link
          href={ctaHref}
          className={`w-full mt-8 px-4 py-3 rounded-full font-medium transition-all duration-300 flex items-center justify-center gap-2 group ${
            highlighted
              ? "bg-primary text-primary-foreground hover:shadow-lg hover:shadow-primary/30 hover:-translate-y-1"
              : "border border-accent/30 text-foreground hover:bg-accent/5"
          }`}
        >
          {cta} <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </Link>
      </GlassPanel>
    </div>
  )
}
