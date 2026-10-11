import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Points, PointMaterial } from '@react-three/drei'
import { useReducedMotion, useInView } from 'framer-motion'
import * as THREE from 'three'
import { useState, useRef, useEffect, useMemo, useCallback } from 'react'

/* ─────────────────────────────────────────────
   STAR LAYER — reusable across foreground / mid / back
   ───────────────────────────────────────────── */
function mulberry32(seed: number) {
  let t = seed
  return () => {
    t += 0x6d2b79f5
    let r = Math.imul(t ^ (t >>> 15), 1 | t)
    r ^= r + Math.imul(r ^ (r >>> 7), 61 | r)
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296
  }
}

function StarLayer({
  count,
  size,
  spread,
  speed,
  opacity,
  color = '#ffffff',
}: {
  count: number
  size: number
  spread: number
  speed: number
  opacity: number
  color?: string
}) {
  const ref = useRef<THREE.Points>(null!)
  const positions = useMemo(() => {
    const rand = mulberry32(count * 1000 + Math.round(spread * 100))
    const arr = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      arr[i * 3] = (rand() - 0.5) * spread
      arr[i * 3 + 1] = (rand() - 0.5) * spread
      arr[i * 3 + 2] = (rand() - 0.5) * spread
    }
    return arr
  }, [count, spread])

  useFrame((_s, delta) => {
    if (!ref.current) return
    const safeDelta = Math.min(delta, 0.05)
    ref.current.rotation.x -= safeDelta * speed * 0.3
    ref.current.rotation.y -= safeDelta * speed * 0.2
  })

  return (
    <Points ref={ref} positions={positions} stride={3} frustumCulled={false}>
      <PointMaterial
        transparent
        color={color}
        size={size}
        sizeAttenuation
        depthWrite={false}
        opacity={opacity}
      />
    </Points>
  )
}

/* ─────────────────────────────────────────────
   MOUSE PARALLAX — responds to pointer
   ───────────────────────────────────────────── */
function MouseParallax({ children }: { children: React.ReactNode }) {
  const groupRef = useRef<THREE.Group>(null!)
  const mouse = useRef({ x: 0, y: 0 })
  const { size } = useThree()

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      mouse.current.x = (e.clientX / size.width - 0.5) * 2
      mouse.current.y = -(e.clientY / size.height - 0.5) * 2
    }
    window.addEventListener('pointermove', onMove, { passive: true })
    return () => window.removeEventListener('pointermove', onMove)
  }, [size])

  useFrame(() => {
    if (!groupRef.current) return
    groupRef.current.rotation.y += (mouse.current.x * 0.02 - groupRef.current.rotation.y) * 0.05
    groupRef.current.rotation.x += (mouse.current.y * 0.02 - groupRef.current.rotation.x) * 0.05
  })

  return <group ref={groupRef}>{children}</group>
}

/* ─────────────────────────────────────────────
   SCENE — combines layers
   ───────────────────────────────────────────── */
function SpaceScene() {
  return (
    <MouseParallax>
      {/* Background — tiny far-away stars */}
      <StarLayer count={600} size={0.015} spread={30} speed={0.02} opacity={0.4} />
      {/* Midground — medium stars */}
      <StarLayer count={250} size={0.03} spread={20} speed={0.04} opacity={0.6} />
      {/* Foreground — bright close stars */}
      <StarLayer count={90} size={0.045} spread={14} speed={0.06} opacity={0.8} />
      {/* Subtle cyan accent particles */}
      <StarLayer count={30} size={0.035} spread={18} speed={0.03} opacity={0.35} color="#00D9FF" />
    </MouseParallax>
  )
}

/* ─────────────────────────────────────────────
   EXPORTED BACKGROUND
   ───────────────────────────────────────────── */
export function SpaceBackground() {
  const reducedMotion = useReducedMotion()
  const containerRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(containerRef, { margin: '200px' })
  const [webglFailed, setWebglFailed] = useState(false)

  const handleCreated = useCallback(() => {
    // WebGL context created successfully
  }, [])

  const handleError = useCallback(() => {
    setWebglFailed(true)
  }, [])

  if (reducedMotion || webglFailed) {
    return (
      <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
        <div
          className="absolute inset-0"
          style={{
            background: 'radial-gradient(ellipse at 50% 20%, rgba(0,30,60,0.3) 0%, #020204 70%)',
          }}
        />
      </div>
    )
  }

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 -z-10 overflow-hidden pointer-events-none"
    >
      {/* Galaxy gradient overlay */}
      <div
        className="absolute inset-0 z-10 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse at 30% 20%, rgba(0,40,80,0.15) 0%, transparent 50%), ' +
            'radial-gradient(ellipse at 70% 80%, rgba(0,20,60,0.1) 0%, transparent 50%)',
        }}
      />
      <div className="sticky top-0 h-screen w-full">
        <Canvas
          camera={{ position: [0, 0, 1], fov: 60 }}
          frameloop={isInView ? 'always' : 'demand'}
          dpr={[1, 1.5]}
          gl={{ antialias: false, alpha: true, powerPreference: 'high-performance' }}
          onCreated={handleCreated}
          onError={handleError}
        >
          <SpaceScene />
        </Canvas>
      </div>
    </div>
  )
}
