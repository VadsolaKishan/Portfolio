import { Canvas, useFrame } from '@react-three/fiber'
import { useRef } from 'react'
import { useInView } from 'framer-motion'
import * as THREE from 'three'

function OrbitScene() {
    const coreRef = useRef<THREE.Mesh>(null!)
    const ringsRef = useRef<THREE.Group>(null!)

    useFrame((_, delta) => {
        if (coreRef.current) {
            coreRef.current.rotation.y += delta * 0.2
        }
        if (ringsRef.current) {
            ringsRef.current.rotation.x += delta * 0.1
            ringsRef.current.rotation.y += delta * 0.15
        }
    })

    return (
        <>
            <ambientLight intensity={0.2} />
            <pointLight position={[0, 0, 0]} intensity={20} color="#a855f7" distance={10} />

            {/* Glowing Core */}
            <mesh ref={coreRef} position={[0, 0, 0]}>
                <sphereGeometry args={[1, 32, 32]} />
                <meshStandardMaterial color="#c084fc" emissive="#a855f7" emissiveIntensity={2} />
            </mesh>

            {/* Rings */}
            <group ref={ringsRef}>
                {[2.5, 4, 5.5, 7].map((radius, i) => (
                    <mesh key={i} rotation={[Math.PI / 2 + (i * 0.2), 0, 0]}>
                        <torusGeometry args={[radius, 0.02, 16, 100]} />
                        <meshStandardMaterial color="#c084fc" emissive="#a855f7" emissiveIntensity={0.5} transparent opacity={0.6} />
                    </mesh>
                ))}
            </group>
        </>
    )
}

export function BackgroundOrbit() {
    const ref = useRef(null)
    const isInView = useInView(ref, { margin: "0px" })

    return (
        <div ref={ref} className="absolute inset-0 -z-10 bg-transparent overflow-hidden pointer-events-none">
            <div className="sticky top-0 h-screen w-full">
                <Canvas camera={{ position: [0, 5, 10] }} gl={{ alpha: true }} frameloop={isInView ? "always" : "demand"}>
                    <OrbitScene />
                </Canvas>
            </div>
        </div>
    )
}
