'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setMounted(true);

    const onScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  if (!mounted) return null;

  return (
    <nav
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'bg-[#070B34]/90 backdrop-blur-xl'
          : 'px-4 pt-3'
      }`}
    >
      <div
        className={`mx-auto max-w-7xl transition-all duration-500 ${
          scrolled
            ? ''
            : 'rounded-3xl border border-cyan-400/10 bg-[#0B1023]/90 shadow-[0_0_40px_rgba(34,211,238,0.08)] backdrop-blur-2xl'
        }`}
      >
        <div className="flex h-20 items-center justify-between px-8">
          
          {/* LOGO */}
          <Link href="/" className="flex items-center gap-3">
            <h1 className="text-2xl font-bold tracking-tight text-white">
              EventSync
            </h1>
          </Link>

          {/* NAVIGATION */}
          <div className="flex items-center gap-5">
            
            {/* Events Link */}
            <Link
              href="/"
              className={`rounded-full border px-8 py-3 text-sm font-medium transition-all duration-300 hover:border-cyan-300/40 hover:bg-cyan-400/10 hover:shadow-[0_0_25px_rgba(34,211,238,0.35)] ${
                pathname === '/'
                  ? 'border-cyan-400/50 bg-cyan-400/10 text-cyan-300'
                  : 'border-cyan-400/20 bg-white/5 text-cyan-100'
              }`}
            >
              Events
            </Link>

            {/* Admin Login */}
            <a
              href="http://localhost:5173"
              target="_blank"
              className="rounded-full bg-cyan-400 px-8 py-3 text-sm font-semibold text-slate-950 shadow-[0_0_30px_rgba(34,211,238,0.55)] transition-all duration-300 hover:scale-[1.03] hover:bg-cyan-300 hover:shadow-[0_0_45px_rgba(34,211,238,0.8)]"
            >
              Admin login
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
}