'use client'

import { useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Points, BufferGeometry, Float32BufferAttribute, PointsMaterial } from 'three'

function ParticleField() {
  const pointsRef = useRef<Points<BufferGeometry, PointsMaterial>>(null)

  const { positions, colors } = useMemo(() => {
    const count = 300
    const pos: number[] = []
    const col: number[] = []
    for (let i = 0; i < count; i++) {
      const r = 5
      pos.push((Math.random() - 0.5) * r * 2, (Math.random() - 0.5) * r * 2, (Math.random() - 0.5) * r * 2)
      const isRed = Math.random() > 0.5
      col.push(isRed ? 0.8 : 0.95, isRed ? 0 : 0.95, isRed ? 0 : 0.95)
    }
    return { positions: new Float32Array(pos), colors: new Float32Array(col) }
  }, [])

  const geo = useMemo(() => {
    const g = new BufferGeometry()
    g.setAttribute('position', new Float32BufferAttribute(positions, 3))
    g.setAttribute('color',    new Float32BufferAttribute(colors,    3))
    return g
  }, [positions, colors])

  useFrame((_, delta) => {
    if (!pointsRef.current) return
    pointsRef.current.rotation.y += delta * 0.08
    const arr = geo.attributes.position.array as Float32Array
    for (let i = 1; i < arr.length; i += 3) {
      // eslint-disable-next-line react-hooks/immutability -- three.js buffer geometry is mutated in place every frame for performance; rebuilding it would defeat the point
      arr[i] += Math.sin(Date.now() * 0.0008 + i) * 0.003
    }
    geo.attributes.position.needsUpdate = true
  })

  return (
    <points ref={pointsRef} geometry={geo}>
      <pointsMaterial size={0.06} vertexColors sizeAttenuation />
    </points>
  )
}

export default function Slide5Scene() {
  return (
    <Canvas
      camera={{ position: [0, 0, 7], fov: 60 }}
      gl={{ alpha: true, antialias: true }}
      dpr={[1, 2]}
      style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}
    >
      <ParticleField />
    </Canvas>
  )
}
