"use client"

import { useState, useRef, useEffect } from "react"
import { MessageCircle, Send, X } from "lucide-react"
import { GlassPanel } from "./glass-panel"

interface ChatDockProps {
  isOpen: boolean
  onToggle: (open: boolean) => void
}

interface Message {
  id: string
  text: string
  role: "user" | "assistant"
  timestamp: Date
}

export function ChatDock({ isOpen, onToggle }: ChatDockProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "Hi! I'm your AI legal advisor. Ask me anything about this contract.",
      role: "assistant",
      timestamp: new Date(),
    },
  ])
  const [input, setInput] = useState("")
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const [isAnimating, setIsAnimating] = useState(false)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSend = () => {
    if (!input.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      text: input,
      role: "user",
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")

    // Simulate AI response
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
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, assistantMessage])
    }, 800)
  }

  return (
    <>
      {/* Chat Button */}
      <button
        onClick={() => onToggle(!isOpen)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-gradient-to-br from-primary to-accent text-white flex items-center justify-center shadow-lg hover:shadow-primary/30 transition-all duration-300 hover:scale-110 active:scale-95"
        aria-label="Toggle chat"
      >
        {isOpen ? <X className="w-5 h-5" /> : <MessageCircle className="w-5 h-5" />}
      </button>

      {/* Chat Dock */}
      {isOpen && (
        <GlassPanel
          className="fixed bottom-24 right-6 z-50 w-96 h-96 rounded-2xl bg-card/60 border border-accent/20 backdrop-blur-xl flex flex-col shadow-2xl animate-fade-in"
          style={{
            background: "linear-gradient(135deg, rgba(76, 59, 227, 0.1) 0%, rgba(168, 85, 247, 0.1) 100%)",
          }}
        >
          {/* Header */}
          <div className="p-4 border-b border-accent/10 flex items-center justify-between">
            <h3 className="font-semibold text-sm text-foreground">Legal Advisor</h3>
            <button
              onClick={() => onToggle(false)}
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-xs px-4 py-2 rounded-lg text-sm animate-slide-up ${
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
          <div className="p-4 border-t border-accent/10 flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSend()}
              placeholder="Ask about this contract..."
              className="flex-1 bg-input/50 border border-accent/10 rounded-lg px-3 py-2 text-sm text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary/30 transition-colors"
            />
            <button
              onClick={handleSend}
              disabled={!input.trim()}
              className="p-2 rounded-lg bg-primary/20 text-primary hover:bg-primary/30 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              aria-label="Send message"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </GlassPanel>
      )}
    </>
  )
}
