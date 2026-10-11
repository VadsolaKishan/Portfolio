import { Canvas, useFrame } from '@react-three/fiber'
import { Float } from '@react-three/drei'
import { motion, useReducedMotion, useInView } from 'framer-motion'
import { useRef, useMemo, useState, useCallback, useEffect } from 'react'
import * as THREE from 'three'
import { FiCpu, FiTerminal, FiActivity, FiCode } from 'react-icons/fi'
import { SiReact, SiPython, SiDjango, SiMysql, SiTensorflow, SiGit } from 'react-icons/si'

function mulberry32(seed: number) {
  let t = seed
  return () => {
    t += 0x6d2b79f5
    let r = Math.imul(t ^ (t >>> 15), 1 | t)
    r ^= r + Math.imul(r ^ (r >>> 7), 61 | r)
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296
  }
}

/* ─────────────────────────────────────────────
   3D GYROSCOPIC CORE & ORBITS
   ───────────────────────────────────────────── */
function HologramCore() {
  const outerRingRef = useRef<THREE.Mesh>(null!)
  const midRingRef = useRef<THREE.Mesh>(null!)
  const innerRingRef = useRef<THREE.Mesh>(null!)
  const icosahedronRef = useRef<THREE.Mesh>(null!)
  const coreRef = useRef<THREE.Mesh>(null!)

  useFrame((state, delta) => {
    const t = state.clock.getElapsedTime()

    if (outerRingRef.current) {
      outerRingRef.current.rotation.x = t * 0.35
      outerRingRef.current.rotation.y = t * 0.22
    }
    if (midRingRef.current) {
      midRingRef.current.rotation.y = -t * 0.45
      midRingRef.current.rotation.z = t * 0.28
    }
    if (innerRingRef.current) {
      innerRingRef.current.rotation.x = -t * 0.3
      innerRingRef.current.rotation.z = -t * 0.4
    }
    if (icosahedronRef.current) {
      icosahedronRef.current.rotation.x += delta * 0.25
      icosahedronRef.current.rotation.y += delta * 0.35
      const scale = 1 + Math.sin(t * 2) * 0.04
      icosahedronRef.current.scale.set(scale, scale, scale)
    }
    if (coreRef.current) {
      coreRef.current.rotation.y -= delta * 0.5
      const pulse = 0.95 + Math.sin(t * 3.5) * 0.08
      coreRef.current.scale.set(pulse, pulse, pulse)
    }
  })

  return (
    <group>
      {/* Central Solid Glow Sphere */}
      <mesh ref={coreRef}>
        <sphereGeometry args={[0.55, 32, 32]} />
        <meshStandardMaterial
          color="#00D9FF"
          emissive="#0088cc"
          emissiveIntensity={1.2}
          roughness={0.2}
          metalness={0.8}
        />
      </mesh>

      {/* Futuristic Wireframe Icosahedron */}
      <mesh ref={icosahedronRef}>
        <icosahedronGeometry args={[0.9, 1]} />
        <meshBasicMaterial
          color="#38bdf8"
          wireframe
          transparent
          opacity={0.45}
        />
      </mesh>

      {/* Innermost Tech Ring */}
      <mesh ref={innerRingRef}>
        <torusGeometry args={[1.2, 0.015, 16, 100]} />
        <meshStandardMaterial
          color="#a855f7"
          emissive="#7e22ce"
          emissiveIntensity={0.8}
          roughness={0.3}
          metalness={0.9}
        />
      </mesh>

      {/* Middle Gyro Ring */}
      <mesh ref={midRingRef}>
        <torusGeometry args={[1.45, 0.02, 16, 100]} />
        <meshStandardMaterial
          color="#06b6d4"
          emissive="#0284c7"
          emissiveIntensity={0.9}
          roughness={0.2}
          metalness={0.9}
        />
      </mesh>

      {/* Outer Gyro Ring */}
      <mesh ref={outerRingRef}>
        <torusGeometry args={[1.7, 0.022, 16, 100]} />
        <meshStandardMaterial
          color="#38bdf8"
          emissive="#0369a1"
          emissiveIntensity={0.6}
          roughness={0.3}
          metalness={0.8}
        />
      </mesh>
    </group>
  )
}

