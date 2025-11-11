import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, Float, Preload } from '@react-three/drei';
import { Suspense, useRef } from 'react';
import { EffectComposer, ToneMapping, N8AO } from '@react-three/postprocessing';
import { useControls, folder, button } from 'leva';
import { useGLTF } from '@react-three/drei';

// Boat component
function Boat(props) {
  const { scene } = useGLTF('/boat.glb');
  return (
    <group {...props}>
      <primitive object={scene} />
    </group>
  );
}

// Simple water plane
function WaterPlane() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
      <planeGeometry args={[100, 100, 64, 64]} />
      <meshStandardMaterial
        color="#1a472a"
        metalness={0.8}
        roughness={0.2}
      />
    </mesh>
  );
}

export default function WaterSceneViewer() {
  const orbitControlsRef = useRef();

  const controls = useControls({
    'Scene Settings': folder({
      autoRotate: true,
      autoRotateSpeed: { value: 2, min: 0, max: 10, step: 0.5 },
      showGrid: true,
      zoomSpeed: { value: 1.5, min: 0.5, max: 5, step: 0.5 },
      panSpeed: { value: 0.8, min: 0.1, max: 2, step: 0.1 },
    }),
    'Lighting': folder({
      ambientIntensity: { value: 1, min: 0, max: 2, step: 0.1 },
      directionalIntensity: { value: 1.5, min: 0, max: 3, step: 0.1 },
    }),
    'Actions': folder({
      recenter: button(() => {
        if (orbitControlsRef.current) {
          orbitControlsRef.current.reset();
        }
      }),
    }),
  });

  return (
    <div className="w-full h-screen bg-gradient-to-b from-void-900 to-gray-900 relative">
      <Canvas
        camera={{ position: [15, 10, 15], fov: 75 }}
        gl={{ antialias: true, alpha: false }}
        className="w-full h-full"
      >
        {/* Environment */}
        <Environment
          background
          files={[
            '/cubemap/sunset/right.png',
            '/cubemap/sunset/left.png',
            '/cubemap/sunset/top.png',
            '/cubemap/sunset/bot.png',
            '/cubemap/sunset/front.png',
            '/cubemap/sunset/back.png',
          ]}
        />

        {/* Lighting */}
        <ambientLight intensity={controls.ambientIntensity} />
        <directionalLight 
          position={[15, 20, 15]} 
          intensity={controls.directionalIntensity}
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
        />

        {/* Water */}
        <WaterPlane />

        {/* Boat */}
        <Float
          speed={2}
          floatingRange={[-0.1, 0.1]}
          floatIntensity={0.05}
          rotationIntensity={0.3}
        >
          <Boat position={[0, 0.5, 0]} rotation={[0, Math.PI / 6, 0]} scale={1.5} />
        </Float>

        {/* Grid */}
        {controls.showGrid && <gridHelper args={[100, 20]} />}

        {/* Post-processing */}
        <EffectComposer>
          <ToneMapping />
          <N8AO aoRadius={0.5} intensity={0.3} />
        </EffectComposer>

        <Preload all />

        {/* Controls */}
        <OrbitControls
          ref={orbitControlsRef}
          autoRotate={controls.autoRotate}
          autoRotateSpeed={controls.autoRotateSpeed}
          zoomSpeed={controls.zoomSpeed}
          panSpeed={controls.panSpeed}
          enableZoom
          enablePan
          enableRotate
          dampingFactor={0.05}
          minPolarAngle={0}
          maxPolarAngle={Math.PI / 2}
        />
      </Canvas>

      {/* Info overlay */}
      <div className="absolute top-4 left-4 text-white z-10">
        <h2 className="text-2xl font-bold">Interactive Water Scene</h2>
        <p className="text-xs text-chrome-500 mt-1">3D Models Tab - Default View</p>
      </div>
    </div>
  );
}
