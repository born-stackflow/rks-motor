'use client'

import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import type { Mesh } from 'three'

function TorusKnot() {
  const ref = useRef<Mesh>(null)
  useFrame(({ clock }, delta) => {
    if (!ref.current) return
    ref.current.rotation.y += delta * 0.3
    ref.current.rotation.z += delta * 0.15
    ref.current.position.y = Math.sin(clock.elapsedTime) * 0.3
  })
  return (
    <mesh ref={ref}>
      <torusKnotGeometry args={[1, 0.35, 128, 16]} />
      <meshStandardMaterial color="#CC0000" metalness={0.9} roughness={0.1} />
    </mesh>
  )
}

export default function Slide1Scene() {
  return (
    <>
      <ambientLight intensity={0.2} color="#222222" />
      <pointLight position={[-3, 3, 3]} intensity={80} color="#CC0000" />
      <pointLight position={[3, -2, 2]} intensity={30} color="#FF4444" />
      <TorusKnot />
    </>
  )
}
