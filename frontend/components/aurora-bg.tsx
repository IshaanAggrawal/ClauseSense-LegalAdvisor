"use client"

import Aurora from "./aurora"

export function AuroraBg() {
  return (
    <div className="fixed inset-0 pointer-events-none -z-10 w-screen h-screen bg-slate-950">
      <Aurora colorStops={["#696FC7", "#5D688A", "#604652"]} blend={0.2} amplitude={1.0} speed={0.1} />
    </div>
  )
}
