import { Canvas, useThree } from '@react-three/fiber';
import { OrbitControls, useGLTF, Environment, Preload } from '@react-three/drei';
import { Suspense, useRef, useState } from 'react';
import { EffectComposer, ToneMapping, N8AO } from '@react-three/postprocessing';
import { useControls, folder, button } from 'leva';

function Model({ url }) {
  const group = useRef();
  const { scene } = useGLTF(url, true);

  return (
    <group ref={group} position={[0, 2, 0]}>
      <primitive object={scene} />
    </group>
  );
}

function LoadingBox() {
  return (
    <mesh position={[0, 2, 0]}>
      <boxGeometry args={[2, 2, 2]} />
      <meshPhongMaterial color="#00ff00" emissive="#00aa00" />
    </mesh>
  );
}

function SceneContent({ modelUrl, showTest, controls, orbitControlsRef }) {
  return (
    <>
      {/* Environment with Sunset Cubemap - using correct file names and order */}
      <Environment
        background
        files={[
          '/cubemap/sunset/right.png',  // px (positive X)
          '/cubemap/sunset/left.png',   // nx (negative X)
          '/cubemap/sunset/top.png',    // py (positive Y)
          '/cubemap/sunset/bot.png',    // ny (negative Y)
          '/cubemap/sunset/front.png',  // pz (positive Z)
          '/cubemap/sunset/back.png',   // nz (negative Z)
        ]}
      />

      {/* Lighting */}
      <ambientLight intensity={controls.ambientIntensity} />
      <directionalLight position={[10, 15, 10]} intensity={controls.directionalIntensity1} castShadow />
      <directionalLight position={[-10, -5, -10]} intensity={controls.directionalIntensity2} />

      {/* Main content */}
      {showTest ? (
        <LoadingBox />
      ) : (
        <Suspense fallback={<LoadingBox />}>
          <Model url={modelUrl} />
        </Suspense>
      )}

      {/* Grid and helpers */}
      {controls.showGrid && <gridHelper args={[50, 50]} position={[0, 0, 0]} />}
      {controls.showAxes && <axesHelper args={[10]} position={[0, 0, 0]} />}

      {/* Post-processing */}
      <EffectComposer>
        {controls.enableToneMapping && <ToneMapping />}
        <N8AO aoRadius={controls.aoRadius} intensity={controls.aoIntensity} />
      </EffectComposer>

      {/* Preload models */}
      <Preload all />
    </>
  );
}

export default function ModelViewerR3F({ modelUrl, modelName, isFullScreen = false, onFullScreenChange }) {
  const canvasRef = useRef();
  const orbitControlsRef = useRef();
  const [showTest, setShowTest] = useState(false);
  const [isFS, setIsFS] = useState(isFullScreen);

  // Get Leva controls
  const controls = useControls({
    'Scene Settings': folder({
      autoRotate: true,
      autoRotateSpeed: { value: 3, min: 0, max: 10, step: 0.5 },
      showGrid: true,
      showAxes: false,
      zoomSpeed: { value: 1.5, min: 0.5, max: 5, step: 0.5 },
      panSpeed: { value: 0.8, min: 0.1, max: 2, step: 0.1 },
    }),
    'Lighting': folder({
      ambientIntensity: { value: 0.8, min: 0, max: 2, step: 0.1 },
      directionalIntensity1: { value: 1.5, min: 0, max: 3, step: 0.1 },
      directionalIntensity2: { value: 0.6, min: 0, max: 3, step: 0.1 },
    }),
    'Post Processing': folder({
      aoRadius: { value: 1, min: 0, max: 5, step: 0.5 },
      aoIntensity: { value: 0.5, min: 0, max: 2, step: 0.1 },
      enableToneMapping: true,
    }),
    'Actions': folder({
      recenter: button(() => {
        if (orbitControlsRef.current) {
          orbitControlsRef.current.reset();
        }
      }),
    }),
  });

  const handleFullScreen = () => {
    const newState = !isFS;
    setIsFS(newState);
    if (onFullScreenChange) {
      onFullScreenChange(newState);
    }
  };

  return (
    <div className={`relative bg-void-900 overflow-hidden ${
      isFS ? 'fixed inset-0 z-50' : 'rounded-3xl border border-white/10 h-96'
    }`}>
      <Canvas
        ref={canvasRef}
        camera={{ position: [0, 4, 12], fov: 75 }}
        gl={{ antialias: true, alpha: true }}
        className="w-full h-full"
      >
        <SceneContent modelUrl={modelUrl} showTest={showTest} controls={controls} orbitControlsRef={orbitControlsRef} />
        
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
        />
      </Canvas>

      {/* Controls Overlay */}
      <div className={`absolute top-4 right-4 flex gap-2 z-10 ${isFS ? 'flex-col' : 'flex-row'}`}>
        <button
          onClick={() => setShowTest(!showTest)}
          className="px-3 py-2 rounded-lg text-sm font-medium transition bg-white/5 border border-white/10 text-chrome-400 hover:bg-white/10 hover:border-white/20"
          title="Toggle test box"
        >
          🔧 {showTest ? 'Hide' : 'Test'}
        </button>
        
        <button
          onClick={handleFullScreen}
          className="px-3 py-2 rounded-lg text-sm font-medium transition bg-white/5 border border-white/10 text-chrome-400 hover:bg-white/10 hover:border-white/20"
          title={isFS ? 'Exit fullscreen' : 'Enter fullscreen'}
        >
          {isFS ? '⛶ Exit' : '⛶ Full'}
        </button>
      </div>

      {/* Help text */}
      {!isFS && (
        <div className="absolute bottom-4 left-4 text-xs text-chrome-500 pointer-events-none">
          Drag to rotate • Scroll to zoom • Right-click to pan
        </div>
      )}

      {/* Exit fullscreen hint */}
      {isFS && (
        <div className="absolute bottom-4 left-4 text-xs text-chrome-500">
          <div>Drag to rotate • Scroll to zoom • Right-click to pan</div>
          <div className="mt-2">Press ⛶ or ESC to exit fullscreen</div>
        </div>
      )}

      {/* Model info in fullscreen */}
      {isFS && (
        <div className="absolute top-4 left-4 text-white">
          <h2 className="text-xl font-bold">{modelName}</h2>
          <p className="text-xs text-chrome-500 mt-1">3D Model Viewer</p>
        </div>
      )}
    </div>
  );
}
