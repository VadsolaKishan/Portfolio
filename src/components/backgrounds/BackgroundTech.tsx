import { Canvas, useFrame } from '@react-three/fiber'
import { useRef, useMemo } from 'react'
import { useInView } from 'framer-motion'
import * as THREE from 'three'

function TechScene() {
    const groupRef = useRef<THREE.Group>(null!)

    const shapes = useMemo(() => {
        return Array.from({ length: 20 }).map(() => ({
            position: [
                (Math.random() - 0.5) * 15,
                (Math.random() - 0.5) * 15,
                (Math.random() - 0.5) * 10
            ] as [number, number, number],
            rotation: [
                Math.random() * Math.PI,
                Math.random() * Math.PI,
                0
            ] as [number, number, number],
            scale: Math.random() * 0.5 + 0.2
        }))
    }, [])

    useFrame((_, delta) => {
        if (groupRef.current) {
            groupRef.current.rotation.x -= delta * 0.05
            groupRef.current.rotation.y -= delta * 0.05
        }
    })

    return (
        <>
            <ambientLight intensity={0.2} />
            <directionalLight position={[0, 10, 5]} intensity={1} color="#60a5fa" />
            <group ref={groupRef}>
                {shapes.map((props, i) => (
                    <mesh
                        key={i}
                        position={props.position}
                        rotation={props.rotation}
                        scale={props.scale}
                    >
                        {i % 2 === 0 ? <boxGeometry args={[1, 1, 1]} /> : <tetrahedronGeometry args={[1, 0]} />}
                        <meshStandardMaterial color="#3b82f6" wireframe transparent opacity={0.25} />
                    </mesh>
                ))}
            </group>
        </>
    )
}

export function BackgroundTech() {
    const ref = useRef(null)
    const isInView = useInView(ref, { margin: "0px" })

    return (
        <div ref={ref} className="absolute inset-0 -z-10 bg-transparent overflow-hidden pointer-events-none">
            <div className="sticky top-0 h-screen w-full">
                <Canvas camera={{ position: [0, 0, 5] }} gl={{ alpha: true }} frameloop={isInView ? "always" : "demand"}>
                    <TechScene />
                </Canvas>
            </div>
        </div>
    )
}
