import { Canvas, useThree } from "@react-three/fiber";
import {
  OrbitControls,
  useGLTF,
  Environment,
  Preload,
  Stars,
  ContactShadows,
  BakeShadows,
} from "@react-three/drei";
import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { EffectComposer, ToneMapping, N8AO } from "@react-three/postprocessing";
import { useControls, folder, button, LevaPanel, useCreateStore } from "leva";
import { Box3, Vector3 } from "three";

const ENVIRONMENT_MAPS = {
  sunset: {
    label: "Sunset",
    files: [
      "/cubemap/sunset/right.png",
      "/cubemap/sunset/left.png",
      "/cubemap/sunset/top.png",
      "/cubemap/sunset/bot.png",
      "/cubemap/sunset/front.png",
      "/cubemap/sunset/back.png",
    ],
  },
  galaxy: {
    label: "Galaxy",
    files: [
      "/cubemap/galaxy/right.png",
      "/cubemap/galaxy/left.png",
      "/cubemap/galaxy/top.png",
      "/cubemap/galaxy/bot.png",
      "/cubemap/galaxy/front.png",
      "/cubemap/galaxy/back.png",
    ],
  },
  sphere: {
    label: "Sphere",
    file: "/cubemap/sphere.jpg",
  },
};

function Model({ url, onLoad }) {
  const group = useRef();
  const { scene } = useGLTF(url, true);
  const { camera, controls } = useThree();

  useEffect(() => {
    if (!group.current) return;

    // Calculate bounding box
    const box = new Box3().setFromObject(group.current);
    const size = box.getSize(new Vector3());
    const center = box.getCenter(new Vector3());

    // Calculate distance to fit model
    const maxDim = Math.max(size.x, size.y, size.z);
    const fov = camera.fov * (Math.PI / 180);
    let cameraZ = Math.abs(maxDim / 2 / Math.tan(fov / 2));
    cameraZ *= 1.5; // Add padding

    // Update camera position
    camera.position.set(cameraZ, center.y, cameraZ);
    camera.lookAt(center);
    camera.updateProjectionMatrix();

    // Reset controls to new target
    if (controls) {
      controls.target.copy(center);
      controls.autoRotate = false;
      controls.reset();
    }

    onLoad?.();
  }, [scene, camera, controls, onLoad]);

  return (
    <group ref={group} position={[0, 0, 0]}>
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

function SceneContent({
  modelUrl,
  showPlaceholder,
  sceneMode,
  environmentPreset,
  ambientIntensity,
  keyIntensity,
  fillIntensity,
  showGrid,
  showAxes,
  enableToneMapping,
  aoRadius,
  aoIntensity,
  contactShadows,
  onModelLoad,
}) {
  const envConfig = useMemo(() => {
    if (environmentPreset === "none" || sceneMode === "hangar") return null;
    return ENVIRONMENT_MAPS[environmentPreset] ?? ENVIRONMENT_MAPS.sunset;
  }, [environmentPreset, sceneMode]);

  return (
    <>
      {envConfig && (
        <Environment
          key={`${sceneMode}-${environmentPreset}`}
          background
          files={envConfig.files ?? envConfig.file}
        />
      )}
      {sceneMode === "starfield" && (
        <Stars
          key="starfield"
          radius={120}
          depth={50}
          count={9000}
          factor={4}
          fade
          speed={0.4}
        />
      )}
      {sceneMode === "hangar" && (
        <>
          <Environment
            key="hangar-env"
            preset="warehouse"
            background
            blur={0.65}
          />
          {contactShadows && (
            <ContactShadows
              position={[0, 0, 0]}
              opacity={0.55}
              scale={25}
              blur={2}
              far={25}
            />
          )}
        </>
      )}

      <ambientLight intensity={ambientIntensity} />
      <directionalLight
        position={[12, 18, 10]}
        intensity={keyIntensity}
        castShadow
      />
      <directionalLight position={[-10, -4, -10]} intensity={fillIntensity} />

      {showPlaceholder ? (
        <LoadingBox />
      ) : (
        <Suspense fallback={<LoadingBox />}>
          <Model url={modelUrl} onLoad={onModelLoad} />
        </Suspense>
      )}

      {showGrid && <gridHelper args={[50, 50]} position={[0, 0, 0]} />}
      {showAxes && <axesHelper args={[10]} position={[0, 0, 0]} />}

      <EffectComposer>
        {enableToneMapping && <ToneMapping />}
        <N8AO aoRadius={aoRadius} intensity={aoIntensity} />
      </EffectComposer>

      <Preload all />
    </>
  );
}

export default function ModelViewerR3F({
  modelUrl,
  modelName,
  onFullScreenChange,
  onSceneChange,
  containerClassName = "rounded-3xl border border-white/10 min-h-[420px]",
  forceFullScreen = false,
}) {
  const wrapperRef = useRef(null);
  const canvasRef = useRef();
  const orbitControlsRef = useRef();
  const [isFS, setIsFS] = useState(false);
  const store = useCreateStore();

  const { sceneMode, showPlaceholder, showGrid, showAxes } = useControls(
    "Scene",
    () => ({
      sceneMode: {
        label: "Mode",
        value: "model",
        options: {
          Model: "model",
          Water: "water",
          Void: "void",
          Starfield: "starfield",
          Hangar: "hangar",
        },
      },
      showPlaceholder: { label: "Debug placeholder", value: false },
      showGrid: false,
      showAxes: false,
    }),
    { collapsed: true },
    { store }
  );

  const { environmentPreset } = useControls(
    "Environment",
    () => ({
      environmentPreset: {
        label: "Backdrop",
        value: "none",
        options: ["none", "sunset", "galaxy", "sphere"],
      },
    }),
    { collapsed: true },
    { store }
  );

  const { autoRotate, autoRotateSpeed, zoomSpeed, panSpeed, dampingFactor } =
    useControls(
      "Camera",
      () => ({
        autoRotate: false,
        autoRotateSpeed: { value: 2, min: 0, max: 10, step: 0.5 },
        zoomSpeed: { value: 1.2, min: 0.2, max: 4, step: 0.1 },
        panSpeed: { value: 0.8, min: 0.1, max: 2, step: 0.1 },
        dampingFactor: { value: 0.08, min: 0.01, max: 0.2, step: 0.01 },
      }),
      { collapsed: true },
      { store }
    );

  const { ambientIntensity, keyIntensity, fillIntensity, contactShadows } =
    useControls(
      "Lighting",
      () => ({
        ambientIntensity: { value: 0.9, min: 0, max: 2, step: 0.1 },
        keyIntensity: { value: 1.4, min: 0, max: 3, step: 0.1 },
        fillIntensity: { value: 0.6, min: 0, max: 3, step: 0.1 },
        contactShadows: { value: true },
      }),
      { collapsed: true },
      { store }
    );

  const { aoRadius, aoIntensity, enableToneMapping } = useControls(
    "Post",
    () => ({
      aoRadius: { value: 1.2, min: 0, max: 5, step: 0.1 },
      aoIntensity: { value: 0.6, min: 0, max: 2, step: 0.05 },
      enableToneMapping: true,
    }),
    { collapsed: true },
    { store }
  );

  useControls(
    "Actions",
    () => ({
      recenter: button(() => {
        orbitControlsRef.current?.reset();
      }),
    }),
    { collapsed: true },
    { store }
  );

  useEffect(() => {
    if (onSceneChange) {
      onSceneChange(sceneMode);
    }
  }, [sceneMode, onSceneChange]);

  useEffect(() => {
    const handleChange = () => {
      const active = document.fullscreenElement === wrapperRef.current;
      setIsFS(active);
      onFullScreenChange?.(active);
    };

    document.addEventListener("fullscreenchange", handleChange);
    return () => document.removeEventListener("fullscreenchange", handleChange);
  }, [onFullScreenChange]);

  useEffect(() => {
    if (!wrapperRef.current) return;
    if (forceFullScreen && !isFS) {
      wrapperRef.current.requestFullscreen?.();
    } else if (
      !forceFullScreen &&
      isFS &&
      document.fullscreenElement === wrapperRef.current
    ) {
      document.exitFullscreen?.();
    }
  }, [forceFullScreen, isFS]);

  const baseClasses = "relative bg-void-900 overflow-hidden";
  const layoutClasses = isFS
    ? "fixed inset-0 z-50 h-screen w-screen"
    : containerClassName;

  const levaPanel = (
    <div className="absolute top-4 right-4 z-30">
      <LevaPanel
        store={store}
        fill
        flat
        hideCopyButton
        titleBar={true}
        // oneLineLabels
      />
    </div>
  );

  const renderOrbitControls = () => (
    <OrbitControls
      ref={orbitControlsRef}
      autoRotate={autoRotate}
      autoRotateSpeed={autoRotateSpeed}
      zoomSpeed={zoomSpeed}
      panSpeed={panSpeed}
      enableZoom
      enablePan
      enableRotate
      dampingFactor={dampingFactor}
    />
  );

  const instructions = (
    <div className="pointer-events-none absolute bottom-4 left-4 text-xs text-chrome-500">
      Drag to rotate • Scroll to zoom • Right-click to pan
      {isFS ? (
        <div className="mt-1">
          Press Esc or use the dashboard button to exit fullscreen
        </div>
      ) : (
        <div className="mt-1">
          Use the Expand Viewer button to enter fullscreen
        </div>
      )}
    </div>
  );

  if (sceneMode === "water") {
    return (
      <div ref={wrapperRef} className={`${baseClasses} ${layoutClasses}`}>
        <Canvas
          ref={canvasRef}
          camera={{ position: [15, 10, 15], fov: 75 }}
          gl={{ antialias: true, alpha: true }}
          className="h-full w-full"
        >
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
            <planeGeometry args={[120, 120, 64, 64]} />
            <meshStandardMaterial
              color="#1b263b"
              metalness={0.7}
              roughness={0.3}
            />
          </mesh>

          <ambientLight intensity={ambientIntensity} />
          <directionalLight
            position={[10, 15, 10]}
            intensity={keyIntensity}
            castShadow
          />
          <directionalLight
            position={[-10, -5, -10]}
            intensity={fillIntensity}
          />

          {showGrid && <gridHelper args={[100, 20]} />}

          <EffectComposer>
            {enableToneMapping && <ToneMapping />}
            <N8AO aoRadius={aoRadius} intensity={aoIntensity} />
          </EffectComposer>

          <Preload all />
          {renderOrbitControls()}
        </Canvas>

        {levaPanel}
        {instructions}
        {isFS && (
          <div className="absolute top-4 left-4 text-white">
            <h2 className="text-xl font-semibold">Water Scene</h2>
            <p className="mt-1 text-xs text-chrome-500">
              Reflective ocean plane
            </p>
          </div>
        )}
      </div>
    );
  }

  if (sceneMode === "void") {
    return (
      <div ref={wrapperRef} className={`${baseClasses} ${layoutClasses}`}>
        <Canvas
          ref={canvasRef}
          camera={{ position: [0, 4, 12], fov: 75 }}
          gl={{ antialias: true, alpha: true }}
          className="h-full w-full"
        >
          <ambientLight intensity={ambientIntensity} />
          <directionalLight
            position={[10, 15, 10]}
            intensity={keyIntensity}
            castShadow
          />
          <directionalLight
            position={[-10, -5, -10]}
            intensity={fillIntensity}
          />

          {showGrid && <gridHelper args={[50, 50]} position={[0, 0, 0]} />}

          <EffectComposer>
            {enableToneMapping && <ToneMapping />}
            <N8AO aoRadius={aoRadius} intensity={aoIntensity} />
          </EffectComposer>

          <Preload all />
          {renderOrbitControls()}
        </Canvas>

        {levaPanel}
        {instructions}
        {isFS && (
          <div className="absolute top-4 left-4 text-white">
            <h2 className="text-xl font-semibold">Void Scene</h2>
            <p className="mt-1 text-xs text-chrome-500">Minimal light rig</p>
          </div>
        )}
      </div>
    );
  }

  return (
    <div ref={wrapperRef} className={`${baseClasses} ${layoutClasses}`}>
      <Canvas
        ref={canvasRef}
        camera={{ position: [0, 4, 12], fov: 75 }}
        gl={{ antialias: true, alpha: true }}
        className="h-full w-full"
      >
        <SceneContent
          modelUrl={modelUrl}
          showPlaceholder={showPlaceholder}
          sceneMode={sceneMode}
          environmentPreset={environmentPreset}
          ambientIntensity={ambientIntensity}
          keyIntensity={keyIntensity}
          fillIntensity={fillIntensity}
          showGrid={showGrid}
          showAxes={showAxes}
          enableToneMapping={enableToneMapping}
          aoRadius={aoRadius}
          aoIntensity={aoIntensity}
          contactShadows={contactShadows}
          onModelLoad={() => {
            // Reset auto-rotate after model loads
            if (orbitControlsRef.current) {
              orbitControlsRef.current.autoRotate = autoRotate;
            }
          }}
        />

        {renderOrbitControls()}
      </Canvas>

      {levaPanel}
      {instructions}

      {isFS && (
        <div className="absolute top-4 left-4 text-white">
          <h2 className="text-xl font-semibold">{modelName}</h2>
          <p className="mt-1 text-xs text-chrome-500">Interactive 3D model</p>
        </div>
      )}
    </div>
  );
}
