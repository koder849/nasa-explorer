import { Canvas, useThree } from "@react-three/fiber";
import {
  OrbitControls,
  useGLTF,
  Environment,
  Preload,
  Stars,
  ContactShadows,
} from "@react-three/drei";
import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { EffectComposer, ToneMapping, N8AO } from "@react-three/postprocessing";
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
  containerClassName = "rounded-2xl border border-slate-200 bg-slate-900 min-h-[420px]",
  forceFullScreen = false,
}) {
  const wrapperRef = useRef(null);
  const canvasRef = useRef();
  const orbitControlsRef = useRef();
  const [isFS, setIsFS] = useState(false);
  const controlsRef = useRef(null);
  const [controlsOpen, setControlsOpen] = useState(false);

  const [sceneMode, setSceneMode] = useState("model");
  const [environmentPreset, setEnvironmentPreset] = useState("none");
  const [showPlaceholder, setShowPlaceholder] = useState(false);
  const [showGrid, setShowGrid] = useState(false);
  const [showAxes, setShowAxes] = useState(false);

  const [autoRotate, setAutoRotate] = useState(false);
  const [autoRotateSpeed, setAutoRotateSpeed] = useState(2);
  const [zoomSpeed, setZoomSpeed] = useState(1.2);
  const [panSpeed, setPanSpeed] = useState(0.8);
  const [dampingFactor, setDampingFactor] = useState(0.08);

  const [ambientIntensity, setAmbientIntensity] = useState(0.9);
  const [keyIntensity, setKeyIntensity] = useState(1.4);
  const [fillIntensity, setFillIntensity] = useState(0.6);
  const [contactShadows, setContactShadows] = useState(true);

  const [aoRadius, setAoRadius] = useState(1.2);
  const [aoIntensity, setAoIntensity] = useState(0.6);
  const [enableToneMapping, setEnableToneMapping] = useState(true);

  useEffect(() => {
    if (onSceneChange) {
      onSceneChange(sceneMode);
    }
  }, [sceneMode, onSceneChange]);

  useEffect(() => {
    if (!controlsOpen) return;
    const handleClick = (event) => {
      if (
        controlsRef.current &&
        !controlsRef.current.contains(event.target) &&
        !event.target.closest("[data-viewer-controls-button]")
      ) {
        setControlsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [controlsOpen]);

  useEffect(() => {
    if (orbitControlsRef.current) {
      orbitControlsRef.current.autoRotate = autoRotate;
    }
  }, [autoRotate]);

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
    <div className="pointer-events-none absolute bottom-4 left-4 text-xs text-white/80">
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

  const ControlSlider = ({ label, value, min, max, step, onChange }) => {
    const precision = step < 1 ? 2 : 1;
    return (
      <label className="space-y-1">
        <div className="flex items-center justify-between text-[11px] uppercase tracking-[0.2em] text-slate-500">
          <span>{label}</span>
          <span className="text-slate-900">
            {typeof value === "number" ? value.toFixed(precision) : value}
          </span>
        </div>
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(event) => onChange(Number(event.target.value))}
          className="w-full accent-indigo-600"
        />
      </label>
    );
  };

  const handleRecenter = () => orbitControlsRef.current?.reset();

  const controlPanel = (
    <div className="absolute top-4 right-4 z-30 flex flex-col items-end gap-2 text-xs">
      <button
        type="button"
        data-viewer-controls-button
        onClick={() => setControlsOpen((prev) => !prev)}
        className="rounded-full border border-white/60 bg-black/60 px-3 py-1 font-semibold uppercase tracking-[0.3em] text-white backdrop-blur transition hover:border-white/80"
      >
        {controlsOpen ? "Hide controls" : "Viewer controls"}
      </button>
      {controlsOpen && (
        <div
          ref={controlsRef}
          className="w-72 rounded-2xl border border-slate-200 bg-white p-4 text-[13px] text-slate-800 shadow-2xl"
        >
          <div className="space-y-4">
            <div>
              <p className="text-[11px] uppercase tracking-[0.3em] text-slate-500">
                Scene
              </p>
              <select
                value={sceneMode}
                onChange={(event) => setSceneMode(event.target.value)}
                className="mt-2 w-full rounded-lg border border-slate-200 px-2 py-1 text-sm focus:border-indigo-500"
              >
                <option value="model">Model</option>
                <option value="water">Water</option>
                <option value="void">Void</option>
                <option value="starfield">Starfield</option>
                <option value="hangar">Hangar</option>
              </select>
              <select
                value={environmentPreset}
                onChange={(event) => setEnvironmentPreset(event.target.value)}
                className="mt-2 w-full rounded-lg border border-slate-200 px-2 py-1 text-sm focus:border-indigo-500"
              >
                <option value="none">No backdrop</option>
                <option value="sunset">Sunset</option>
                <option value="galaxy">Galaxy</option>
                <option value="sphere">Sphere</option>
              </select>
              <div className="mt-2 space-y-1 text-sm">
                {[
                  { label: "Grid", value: showGrid, setter: setShowGrid },
                  { label: "Axes", value: showAxes, setter: setShowAxes },
                  {
                    label: "Placeholder",
                    value: showPlaceholder,
                    setter: setShowPlaceholder,
                  },
                ].map((item) => (
                  <label
                    key={item.label}
                    className="flex items-center justify-between"
                  >
                    <span>{item.label}</span>
                    <input
                      type="checkbox"
                      checked={item.value}
                      onChange={(event) =>
                        item.setter(event.target.checked)
                      }
                      className="h-4 w-4 accent-indigo-600"
                    />
                  </label>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <p className="text-[11px] uppercase tracking-[0.3em] text-slate-500">
                Lighting
              </p>
              <ControlSlider
                label="Ambient"
                value={ambientIntensity}
                min={0}
                max={2}
                step={0.1}
                onChange={setAmbientIntensity}
              />
              <ControlSlider
                label="Key"
                value={keyIntensity}
                min={0}
                max={3}
                step={0.1}
                onChange={setKeyIntensity}
              />
              <ControlSlider
                label="Fill"
                value={fillIntensity}
                min={0}
                max={3}
                step={0.1}
                onChange={setFillIntensity}
              />
              <label className="flex items-center justify-between text-sm">
                <span>Contact shadow</span>
                <input
                  type="checkbox"
                  checked={contactShadows}
                  onChange={(event) =>
                    setContactShadows(event.target.checked)
                  }
                  className="h-4 w-4 accent-indigo-600"
                />
              </label>
            </div>

            <div className="space-y-3">
              <p className="text-[11px] uppercase tracking-[0.3em] text-slate-500">
                Camera
              </p>
              <label className="flex items-center justify-between text-sm">
                <span>Auto rotate</span>
                <input
                  type="checkbox"
                  checked={autoRotate}
                  onChange={(event) => setAutoRotate(event.target.checked)}
                  className="h-4 w-4 accent-indigo-600"
                />
              </label>
              <ControlSlider
                label="Rotate speed"
                value={autoRotateSpeed}
                min={0}
                max={10}
                step={0.5}
                onChange={setAutoRotateSpeed}
              />
              <ControlSlider
                label="Zoom"
                value={zoomSpeed}
                min={0.2}
                max={4}
                step={0.1}
                onChange={setZoomSpeed}
              />
              <ControlSlider
                label="Pan"
                value={panSpeed}
                min={0.1}
                max={2}
                step={0.1}
                onChange={setPanSpeed}
              />
              <ControlSlider
                label="Damping"
                value={dampingFactor}
                min={0.01}
                max={0.2}
                step={0.01}
                onChange={setDampingFactor}
              />
            </div>

            <div className="space-y-3">
              <p className="text-[11px] uppercase tracking-[0.3em] text-slate-500">
                Post
              </p>
              <ControlSlider
                label="AO radius"
                value={aoRadius}
                min={0}
                max={5}
                step={0.1}
                onChange={setAoRadius}
              />
              <ControlSlider
                label="AO intensity"
                value={aoIntensity}
                min={0}
                max={2}
                step={0.05}
                onChange={setAoIntensity}
              />
              <label className="flex items-center justify-between text-sm">
                <span>Tone mapping</span>
                <input
                  type="checkbox"
                  checked={enableToneMapping}
                  onChange={(event) =>
                    setEnableToneMapping(event.target.checked)
                  }
                  className="h-4 w-4 accent-indigo-600"
                />
              </label>
              <button
                type="button"
                onClick={handleRecenter}
                className="w-full rounded-full border border-slate-200 px-3 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-slate-800"
              >
                Recenter
              </button>
            </div>
          </div>
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

        {controlPanel}
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

        {controlPanel}
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

      {controlPanel}
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
