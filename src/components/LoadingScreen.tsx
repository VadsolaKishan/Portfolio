import { motion } from 'framer-motion'
import { useEffect } from 'react'

type Props = {
  onDone: () => void
}

const particlesArray = [...Array(30)].map(() => ({
  width: Math.random() * 2 + 1 + 'px',
  height: Math.random() * 2 + 1 + 'px',
  top: Math.random() * 100 + '%',
  left: Math.random() * 100 + '%',
  duration: Math.random() * 4 + 3,
  delay: Math.random() * 2,
}))

const orbitParticlesArray = [...Array(15)].map(() => ({
  angle: Math.random() * 360,
  radius: Math.random() * 50 + 110,
  size: Math.random() * 2 + 1 + 'px',
}))

const dataFragmentsArray = [...Array(12)].map(() => ({
  top: Math.random() * 100 + '%',
  left: Math.random() * 100 + '%',
  delay: Math.random() * 2,
  duration: Math.random() * 3 + 2,
  text: ['01', '10', '++', '//', '<>', '{}'][Math.floor(Math.random() * 6)]
}))

export function LoadingScreen({ onDone }: Props) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onDone()
    }, 2400)

    const handleKey = () => onDone()
    window.addEventListener('keydown', handleKey)
    return () => {
      clearTimeout(timer)
      window.removeEventListener('keydown', handleKey)
    }
  }, [onDone])

  const particles = particlesArray;
  const orbitParticles = orbitParticlesArray;
  const dataFragments = dataFragmentsArray;

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#000000] overflow-hidden cursor-pointer"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
      role="dialog"
      aria-modal="true"
      aria-label="Quantum Access Engaged"
    >
      {/* Faint Grid Distortion */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 opacity-[0.03] [background-image:linear-gradient(to_right,#f8fafc_1px,transparent_1px),linear-gradient(to_bottom,#f8fafc_1px,transparent_1px)] [background-size:64px_64px]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#000000_80%)]" />
      </div>

      {/* Deep Glow Accents */}
      <div className="absolute inset-0 z-0 flex items-center justify-center pointer-events-none">
        <div className="absolute w-[800px] h-[800px] bg-[#00f5ff]/5 blur-[150px] rounded-full" />
        <div className="absolute w-[600px] h-[600px] bg-[#6d28d9]/10 blur-[120px] rounded-full" />
      </div>

      {/* Background Particles & Data Fragments */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        {particles.map((p, i) => (
          <motion.div
            key={`p-${i}`}
            className="absolute rounded-full bg-white/20"
            style={{
              width: p.width,
              height: p.height,
              top: p.top,
              left: p.left,
            }}
            animate={{
              y: [0, -40, 0],
              opacity: [0, 0.4, 0],
              scale: [0.8, 1.2, 0.8],
            }}
            transition={{
              duration: p.duration,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: p.delay,
            }}
          />
        ))}
        {dataFragments.map((d, i) => (
          <motion.div
            key={`d-${i}`}
            className="absolute text-[#00f5ff]/20 text-xs font-mono"
            style={{ top: d.top, left: d.left }}
            animate={{
              opacity: [0, 0.6, 0],
              y: [0, -20, 0],
            }}
            transition={{
              duration: d.duration,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: d.delay,
            }}
          >
            {d.text}
          </motion.div>
        ))}
      </div>

      {/* Central Glassmorphism Container */}
      <div className="relative z-10 flex flex-col items-center justify-center">
        <div className="relative flex items-center justify-center w-[340px] h-[340px] mb-12">

          {/* Outer Soft Pulse */}
          <motion.div
            className="absolute inset-0 rounded-full bg-[#00f5ff]/5"
            animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0, 0.3] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          />

          {/* Quantum Core Rings */}
          {/* Ring 1 (Outer) - Violet */}
          <motion.div
            className="absolute inset-4 rounded-full border border-[#6d28d9]/30 border-dashed"
            animate={{ rotate: 360 }}
            transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
          />

          {/* Ring 2 - Cyan Solid Thin */}
          <motion.div
            className="absolute inset-8 rounded-full border-[0.5px] border-[#00f5ff]/30"
            animate={{ rotate: -360 }}
            transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
          >
            {/* Orbiting Gold Accent */}
            <div className="absolute -top-1 left-1/2 w-2 h-2 -translate-x-1/2 bg-[#facc15] rounded-full shadow-[0_0_12px_#facc15]" />
          </motion.div>

          {/* Ring 3 - Violet Dotted */}
          <motion.div
            className="absolute inset-[60px] rounded-full border-[2px] border-[#6d28d9]/20 group"
            style={{ borderStyle: 'dotted' }}
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
          />

          {/* Ring 4 - Inner Cyan */}
          <motion.div
            className="absolute inset-[84px] rounded-full border-[0.5px] border-[#00f5ff]/50"
            animate={{ rotate: -360 }}
            transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
            style={{ boxShadow: '0 0 20px rgba(0, 245, 255, 0.15) inset' }}
          >
            <div className="absolute bottom-0 left-1/2 w-1.5 h-1.5 -translate-x-1/2 translate-y-1/2 bg-[#00f5ff] rounded-full shadow-[0_0_10px_#00f5ff]" />
          </motion.div>

          {/* Central Vault (Glassmorphism) */}
          <motion.div
            className="absolute inset-[100px] rounded-full bg-black/60 backdrop-blur-xl border border-white/5 flex items-center justify-center overflow-hidden"
            style={{ boxShadow: '0 0 40px rgba(109, 40, 217, 0.4)' }}
          >
            {/* Inner Glow */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-br from-[#6d28d9]/20 via-transparent to-[#00f5ff]/20"
              animate={{ opacity: [0.5, 0.9, 0.5] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            />

            {/* Pulsing Core */}
            <motion.div
              className="w-10 h-10 rounded-full bg-[#00f5ff] shadow-[0_0_25px_#00f5ff,0_0_50px_#00f5ff]"
              animate={{ scale: [0.8, 1.2, 0.8], opacity: [0.8, 1, 0.8] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            />

            {/* Razor Sharp Scanning Beam */}
            <motion.div
              className="absolute left-0 right-0 h-full w-full flex flex-col justify-end"
              initial={{ y: '-100%' }}
              animate={{ y: '100%' }}
              transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
            >
              <div className="h-[150%] w-full bg-gradient-to-b from-transparent via-[#00f5ff]/10 to-transparent" />
              <div className="h-[2px] w-full bg-[#00f5ff] shadow-[0_0_12px_#00f5ff]" />
            </motion.div>
          </motion.div>

          {/* Orbiting Micro Light Particles */}
          <motion.div
            className="absolute inset-0"
            animate={{ rotate: 360 }}
            transition={{ duration: 40, repeat: Infinity, ease: 'linear' }}
          >
            {orbitParticles.map((p, i) => (
              <div
                key={`o-${i}`}
                className="absolute top-1/2 left-1/2 rounded-full bg-[#00f5ff] shadow-[0_0_8px_#00f5ff]"
                style={{
                  width: p.size,
                  height: p.size,
                  marginTop: `-${parseFloat(p.size) / 2}px`,
                  marginLeft: `-${parseFloat(p.size) / 2}px`,
                  transform: `rotate(${p.angle}deg) translateX(${p.radius}px)`,
                }}
              />
            ))}
          </motion.div>
        </div>

        {/* Typography */}
        <motion.div
          className="flex flex-col items-center z-20"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5, ease: 'easeOut' }}
        >
          <div className="text-center font-sans">
            <h2 className="text-[#f8fafc] text-xl sm:text-2xl font-light tracking-[0.25em] uppercase drop-shadow-[0_0_10px_rgba(248,250,252,0.3)]">
              Quantum Access Engaged
            </h2>
            <div className="text-xs sm:text-sm tracking-[0.2em] text-[#6d28d9] flex justify-center items-center mt-4 opacity-80 uppercase font-medium">
              Authenticating Neural Signature
              <motion.span
                animate={{ opacity: [0, 1, 0] }}
                transition={{ duration: 1.5, repeat: Infinity, times: [0, 0.5, 1] }}
                className="ml-1 text-[#00f5ff]"
              >
                ...
              </motion.span>
            </div>
            <p className="mt-3 text-[11px] font-mono tracking-widest text-zinc-500 uppercase">
              Click anywhere to bypass
            </p>
          </div>
        </motion.div>
      </div>
    </motion.div>
  )
}
