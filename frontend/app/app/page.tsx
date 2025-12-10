"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { useRouter } from 'next/navigation'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { Upload, Send, Plus, Bot, Home, Square, File, MessageSquarePlus } from "lucide-react"
import { useToast } from '@/hooks/use-toast'
import { AuroraBackground } from "@/components/aurora-background"
import { GrainOverlay } from "@/components/grain-overlay"
import { CursorGlow } from "@/components/cursor-glow"

const generateId = () => Math.random().toString(36).substr(2, 9);

interface Message {
  id: string
  text: string
  role: "user" | "assistant"
  sources?: string[]
}

export default function AppPage() {
  const { toast } = useToast()
  const router = useRouter()
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

  // STATE
  const [sessionId, setSessionId] = useState<string>("") 
  const [docIds, setDocIds] = useState<string[]>([]) 
  const [filenames, setFilenames] = useState<string[]>([])
  
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [isThinking, setIsThinking] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [chatInput, setChatInput] = useState("")
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const [abortController, setAbortController] = useState<AbortController | null>(null)

  useEffect(() => {
    setSessionId(generateId())
    setMessages([{
      id: "welcome",
      text: "Hello! Upload documents to compare them, or ask general legal questions.",
      role: "assistant",
    }])
  }, [])

  useEffect(() => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }), [messages])

  const handleStop = () => {
    if (abortController) {
        abortController.abort()
        setAbortController(null)
        setIsThinking(false)
        setMessages(prev => [...prev, { id: Date.now().toString(), text: "🛑 Stopped.", role: "assistant" }])
    }
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsAnalyzing(true)
    const msgId = Date.now().toString()
    setMessages(prev => [...prev, { id: msgId, text: `Uploading **${file.name}**...`, role: "assistant" }])

    const formData = new FormData()
    formData.append('file', file)

    try {
      const res = await fetch(`${API_URL}/api/v1/upload`, { method: 'POST', body: formData })
      if (!res.ok) throw new Error("Upload failed")
      
      const data = await res.json()
      
      if (data.doc_id) {
          setDocIds(prev => [...prev, data.doc_id])
          setFilenames(prev => [...prev, file.name])
      }

      setMessages(prev => prev.filter(m => m.id !== msgId).concat({
        id: Date.now().toString(),
        text: `**Success:** Added **${file.name}**.\n\n${docIds.length + 1} document(s) active.`,
        role: "assistant"
      }))
    } catch (err) {
      console.error(err)
      setMessages(prev => [...prev, { id: Date.now().toString(), text: "❌ Upload failed.", role: "assistant" }])
    } finally {
      setIsAnalyzing(false)
    }
  }

  const handleSendChat = async () => {
    const text = chatInput.trim()
    if (!text || isThinking) return

    setMessages(prev => [...prev, { id: Date.now().toString(), text, role: "user" }])
    setChatInput("")
    setIsThinking(true)

    const controller = new AbortController()
    setAbortController(controller)

    try {
      const res = await fetch(`${API_URL}/api/v1/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
            session_id: sessionId,
            document_id: docIds.length > 0 ? docIds.join(",") : "general",
            message: text 
        }),
        signal: controller.signal
      })
      
      if (!res.ok) throw new Error("Failed")
      const data = await res.json()
      
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        text: data.response,
        role: "assistant",
        sources: data.sources
      }])
    } catch (err: any) {
        if (err.name !== 'AbortError') {
            setMessages(prev => [...prev, { id: Date.now().toString(), text: "⚠️ Error: " + err.message, role: "assistant" }])
        }
    } finally {
      setIsThinking(false)
      setAbortController(null)
    }
  }

  const handleNewChat = () => {
      setSessionId(generateId())
      setDocIds([]) 
      setFilenames([])
      setMessages([{ id: Date.now().toString(), text: "New session started.", role: "assistant" }])
  }

  return (
    <div className="h-screen w-screen flex bg-background relative overflow-hidden text-foreground">
      <AuroraBackground /> <GrainOverlay /> <CursorGlow />
      
      {/* DESKTOP SIDEBAR BUTTON (Hidden on Mobile) */}
      <div className="hidden md:flex fixed top-6 left-6 z-50">
        <button onClick={handleNewChat} className="p-3 bg-card/80 backdrop-blur rounded-xl border border-white/10 hover:bg-white/10 transition text-xs font-bold text-primary flex items-center gap-2 shadow-lg">
            <MessageSquarePlus className="w-4 h-4"/> NEW CHAT
        </button>
      </div>

      <div className="flex-1 flex flex-col h-full relative z-10 w-full">
        
        {/* HEADER */}
        <header className="h-16 md:h-20 flex items-center justify-center px-4 md:px-6 border-b border-white/5 bg-background/60 backdrop-blur-xl sticky top-0 z-40">
           {/* Desktop: Use max-w-5xl to center. Mobile: Use w-full to fill space. */}
           <div className="w-full md:max-w-5xl flex items-center justify-between">
                
                {/* LEFT */}
                <div className="flex items-center gap-3">
                    {/* Mobile New Chat Button */}
                    <button onClick={handleNewChat} className="md:hidden p-2 bg-primary/20 rounded-lg text-primary active:scale-95 transition">
                        <Plus className="w-5 h-5" />
                    </button>

                    {/* Desktop Icon */}
                    <div className="hidden md:block p-2 bg-primary/20 rounded-lg">
                        <Bot className="w-6 h-6 text-primary" />
                    </div>

                    <div>
                        <h1 className="font-bold text-base md:text-lg leading-tight">Legal Agent</h1>
                        <p className="text-[10px] md:text-xs text-muted-foreground">
                            {docIds.length === 0 ? "General Mode" : `${docIds.length} Active`}
                        </p>
                    </div>
                </div>

                {/* RIGHT */}
                <div className="flex items-center gap-3">
                    {/* File Badges (Desktop Only) */}
                    {filenames.length > 0 && (
                        <div className="hidden md:flex gap-2">
                            {filenames.map((name, i) => (
                                <span key={i} className="text-xs bg-white/10 px-2 py-1 rounded-md flex items-center gap-1">
                                    <File className="w-3 h-3"/> {name.substring(0, 10)}...
                                </span>
                            ))}
                        </div>
                    )}
                    
                    <button onClick={() => router.push('/')} className="p-2 hover:bg-white/10 rounded-lg transition active:scale-95">
                        <Home className="w-5 h-5 opacity-80"/>
                    </button>
                </div>
           </div>
        </header>

        {/* CHAT AREA */}
        <div className="flex-1 overflow-y-auto w-full scroll-smooth">
            <div className="w-full md:max-w-5xl mx-auto p-4 space-y-6 pb-32">
                {messages.map((msg) => (
                    <div key={msg.id} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                        <div className={`max-w-[90%] md:max-w-[80%] px-5 py-3 rounded-2xl shadow-sm ${
                            msg.role === "user" ? "bg-primary text-primary-foreground rounded-br-none" : "bg-card/90 backdrop-blur border border-white/10 rounded-bl-none"
                        }`}>
                            <div className={`text-sm md:text-base leading-relaxed ${msg.role === 'assistant' ? 'markdown-content' : ''}`}>
                                {msg.role === 'assistant' ? (
                                    <ReactMarkdown remarkPlugins={[remarkGfm]} components={{
                                        h1: ({node, ...props}) => <h1 className="text-lg font-bold mt-2" {...props} />,
                                        ul: ({node, ...props}) => <ul className="list-disc ml-4 my-2" {...props} />,
                                        strong: ({node, ...props}) => <span className="font-bold text-foreground" {...props} />,
                                        p: ({node, ...props}) => <p className="mb-2 last:mb-0" {...props} />,
                                    }}>{msg.text}</ReactMarkdown>
                                ) : msg.text}
                            </div>
                        </div>
                    </div>
                ))}
                {isThinking && <div className="ml-4 animate-pulse text-sm opacity-70">Thinking...</div>}
                <div ref={messagesEndRef} />
            </div>
        </div>

        {/* INPUT AREA */}
        <div className="p-4 md:p-6 w-full bg-background/80 backdrop-blur-md border-t border-white/5 sticky bottom-0 z-30">
            <div className="w-full md:max-w-3xl mx-auto bg-card/80 backdrop-blur-xl border border-white/10 p-2 rounded-2xl flex gap-2 shadow-2xl">
                {isThinking ? (
                    <button onClick={handleStop} className="p-3 text-red-400 hover:bg-red-500/10 rounded-xl"><Square className="w-5 h-5 fill-current"/></button>
                ) : (
                    <label className="p-3 hover:bg-white/10 rounded-xl cursor-pointer transition active:scale-95">
                        <input type="file" onChange={handleFileUpload} accept=".pdf,.docx,.txt" className="hidden" />
                        {isAnalyzing ? <div className="animate-spin w-5 h-5 border-2 border-primary border-t-transparent rounded-full"/> : <Plus className="w-5 h-5"/>}
                    </label>
                )}
                
                <input 
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSendChat()}
                    placeholder={docIds.length > 0 ? "Ask about docs..." : "Legal question..."}
                    className="flex-1 bg-transparent border-none focus:outline-none px-2 text-sm md:text-base"
                    disabled={isThinking}
                />
                
                <button onClick={handleSendChat} disabled={!chatInput.trim() || isThinking} className="p-3 bg-primary text-primary-foreground rounded-xl hover:opacity-90 disabled:opacity-50 active:scale-95 transition">
                    <Send className="w-5 h-5" />
                </button>
            </div>
        </div>
      </div>
    </div>
  )
}