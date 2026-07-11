'use client'

import { useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Mesh, PointLight } from 'three'

function GemIcosahedron() {
  const meshRef = useRef<Mesh>(null)
  const lightRef = useRef<PointLight>(null)
  useFrame((_, delta) => {
    if (!meshRef.current) return
    meshRef.current.rotation.x += delta * 0.2
    meshRef.current.rotation.y += delta * 0.35
    meshRef.current.rotation.z += delta * 0.15
    if (lightRef.current) {
      const t = Date.now() * 0.001
      lightRef.current.position.x = Math.sin(t) * 4
      lightRef.current.position.z = Math.cos(t) * 4
    }
  })
  return (
    <group position={[1.5, 0, 0]}>
      <pointLight ref={lightRef} position={[4, 2, 4]} intensity={60} color="#CC0000" />
      <mesh ref={meshRef}>
        <icosahedronGeometry args={[1.8, 0]} />
        <meshPhysicalMaterial
          color="#CC0000"
          metalness={0.8}
          roughness={0.05}
          transmission={0.15}
          thickness={0.5}
        />
      </mesh>
    </group>
  )
}

export default function Slide3Scene() {
  return (
    <Canvas
      camera={{ position: [0, 0, 6], fov: 50 }}
      gl={{ alpha: true, antialias: true }}
      dpr={[1, 2]}
      style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}
    >
      <ambientLight intensity={0.15} color="#111111" />
      <pointLight position={[-4, 3, 3]} intensity={40} color="#FF2200" />
      <GemIcosahedron />
    </Canvas>
  )
}