/* ─────────────────────────────────────────────
   ORBITAL SATELLITE TECH NODES
   ───────────────────────────────────────────── */
function OrbitalNodes() {
  const groupRef = useRef<THREE.Group>(null!)

  useFrame((state) => {
    if (!groupRef.current) return
    const t = state.clock.getElapsedTime()
    groupRef.current.rotation.y = t * 0.25
    groupRef.current.rotation.x = Math.sin(t * 0.2) * 0.18
  })

  const nodes = useMemo(() => {
    const rand = mulberry32(4042)
    return [0, 1, 2, 3, 4, 5].map((i) => {
      const angle = (i / 6) * Math.PI * 2
      const radius = 1.95 + rand() * 0.2
      return {
        pos: [
          Math.cos(angle) * radius,
          (rand() - 0.5) * 0.7,
          Math.sin(angle) * radius,
        ] as [number, number, number],
        color: i % 2 === 0 ? '#22d3ee' : '#c084fc',
      }
    })
  }, [])

  return (
    <group ref={groupRef}>
      {nodes.map((node, i) => (
        <mesh key={i} position={node.pos}>
          <octahedronGeometry args={[0.075, 0]} />
          <meshBasicMaterial color={node.color} wireframe={false} />
        </mesh>
      ))}
    </group>
  )
}

/* ─────────────────────────────────────────────
   AMBIENT CLOUD PARTICLES
   ───────────────────────────────────────────── */
function AmbientField() {
  const pointsRef = useRef<THREE.Points>(null!)

  const positions = useMemo(() => {
    const rand = mulberry32(98765)
    const count = 90
    const arr = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      const r = 1.2 + rand() * 1.6
      const theta = rand() * Math.PI * 2
      const phi = Math.acos(rand() * 2 - 1)
      arr[i * 3] = r * Math.sin(phi) * Math.cos(theta)
      arr[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta)
      arr[i * 3 + 2] = r * Math.cos(phi)
    }
    return arr
  }, [])

  useFrame((_, delta) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y += delta * 0.08
    }
  })

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.04}
        color="#38bdf8"
        transparent
        opacity={0.65}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  )
}

/* ─────────────────────────────────────────────
   MOUSE INTERACTIVE PARALLAX RIG
   ───────────────────────────────────────────── */
function SceneRig() {
  const rigRef = useRef<THREE.Group>(null!)
  const mouse = useRef({ x: 0, y: 0 })

  useEffect(() => {
    const handleMove = (e: MouseEvent) => {
      mouse.current.x = (e.clientX / window.innerWidth - 0.5) * 2
      mouse.current.y = -(e.clientY / window.innerHeight - 0.5) * 2
    }
    window.addEventListener('mousemove', handleMove, { passive: true })
    return () => window.removeEventListener('mousemove', handleMove)
  }, [])

  useFrame(() => {
    if (!rigRef.current) return
    const targetRotY = mouse.current.x * 0.35
    const targetRotX = -mouse.current.y * 0.25
    rigRef.current.rotation.y += (targetRotY - rigRef.current.rotation.y) * 0.06
    rigRef.current.rotation.x += (targetRotX - rigRef.current.rotation.x) * 0.06
  })

  return (
    <group ref={rigRef}>
      <Float speed={2.2} rotationIntensity={0.5} floatIntensity={0.7}>
        <ambientLight intensity={0.4} />
        <pointLight position={[5, 5, 5]} intensity={1.5} color="#38bdf8" />
        <pointLight position={[-5, -4, -3]} intensity={1.2} color="#c084fc" />
        <HologramCore />
        <OrbitalNodes />
        <AmbientField />
      </Float>
    </group>
  )
}

