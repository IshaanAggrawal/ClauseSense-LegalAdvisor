"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ArrowRight, FileText, Zap, Shield, AlertTriangle, CheckCircle2 } from "lucide-react"
import { GlassPanel } from "@/components/glass-panel"
import { AuroraBackground } from "@/components/aurora-background"
import { FeatureCard } from "@/components/feature-card"
import { VisualStoryboard } from "@/components/visual-storyboard"
import { PricingCard } from "@/components/pricing-card"
import { ParallaxText } from "@/components/parallax-text"
import { ScrollReveal } from "@/components/scroll-reveal"
import { GrainOverlay } from "@/components/grain-overlay"
import { CursorGlow } from "@/components/cursor-glow"
import { TooltipJargon } from "@/components/tooltip-jargon"

export default function LandingPage() {
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <div className="relative min-h-screen bg-background overflow-hidden">
      <GrainOverlay />
      <CursorGlow />

      {/* Animated Aurora Background */}
      <AuroraBackground />

      {/* Floating Header */}
      <header
        className={`fixed top-0 w-full z-50 transition-all duration-500 ${
          isScrolled ? "bg-background/80 backdrop-blur-md border-b border-accent/10" : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <FileText className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="font-space-grotesk text-xl font-semibold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Clause Sense
            </span>
          </div>
          <nav className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Features
            </a>
            <a href="#how-it-works" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              How It Works
            </a>
            <a href="#pricing" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Pricing
            </a>
          </nav>
          <Link
            href="/app"
            className="px-6 py-2 rounded-full bg-primary text-primary-foreground text-sm font-medium hover:shadow-lg hover:shadow-primary/20 transition-all duration-300 hover:-translate-y-0.5"
          >
            Launch App
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6 relative">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <ParallaxText offset={0.3}>
              <div className="space-y-8 animate-fade-in">
                <div className="space-y-4">
                  <div className="inline-block px-3 py-1 rounded-full bg-accent/10 border border-accent/20 backdrop-blur-sm">
                    <span className="text-xs font-medium text-accent">AI-Powered Legal Analysis</span>
                  </div>
                  <h1 className="font-space-grotesk text-6xl lg:text-7xl font-bold leading-tight text-balance">
                    Read legal docs,
                    <span className="block bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent">
                      not essays.
                    </span>
                  </h1>
                </div>
                <p className="text-lg text-muted-foreground max-w-xl leading-relaxed text-pretty">
                  Clause Sense transforms dense legal documents into clear, actionable insights. Detect{" "}
                  <TooltipJargon term="Anomaly" definition="Unusual or deviating clauses detected by AI">
                    anomalies
                  </TooltipJargon>
                  , summarize complexities, and understand every clause in seconds.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                  <Link
                    href="/app"
                    className="px-8 py-3 rounded-full bg-primary text-primary-foreground font-medium hover:shadow-lg hover:shadow-primary/30 transition-all duration-300 hover:-translate-y-1 inline-flex items-center justify-center gap-2 group"
                  >
                    Start Analyzing <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                  <button className="px-8 py-3 rounded-full border border-accent/30 text-foreground font-medium hover:bg-accent/5 transition-all duration-300 backdrop-blur-sm">
                    Watch Demo
                  </button>
                </div>
              </div>
            </ParallaxText>

            <div className="relative h-full min-h-[500px] hidden lg:flex items-center justify-center">
              <GlassPanel className="w-full h-full rounded-2xl p-8 overflow-hidden flex flex-col justify-between">
                {/* Header */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-success/80 animate-pulse" />
                    <span className="text-xs font-medium text-muted-foreground">Analysis Complete</span>
                  </div>

                  {/* Summary Section */}
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-foreground">Quick Summary</p>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      This employment contract contains standard terms with one flagged clause requiring attention. Risk
                      level: <span className="text-warning font-semibold">Medium</span>
                    </p>
                  </div>
                </div>

                {/* Key Findings */}
                <div className="space-y-3 py-4 border-t border-accent/10 border-b border-accent/10">
                  <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Key Findings</p>
                  <div className="space-y-2">
                    <div className="flex items-start gap-2 p-2 rounded-lg bg-success/5 border border-success/20">
                      <CheckCircle2 className="w-4 h-4 text-success flex-shrink-0 mt-0.5" />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-success">Standard clause</p>
                        <p className="text-xs text-muted-foreground">Non-compete agreement</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2 p-2 rounded-lg bg-error/5 border border-error/20">
                      <AlertTriangle className="w-4 h-4 text-error flex-shrink-0 mt-0.5" />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-error">Anomaly detected</p>
                        <p className="text-xs text-muted-foreground">Unclear termination clause</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Document Stats */}
                <div className="space-y-3 pt-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 rounded-lg bg-primary/5 border border-primary/10">
                      <p className="text-xs text-muted-foreground">Pages</p>
                      <p className="text-sm font-semibold text-primary">12</p>
                    </div>
                    <div className="p-3 rounded-lg bg-accent/5 border border-accent/10">
                      <p className="text-xs text-muted-foreground">Clauses</p>
                      <p className="text-sm font-semibold text-accent">47</p>
                    </div>
                  </div>
                </div>
              </GlassPanel>
            </div>
          </div>
        </div>
      </section>

      {/* Visual Storyboard Section */}
      <section id="how-it-works" className="py-24 px-6 relative">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 space-y-4">
            <ScrollReveal>
              <h2 className="font-space-grotesk text-5xl font-bold">See it in motion</h2>
            </ScrollReveal>
            <ScrollReveal delay={100}>
              <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
                Watch how Clause Sense transforms dense contracts into clarity
              </p>
            </ScrollReveal>
          </div>
          <ScrollReveal delay={200}>
            <VisualStoryboard />
          </ScrollReveal>
        </div>
      </section>

      {/* Feature Capsules Section */}
      <section id="features" className="py-24 px-6 relative">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 space-y-4">
            <ScrollReveal>
              <h2 className="font-space-grotesk text-5xl font-bold">Intelligence meets simplicity</h2>
            </ScrollReveal>
            <ScrollReveal delay={100}>
              <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
                Advanced AI that works like your legal advisor—understanding context, spotting risks, and delivering
                clarity.
              </p>
            </ScrollReveal>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <ScrollReveal delay={200}>
              <FeatureCard
                icon={<FileText className="w-6 h-6" />}
                title="Smart Summarization"
                description="Reduce 50-page documents to key insights in seconds. Crystal-clear summaries without losing critical details."
              />
            </ScrollReveal>
            <ScrollReveal delay={300}>
              <FeatureCard
                icon={<Zap className="w-6 h-6" />}
                title="Clause Anomaly Detection"
                description="AI-powered analysis catches unusual terms, risky language, and deviations from standard legal norms automatically."
              />
            </ScrollReveal>
            <ScrollReveal delay={400}>
              <FeatureCard
                icon={<Shield className="w-6 h-6" />}
                title="Risk Assessment"
                description="Understand exposure and obligations at a glance. Get confidence scores for every clause and potential impact."
              />
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Trust Layer */}
      <section className="py-20 px-6 relative">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 space-y-4">
            <ScrollReveal>
              <h2 className="font-space-grotesk text-4xl font-bold">Built with intelligence</h2>
            </ScrollReveal>
            <ScrollReveal delay={100}>
              <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
                Compliance-grade AI engineered for legal precision
              </p>
            </ScrollReveal>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: Shield,
                title: "Enterprise Security",
                description: "Bank-level encryption and compliance certifications",
              },
              {
                icon: Zap,
                title: "Sub-Second Analysis",
                description: "Real-time document processing at scale",
              },
              {
                icon: FileText,
                title: "Legal Expertise",
                description: "Trained on thousands of real contracts",
              },
            ].map((item, idx) => (
              <ScrollReveal key={idx} delay={idx * 150}>
                <div className="text-center space-y-3 group">
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center mx-auto group-hover:scale-110 transition-transform duration-500">
                    <item.icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-semibold text-foreground">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">{item.description}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-24 px-6 relative">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 space-y-4">
            <ScrollReveal>
              <h2 className="font-space-grotesk text-5xl font-bold">Simple, transparent pricing</h2>
            </ScrollReveal>
            <ScrollReveal delay={100}>
              <p className="text-muted-foreground max-w-2xl mx-auto text-lg">Choose the plan that fits your needs</p>
            </ScrollReveal>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <ScrollReveal delay={200}>
              <PricingCard
                name="Starter"
                price="Free"
                description="Perfect for trying out"
                features={["Up to 5 documents", "Basic summarization", "Standard support", "7-day history"]}
                cta="Get Started"
                ctaHref="/app"
              />
            </ScrollReveal>
            <ScrollReveal delay={300}>
              <PricingCard
                name="Professional"
                price="$29"
                period="/month"
                description="For regular users"
                features={[
                  "Unlimited documents",
                  "Advanced risk detection",
                  "Priority support",
                  "30-day history",
                  "API access",
                ]}
                cta="Start Free Trial"
                ctaHref="/app"
                highlighted
              />
            </ScrollReveal>
            <ScrollReveal delay={400}>
              <PricingCard
                name="Enterprise"
                price="Custom"
                description="For teams"
                features={[
                  "Everything in Pro",
                  "Team collaboration",
                  "Custom integrations",
                  "Dedicated support",
                  "On-premise option",
                ]}
                cta="Contact Sales"
                ctaHref="mailto:sales@clause-sense.com"
              />
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 relative">
        <div className="max-w-4xl mx-auto">
          <ScrollReveal>
            <GlassPanel className="p-12 md:p-16 text-center space-y-8 rounded-2xl">
              <h2 className="font-space-grotesk text-4xl md:text-5xl font-bold text-balance">
                Stop drowning in legal jargon
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Join teams that are reclaiming hours every week. Clause Sense: The legal document analyzer that actually
                understands law.
              </p>
              <Link
                href="/app"
                className="inline-block px-8 py-4 rounded-full bg-primary text-primary-foreground font-medium hover:shadow-lg hover:shadow-primary/30 transition-all duration-300 hover:-translate-y-1"
              >
                Start Free Analysis →
              </Link>
            </GlassPanel>
          </ScrollReveal>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-accent/10 py-12 px-6 bg-gradient-to-b from-transparent via-background/50 to-background/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-primary to-accent" />
            <span className="font-medium">Clause Sense</span>
          </div>
          <p className="text-sm text-muted-foreground">© 2025 Clause Sense. Legal analysis redefined.</p>
          <div className="flex gap-6">
            <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Privacy
            </a>
            <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Terms
            </a>
          </div>
        </div>
      </footer>
    </div>
  )
}
