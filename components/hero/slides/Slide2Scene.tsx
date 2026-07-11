'use client'

import { useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Mesh } from 'three'

function WireframeSphere() {
  const outerRef = useRef<Mesh>(null)
  const innerRef = useRef<Mesh>(null)
  useFrame((_, delta) => {
    if (outerRef.current) {
      outerRef.current.rotation.y += delta * 0.5
      const s = 1 + Math.sin(Date.now() * 0.0015) * 0.05
      outerRef.current.scale.setScalar(s)
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
    <Canvas
      camera={{ position: [0, 0, 6], fov: 50 }}
      gl={{ alpha: true, antialias: true }}
      dpr={[1, 2]}
      style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}
    >
      <ambientLight intensity={0.3} />
      <pointLight position={[4, 4, 4]} intensity={50} color="#CC0000" />
      <WireframeSphere />
    </Canvas>
  )
}
