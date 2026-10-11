import { Canvas, useFrame } from '@react-three/fiber'
import { useInView } from 'framer-motion'
import { Points, PointMaterial } from '@react-three/drei'
import * as THREE from 'three'
import { useRef, useMemo, useEffect } from 'react'

const STAR_COUNT = 1200
const Z_NEAR = 1.4
const Z_FAR = -25.0
const DEPTH = Z_NEAR - Z_FAR
const SPREAD = 24.0

function mulberry32(seed: number) {
  let s = seed
  return () => {
    s += 0x6d2b79f5
    let t = Math.imul(s ^ (s >>> 15), 1 | s)
    t ^= t + Math.imul(t ^ (t >>> 7), 61 | t)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

function Sky({ warpSpeed = false }: { warpSpeed?: boolean }) {
  const pointsRef = useRef<THREE.Points>(null!)
  const groupRef = useRef<THREE.Group>(null!)
  const speedRef = useRef(0.65)
  const mouseRef = useRef({ x: 0, y: 0 })

  // Initialize star positions uniformly distributed across the depth volume
  const positions = useMemo(() => {
    const rng = mulberry32(42)
    const arr = new Float32Array(STAR_COUNT * 3)
    for (let i = 0; i < STAR_COUNT; i++) {
      arr[i * 3] = (rng() - 0.5) * SPREAD
      arr[i * 3 + 1] = (rng() - 0.5) * SPREAD
      arr[i * 3 + 2] = Z_FAR + rng() * DEPTH
    }
    return arr
  }, [])

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      mouseRef.current.x = (e.clientX / window.innerWidth - 0.5) * 0.15
      mouseRef.current.y = (e.clientY / window.innerHeight - 0.5) * 0.15
    }
    window.addEventListener('mousemove', onMove, { passive: true })
    return () => window.removeEventListener('mousemove', onMove)
  }, [])

  useFrame((_state, delta) => {
    const posAttr = pointsRef.current?.geometry?.attributes?.position
    if (!posAttr) return

    // Clamp delta to protect against tab suspension or frame drops
    const safeDelta = Math.min(delta, 0.05)

    // Smooth speed interpolation for normal flight vs warp speed
    const targetSpeed = warpSpeed ? 32 : 0.65
    speedRef.current = THREE.MathUtils.lerp(speedRef.current, targetSpeed, safeDelta * 4)

    const step = speedRef.current * safeDelta
    const arr = posAttr.array as Float32Array

    // Seamless continuous flight: wrap each star individually when it passes camera
    for (let i = 0; i < STAR_COUNT; i++) {
      const zIdx = i * 3 + 2
      arr[zIdx] += step

      if (arr[zIdx] > Z_NEAR) {
        arr[zIdx] -= DEPTH
        arr[i * 3] = (Math.random() - 0.5) * SPREAD
        arr[i * 3 + 1] = (Math.random() - 0.5) * SPREAD
      }
    }
    posAttr.needsUpdate = true

    // Continuous smooth roll & subtle mouse parallax (never jumps, never stops)
    if (groupRef.current) {
      groupRef.current.rotation.z += safeDelta * 0.02
      groupRef.current.rotation.x = THREE.MathUtils.lerp(
        groupRef.current.rotation.x,
        mouseRef.current.y,
        0.04
      )
      groupRef.current.rotation.y = THREE.MathUtils.lerp(
        groupRef.current.rotation.y,
        mouseRef.current.x,
        0.04
      )
    }
  })

  return (
    <group ref={groupRef} rotation={[0, 0, Math.PI / 4]}>
      <Points ref={pointsRef} positions={positions} stride={3} frustumCulled={false}>
        <PointMaterial
          transparent
          color="#ffffff"
          size={0.032}
          sizeAttenuation={true}
          depthWrite={false}
          opacity={0.88}
        />
      </Points>
    </group>
  )
}

export function BackgroundSky3D({ warpSpeed = false }: { warpSpeed?: boolean }) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { margin: "500px" })

  return (
    <div ref={ref} className="absolute inset-0 -z-10 bg-black overflow-hidden pointer-events-none">
      <div className="sticky top-0 h-screen w-full">
        <Canvas
          camera={{ position: [0, 0, 1], fov: 75 }}
          frameloop={isInView ? "always" : "demand"}
          dpr={[1, 1.5]}
          gl={{ antialias: false, powerPreference: 'high-performance' }}
        >
          <Sky warpSpeed={warpSpeed} />
        </Canvas>
      </div>
    </div>
  )
}

