"use client"

import type React from "react"

import { useEffect, useState } from "react"

interface AdaptiveTypographyProps {
  children: React.ReactNode
  baseSize?: number
}

export function AdaptiveTypography({ children, baseSize = 16 }: AdaptiveTypographyProps) {
  const [scale, setScale] = useState(1)

  useEffect(() => {
    const handleScroll = () => {
      const scrollProgress = Math.min(window.scrollY / (document.documentElement.scrollHeight - window.innerHeight), 1)
      const newScale = 1 + scrollProgress * 0.1
      setScale(newScale)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <div style={{ transform: `scale(${scale})`, transformOrigin: "left top", transition: "transform 0.3s ease-out" }}>
      {children}
    </div>
  )
}
