import { motion, AnimatePresence } from 'framer-motion'
import { useEffect, useState, useRef } from 'react'
import kvLogo from '../assets/kv-logo.png'

type NavLink = {
  id: string
  label: string
  href?: string
  isExternal?: boolean
}

// 5 Center Navigation buttons
const navLinks: NavLink[] = [
  { id: 'home', label: 'Home' },
  { id: 'about', label: 'About' },
  { id: 'projects', label: 'Projects' },
  { id: 'skills', label: 'Skills' },
  { id: 'achievements', label: 'Achievements' },
]

// All links for mobile menu & scroll spy
const allLinks: NavLink[] = [
  ...navLinks,
  { id: 'resume', label: 'Resume', href: '/resume.pdf', isExternal: true },
  { id: 'contact', label: 'Contact' },
]

export function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [activeTab, setActiveTab] = useState('home')
  const [hoveredTab, setHoveredTab] = useState<string | null>(null)
  const [mobileOpen, setMobileOpen] = useState(false)
  const isClickingRef = useRef(false)
  const clickTimeoutRef = useRef<number | null>(null)

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 30)

      if (isClickingRef.current) return

      const sections = allLinks
        .filter((l) => !l.isExternal)
        .map((l) => document.getElementById(l.id))
      let current = 'home'
      for (const section of sections) {
        if (section && window.scrollY >= section.offsetTop - 220) {
          current = section.id
        }
      }
      setActiveTab(current)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    return () => {
      if (clickTimeoutRef.current) window.clearTimeout(clickTimeoutRef.current)
    }
  }, [])

  const handleNavClick = (id: string, e?: React.MouseEvent<HTMLAnchorElement>) => {
    if (e) e.preventDefault()
    setActiveTab(id)
    isClickingRef.current = true

    if (id === 'home') {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } else {
      const section = document.getElementById(id)
      if (section) {
        section.scrollIntoView({ behavior: 'smooth' })
      }
    }

    if (clickTimeoutRef.current) window.clearTimeout(clickTimeoutRef.current)
    clickTimeoutRef.current = window.setTimeout(() => {
      isClickingRef.current = false
    }, 1000)
  }

  useEffect(() => {
    if (!mobileOpen) return
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMobileOpen(false)
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [mobileOpen])

  return (
    <header className="fixed left-0 right-0 top-0 z-50 flex justify-center pointer-events-none pt-5 sm:pt-6 lg:pt-7 px-4 sm:px-6">
      {/* Unified Floating Navbar Dock */}
      <motion.div
        initial={false}
        animate={{
          maxWidth: scrolled ? '1060px' : '1380px',
          backgroundColor: scrolled ? 'rgba(8, 8, 12, 0.8)' : 'rgba(0, 0, 0, 0)',
          borderColor: scrolled ? 'rgba(255, 255, 255, 0.14)' : 'rgba(255, 255, 255, 0)',
          boxShadow: scrolled
            ? '0 20px 48px rgba(0, 0, 0, 0.8), inset 0 1px 0 rgba(255, 255, 255, 0.16), inset 0 -1px 0 rgba(0, 0, 0, 0.4)'
            : '0 0 0 rgba(0, 0, 0, 0)',
          backdropFilter: scrolled ? 'blur(24px) saturate(180%)' : 'blur(0px)',
          paddingTop: scrolled ? '10px' : '10px',
          paddingBottom: scrolled ? '10px' : '10px',
          paddingLeft: scrolled ? '18px' : '16px',
          paddingRight: scrolled ? '18px' : '16px',
        }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        className="pointer-events-auto w-full rounded-full flex items-center justify-between gap-4 border"
      >
        {/* BRAND / LOGO (LEFT) */}
        <div className="flex-1 flex items-center justify-start min-w-0">
          <a
            href="#home"
            onClick={(e) => handleNavClick('home', e)}
            className="flex items-center gap-3 sm:gap-3.5 focus:outline-none select-none shrink-0"
          >
            <img
              src={kvLogo}
              alt="Kishan Vadsola Logo"
              className="h-9 sm:h-10 w-auto object-contain select-none shrink-0"
              width={60}
              height={40}
            />
            <span className="font-heading font-bold text-[17px] sm:text-[18px] lg:text-[19px] tracking-tight text-white whitespace-nowrap">
              Kishan Vadsola
            </span>
          </a>
        </div>

        {/* 5 CENTER NAV BUTTONS - PROPER CENTER */}
        <nav
          onMouseLeave={() => setHoveredTab(null)}
          className="hidden md:flex items-center gap-2 lg:gap-3 xl:gap-3.5 shrink-0"
        >
          {navLinks.map((l) => {
            const isHovered = hoveredTab === l.id
            const isActive = activeTab === l.id
            return (
              <a
                key={l.id}
                href={`#${l.id}`}
                onMouseEnter={() => setHoveredTab(l.id)}
                onClick={(e) => handleNavClick(l.id, e)}
                className={`relative px-3 py-1.5 text-[14.5px] lg:text-[15px] font-sans font-medium transition-colors duration-200 rounded-full select-none whitespace-nowrap ${
                  isHovered || isActive
                    ? 'text-white font-semibold'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                {/* Subtle Moving Window on Hover */}
                <AnimatePresence>
                  {isHovered && (
                    <motion.div
                      layoutId="navSlidingWindow"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="absolute inset-0 rounded-full pointer-events-none bg-white/[0.08] border border-white/15 shadow-[0_0_12px_rgba(255,255,255,0.08)]"
                      transition={{
                        type: 'spring',
                        stiffness: 400,
                        damping: 30,
                        mass: 0.8,
                      }}
                    />
                  )}
                </AnimatePresence>
                <span className="relative z-10 flex items-center justify-center whitespace-nowrap">
                  {l.label}
                </span>
              </a>
            )
          })}
        </nav>

        {/* RIGHT ACTIONS - Resume Button + Let's Talk Button */}
        <div className="flex-1 flex items-center justify-end gap-2.5 sm:gap-3 min-w-0">
          <a
            href="/resume.pdf"
            download="Kishan_Vadsola_Resume.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline-flex items-center justify-center rounded-full font-sans font-medium px-3.5 py-1.5 text-[14px] lg:text-[14.5px] text-zinc-300 hover:text-white hover:bg-white/[0.08] transition-colors duration-200 select-none whitespace-nowrap"
          >
            Resume
          </a>

          <motion.a
            href="#contact"
            onClick={(e) => handleNavClick('contact', e)}
            whileHover={{ scale: 1.04, y: -1 }}
            whileTap={{ scale: 0.96, y: 0 }}
            className="relative group overflow-hidden rounded-full font-heading font-bold px-5 sm:px-6 py-2.5 sm:py-2.5 text-[13.5px] sm:text-[14px] lg:text-[14.5px] tracking-wider uppercase transition-all whitespace-nowrap shrink-0 focus:outline-none bg-white hover:bg-zinc-100 text-slate-950 shadow-[0_0_20px_rgba(255,255,255,0.35)]"
          >
            <span className="relative z-10 flex items-center justify-center whitespace-nowrap">
              LET'S TALK
            </span>
          </motion.a>

          {/* Mobile Menu Toggle Button */}
          <motion.button
            type="button"
            onClick={() => setMobileOpen((v) => !v)}
            whileHover={{ scale: 1.06 }}
            whileTap={{ scale: 0.94 }}
            className="md:hidden inline-flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-zinc-200 transition hover:bg-white/10 focus:outline-none shrink-0"
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileOpen}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d={mobileOpen ? 'M6 6l12 12M18 6L6 18' : 'M4 7h16M4 12h16M4 17h16'}
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </motion.button>
        </div>
      </motion.div>

      {/* MOBILE MENU DROPDOWN */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.96 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="pointer-events-auto absolute top-16 w-[92%] max-w-sm rounded-2xl border border-white/15 bg-black/90 p-4 shadow-2xl backdrop-blur-2xl md:hidden"
          >
            <nav className="flex flex-col gap-1">
              {allLinks.map((l) => {
                const isActive = activeTab === l.id
                return (
                  <a
                    key={l.id}
                    href={l.href || `#${l.id}`}
                    {...(l.isExternal
                      ? { download: 'Kishan_Vadsola_Resume.pdf', target: '_blank', rel: 'noopener noreferrer' }
                      : {})}
                    onClick={(e) => {
                      if (!l.isExternal) handleNavClick(l.id, e)
                      setMobileOpen(false)
                    }}
                    className={`rounded-xl px-4 py-2.5 text-[15px] font-medium transition flex items-center justify-between ${
                      isActive
                        ? 'bg-white/10 text-white font-semibold border border-white/15'
                        : 'text-zinc-200 hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    <span>{l.label}</span>
                  </a>
                )
              })}
              <div className="mt-2 flex flex-col gap-2 pt-2 border-t border-white/10">
                <a
                  href="#contact"
                  onClick={(e) => {
                    handleNavClick('contact', e)
                    setMobileOpen(false)
                  }}
                  className="rounded-xl bg-white hover:bg-zinc-100 text-slate-950 px-3 py-2.5 text-center text-sm font-bold uppercase tracking-wider transition shadow-[0_0_15px_rgba(255,255,255,0.4)]"
                >
                  Let's Talk
                </a>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
