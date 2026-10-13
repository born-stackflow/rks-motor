'use client'

import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import type { Mesh, PointLight } from 'three'

function GemIcosahedron() {
  const meshRef = useRef<Mesh>(null)
  const lightRef = useRef<PointLight>(null)
  useFrame(({ clock }, delta) => {
    if (!meshRef.current) return
    meshRef.current.rotation.x += delta * 0.2
    meshRef.current.rotation.y += delta * 0.35
    meshRef.current.rotation.z += delta * 0.15
    if (lightRef.current) {
      lightRef.current.position.x = Math.sin(clock.elapsedTime) * 4
      lightRef.current.position.z = Math.cos(clock.elapsedTime) * 4
    }
  })
  return (
    <group position={[1.5, 0, 0]}>
      <pointLight ref={lightRef} position={[4, 2, 4]} intensity={60} color="#CC0000" />
      <mesh ref={meshRef}>
        <icosahedronGeometry args={[1.8, 0]} />
        <meshPhysicalMaterial color="#CC0000" metalness={0.8} roughness={0.05} transmission={0.15} thickness={0.5} />
      </mesh>
    </group>
  )
}

export default function Slide3Scene() {
  return (
    <>
      <ambientLight intensity={0.15} color="#111111" />
      <pointLight position={[-4, 3, 3]} intensity={40} color="#FF2200" />
      <GemIcosahedron />
    </>
  )
}
