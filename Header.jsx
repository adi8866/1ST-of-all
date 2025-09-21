import React, { useEffect, useRef, useState } from 'react'
import { assets } from '../assets/assets'

const suggestions = ['Idea Pods', 'Snackable Reads', 'Treasure Hunt', 'Curiosity Lens']

export default function Header() {
  const rootRef = useRef(null)
  const inputRef = useRef(null)
  const [q, setQ] = useState('')
  const [placeholder, setPlaceholder] = useState(suggestions[0])

  useEffect(() => {
    let i = 0
    const id = setInterval(() => {
      i = (i + 1) % suggestions.length
      setPlaceholder(suggestions[i])
    }, 2600)
    return () => clearInterval(id)
  }, [])

  useEffect(() => {
    const onKey = (e) => {
      const tag = (e.target?.tagName || '').toLowerCase()
      if (e.metaKey || e.ctrlKey || e.altKey || e.shiftKey) return
      if (['input','textarea','select'].includes(tag)) return
      if (e.key === '/') { e.preventDefault(); inputRef.current?.focus() }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  useEffect(() => {
    const el = rootRef.current
    if (!el) return
    const onMove = (e) => {
      const r = el.getBoundingClientRect()
      const x = (e.clientX - r.left) / r.width - 0.5
      const y = (e.clientY - r.top) / r.height - 0.5
      el.style.setProperty('--parx', (x * 6).toFixed(2) + 'px')
      el.style.setProperty('--pary', (y * 6).toFixed(2) + 'px')
    }
    el.addEventListener('pointermove', onMove)
    return () => el.removeEventListener('pointermove', onMove)
  }, [])

  const onSubmit = (e) => {
    e.preventDefault()
    const term = (q || placeholder).trim()
    console.log('[Header] search:', term)
  }

  return (
    <section
      ref={rootRef}
      className="relative w-full min-h-[520px] sm:min-h-[580px] md:min-h-[640px] flex items-center overflow-hidden py-16 sm:py-20"
    >
      <img
        src={assets.gradientBackground}
        alt=""
        decoding="async"
        fetchpriority="low"
        className="absolute inset-0 h-full w-full object-cover -z-30 opacity-40"
      />
      <div className="absolute inset-0 -z-20 bg-[#0E3A2D]/70" />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute -z-10 inset-0 opacity-70 will-change-transform"
        style={{
          transform: 'translate(var(--parx,0), var(--pary,0))',
          transition: 'transform 200ms ease-out',
          background: `
            radial-gradient(55% 45% at 50% 28%, rgba(231,196,140,.18) 0%, rgba(231,196,140,0) 62%),
            radial-gradient(20% 30% at 15% 85%, rgba(245,184,161,.12) 0%, rgba(245,184,161,0) 70%),
            radial-gradient(22% 30% at 85% 85%, rgba(210,160,101,.12) 0%, rgba(210,160,101,0) 70%)
          `
        }}
      />

      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 opacity-65">
        <div className="hero-dust" />
      </div>

      <div className="mx-auto w-full max-w-screen-xl px-4 sm:px-6">
        <div className="mx-auto flex w-full max-w-[56rem] flex-col items-center text-center gap-6 sm:gap-8">

          {/* Announcement — text only */}
          <p className="flex items-center gap-2 text-sm sm:text-[0.95rem] text-[#F0E2C3]/95 tracking-[0.005em]">
            <img src={assets.star_icon} className="h-4 w-4" alt="" />
            <span className="font-semibold">Smart just got smarter</span>
            <span className="opacity-85">— AI is now part of the crew</span>
          </p>

          {/* Headline */}
          <div className="max-w-[48rem] w-full px-2">
            <h1 className="leading-tight">
              <span
                className="block relative select-none"
                style={{
                  fontFamily: '"Outfit","Poppins",system-ui,-apple-system,Segoe UI,Roboto,"Helvetica Neue",Arial,sans-serif',
                  fontWeight: 900,
                  letterSpacing: '-0.7px',
                  fontSize: 'clamp(3.2rem, 8vw, 5.8rem)',
                  lineHeight: 1
                }}
              >
                <span
                  className="bg-gradient-to-b from-[#F8EEC6] via-[#E9C895] to-[#C6884A] text-transparent bg-clip-text"
                  style={{ filter: 'drop-shadow(0 3px 16px rgba(0,0,0,.22))' }}
                >
                  Blog
                </span>

                <svg className="mx-auto mt-2 block w-[72%] h-[18px]" viewBox="0 0 600 30" aria-hidden="true">
                  <defs>
                    <linearGradient id="g" x1="0" x2="1">
                      <stop offset="0" stopColor="#E7C48C" stopOpacity=".0" />
                      <stop offset=".5" stopColor="#E7C48C" />
                      <stop offset="1" stopColor="#E7C48C" stopOpacity=".0" />
                    </linearGradient>
                  </defs>
                  <path d="M6 18 C130 8, 230 26, 300 14 S 520 8, 594 18" stroke="url(#g)" strokeWidth="5" strokeLinecap="round" className="path-draw" fill="none" />
                </svg>
              </span>

              <span
                className="-mt-0.5 sm:-mt-1 block font-semibold"
                style={{
                  fontFamily: 'Inter,"SF Pro Text","General Sans",system-ui,-apple-system,Segoe UI,Roboto,"Helvetica Neue",Arial,sans-serif',
                  fontSize: 'clamp(1.1rem, 3vw, 2.2rem)',
                  color: '#F2E9D6'
                }}
              >
                like you mean it.”
              </span>
            </h1>
          </div>

          {/* 2 a.m. ideas line — text-only with balanced emphasis */}
          <div className="max-w-[48rem] w-full px-4">
            <p
              className="text-[1rem] md:text-[1.15rem] leading-[1.55] tracking-[0.003em] text-[#FBF5E6]/95"
              style={{ fontFamily: '"Inter","SF Pro Text","General Sans",system-ui' }}
            >
              <span className="font-semibold bg-gradient-to-r from-[#F5B8A1] via-[#E7C48C] to-[#D2A065] bg-clip-text text-transparent drop-shadow-[0_1px_8px_rgba(0,0,0,.22)]">
                You bring the <span className="italic">2 a.m. ideas</span>
              </span>
              <span className="px-1 text-[#FBF5E6]/90">; we’ll handle the</span>
              <span className="font-semibold text-[#F5B8A1] underline decoration-[#F5B8A1]/40 decoration-2 underline-offset-[3px]">
                {' '}premiere
              </span>
              <span className="px-1 text-[#FBF5E6]/90">—polish, pacing, and an </span>
              <span className="font-semibold text-[#FFEBCF]">AI co-pilot</span>
              <span className="text-[#FBF5E6]/90">—so they land like crowd-pleasers</span>
              <span className="opacity-80 text-[0.95em] italic"> (applause subject to T&amp;Cs)</span>
            </p>
          </div>

          {/* Search */}
          <form onSubmit={onSubmit} className="w-full" role="search" aria-label="Site search">
            <div className="mx-auto hidden sm:flex max-w-[42rem] items-stretch rounded-[16px] overflow-hidden bg-white/96 shadow-[0_14px_36px_rgba(0,0,0,0.16)] ring-1 ring-black/5 focus-within:ring-4 focus-within:ring-[#E7C48C]/70">
              <div className="flex items-center pl-5 pr-2 text-[#0E3A2D]/80">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path d="M21 21l-4.2-4.2M10.8 18a7.2 7.2 0 1 1 0-14.4 7.2 7.2 0 0 1 0 14.4z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <div className="relative flex-1 min-w-0">
                <input
                  ref={inputRef}
                  type="search"
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder={`Search for ${placeholder}`}
                  className="w-full px-4 py-3 text-[0.95rem] outline-none bg-transparent placeholder-gray-500 text-gray-900"
                  aria-label="Search"
                />
                {!q && (
                  <kbd className="hidden md:flex items-center gap-1 absolute right-28 top-1/2 -translate-y-1/2 rounded-md border border-gray-200 bg-gray-50 px-2 py-1 text-xs text-gray-600">
                    /
                  </kbd>
                )}
              </div>
              <button
                type="submit"
                className="px-6 md:px-7 py-3 font-semibold bg-[#D2A065] text-[#0E3A2D] hover:bg-[#c89256] hover:shadow-[0_10px_26px_rgba(231,196,140,.35)] transition-[transform,box-shadow,background-color] duration-200 will-change-transform"
              >
                Search
              </button>
            </div>

            <div className="sm:hidden mx-auto w-full max-w-[20rem] flex items-center gap-2">
              <div className="flex-1 flex items-center rounded-full bg-white/95 shadow-inner ring-1 ring-black/5 px-3 focus-within:ring-2 focus-within:ring-[#E7C48C]/60">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="text-[#0E3A2D]/80">
                  <path d="M21 21l-4.2-4.2M10.8 18a7.2 7.2 0 1 1 0-14.4 7.2 7.2 0 0 1 0 14.4z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <input
                  ref={inputRef}
                  type="search"
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder={`Search for ${placeholder}`}
                  className="flex-1 min-w-0 px-2 py-2 text-sm outline-none bg-transparent placeholder-gray-500 text-gray-900"
                  aria-label="Search"
                />
              </div>
              <button
                type="submit"
                className="h-10 w-10 rounded-full bg-[#D2A065] text-[#0E3A2D] font-semibold shadow-sm hover:scale-[1.02] transition-transform focus:outline-none focus-visible:outline focus-visible:outline-3 focus-visible:outline-[#0E3A2D]"
                aria-label="Search"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="mx-auto">
                  <path d="M21 21l-4.2-4.2M10.8 18a7.2 7.2 0 1 1 0-14.4 7.2 7.2 0 0 1 0 14.4z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>
          </form>
        </div>
      </div>

      <style>{`
        .path-draw{stroke-dasharray:640;stroke-dashoffset:640;animation:draw 1100ms cubic-bezier(.77,0,.18,1) 120ms forwards}
        @keyframes draw{to{stroke-dashoffset:0}}
        .hero-dust{
          position:absolute; inset:0;
          background:
            radial-gradient(2px 2px at 15% 30%, rgba(231,196,140,.50), rgba(231,196,140,0) 60%),
            radial-gradient(1.6px 1.6px at 35% 60%, rgba(245,184,161,.40), rgba(245,184,161,0) 60%),
            radial-gradient(1.8px 1.8px at 70% 38%, rgba(210,160,101,.40), rgba(210,160,101,0) 60%),
            radial-gradient(1.6px 1.6px at 82% 68%, rgba(231,196,140,.35), rgba(231,196,140,0) 60%);
          animation: drift 16s ease-in-out infinite;
          filter: drop-shadow(0 2px 8px rgba(0,0,0,.20));
        }
        @keyframes drift{0%,100%{transform:translate3d(0,0,0)}50%{transform:translate3d(0,-8px,0)}}
        @media (prefers-reduced-motion: reduce){.path-draw,.hero-dust{animation:none!important}}
      `}</style>
    </section>
  )
}
