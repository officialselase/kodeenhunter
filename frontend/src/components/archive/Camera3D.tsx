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
  const [xrSupported, setXrSupported] = useState(false)
  const [vrMessage, setVrMessage] = useState('')
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    try {
      const canvas = document.createElement('canvas')
      const gl = canvas.getContext('webgl2') || canvas.getContext('webgl') || canvas.getContext('experimental-webgl')
      if (!gl) {
        setHasWebGL(false)
      }
    } catch (e) {
      setHasWebGL(false)
    }

    if (navigator.xr) {
      navigator.xr.isSessionSupported('immersive-vr').then((supported) => {
        setXrSupported(supported)
      }).catch(() => {
        setXrSupported(false)
      })
    }
  }, [])

  const handleEnterVR = async () => {
    if (!navigator.xr) {
      setVrMessage('WebXR not available on this device')
      return
    }

    setVrMessage('VR mode requires a compatible headset. Connect your VR device and refresh the page.')
    setTimeout(() => setVrMessage(''), 5000)
  }

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
    <div ref={containerRef} className="w-full h-full min-h-[400px] relative">
      {xrSupported && (
        <div className="absolute top-4 right-4 z-10">
          <button
            onClick={handleEnterVR}
            className="bg-kodeen-black text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-kodeen-gray-800 transition-colors flex items-center gap-2"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20.74 6H3.21a1.2 1.2 0 0 0-1.21 1.2v9.6a1.2 1.2 0 0 0 1.2 1.2h6.48l1.44 1.8a1.2 1.2 0 0 0 1.92 0l1.44-1.8h6.24a1.2 1.2 0 0 0 1.2-1.2V7.2A1.2 1.2 0 0 0 20.74 6zm-13.9 8.4a2.4 2.4 0 1 1 0-4.8 2.4 2.4 0 0 1 0 4.8zm10.32 0a2.4 2.4 0 1 1 0-4.8 2.4 2.4 0 0 1 0 4.8z"/>
            </svg>
            VR Mode
          </button>
        </div>
      )}
      {vrMessage && (
        <div className="absolute top-16 right-4 z-10 bg-white shadow-lg rounded-lg p-3 max-w-xs">
          <p className="text-sm text-kodeen-gray-600">{vrMessage}</p>
        </div>
      )}
      <Canvas
        camera={{ position: [0, 2, 5], fov: 45 }}
        gl={{ 
          antialias: true, 
          alpha: true,
          powerPreference: 'default',
          failIfMajorPerformanceCaveat: false
        }}
        style={{ background: 'transparent' }}
        onCreated={({ gl }) => {
          gl.domElement.addEventListener('webglcontextlost', (e) => {
            e.preventDefault()
            setContextLost(true)
          })
          gl.domElement.addEventListener('webglcontextrestored', () => {
            setContextLost(false)
          })
        }}
      >
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 5, 5]} intensity={1} />
        <directionalLight position={[-5, -5, -5]} intensity={0.3} />
        <FilmReel />
      </Canvas>
      {xrSupported && (
        <div className="absolute bottom-4 left-4 z-10">
          <span className="text-xs text-kodeen-gray-400 bg-white/80 px-2 py-1 rounded">
            VR Compatible
          </span>
        </div>
      )}
    </div>
  )
}

export default Camera3D
