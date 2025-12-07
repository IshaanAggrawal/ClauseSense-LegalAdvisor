"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Upload } from "lucide-react"
import { GlassPanel } from "./glass-panel"

interface UploadZoneProps {
  onUpload: (file: File) => void
}

export function UploadZone({ onUpload }: UploadZoneProps) {
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const files = e.dataTransfer.files
    if (files.length > 0) {
      const file = files[0]
      if (file.type === "application/pdf" || file.name.endsWith(".pdf")) {
        simulateUpload(file)
      }
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.currentTarget.files
    if (files && files.length > 0) {
      simulateUpload(files[0])
    }
  }

  const simulateUpload = (file: File) => {
    setIsAnalyzing(true)
    // Simulate analysis delay
    setTimeout(() => {
      onUpload(file)
      setIsAnalyzing(false)
    }, 1500)
  }

  return (
    <div className="max-w-2xl mx-auto min-h-[60vh] flex items-center justify-center">
      <div className="w-full space-y-8 text-center">
        {/* Centered Upload Area */}
        <div
          className={`relative transition-all duration-500 ${isDragging ? "scale-105" : "scale-100"}`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <GlassPanel
            className={`p-16 rounded-2xl cursor-pointer border-2 transition-all duration-500 ${
              isDragging ? "border-primary/60 bg-primary/5" : "border-accent/20 hover:border-accent/40"
            }`}
            onClick={() => fileInputRef.current?.click()}
          >
            <div className="space-y-6 flex flex-col items-center">
              {/* Animated Gradient Ring */}
              <div className="relative w-24 h-24">
                <div className="absolute inset-0 rounded-full border-2 border-transparent bg-gradient-to-r from-primary via-accent to-secondary bg-clip-border animate-spin opacity-50" />
                <div className="absolute inset-0 rounded-full flex items-center justify-center">
                  <Upload className="w-10 h-10 text-primary" />
                </div>
              </div>

              <div className="space-y-2">
                <h2 className="font-space-grotesk text-3xl font-bold text-foreground">
                  {isAnalyzing ? "Analyzing your document..." : "Upload your contract"}
                </h2>
                <p className="text-muted-foreground text-lg">
                  {isAnalyzing
                    ? "Sit back. We're scanning for clauses, risks, and anomalies."
                    : "Drag and drop a PDF, or click to browse"}
                </p>
              </div>

              {/* Progress indicator */}
              {isAnalyzing && (
                <div className="w-full max-w-xs space-y-2">
                  <div className="h-1 w-full bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-primary to-accent animate-shimmer" />
                  </div>
                  <p className="text-xs text-muted-foreground">Processing document...</p>
                </div>
              )}
            </div>
          </GlassPanel>

          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf"
            onChange={handleFileSelect}
            className="hidden"
            aria-label="Upload PDF document"
          />
        </div>

        {/* Supported formats */}
        <p className="text-sm text-muted-foreground">
          Supports PDF documents • Contracts, terms, agreements • Any legal doc
        </p>
      </div>
    </div>
  )
}
