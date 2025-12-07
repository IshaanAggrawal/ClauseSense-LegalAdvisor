"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { Upload, Loader2, AlertCircle, Send } from "lucide-react"
import { GlassPanel } from "@/components/glass-panel"
import { AuroraBackground } from "@/components/aurora-background"
import { GrainOverlay } from "@/components/grain-overlay"
import { CursorGlow } from "@/components/cursor-glow"
import { ScrollReveal } from "@/components/scroll-reveal"

interface Message {
  id: string
  text: string
  role: "user" | "assistant"
}

export default function AppPage() {
  const [uploadedFile, setUploadedFile] = useState<{ name: string; size: number } | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisComplete, setAnalysisComplete] = useState(false)
  const [displayedSummary, setDisplayedSummary] = useState("")
  const [visibleIssues, setVisibleIssues] = useState<number[]>([])
  // const [isChatOpen, setIsChatOpen] = useState(false) - unused state
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "Hi! I'm your AI legal advisor. Ask me anything about this contract.",
      role: "assistant",
    },
  ])
  const [chatInput, setChatInput] = useState("")
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const fullSummary =
    "This legal document contains 12 primary clauses covering liability, indemnification, and dispute resolution. Key obligations include: (1) confidentiality maintenance, (2) performance standards, and (3) termination rights."

  const clauses = [
    { title: "Liability Limitation", status: "standard", type: "Standard clause" },
    { title: "Indemnification", status: "warning", type: "Anomaly: Unusual scope detected" },
    { title: "Termination Rights", status: "standard", type: "Standard clause" },
  ]

  useEffect(() => {
    if (!analysisComplete) return

    let charIndex = 0
    const interval = setInterval(() => {
      if (charIndex < fullSummary.length) {
        setDisplayedSummary(fullSummary.slice(0, charIndex + 1))
        charIndex++
      } else {
        clearInterval(interval)
      }
    }, 20)

    return () => clearInterval(interval)
  }, [analysisComplete, fullSummary])

  useEffect(() => {
    if (!analysisComplete) return

    clauses.forEach((_, index) => {
      setTimeout(() => {
        setVisibleIssues((prev) => [...prev, index])
      }, index * 200)
    })
  }, [analysisComplete, clauses])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setUploadedFile({
        name: file.name,
        size: file.size,
      })
      setIsAnalyzing(true)
      setDisplayedSummary("")
      setVisibleIssues([])

      setTimeout(() => {
        setIsAnalyzing(false)
        setAnalysisComplete(true)
      }, 2000)
    }
  }

  const handleSendChat = () => {
    if (!chatInput.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      text: chatInput,
      role: "user",
    }

    setMessages((prev) => [...prev, userMessage])
    setChatInput("")

    setTimeout(() => {
      const responses = [
        "This clause could be problematic. Let me explain why...",
        "That's a great question. The standard approach would be...",
        "I'd recommend negotiating this term. Here's why...",
      ]
      const randomResponse = responses[Math.floor(Math.random() * responses.length)]

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: randomResponse,
        role: "assistant",
      }
      setMessages((prev) => [...prev, assistantMessage])
    }, 800)
  }

  return (
    <div className="relative min-h-screen bg-background overflow-hidden">
      <GrainOverlay />
      <CursorGlow />

      <AuroraBackground />

      {/* Header with logo/nav linking to home page */}
      <header className="relative z-50 backdrop-blur-md bg-card/30">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
              <span className="text-primary font-bold text-sm">CS</span>
            </div>
            <span className="font-space-grotesk font-semibold text-foreground hidden sm:inline">Clause Sense</span>
          </Link>
          <nav className="flex items-center gap-6">
            <Link href="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Back to Home
            </Link>
          </nav>
        </div>
      </header>

      <div className="relative max-w-7xl mx-auto px-6 py-20">
        {!uploadedFile && (
          <ScrollReveal>
            <div className="mb-20 text-center space-y-4">
              <h1 className="font-space-grotesk text-5xl md:text-6xl font-bold text-balance">
                Analyze Your Legal Documents
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Upload a PDF or document. Our AI will summarize, analyze, and flag anomalies instantly.
              </p>
            </div>
          </ScrollReveal>
        )}

        {/* Upload or Analysis Layout */}
        {!uploadedFile ? (
          /* Initial Upload Section */
          <div className="max-w-2xl mx-auto">
            <GlassPanel className="p-16 rounded-2xl">
              <label className="cursor-pointer block">
                <input type="file" onChange={handleFileUpload} accept=".pdf,.doc,.docx,.txt" className="hidden" />
                <div className="flex flex-col items-center justify-center py-20 space-y-6 hover:opacity-80 transition-opacity">
                  <div className="relative w-20 h-20">
                    <div className="absolute inset-0 rounded-full border-2 border-transparent bg-gradient-to-r from-primary via-accent to-secondary bg-clip-border animate-spin opacity-50" />
                    <div className="absolute inset-0 rounded-full flex items-center justify-center">
                      <Upload className="w-10 h-10 text-primary" />
                    </div>
                  </div>

                  <div className="text-center">
                    <p className="font-space-grotesk font-semibold text-2xl">Drop your document here</p>
                    <p className="text-muted-foreground mt-2">or click to browse (PDF, DOC, DOCX, TXT)</p>
                  </div>
                </div>
              </label>
            </GlassPanel>
          </div>
        ) : (
          /* Analysis Results - Split Layout */
          <div className="space-y-8">
            {/* File Header */}
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Analyzing</p>
              <h1 className="font-space-grotesk text-4xl font-bold">{uploadedFile.name}</h1>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left: Document Preview + Chat */}
              <div className="lg:col-span-2 flex flex-col gap-8">
                {isAnalyzing ? (
                  <GlassPanel className="p-12 rounded-2xl flex flex-col items-center justify-center space-y-6 h-96">
                    <Loader2 className="w-10 h-10 text-primary animate-spin" />
                    <p className="font-space-grotesk text-lg font-semibold">Analyzing your document...</p>
                    <p className="text-sm text-muted-foreground">Scanning clauses and detecting anomalies</p>
                  </GlassPanel>
                ) : analysisComplete ? (
                  <GlassPanel className="p-8 rounded-2xl space-y-6 bg-card/40 border border-accent/10 backdrop-blur-md max-h-[600px] overflow-y-auto">
                    {clauses.map((clause, index) => (
                      <div
                        key={index}
                        className={`p-6 rounded-lg transition-all duration-500 border ${
                          clause.status === "warning"
                            ? "border-primary/40 bg-primary/5 hover:bg-primary/10 animate-glow-pulse"
                            : "border-accent/20 bg-card/50 hover:bg-card/80"
                        }`}
                      >
                        <div className="flex items-start gap-3 mb-2">
                          <div
                            className={`mt-1 w-2 h-2 rounded-full flex-shrink-0 ${
                              clause.status === "warning" ? "bg-primary/80" : "bg-accent/50"
                            }`}
                          />
                          <h3 className="font-medium text-foreground">{clause.title}</h3>
                        </div>
                        <p className="text-sm text-muted-foreground leading-relaxed ml-5">
                          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut
                          labore et dolore magna aliqua.
                        </p>
                      </div>
                    ))}
                  </GlassPanel>
                ) : null}

                {analysisComplete && (
                  <GlassPanel className="p-6 rounded-xl bg-card/40 border border-accent/10 backdrop-blur-md flex flex-col h-96">
                    <h3 className="font-semibold text-sm text-foreground mb-4">Legal Advisor</h3>

                    <div className="flex-1 overflow-y-auto space-y-3 mb-4 chat-scroll">
                      {messages.map((msg) => (
                        <div key={msg.id} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                          <div
                            className={`max-w-xs px-3 py-2 rounded-lg text-xs animate-slide-up ${
                              msg.role === "user"
                                ? "bg-primary/20 text-foreground rounded-br-none"
                                : "bg-accent/10 text-muted-foreground rounded-bl-none"
                            }`}
                          >
                            {msg.text}
                          </div>
                        </div>
                      ))}
                      <div ref={messagesEndRef} />
                    </div>

                    {/* Input */}
                    <div className="flex gap-2 border-t border-accent/10 pt-4">
                      <input
                        type="text"
                        value={chatInput}
                        onChange={(e) => setChatInput(e.target.value)}
                        onKeyPress={(e) => e.key === "Enter" && handleSendChat()}
                        placeholder="Ask about this..."
                        className="flex-1 bg-input/50 border border-accent/10 rounded-lg px-2 py-2 text-xs text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary/30 transition-colors"
                      />
                      <button
                        onClick={handleSendChat}
                        disabled={!chatInput.trim()}
                        className="p-2 rounded-lg bg-primary/20 text-primary hover:bg-primary/30 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        aria-label="Send message"
                      >
                        <Send className="w-4 h-4" />
                      </button>
                    </div>
                  </GlassPanel>
                )}
              </div>

              {/* Right: Summary, Issues, Negotiation Tips, Metrics */}
              <div className="space-y-4 lg:sticky lg:top-32">
                {analysisComplete && (
                  <GlassPanel className="p-6 rounded-xl bg-card/40 border border-accent/10 backdrop-blur-md">
                    <div className="space-y-3">
                      <h3 className="text-sm font-semibold text-foreground">Summary</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">{displayedSummary}</p>
                      {displayedSummary.length === fullSummary.length && (
                        <div className="pt-2 border-t border-accent/10">
                          <p className="text-xs text-accent font-medium">Analysis complete</p>
                        </div>
                      )}
                    </div>
                  </GlassPanel>
                )}

                {analysisComplete && (
                  <div className="space-y-3">
                    {clauses.slice(0, 2).map((issue, index) => (
                      <GlassPanel
                        key={index}
                        className={`p-4 rounded-lg border transition-all duration-500 ${
                          visibleIssues.includes(index) ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                        } ${
                          issue.status === "warning"
                            ? "border-primary/30 bg-primary/5 hover:bg-primary/10"
                            : "border-accent/20 bg-card/50 hover:bg-card/80"
                        }`}
                      >
                        <div className="flex items-start gap-2">
                          <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0 text-primary" />
                          <div>
                            <p className="text-sm font-medium text-foreground">{issue.title}</p>
                            <p className="text-xs text-muted-foreground">{issue.type}</p>
                          </div>
                        </div>
                      </GlassPanel>
                    ))}
                  </div>
                )}

                {/* Negotiation Insights */}
                {analysisComplete && (
                  <GlassPanel className="p-6 rounded-xl bg-gradient-to-br from-accent/5 to-primary/5 border border-accent/10 backdrop-blur-md">
                    <div className="space-y-3">
                      <h3 className="text-sm font-semibold text-foreground">Negotiation Tips</h3>
                      <ul className="space-y-2">
                        {[
                          "Request 3-year term instead of 5-year",
                          "Add liability cap of $250k",
                          "Limit confidentiality to 2 years post-term",
                        ].map((tip, idx) => (
                          <li key={idx} className="text-xs text-muted-foreground flex items-start gap-2">
                            <span className="text-accent font-bold">→</span>
                            <span>{tip}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </GlassPanel>
                )}

                {/* Metrics */}
                {analysisComplete && (
                  <GlassPanel className="p-6 rounded-xl">
                    <h3 className="font-space-grotesk font-semibold mb-4">Metrics</h3>
                    <div className="space-y-3">
                      {[
                        { label: "Clauses", value: "12" },
                        { label: "Anomalies", value: "1" },
                        { label: "Risk", value: "Low" },
                      ].map((metric, idx) => (
                        <div key={idx} className="border-t border-accent/10 pt-3 first:border-t-0 first:pt-0">
                          <p className="text-xs text-muted-foreground uppercase">{metric.label}</p>
                          <p className="text-xl font-semibold mt-1">{metric.value}</p>
                        </div>
                      ))}
                    </div>
                  </GlassPanel>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      <footer className="relative z-30 border-t border-accent/10 backdrop-blur-md bg-card/30 mt-20">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-primary/20 flex items-center justify-center">
                <span className="text-primary font-bold text-xs">CS</span>
              </div>
              <span className="font-space-grotesk font-semibold text-sm text-foreground">Clause Sense</span>
            </div>
            <p className="text-xs text-muted-foreground">
              © 2025 Clause Sense. AI-powered legal document analysis. All rights reserved.
            </p>
            <div className="flex gap-4">
              <Link href="#" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
                Privacy
              </Link>
              <Link href="#" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
                Terms
              </Link>
              <Link href="#" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
                Contact
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
