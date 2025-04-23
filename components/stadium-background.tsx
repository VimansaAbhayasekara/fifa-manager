"use client"

import { useEffect, useState } from "react"
import Image from "next/image"

export function StadiumBackground() {
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    setLoaded(true)
  }, [])

  return (
    <div className="fixed inset-0 z-0">
      <div
        className={`absolute inset-0 bg-gradient-to-b from-blue-600 to-blue-900 transition-opacity duration-1000 ${loaded ? "opacity-0" : "opacity-100"}`}
      />
      <Image
        src="/images/stadium-background.jpg"
        alt="Stadium Background"
        fill
        priority
        className={`object-cover transition-opacity duration-1000 ${loaded ? "opacity-100" : "opacity-0"}`}
        onLoad={() => setLoaded(true)}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-blue-900/80 to-blue-800/40" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-600/0 to-blue-900/80" />
    </div>
  )
}
