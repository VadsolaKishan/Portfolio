import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { useState } from 'react'

interface AiBrandLogoProps {
  size?: number
  isHovered?: boolean
  interactive?: boolean
  className?: string
}

export function AiBrandLogo({
  size = 48,
  isHovered = false,
  interactive = true,
  className = '',
}: AiBrandLogoProps) {
  const [internalHover, setInternalHover] = useState(false)
  const activeHover = isHovered || internalHover

  // 3D gyroscope tracking with buttery smooth spring physics
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  const springConfig = { damping: 22, stiffness: 220 }
  const tiltX = useSpring(useTransform(mouseY, [-0.5, 0.5], [16, -16]), springConfig)
  const tiltY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-16, 16]), springConfig)

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!interactive) return
    const rect = e.currentTarget.getBoundingClientRect()
    if (!rect.width || !rect.height) return
    const x = (e.clientX - rect.left) / rect.width - 0.5
    const y = (e.clientY - rect.top) / rect.height - 0.5
    mouseX.set(x)
    mouseY.set(y)
  }

  const handleMouseLeave = () => {
    setInternalHover(false)
    mouseX.set(0)
    mouseY.set(0)
  }

  return (
    <div
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setInternalHover(true)}
      onMouseLeave={handleMouseLeave}
      className={`relative inline-flex items-center justify-center select-none ${className}`}
      style={{
        width: size,
        height: size,
        perspective: 900,
        transformStyle: 'preserve-3d',
      }}
    >
      {/* 3D Rotating & Levitation Master Rig */}
      <motion.div
        animate={{
          y: activeHover ? [-3.5, 3.5, -3.5] : [-2, 2, -2],
          rotateY: activeHover ? [0, 360] : [-12, 12, -12],
          rotateX: activeHover ? 0 : [6, -6, 6],
        }}
        transition={
          activeHover
            ? {
                rotateY: { duration: 1.3, ease: 'easeOut' },
                y: { duration: 2.2, repeat: Infinity, ease: 'easeInOut' },
              }
            : {
                rotateY: { duration: 4.8, repeat: Infinity, ease: 'easeInOut' },
                rotateX: { duration: 3.8, repeat: Infinity, ease: 'easeInOut' },
                y: { duration: 3.2, repeat: Infinity, ease: 'easeInOut' },
              }
        }
        style={{
          width: '100%',
          height: '100%',
          transformStyle: 'preserve-3d',
          ...(interactive && !activeHover
            ? {
                rotateX: tiltX,
                rotateY: tiltY,
              }
            : {}),
        }}
        className="relative flex items-center justify-center"
      >
        {/* Layer 1: Base 3D Isometric Chatbot Hexagon (Z: 0px) */}
        <svg
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full overflow-visible drop-shadow-[0_8px_18px_rgba(0,0,0,0.9)]"
        >
          <defs>
            {/* Top Chrome Facet: polished platinum gradient */}
            <linearGradient id="top-chrome" x1="15%" y1="0%" x2="85%" y2="100%">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="35%" stopColor="#F1F5F9" />
              <stop offset="70%" stopColor="#CBD5E1" />
              <stop offset="100%" stopColor="#64748B" />
            </linearGradient>

            {/* Right Electric Cyan Facet */}
            <linearGradient id="right-cyan" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#67E8F9" />
              <stop offset="30%" stopColor="#00F0FF" />
              <stop offset="70%" stopColor="#0284C7" />
              <stop offset="100%" stopColor="#0B1E40" />
            </linearGradient>

            {/* Left Obsidian & Tail Facet */}
            <linearGradient id="left-obsidian" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#334155" />
              <stop offset="45%" stopColor="#1E293B" />
              <stop offset="100%" stopColor="#020617" />
            </linearGradient>

            {/* Inner Dark Cavity */}
            <linearGradient id="inner-dark" x1="50%" y1="0%" x2="50%" y2="100%">
              <stop offset="0%" stopColor="#0F172A" />
              <stop offset="100%" stopColor="#030712" />
            </linearGradient>

            {/* Cyan Neon Edge Highlight */}
            <linearGradient id="neon-stroke" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="30%" stopColor="#00F0FF" />
              <stop offset="75%" stopColor="#0284C7" />
              <stop offset="100%" stopColor="#38BDF8" />
            </linearGradient>

            {/* Star Facet NW */}
            <linearGradient id="star-nw" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="55%" stopColor="#A5F3FC" />
              <stop offset="100%" stopColor="#00F0FF" />
            </linearGradient>

            {/* Star Facet NE */}
            <linearGradient id="star-ne" x1="100%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#E0F2FE" />
              <stop offset="55%" stopColor="#38BDF8" />
              <stop offset="100%" stopColor="#0284C7" />
            </linearGradient>

            {/* Star Facet SW */}
            <linearGradient id="star-sw" x1="0%" y1="100%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#00F0FF" />
              <stop offset="55%" stopColor="#0284C7" />
              <stop offset="100%" stopColor="#0369A1" />
            </linearGradient>

            {/* Star Facet SE */}
            <linearGradient id="star-se" x1="100%" y1="100%" x2="0%" y2="0%">
              <stop offset="0%" stopColor="#38BDF8" />
              <stop offset="55%" stopColor="#0284C7" />
              <stop offset="100%" stopColor="#1E3A8A" />
            </linearGradient>
          </defs>

          {/* 1. Left 3D Face & Conversation Tail */}
          <path
            d="M 22 28 L 50 12 L 50 48 L 22 64 Z"
            fill="url(#left-obsidian)"
            stroke="#1E293B"
            strokeWidth="0.8"
          />
          {/* Dialogue Tail Pointer */}
          <path
            d="M 22 64 L 50 48 L 50 78 L 38 72 L 20 89 L 22 64 Z"
            fill="url(#left-obsidian)"
            stroke="url(#neon-stroke)"
            strokeWidth="1.3"
            strokeLinejoin="round"
          />

          {/* 2. Right 3D Face */}
          <path
            d="M 50 12 L 78 28 L 78 64 L 50 78 L 50 48 Z"
            fill="url(#right-cyan)"
            stroke="url(#neon-stroke)"
            strokeWidth="1.3"
            strokeLinejoin="round"
          />

          {/* 3. Top Chrome Beveled Cap */}
          <path
            d="M 50 12 L 78 28 L 50 44 L 22 28 Z"
            fill="url(#top-chrome)"
            stroke="#FFFFFF"
            strokeWidth="1.2"
            strokeLinejoin="round"
          />

          {/* 4. Recessed Inner Display Cavity */}
          <path
            d="M 50 22 L 70 34 L 70 60 L 50 71 L 30 60 L 30 34 Z"
            fill="url(#inner-dark)"
            stroke="url(#neon-stroke)"
            strokeWidth="1.3"
          />

          {/* 5. Precise Neon Circuit Accent Beams */}
          <line x1="50" y1="12" x2="50" y2="22" stroke="#00F0FF" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="78" y1="28" x2="70" y2="34" stroke="#00F0FF" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="22" y1="28" x2="30" y2="34" stroke="#00F0FF" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="78" y1="64" x2="70" y2="60" stroke="#00F0FF" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="50" y1="78" x2="50" y2="71" stroke="#00F0FF" strokeWidth="1.5" strokeLinecap="round" />
        </svg>

        {/* Layer 2: Embossed 3D AI Spark Star (Floating forward on Z: 16px) */}
        <motion.div
          animate={{
            scale: activeHover ? [1, 1.1, 1] : [0.98, 1.04, 0.98],
          }}
          transition={{
            duration: 2.4,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="absolute inset-0 flex items-center justify-center pointer-events-none"
          style={{ transform: 'translateZ(16px)' }}
        >
          <svg
            viewBox="0 0 100 100"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-[62%] h-[62%] overflow-visible filter drop-shadow-[0_2px_10px_rgba(0,240,255,0.75)]"
          >
            {/* 4-Pointed Curved AI Diamond Star */}
            {/* North-West Quadrant */}
            <path
              d="M 50 15 Q 49 42 21 47 Q 44 49 50 50 Q 50 44 50 15 Z"
              fill="url(#star-nw)"
              stroke="#FFFFFF"
              strokeWidth="0.75"
            />

            {/* North-East Quadrant */}
            <path
              d="M 50 15 Q 51 42 79 47 Q 56 49 50 50 Q 50 44 50 15 Z"
              fill="url(#star-ne)"
              stroke="#38BDF8"
              strokeWidth="0.75"
            />

            {/* South-West Quadrant */}
            <path
              d="M 50 85 Q 49 58 21 47 Q 44 51 50 50 Q 50 56 50 85 Z"
              fill="url(#star-sw)"
              stroke="#00F0FF"
              strokeWidth="0.75"
            />

            {/* South-East Quadrant */}
            <path
              d="M 50 85 Q 51 58 79 47 Q 56 51 50 50 Q 50 56 50 85 Z"
              fill="url(#star-se)"
              stroke="#0284C7"
              strokeWidth="0.75"
            />

            {/* Central Precision Diamond Highlight */}
            <polygon
              points="50,43 55,50 50,57 45,50"
              fill="#FFFFFF"
              stroke="#A5F3FC"
              strokeWidth="0.6"
            />

            {/* Corner Specular Spark Points */}
            <circle cx="50" cy="15" r="1.6" fill="#FFFFFF" />
            <circle cx="79" cy="47" r="1.6" fill="#38BDF8" />
            <circle cx="50" cy="85" r="1.6" fill="#00F0FF" />
            <circle cx="21" cy="47" r="1.6" fill="#A5F3FC" />
          </svg>
        </motion.div>
      </motion.div>
    </div>
  )
}
