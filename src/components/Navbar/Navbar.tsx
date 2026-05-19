'use client'

import { useEffect, useState } from 'react'
import { useAdmin } from '@/context/AdminContext'
import Link from 'next/link'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const { admin, logout, isAdmin } = useAdmin()

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
        <Link href="/">
          <h1 className="text-xl font-semibold tracking-tight text-sky-100 cursor-pointer hover:text-sky-300 transition-colors">
            EventSync
          </h1>
        </Link>

        <div className="flex items-center gap-4">
          <Link href="/" className="px-6 py-3 rounded-full text-sky-200 border border-sky-300/20 bg-transparent shadow-[0_0_28px_rgba(56,189,248,0.24)] hover:shadow-[0_0_40px_rgba(56,189,248,0.35)] transition duration-200 ease-out">
            Events
          </Link>

          {isAdmin ? (
            <div className="flex items-center gap-3">
              <span className="text-sm text-sky-300 font-medium flex items-center gap-1">
                <svg className="w-4 h-4 text-emerald-400" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm-2 16l-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z"/>
                </svg>
                {admin?.name}
              </span>
              <button
                onClick={logout}
                className="px-4 py-2 rounded-full text-rose-300 border border-rose-300/30 bg-rose-900/20 hover:bg-rose-900/40 transition duration-200 ease-out text-sm"
              >
                Déconnexion
              </button>
            </div>
          ) : (
            <Link
              href="/admin/login"
              className="px-6 py-3 rounded-full bg-sky-500 text-white font-semibold shadow-lg shadow-sky-500/30 hover:bg-sky-400 transition duration-200 ease-out"
            >
              Admin
            </Link>
          )}
        </div>
      </div>
    </nav>
  )
}
