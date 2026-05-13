'use client'

import { useEffect, useState } from 'react'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <nav
      className={`fixed inset-x-0 top-0 z-50 h-18 transition-all duration-700 ease-in-out ${
        scrolled
          ? 'bg-slate-950 border-b border-slate-900 shadow-[0_18px_60px_rgba(15,23,42,0.5)] m-2 rounded-2xl'
          : 'bg-slate-950/80 border-b border-slate-900/20 backdrop-blur-xl'
      }`}
    >
      <div className="mx-auto flex h-full max-w-7xl items-center justify-between px-6">
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-sky-100">EventSync</h1>
        </div>

        <div className="flex items-center gap-4">
          <button className="px-6 py-3 rounded-full text-sky-200 border border-sky-300/20 bg-transparent shadow-[0_0_28px_rgba(56,189,248,0.24)] hover:shadow-[0_0_40px_rgba(56,189,248,0.35)] transition duration-200 ease-out">
            Events
          </button>
          <button className="px-6 py-3 rounded-full bg-sky-500 text-white font-semibold shadow-lg shadow-sky-500/30 hover:bg-sky-400 transition duration-200 ease-out">
            Admin login
          </button>
        </div>
      </div>
    </nav>
  )
}
