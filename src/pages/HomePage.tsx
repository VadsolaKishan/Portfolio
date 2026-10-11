import { useState, useEffect, useLayoutEffect, useRef } from 'react'
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useSpring,
  useTransform,
  useReducedMotion,
  type Variants,
} from 'framer-motion'
import { BackgroundSky3D } from '../components/backgrounds/BackgroundSky3D'
import { PageTransition } from '../components/PageTransition'

const ROLES = [
  'FULL STACK DEVELOPER',
] as const

export function HomePage() {
  const [warpSpeed, setWarpSpeed] = useState(false)
  const [roleIndex, setRoleIndex] = useState(0)
  const cardRef = useRef<HTMLDivElement>(null)
  const sizerRef = useRef<HTMLDivElement>(null)
  const [roleWidths, setRoleWidths] = useState<number[]>([])
  const [paddingOffset, setPaddingOffset] = useState(116)
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
  const [isHovered, setIsHovered] = useState(false)
  const reducedMotion = useReducedMotion()

  // Accurately measure text widths (including subpixels & web font loading) so letters are never clipped
  useLayoutEffect(() => {
    const measure = () => {
      if (sizerRef.current) {
        const widths = Array.from(sizerRef.current.children).map((el) => {
          const rect = (el as HTMLElement).getBoundingClientRect()
          return Math.ceil(rect.width)
        })
        setRoleWidths(widths)
      }
      const width = window.innerWidth
      if (width < 640) setPaddingOffset(80)
      else if (width < 768) setPaddingOffset(96)
      else setPaddingOffset(116)
    }

    measure()

    // Ensure re-measurement once web fonts finish loading asynchronously
    if (typeof document !== 'undefined' && 'fonts' in document) {
      document.fonts.ready.then(() => {
        measure()
      })
    }

    window.addEventListener('resize', measure)
    return () => window.removeEventListener('resize', measure)
  }, [])

  // Switch roles smoothly if multiple roles exist
  useEffect(() => {
    if (ROLES.length <= 1) return
    const timer = setInterval(() => {
      setRoleIndex((prev) => (prev + 1) % ROLES.length)
    }, 3800)
    return () => clearInterval(timer)
  }, [])

  // Pointer-responsive subtle 3D tilt on the role card
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  const springConfig = { damping: 25, stiffness: 140 }
  const tiltX = useSpring(
    useTransform(mouseY, [-0.5, 0.5], [4, -4]),
    springConfig,
  )
  const tiltY = useSpring(
    useTransform(mouseX, [-0.5, 0.5], [-4, 4]),
    springConfig,
  )

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return
    const rect = cardRef.current.getBoundingClientRect()
    if (rect.width === 0 || rect.height === 0) return
    const relX = e.clientX - rect.left
    const relY = e.clientY - rect.top
    setMousePos({ x: relX, y: relY })
    if (reducedMotion) return
    const x = relX / rect.width - 0.5
    const y = relY / rect.height - 0.5
    mouseX.set(x)
    mouseY.set(y)
  }

  const handleMouseEnter = () => {
    setIsHovered(true)
  }

  const handleMouseLeave = () => {
    setIsHovered(false)
    mouseX.set(0)
    mouseY.set(0)
  }

  const handleEnterUniverse = () => {
    setWarpSpeed(true)
    setTimeout(() => {
      document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })
      setWarpSpeed(false)
    }, 900)
  }

  const customEase = [0.16, 1, 0.3, 1] as const
  const smoothEase = [0.25, 0.1, 0.25, 1] as const

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: reducedMotion ? 0 : 0.12,
        delayChildren: reducedMotion ? 0 : 0.1,
      },
    },
  }

  const itemVariants: Variants = {
    hidden: {
      opacity: 0,
      y: reducedMotion ? 0 : 20,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: reducedMotion ? 0.3 : 0.65,
        ease: customEase,
      },
    },
  }

  return (
    <PageTransition id="home">
      <BackgroundSky3D warpSpeed={warpSpeed} />

      {/* Invisible phantom measurement container: measures font width without affecting display */}
      <div
        ref={sizerRef}
        aria-hidden="true"
        className="absolute opacity-0 pointer-events-none -z-50 invisible flex flex-col items-start"
      >
        {ROLES.map((role, idx) => (
          <span
            key={idx}
            className="inline-block font-heading font-bold uppercase whitespace-nowrap tracking-[0.03em]"
            style={{
              fontSize: 'clamp(2rem, 3.8vw, 3.15rem)',
              lineHeight: 1.15,
            }}
          >
            {role}
          </span>
        ))}
      </div>

      {/* Hero Content Container: Positioned in the left-side bottom corner, elevated safely above scroll to explore */}
      <div className="relative z-10 flex flex-col justify-end min-h-[100svh] w-full px-6 sm:px-10 md:px-14 lg:px-16 pb-24 sm:pb-28 md:pb-32 lg:pb-36 pointer-events-none">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="flex flex-col items-start text-left pointer-events-auto self-start"
        >
          {/* 1. KICKER: HELLO, I AM A • (Pushed slightly right to align perfectly with the box left edge) */}
          <motion.div
            variants={itemVariants}
            className="flex items-center gap-2.5 mb-3 sm:mb-3.5 select-none pl-2 sm:pl-2.5"
          >
            <span className="font-sans font-bold text-xs sm:text-[13px] tracking-[0.22em] text-cyan-400 uppercase drop-shadow-[0_0_12px_rgba(0,217,255,0.4)]">
              HELLO, I AM A
            </span>
            <span
              className="inline-block w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_10px_#00D9FF] animate-pulse"
              aria-hidden="true"
            />
          </motion.div>

          {/* 2. MAIN ROLE CARD: Anchored on the left, animated width prevents corner distortion */}
          <motion.div
            variants={itemVariants}
            className="relative self-start"
            style={{ perspective: 1200 }}
          >
            {/* Ambient cyan underglow with reduced corners */}
            <div
              className="absolute -inset-1 rounded-xl sm:rounded-2xl bg-cyan-500/20 blur-xl opacity-75 pointer-events-none"
              aria-hidden="true"
            />

            {/* Dark Card Container: Animated width directly ensures corners never distort or warp */}
            <motion.div
              ref={cardRef}
              animate={{
                width:
                  roleWidths[roleIndex] !== undefined
                    ? roleWidths[roleIndex] + paddingOffset
                    : 'auto',
              }}
              transition={{
                width: {
                  duration: 0.82,
                  ease: smoothEase,
                },
              }}
              onMouseMove={handleMouseMove}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              style={{
                transformOrigin: 'left center',
                ...(reducedMotion
                  ? {}
                  : {
                    rotateX: tiltX,
                    rotateY: tiltY,
                    transformStyle: 'preserve-3d',
                  }),
              }}
              className="relative inline-flex items-center justify-center text-center self-start min-h-[108px] sm:min-h-[120px] md:min-h-[132px] px-8 sm:px-10 md:px-12 py-6 sm:py-7 md:py-8 border border-cyan-400/25 hover:border-cyan-400/45 rounded-xl sm:rounded-2xl bg-black/85 backdrop-blur-2xl shadow-[0_12px_44px_rgba(0,0,0,0.85),0_0_28px_rgba(0,217,255,0.08),inset_0_1px_1px_rgba(255,255,255,0.15)] transition-colors duration-300 select-none overflow-hidden origin-left"
            >
              {/* Dynamic specular light reflection following cursor */}
              <div
                className="absolute inset-0 pointer-events-none transition-opacity duration-300"
                style={{
                  background: `radial-gradient(350px circle at ${mousePos.x}px ${mousePos.y}px, rgba(0, 217, 255, 0.12), transparent 70%)`,
                  opacity: isHovered ? 1 : 0,
                }}
                aria-hidden="true"
              />

              {/* Shimmer light sweep on role transition */}
              <AnimatePresence mode="popLayout">
                <motion.div
                  key={`shine-${roleIndex}`}
                  initial={{ x: '-120%', opacity: 0 }}
                  animate={{ x: '180%', opacity: [0, 0.45, 0] }}
                  transition={{ duration: 1.0, delay: 0.15, ease: 'easeInOut' }}
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-400/15 to-transparent pointer-events-none -skew-x-12"
                  aria-hidden="true"
                />
              </AnimatePresence>

              <h1 className="m-0 p-0 text-center relative flex items-center justify-center overflow-visible w-full">
                <AnimatePresence mode="popLayout">
                  <motion.div
                    key={roleIndex}
                    initial={
                      reducedMotion
                        ? { opacity: 0 }
                        : {
                          opacity: 0,
                          y: 32,
                          rotateX: -65,
                          z: -20,
                        }
                    }
                    animate={{
                      opacity: 1,
                      y: 0,
                      rotateX: 0,
                      z: 0,
                    }}
                    exit={
                      reducedMotion
                        ? { opacity: 0 }
                        : {
                          opacity: 0,
                          y: -30,
                          rotateX: 65,
                          z: -20,
                          transition: { duration: 0.38, ease: smoothEase },
                        }
                    }
                    transition={{
                      duration: reducedMotion ? 0.3 : 0.78,
                      ease: smoothEase,
                    }}
                    style={{
                      transformStyle: 'preserve-3d',
                      transformOrigin: 'center center -25px',
                      backfaceVisibility: 'hidden',
                      WebkitFontSmoothing: 'antialiased',
                    }}
                    className="inline-flex items-center justify-center text-center font-heading font-bold text-white uppercase whitespace-nowrap select-none"
                  >
                    <span
                      className="text-white drop-shadow-[0_2px_16px_rgba(0,0,0,0.9)] tracking-[0.03em]"
                      style={{
                        fontSize: 'clamp(2rem, 3.8vw, 3.15rem)',
                        lineHeight: 1.15,
                      }}
                    >
                      {ROLES[roleIndex]}
                    </span>
                  </motion.div>
                </AnimatePresence>
              </h1>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* 3. BOTTOM CENTER: SCROLL TO EXPLORE */}
        <div className="absolute bottom-5 sm:bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 z-20 pointer-events-auto">
          <button
            type="button"
            onClick={handleEnterUniverse}
            className="group flex flex-col items-center gap-1.5 text-slate-400 hover:text-cyan-300 transition-colors cursor-pointer select-none focus:outline-none"
            aria-label="Scroll to explore"
          >
            <span className="text-[10px] sm:text-[11px] font-semibold tracking-[0.25em] uppercase text-cyan-400/80 group-hover:text-cyan-300 transition-colors">
              SCROLL TO EXPLORE
            </span>
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full border border-cyan-400/30 bg-black/60 backdrop-blur-md flex items-center justify-center text-cyan-300 shadow-[0_0_12px_rgba(34,211,238,0.2)] group-hover:border-cyan-400 group-hover:scale-110 group-hover:shadow-[0_0_22px_rgba(34,211,238,0.5)] transition-all">
              <svg
                className="w-3.5 h-3.5 animate-bounce"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2.5"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </div>
          </button>
        </div>
      </div>
    </PageTransition>
  )
}