const floatingTech = [
  { name: 'React', Icon: SiReact, color: '#22d3ee', delay: 0 },
  { name: 'Python', Icon: SiPython, color: '#38bdf8', delay: 1.2 },
  { name: 'Django', Icon: SiDjango, color: '#34d399', delay: 2.4 },
  { name: 'MySQL', Icon: SiMysql, color: '#818cf8', delay: 3.6 },
  { name: 'AI / ML', Icon: SiTensorflow, color: '#c084fc', delay: 4.8 },
  { name: 'Git', Icon: SiGit, color: '#fb923c', delay: 6.0 },
]

/* ─────────────────────────────────────────────
   MAIN HERO VISUAL COMPONENT
   ───────────────────────────────────────────── */
export function HeroVisual3D() {
  const reducedMotion = useReducedMotion()
  const containerRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(containerRef, { margin: '100px' })
  const [hasError, setHasError] = useState(false)

  const handleError = useCallback(() => {
    setHasError(true)
  }, [])

  return (
    <div
      ref={containerRef}
      className="relative w-full aspect-square max-w-[420px] sm:max-w-[460px] lg:max-w-[500px] mx-auto flex items-center justify-center select-none"
    >
      {/* Glowing Ambient Radial Backdrop */}
      <div className="absolute inset-0 rounded-3xl bg-gradient-to-tr from-cyan-500/15 via-indigo-500/10 to-purple-500/15 blur-3xl pointer-events-none" />

      {/* Cybernetic Tech Frame & Corner Marks */}
      <div className="absolute inset-0 rounded-3xl border border-white/10 bg-slate-950/60 backdrop-blur-xl shadow-[0_20px_50px_rgba(0,0,0,0.6)] pointer-events-none overflow-hidden">
        {/* Subtle decorative grid overlay */}
        <div className="absolute inset-0 opacity-15 [background-image:radial-gradient(rgba(34,211,238,0.5)_1px,transparent_1px)] [background-size:24px_24px]" />

        {/* Top Header HUD Bar */}
        <div className="absolute top-0 left-0 right-0 h-9 px-4 flex items-center justify-between border-b border-white/5 bg-white/[0.02]">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-cyan-400 animate-ping" />
            <span className="text-[10px] font-mono tracking-widest text-cyan-300 uppercase font-semibold">
              CORE.SYS // V2.4
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-zinc-500 text-[10px] font-mono">
            <span className="text-emerald-400">99.9%</span>
            <span>ACTIVE</span>
          </div>
        </div>

        {/* Corner Accents */}
        <span className="absolute top-2 left-2 w-2.5 h-2.5 border-t border-l border-cyan-400/60" />
        <span className="absolute top-2 right-2 w-2.5 h-2.5 border-t border-r border-cyan-400/60" />
        <span className="absolute bottom-2 left-2 w-2.5 h-2.5 border-b border-l border-cyan-400/60" />
        <span className="absolute bottom-2 right-2 w-2.5 h-2.5 border-b border-r border-cyan-400/60" />
      </div>

      {/* 3D Canvas or Fallback */}
      <div className="relative w-full h-full pt-8 pb-3 px-3 flex items-center justify-center">
        {!reducedMotion && !hasError ? (
          <Canvas
            camera={{ position: [0, 0, 4.3], fov: 48 }}
            frameloop={isInView ? 'always' : 'demand'}
            dpr={[1, 1.5]}
            gl={{ alpha: true, antialias: true, powerPreference: 'high-performance' }}
            onError={handleError}
            className="w-full h-full cursor-grab active:cursor-grabbing"
          >
            <SceneRig />
          </Canvas>
        ) : (
          /* Graceful 2D/CSS holographic fallback */
          <div className="flex flex-col items-center justify-center gap-4 text-center p-6">
            <div className="relative flex items-center justify-center w-36 h-36 rounded-full border border-cyan-400/40 bg-cyan-950/30 shadow-[0_0_35px_rgba(0,217,255,0.3)]">
              <span className="absolute inset-0 rounded-full border border-purple-500/30 animate-spin" />
              <FiCpu className="w-14 h-14 text-cyan-300 animate-pulse" />
            </div>
            <p className="text-xs font-mono text-cyan-200/80">KISHAN VADSOLA // ARCHITECT</p>
          </div>
        )}
      </div>

      {/* Floating Glassmorphic Badges */}
      {/* Top Left: Stack Chip */}
      <motion.div
        animate={{ y: [0, -6, 0] }}
        transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute -top-3 -left-3 sm:-left-5 flex items-center gap-2 px-3 py-1.5 rounded-xl border border-white/10 bg-black/85 backdrop-blur-md shadow-[0_4px_20px_rgba(0,0,0,0.5)] z-20"
      >
        <div className="p-1 rounded-md bg-cyan-500/10 text-cyan-400">
          <FiCode className="w-3.5 h-3.5" />
        </div>
        <div className="text-left">
          <div className="text-[9px] text-zinc-400 font-mono">PRIMARY STACK</div>
          <div className="text-[11px] font-bold text-white tracking-wide">React • Django • AI</div>
        </div>
      </motion.div>

      {/* Bottom Right: Problem Solver Chip */}
      <motion.div
        animate={{ y: [0, 6, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
        className="absolute -bottom-3 -right-3 sm:-right-5 flex items-center gap-2 px-3.5 py-2 rounded-xl border border-cyan-500/30 bg-slate-950/90 backdrop-blur-md shadow-[0_0_25px_rgba(0,217,255,0.2)] z-20"
      >
        <div className="p-1.5 rounded-lg bg-cyan-400/20 text-cyan-300">
          <FiActivity className="w-3.5 h-3.5" />
        </div>
        <div className="text-left">
          <div className="text-[9px] text-cyan-300/80 font-mono uppercase">Problem Solving</div>
          <div className="text-xs font-black text-cyan-100">500+ LeetCode Solved</div>
        </div>
      </motion.div>

      {/* Bottom Left: Status Tag */}
      <motion.div
        animate={{ x: [0, -4, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
        className="hidden sm:flex absolute bottom-8 -left-5 items-center gap-2 px-2.5 py-1 rounded-lg border border-white/10 bg-black/80 backdrop-blur-md z-20"
      >
        <FiTerminal className="w-3 h-3 text-purple-400" />
        <span className="text-[10px] font-mono text-zinc-300">Full Stack System</span>
      </motion.div>

      {/* Floating Orbital Tech Badges */}
      <div className="absolute inset-0 pointer-events-none z-10 hidden sm:block">
        {floatingTech.map((tech, idx) => {
          // Positions arranged around the sphere perimeter
          const positions = [
            'top-14 -right-4', // React
            'bottom-24 -right-5', // Python
            '-bottom-2 left-16', // Django
            'top-28 -left-6', // MySQL
            'top-6 right-20', // AI/ML
            '-bottom-1 right-28', // Git
          ]
          return (
            <motion.div
              key={tech.name}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{
                opacity: 1,
                scale: 1,
                y: [0, idx % 2 === 0 ? -5 : 5, 0],
              }}
              transition={{
                y: {
                  duration: 3.5 + (idx % 3),
                  repeat: Infinity,
                  ease: 'easeInOut',
                  delay: tech.delay,
                },
                opacity: { duration: 0.6 },
              }}
              className={`absolute ${positions[idx]} flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-white/10 bg-slate-950/80 backdrop-blur-md text-[11px] font-mono font-medium shadow-lg`}
              style={{ color: tech.color }}
            >
              <tech.Icon className="w-3 h-3" />
              <span className="text-zinc-200">{tech.name}</span>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}
