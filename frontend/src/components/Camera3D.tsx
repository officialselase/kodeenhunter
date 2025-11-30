import { useRef, useState, useEffect } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Float } from '@react-three/drei'
import * as THREE from 'three'

const FilmReel = () => {
  const meshRef = useRef<THREE.Group>(null)

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.3
      meshRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.5) * 0.1
    }
  })

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
      <group ref={meshRef}>
        <mesh>
          <torusGeometry args={[1.5, 0.15, 16, 64]} />
          <meshStandardMaterial color="#0a0a0a" metalness={0.8} roughness={0.2} />
        </mesh>
        <mesh>
          <torusGeometry args={[1.2, 0.1, 16, 64]} />
          <meshStandardMaterial color="#0a0a0a" metalness={0.8} roughness={0.2} />
        </mesh>
        <mesh>
          <cylinderGeometry args={[0.3, 0.3, 0.4, 24]} />
          <meshStandardMaterial color="#0a0a0a" metalness={0.9} roughness={0.1} />
        </mesh>
        {[...Array(8)].map((_, i) => (
          <mesh
            key={i}
            position={[
              Math.cos((i * Math.PI * 2) / 8) * 1.35,
              0,
              Math.sin((i * Math.PI * 2) / 8) * 1.35,
            ]}
          >
            <boxGeometry args={[0.15, 0.3, 0.15]} />
            <meshStandardMaterial color="#1a1a1a" metalness={0.7} roughness={0.3} />
          </mesh>
        ))}
      </group>
    </Float>
  )
}

const Camera3D = () => {
  const [hasWebGL, setHasWebGL] = useState(true)
  const [contextLost, setContextLost] = useState(false)

  useEffect(() => {
    try {
      const canvas = document.createElement('canvas')
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl')
      if (!gl) {
        setHasWebGL(false)
      }
    } catch (e) {
      setHasWebGL(false)
    }
  }, [])

  if (!hasWebGL || contextLost) {
    return (
      <div className="w-full h-full min-h-[400px] flex items-center justify-center">
        <div className="relative">
          <svg width="200" height="200" viewBox="0 0 200 200" className="animate-spin-slow">
            <circle cx="100" cy="100" r="80" stroke="#0a0a0a" strokeWidth="3" fill="none" opacity="0.3" />
            <circle cx="100" cy="100" r="60" stroke="#0a0a0a" strokeWidth="2" fill="none" opacity="0.5" />
            <circle cx="100" cy="100" r="20" fill="#0a0a0a" />
            {[...Array(8)].map((_, i) => (
              <rect
                key={i}
                x={100 + Math.cos((i * Math.PI * 2) / 8) * 70 - 5}
                y={100 + Math.sin((i * Math.PI * 2) / 8) * 70 - 10}
                width="10"
                height="20"
                fill="#0a0a0a"
                opacity="0.7"
              />
            ))}
          </svg>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full h-full min-h-[400px]">
      <Canvas
        camera={{ position: [0, 2, 5], fov: 45 }}
        gl={{ 
          antialias: true, 
          alpha: true,
          powerPreference: 'low-power',
          failIfMajorPerformanceCaveat: false
        }}
        style={{ background: 'transparent' }}
        onCreated={({ gl }) => {
          gl.domElement.addEventListener('webglcontextlost', (e) => {
            e.preventDefault()
            setContextLost(true)
          })
        }}
      >
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 5, 5]} intensity={1} />
        <directionalLight position={[-5, -5, -5]} intensity={0.3} />
        <FilmReel />
      </Canvas>
    </div>
  )
}

export default Camera3D
