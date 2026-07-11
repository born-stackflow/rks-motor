'use client'

import { useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Mesh, Group } from 'three'

function BatteryOrb() {
  const groupRef = useRef<Group>(null)
  const innerRef = useRef<Mesh>(null)
  const outerRef = useRef<Mesh>(null)
  const ring1Ref = useRef<Mesh>(null)
  const ring2Ref = useRef<Mesh>(null)

  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.3
      groupRef.current.position.y = Math.sin(Date.now() * 0.0008) * 0.2
    }
    if (innerRef.current) {
      innerRef.current.rotation.x += delta * 0.4
      innerRef.current.rotation.z += delta * 0.2
    }
    if (outerRef.current) {
      const pulse = 1 + Math.sin(Date.now() * 0.002) * 0.04
      outerRef.current.scale.setScalar(pulse)
    }
    if (ring1Ref.current) ring1Ref.current.rotation.z += delta * 0.6
    if (ring2Ref.current) ring2Ref.current.rotation.x += delta * 0.4
  })

  return (
    <group ref={groupRef} position={[1.2, 0, 0]}>
      {/* Core energy sphere */}
      <mesh ref={innerRef}>
        <icosahedronGeometry args={[1.1, 1]} />
        <meshPhysicalMaterial
          color="#CC0000"
          metalness={0.6}
          roughness={0.1}
          emissive="#CC0000"
          emissiveIntensity={0.4}
          transmission={0.1}
        />
      </mesh>

      {/* Outer glow shell */}
      <mesh ref={outerRef}>
        <sphereGeometry args={[1.55, 24, 24]} />
        <meshBasicMaterial color="#CC0000" wireframe opacity={0.12} transparent />
      </mesh>

      {/* Orbital ring 1 */}
      <mesh ref={ring1Ref}>
        <torusGeometry args={[1.8, 0.018, 8, 60]} />
        <meshBasicMaterial color="#FF3300" opacity={0.5} transparent />
      </mesh>

      {/* Orbital ring 2 — tilted */}
      <mesh ref={ring2Ref} rotation={[Math.PI / 3, 0, Math.PI / 4]}>
        <torusGeometry args={[1.8, 0.018, 8, 60]} />
        <meshBasicMaterial color="#CC0000" opacity={0.35} transparent />
      </mesh>
    </group>
  )
}

export default function Slide4Scene() {
  return (
    <Canvas
      camera={{ position: [0, 0, 6], fov: 50 }}
      gl={{ alpha: true, antialias: true }}
      dpr={[1, 2]}
      style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}
    >
      <ambientLight intensity={0.15} color="#111111" />
      <pointLight position={[4, 3, 3]} intensity={80} color="#CC0000" />
      <pointLight position={[-3, -2, 2]} intensity={30} color="#FF4422" />
      <BatteryOrb />
    </Canvas>
  )
}
