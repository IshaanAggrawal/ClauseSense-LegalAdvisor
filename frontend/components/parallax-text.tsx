"use client"

import type React from "react"

import { useEffect, useRef, useState } from "react"

interface ParallaxTextProps {
  children: React.ReactNode
  offset?: number
}

export function ParallaxText({ children, offset = 0.5 }: ParallaxTextProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [translateY, setTranslateY] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      if (!ref.current) return
      const rect = ref.current.getBoundingClientRect()
      const elementCenter = rect.top + rect.height / 2
      const windowCenter = window.innerHeight / 2
      const distance = elementCenter - windowCenter
      setTranslateY(distance * offset * 0.1)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [offset])

  return (
    <div ref={ref} style={{ transform: `translateY(${translateY}px)` }} className="transition-transform duration-300">
      {children}
    </div>
  )
}
