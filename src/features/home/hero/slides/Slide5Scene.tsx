'use client'

import { useEffect, useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { BufferGeometry, Float32BufferAttribute, type Points, type PointsMaterial } from 'three'

const COUNT = 300
const SPREAD = 5

function createField() {
  const positions = new Float32Array(COUNT * 3)
  const colors = new Float32Array(COUNT * 3)
  for (let i = 0; i < COUNT * 3; i += 3) {
    positions[i] = (Math.random() - 0.5) * SPREAD * 2
    positions[i + 1] = (Math.random() - 0.5) * SPREAD * 2
    positions[i + 2] = (Math.random() - 0.5) * SPREAD * 2
    const isRed = Math.random() > 0.5
    colors[i] = isRed ? 0.8 : 0.95
    colors[i + 1] = isRed ? 0 : 0.95
    colors[i + 2] = isRed ? 0 : 0.95
  }
  const geometry = new BufferGeometry()
  geometry.setAttribute('position', new Float32BufferAttribute(positions, 3))
  geometry.setAttribute('color', new Float32BufferAttribute(colors, 3))
  return geometry
}

function ParticleField() {
  const pointsRef = useRef<Points<BufferGeometry, PointsMaterial>>(null)
  const geometry = useMemo(() => createField(), [])

  useEffect(() => () => geometry.dispose(), [geometry])

  useFrame(({ clock }, delta) => {
    const points = pointsRef.current
    if (!points) return
    points.rotation.y += delta * 0.08
    const position = points.geometry.attributes.position
    const values = position.array
    for (let i = 1; i < values.length; i += 3) {
      values[i] += Math.sin(clock.elapsedTime * 0.8 + i) * 0.003
    }
    position.needsUpdate = true
  })

  return (
    <points ref={pointsRef} geometry={geometry}>
      <pointsMaterial size={0.06} vertexColors sizeAttenuation />
    </points>
  )
}

export default function Slide5Scene() {
  return <ParticleField />
}
