'use client'

import { Canvas, useFrame } from '@react-three/fiber'
import { PerspectiveCamera } from 'three'
import Slide1Scene from './slides/Slide1Scene'
import Slide2Scene from './slides/Slide2Scene'
import Slide3Scene from './slides/Slide3Scene'
import Slide4Scene from './slides/Slide4Scene'
import Slide5Scene from './slides/Slide5Scene'

const SCENES = [Slide1Scene, Slide2Scene, Slide3Scene, Slide4Scene, Slide5Scene]

const CAMERAS = [
  { z: 5, fov: 50 },
  { z: 6, fov: 50 },
  { z: 6, fov: 50 },
  { z: 6, fov: 50 },
  { z: 7, fov: 60 },
]

function CameraRig({ z, fov }: { z: number; fov: number }) {
  useFrame(({ camera }) => {
    if (!(camera instanceof PerspectiveCamera)) return
    if (camera.position.z === z && camera.fov === fov) return
    camera.position.set(0, 0, z)
    camera.fov = fov
    camera.updateProjectionMatrix()
  })
  return null
}

/**
 * One WebGL context for every slide: only the scene graph changes with the slide,
 * and rendering stops entirely while `active` is false.
 */
export default function HeroScene({ index, active }: { index: number; active: boolean }) {
  const Scene = SCENES[index % SCENES.length]
  const camera = CAMERAS[index % CAMERAS.length]

  return (
    <Canvas
      camera={{ position: [0, 0, camera.z], fov: camera.fov }}
      frameloop={active ? 'always' : 'never'}
      gl={{ alpha: true, antialias: true, powerPreference: 'low-power' }}
      dpr={[1, 1.5]}
      style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}
    >
      <CameraRig z={camera.z} fov={camera.fov} />
      <Scene key={index} />
    </Canvas>
  )
}
