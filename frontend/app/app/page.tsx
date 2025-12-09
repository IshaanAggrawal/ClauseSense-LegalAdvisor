"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { useRouter } from 'next/navigation'
import { Upload, Send, History, X, Menu, Plus, FileText, Bot, Home, File, Square, MessageSquarePlus } from "lucide-react"
import { useToast } from '@/components/ui/use-toast'
import { ToastAction } from '@/components/ui/toast'
import { AuroraBackground } from "@/components/aurora-background"
import { GrainOverlay } from "@/components/grain-overlay"
import { CursorGlow } from "@/components/cursor-glow"

interface Message {
  id: string
  text: string
  role: "user" | "assistant"
  fileName?: string
  model?: string
}

interface Chat {
  id: string
  title: string
  messages: Message[]
  date: string
  fileName?: string
}

export default function AppPage() {
  const { toast } = useToast()
  const router = useRouter()
  
  // State management
  const [uploadedFile, setUploadedFile] = useState<{ name: string; size: number } | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  
  // Initialized with dummy data
  const [chatHistory, setChatHistory] = useState<Chat[]>([
    { 
      id: "1", 
      title: "Legal Document Review", 
      date: "12/08/2025",
      fileName: "nda_contract.pdf",
      messages: [
        { id: "1", role: "user", text: "Review this NDA for me" },
        { id: "2", role: "assistant", text: "I have reviewed the NDA. Clause 3 regarding termination seems non-standard." }
      ]
    },
    { 
      id: "2", 
      title: "Murder Case Precedents", 
      date: "12/07/2025",
      messages: [
        { id: "1", role: "user", text: "give me some legal cases related to murder" },
        { id: "2", role: "assistant", text: "I cannot provide specific legal advice or case details for criminal acts." }
      ]
    }
  ])
  
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "Hello! I am your AI Legal Advisor. Upload a document to get started or ask me a general legal question.",
      role: "assistant",
    }
  ]);

  const [abortController, setAbortController] = useState<AbortController | null>(null)
  const [chatInput, setChatInput] = useState("")
  const [currentDocId, setCurrentDocId] = useState<string | null>(null)
  const [isThinking, setIsThinking] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showChatHistory, setShowChatHistory] = useState(false)
  const [showMobileSidebar, setShowMobileSidebar] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const LEGAL_DISCLAIMER = "\n\n---\n**Disclaimer:** I am an AI assistant, not a lawyer. This analysis is for informational purposes only and does not constitute legal advice. Please consult a qualified attorney for professional counsel.";

  // Parse AI response
  const parseAIResponse = (response: string) => {
    const disclaimerMatch = response.match(/\(Disclaimer:.*?\)/);
    const disclaimer = disclaimerMatch ? disclaimerMatch[0] : '';
    
    let cleanResponse = response.replace(/\(Disclaimer:.*?\)/g, '').trim();
    
    cleanResponse = cleanResponse
      .replace(/^<assistant\|>\s*/, '') 
      .replace(/^(Answer:\s*)+/i, '')
      .replace(/^(Response:\s*)+/i, '')
      .replace(/^(I apologize, but\s*)+/i, '')
      .replace(/^[\W]+/, '') 
      .trim();

    return {
      answer: cleanResponse,
      hasDisclaimer: !!disclaimer,
      disclaimerText: disclaimer
    };
  }

  // --- STOP RESPONSE FUNCTION ---
  const handleStopResponse = () => {
    if (abortController) {
      abortController.abort()
      setAbortController(null)
      setIsThinking(false)
      
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        text: "🛑 [Response stopped by user]",
        role: "assistant",
        model: "System"
      }])
    }
  }

  // --- NEW CHAT & SAVE TO HISTORY FUNCTION ---
  const handleNewChat = () => {
    if (messages.length > 1) {
      let title = "New Conversation";
      if (uploadedFile) {
        title = `Analysis: ${uploadedFile.name}`;
      } else {
        const firstUserMsg = messages.find(m => m.role === 'user');
        if (firstUserMsg) {
          title = firstUserMsg.text.length > 25 
            ? firstUserMsg.text.slice(0, 25) + "..." 
            : firstUserMsg.text;
        }
      }

      const newHistoryItem: Chat = {
        id: Date.now().toString(),
        title: title,
        messages: [...messages],
        date: new Date().toLocaleDateString(),
        fileName: uploadedFile?.name
      }
      
      setChatHistory(prev => [newHistoryItem, ...prev])
      
      toast({
        title: "Chat Saved",
        description: "Your conversation has been added to history.",
      })
    }

    setMessages([{
      id: Date.now().toString(),
      text: "New chat started. How can I help you regarding legal matters today?",
      role: "assistant",
    }])
    setUploadedFile(null)
    setCurrentDocId(null)
    setChatInput("")
    setError(null)
  }

  const loadChatFromHistory = (chat: Chat) => {
    setMessages(chat.messages)
    if (chat.fileName) {
        setUploadedFile({ name: chat.fileName, size: 0 }) 
    } else {
        setUploadedFile(null)
    }
    setShowChatHistory(false)
    
    toast({
        title: "History Loaded",
        description: `Loaded conversation: ${chat.title}`,
    })
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // 1. Initial State for Upload
    const uploadMsgId = Date.now().toString();
    setMessages(prev => [...prev, {
        id: uploadMsgId,
        text: `Uploading and analyzing ${file.name}...`,
        role: "assistant"
    }])
    
    setIsAnalyzing(true)
    setError(null)
    setUploadedFile({
      name: file.name,
      size: file.size,
    })

    const formData = new FormData()
    formData.append('file', file)
    const inputElement = e.target;

    let progress = 0
    const progressInterval = setInterval(() => {
      progress += Math.random() * 10
      if (progress >= 95) {
        progress = 95
      }
      setUploadProgress(progress)
    }, 100)

    try {
      // 2. Perform Upload
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/upload`, {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        clearInterval(progressInterval);
        const errorData = await response.json()
        throw new Error(errorData.detail || 'Failed to upload document')
      }

      const result = await response.json()
      
      // Ensure we have a valid ID
      if (!result.document_id) {
          throw new Error('Upload successful but no document ID returned.');
      }

      setCurrentDocId(result.document_id)
      
      clearInterval(progressInterval);
      setUploadProgress(100);

      // 3. Auto-Trigger Analysis (Chained Request)
      // FIX: Explicitly cast document_id to String to avoid 422 type errors
      const docIdStr = String(result.document_id);

      const analysisResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
            document_id: docIdStr, 
            message: "Please analyze the uploaded document and provide a concise summary of its key legal points and any potential issues." 
        }),
      })

      if (!analysisResponse.ok) {
          const errorData = await analysisResponse.json();
          console.error("Analysis Error Details:", errorData); // Log for debugging
          throw new Error(errorData.detail || 'Document uploaded, but analysis failed.');
      }

      const analysisResult = await analysisResponse.json()
      const { answer } = parseAIResponse(analysisResult.response)

      // 4. Update UI with Analysis AND Disclaimer
      setMessages(prev => {
        const filtered = prev.filter(msg => msg.id !== uploadMsgId);
        return [...filtered, {
            id: Date.now().toString(),
            text: `**Analysis of ${file.name}:**\n\n${answer}${LEGAL_DISCLAIMER}`,
            role: "assistant",
            model: analysisResult.router_decision || "Analysis"
        }]
      })
      
      setIsAnalyzing(false)
      setUploadProgress(0)
      
      toast({
        title: "Analysis Complete",
        description: "Document uploaded and analyzed successfully.",
      })

    } catch (error) {
      setIsAnalyzing(false)
      setUploadProgress(0)
      setUploadedFile(null)
      
      setMessages(prev => [
          ...prev.filter(msg => msg.id !== uploadMsgId),
          {
              id: Date.now().toString(),
              text: `Error: ${error instanceof Error ? error.message : "Failed to process document"}`,
              role: "assistant"
          }
      ])
      
      toast({
        variant: "destructive",
        title: "Process failed",
        description: error instanceof Error ? error.message : "Failed to upload/analyze document",
        action: (
          <ToastAction altText="Try again" onClick={() => inputElement.click()}>
            Try again
          </ToastAction>
        ),
      })
    }
  }

  const handleSendChat = async () => {
    const message = chatInput.trim()
    
    // Input validation: reject empty or whitespace-only messages
    if (!message || message.length === 0 || isThinking) {
      setError("Please enter a message before sending.")
      return
    }

    const controller = new AbortController()
    setAbortController(controller)

    const userMessage: Message = {
      id: Date.now().toString(),
      text: message,
      role: "user",
    }

    setMessages((prev) => [...prev, userMessage])
    setChatInput("")
    setIsThinking(true)
    setError(null)
    
    // Force document_id to be a string to prevent 422 errors
    const docId = currentDocId ? String(currentDocId).trim() : 'general_chat';
    
    // Validate docId is not empty
    if (!docId || docId.length === 0) {
      setError("Invalid document ID. Please try again.")
      setIsThinking(false)
      return
    }

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ document_id: docId, message }),
        signal: controller.signal
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.detail || 'Failed to get response')
      }

      const result = await response.json()
      const { answer } = parseAIResponse(result.response)
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: answer + (docId !== 'general_chat' ? LEGAL_DISCLAIMER : ""), // Only add disclaimer for legal doc chats if desired, or always
        role: "assistant",
        model: result.router_decision || "General"
      }
      setMessages((prev) => [...prev, assistantMessage])
      
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        console.log('Request was aborted')
        return
      }
      
      setIsThinking(false)
      if (error instanceof Error && error.name !== 'AbortError') {
          toast({
            variant: "destructive",
            title: "Error",
            description: error instanceof Error ? error.message : "Failed to send message"
          })
      }
    } finally {
      setIsThinking(false)
      setAbortController(null)
    }
  }

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  return (
    <div className="h-screen w-screen flex bg-background relative">
      <AuroraBackground />
      <GrainOverlay />
      <CursorGlow />
      
      {(showMobileSidebar || showChatHistory) && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => {
            if (showMobileSidebar) setShowMobileSidebar(false);
            if (showChatHistory) setShowChatHistory(false);
          }}
        />
      )}
      
      {/* Sidebar */}
      <div 
        className={`
          fixed top-0 left-0 h-full 
          bg-card/80 backdrop-blur-sm border-r border-accent/10 
          flex flex-col items-center py-6 z-50 
          transition-transform duration-300 ease-in-out
          w-16 md:w-20
          md:translate-x-0
          ${showMobileSidebar ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        <div className="space-y-6 flex flex-col justify-center h-full">
          <button
            onClick={() => setShowChatHistory(!showChatHistory)}
            className="p-3 rounded-xl hover:bg-accent/10 transition-all duration-200 group relative"
            title="Chat History"
            suppressHydrationWarning
          >
            <History className="w-6 h-6 text-foreground/70 group-hover:text-foreground" />
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-full pl-0 md:pl-20 relative z-10">
        <header className="h-20 border-b border-accent/10 flex items-center justify-between px-6 z-20 bg-background/80 backdrop-blur-lg">
          <button
            onClick={() => setShowMobileSidebar(true)}
            className="md:hidden p-3 mr-4 rounded-xl hover:bg-accent/10 transition-all duration-200"
            title="Open Menu"
            suppressHydrationWarning
          >
            <Menu className="w-6 h-6 text-foreground/70" />
          </button>

          <div className="flex items-center space-x-2">
            <div className="p-2 bg-gradient-to-br from-primary to-primary/80 rounded-xl">
              <Bot className="w-4 h-4 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-sm sm:text-lg font-semibold text-foreground truncate max-w-[150px] sm:max-w-[200px]">
                {uploadedFile?.name || 'Legal Advisor'}
              </h1>
              <p className="text-xs text-muted-foreground hidden sm:block">
                {uploadedFile ? 'Document uploaded' : 'AI-powered legal assistance'}
              </p>
            </div>
          </div>
          
          <button
            onClick={() => router.push('/')}
            className="flex items-center space-x-1 px-3 py-2 rounded-xl bg-accent/10 hover:bg-accent/20 transition-all duration-200 group"
            title="Back to Home"
            suppressHydrationWarning
          >
            <Home className="w-4 h-4 text-foreground/70 group-hover:text-foreground transition-colors" />
            <span className="text-foreground/70 group-hover:text-foreground transition-colors text-xs font-medium hidden sm:inline">
              Home
            </span>
          </button>
        </header>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          <div className="space-y-4">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"} group`}
              >
                <div
                  className={`max-w-2xl px-6 py-4 rounded-2xl shadow-lg transition-all duration-200 ${
                    msg.role === "user"
                      ? "bg-gradient-to-br from-primary to-primary/80 text-primary-foreground rounded-br-sm shadow-primary/25" 
                      : "bg-card/50 text-foreground rounded-bl-sm border border-accent/20 backdrop-blur-sm shadow-accent/10"
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    {msg.role === "assistant" && (
                      <div className="p-1 bg-gradient-to-br from-primary to-primary/80 rounded-lg">
                        <Bot className="w-4 h-4 text-primary-foreground" />
                      </div>
                    )}
                    <div className="flex-1">
                      {msg.fileName && (
                        <div className="mb-3 flex items-center space-x-2 p-2 rounded-lg bg-accent/5 border border-accent/20">
                          <File className="w-4 h-4 text-primary" />
                          <span className="text-sm font-medium text-foreground">{msg.fileName}</span>
                        </div>
                      )}
                      <p className="whitespace-pre-wrap leading-relaxed">{msg.text}</p>
                      {msg.model && (
                      <div className="text-xs text-gray-500 mt-1">
                      via {msg.model}
                      </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
            
            {isThinking && (
              <div className="flex justify-start">
                <div className="px-6 py-4 rounded-2xl rounded-bl-sm bg-card/50 border border-accent/20 backdrop-blur-sm shadow-lg">
                  <div className="flex items-center space-x-2">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '0ms' }}></div>
                      <div className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '150ms' }}></div>
                      <div className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '300ms' }}></div>
                    </div>
                    <span className="text-sm text-muted-foreground">AI is thinking...</span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Input Area */}
        <div className="p-6 border-t border-accent/10 bg-background/80 backdrop-blur-lg">
          <div className="flex items-center gap-3 max-w-4xl mx-auto">
            
            {isThinking ? (
              <button
                onClick={handleStopResponse}
                className="p-3 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-500 transition-all duration-200"
                title="Stop Response"
                suppressHydrationWarning
              >
                <Square className="w-6 h-6 fill-current" />
              </button>
            ) : (
              <>
                <button
                  onClick={handleNewChat}
                  className="p-3 rounded-xl text-foreground/70 hover:text-foreground hover:bg-accent/10 transition-all duration-200"
                  title="New Chat (Saves current history)"
                  suppressHydrationWarning
                >
                  <MessageSquarePlus className="w-6 h-6" />
                </button>

                <label 
                  className="p-3 rounded-xl text-foreground/70 hover:text-foreground hover:bg-accent/10 transition-all duration-200 cursor-pointer" 
                  title="Attach Document"
                  suppressHydrationWarning
                >
                  <input
                    type="file"
                    onChange={handleFileUpload}
                    accept=".pdf,.doc,.docx,.txt"
                    className="hidden"
                  />
                  <Plus className="w-6 h-6" />
                </label>
              </>
            )}
            
            <div className="flex-1 relative">
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSendChat()}
                placeholder={isThinking ? "Thinking..." : "Ask me anything..."}
                className="w-full bg-card/50 border border-accent/20 rounded-xl px-6 py-4 pr-12 text-base text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent backdrop-blur-sm disabled:opacity-50"
                disabled={isThinking}
                suppressHydrationWarning
              />
              {chatInput && !isThinking && (
                <button
                  onClick={() => setChatInput("")}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 rounded-lg hover:bg-accent/10 transition-colors"
                  suppressHydrationWarning
                >
                  <X className="w-4 h-4 text-muted-foreground" />
                </button>
              )}
            </div>
            
            <button
              onClick={handleSendChat}
              disabled={!chatInput.trim() || isThinking} 
              className={`p-3 rounded-xl transition-all duration-200 ${
                chatInput.trim() && !isThinking
                  ? 'bg-gradient-to-r from-primary to-primary/80 text-primary-foreground hover:from-primary/90 hover:to-primary/70 shadow-lg shadow-primary/25' 
                  : 'bg-accent/20 text-muted-foreground cursor-not-allowed'
              }`}
              suppressHydrationWarning
            >
              <Send className="w-6 h-6" />
            </button>
          </div>
          {error && (
            <div className="mt-3 p-3 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
              <p className="text-sm text-red-600 dark:text-red-400 text-center">{error}</p>
            </div>
          )}
        </div>
      </div>

      {/* Chat History Panel */}
      {showChatHistory && (
        <div className="fixed top-0 right-0 h-full w-full md:w-96 bg-card/95 backdrop-blur-xl p-6 border-l border-accent/10 overflow-y-auto z-50">
          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center space-x-3">
              <History className="w-6 h-6 text-foreground/70" />
              <h3 className="text-xl font-semibold text-foreground">Chat History</h3>
            </div>
            <button
              onClick={() => setShowChatHistory(false)}
              className="p-2 rounded-xl hover:bg-accent/10 transition-all duration-200"
              suppressHydrationWarning
            >
              <X className="w-5 h-5 text-foreground/70" />
            </button>
          </div>
          <div className="space-y-3">
            {chatHistory.length === 0 && (
                 <p className="text-muted-foreground text-center py-4">No history yet.</p>
            )}
            {chatHistory.map((chat) => (
              <div
                key={chat.id}
                className="p-4 rounded-xl border border-accent/20 hover:bg-accent/5 cursor-pointer transition-all duration-200 group"
                onClick={() => loadChatFromHistory(chat)}
              >
                <div className="flex flex-col space-y-1">
                  <div className="flex items-center space-x-3">
                    <FileText className="w-5 h-5 text-muted-foreground group-hover:text-foreground" />
                    <span className="text-foreground font-medium truncate">{chat.title}</span>
                  </div>
                  <div className="flex justify-between items-center pl-8">
                      <span className="text-xs text-muted-foreground">{chat.date}</span>
                      {chat.messages.some(m => m.text.includes("stopped")) && (
                        <span className="text-xs text-red-400 bg-red-400/10 px-1.5 py-0.5 rounded">Stopped</span>
                      )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Upload Progress */}
      {isAnalyzing && (
        <div className="fixed bottom-8 right-8 bg-card/95 backdrop-blur-lg p-6 rounded-2xl shadow-2xl border border-accent/10 z-50 w-80">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-primary/10 rounded-xl">
                <Upload className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="font-medium text-foreground">
                  {uploadedFile ? `Uploading ${uploadedFile.name}` : 'Processing...'}
                </p>
                <p className="text-sm text-muted-foreground">Please wait</p>
              </div>
            </div>
            <span className="text-lg font-mono font-bold text-primary">{Math.round(uploadProgress)}%</span>
          </div>
          <div className="w-full bg-accent/20 rounded-full h-2 overflow-hidden">
            <div
              className="bg-gradient-to-r from-primary to-primary/80 h-full rounded-full transition-all duration-500 ease-out"
              style={{ width: `${uploadProgress}%` }}
            ></div>
          </div>
        </div>
      )}
    </div>
  )
}