'use client'

import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import type { Mesh } from 'three'

function WireframeSphere() {
  const outerRef = useRef<Mesh>(null)
  const innerRef = useRef<Mesh>(null)
  useFrame(({ clock }, delta) => {
    if (outerRef.current) {
      outerRef.current.rotation.y += delta * 0.5
      outerRef.current.scale.setScalar(1 + Math.sin(clock.elapsedTime * 1.5) * 0.05)
    }
    if (innerRef.current) innerRef.current.rotation.y += delta * 0.2
  })
  return (
    <group position={[-1.5, 0, 0]}>
      <mesh ref={innerRef}>
        <sphereGeometry args={[1.8, 32, 32]} />
        <meshStandardMaterial color="#1A1A1A" />
      </mesh>
      <mesh ref={outerRef}>
        <sphereGeometry args={[2, 16, 16]} />
        <meshBasicMaterial color="#CC0000" wireframe opacity={0.55} transparent />
      </mesh>
    </group>
  )
}

export default function Slide2Scene() {
  return (
    <>
      <ambientLight intensity={0.3} />
      <pointLight position={[4, 4, 4]} intensity={50} color="#CC0000" />
      <WireframeSphere />
    </>
  )
}
