import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

export default function ModelViewer({ modelUrl, modelName }) {
  const containerRef = useRef(null);
  const rendererRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [autoRotate, setAutoRotate] = useState(true);

  useEffect(() => {
    if (!containerRef.current || !modelUrl) return;

    setLoading(true);
    setError(null);

    let scene, camera, renderer, controls, animationId;

    try {
      // Scene setup
      scene = new THREE.Scene();
      scene.background = new THREE.Color(0x0a0e27);

      // Camera
      const width = containerRef.current.clientWidth;
      const height = containerRef.current.clientHeight;
      camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 10000);
      camera.position.z = 8;
      camera.position.y = 2;

      // Renderer
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      renderer.setSize(width, height);
      renderer.setPixelRatio(window.devicePixelRatio);
      renderer.shadowMap.enabled = true;
      renderer.shadowMap.type = THREE.PCFShadowShadowMap;
      containerRef.current.appendChild(renderer.domElement);
      rendererRef.current = renderer;

      // Lighting
      const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
      scene.add(ambientLight);

      const dirLight1 = new THREE.DirectionalLight(0xffffff, 1.2);
      dirLight1.position.set(10, 10, 10);
      dirLight1.castShadow = true;
      dirLight1.shadow.camera.left = -50;
      dirLight1.shadow.camera.right = 50;
      dirLight1.shadow.camera.top = 50;
      dirLight1.shadow.camera.bottom = -50;
      scene.add(dirLight1);

      const dirLight2 = new THREE.DirectionalLight(0xffffff, 0.6);
      dirLight2.position.set(-10, -10, 5);
      scene.add(dirLight2);

      // Add a ground plane for reference
      const gridHelper = new THREE.GridHelper(20, 20, 0x444444, 0x222222);
      scene.add(gridHelper);

      // Add axes helper to see orientation
      const axesHelper = new THREE.AxesHelper(5);
      scene.add(axesHelper);

      // Add a TEST BOX to verify rendering works
      const testGeometry = new THREE.BoxGeometry(2, 2, 2);
      const testMaterial = new THREE.MeshPhongMaterial({ 
        color: 0x00ff00,
        emissive: 0x00aa00,
      });
      const testBox = new THREE.Mesh(testGeometry, testMaterial);
      testBox.position.set(0, 0, 0);
      scene.add(testBox);
      console.log('Test box added to scene');

      // Load model
      const loader = new GLTFLoader();
      loader.load(
        modelUrl,
        (gltf) => {
          const model = gltf.scene;
          
          // Make sure to traverse and find all meshes
          let hasVisibleMesh = false;
          const defaultMaterial = new THREE.MeshPhongMaterial({
            color: 0x888888,
            side: THREE.DoubleSide,
            flatShading: false,
            wireframe: false,
            emissive: 0x111111,
          });

          model.traverse((node) => {
            if (node.isMesh) {
              node.visible = true;
              node.castShadow = true;
              node.receiveShadow = true;
              
              // Fix materials - ensure they're visible
              if (!node.material) {
                // If no material, use default
                node.material = defaultMaterial.clone();
              } else if (Array.isArray(node.material)) {
                node.material.forEach((mat) => {
                  mat.side = THREE.DoubleSide;
                  mat.wireframe = false;
                  mat.transparent = false;
                  mat.opacity = 1;
                  mat.emissiveIntensity = 0.1;
                });
              } else {
                node.material.side = THREE.DoubleSide;
                node.material.wireframe = false;
                node.material.transparent = false;
                node.material.opacity = 1;
                if (node.material.emissiveIntensity !== undefined) {
                  node.material.emissiveIntensity = 0.1;
                }
              }
              hasVisibleMesh = true;
            }
          });

          console.log('Has visible mesh:', hasVisibleMesh);

          scene.add(model);

          // Debug: Log model info
          console.log('Model loaded:', modelName);
          console.log('Model children:', model.children.length);

          // Auto-scale and center model
          const box = new THREE.Box3().setFromObject(model);
          const size = box.getSize(new THREE.Vector3());
          const center = box.getCenter(new THREE.Vector3());

          console.log('Model size:', size);
          console.log('Model center:', center);

          // Check if box has valid bounds
          const isBoxValid = size.x !== 0 && size.y !== 0 && size.z !== 0;
          console.log('Box valid:', isBoxValid);

          if (!isBoxValid) {
            console.error('Invalid bounding box - model may be empty');
            setError('Model has no visible geometry');
            setLoading(false);
            return;
          }

          // Move model to origin
          model.position.sub(center);

          const maxDim = Math.max(size.x, size.y, size.z);
          console.log('Max dimension:', maxDim);

          // If model is too small or too large, adjust scale
          let scale = 1;
          if (maxDim > 0.01) {
            scale = 5 / maxDim;
          }
          
          model.scale.multiplyScalar(scale);
          console.log('Applied scale:', scale);

          // Position camera
          const distance = Math.max(10, maxDim * 3);
          camera.position.set(0, distance * 0.5, distance);
          camera.lookAt(0, 0, 0);
          console.log('Camera distance:', distance);

          // Update orbit controls
          controls.target.set(0, 0, 0);
          controls.update();

          setLoading(false);
        },
        (progress) => {
          // Track loading progress
          const percent = (progress.loaded / progress.total) * 100;
          console.log('Loading:', percent + '%');
        },
        (err) => {
          setError('Model not found or failed to load. Try another model.');
          setLoading(false);
          console.error('GLTFLoader error:', err);
        }
      );

      // Orbit controls
      controls = new OrbitControls(camera, renderer.domElement);
      controls.enableDamping = true;
      controls.dampingFactor = 0.08;
      controls.autoRotate = autoRotate;
      controls.autoRotateSpeed = 4;
      controls.enableZoom = true;
      controls.zoomSpeed = 1.5;
      controls.minDistance = 1;
      controls.maxDistance = 1000;
      controls.enablePan = true;
      controls.panSpeed = 0.8;
      controls.target.set(0, 0, 0);
      controls.update();

      // Animation loop
      const animate = () => {
        animationId = requestAnimationFrame(animate);
        controls.autoRotate = autoRotate;
        controls.update();
        renderer.clear();
        renderer.render(scene, camera);
      };
      animate();

      // Handle resize
      const handleResize = () => {
        if (!containerRef.current) return;
        const newWidth = containerRef.current.clientWidth;
        const newHeight = containerRef.current.clientHeight;
        camera.aspect = newWidth / newHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(newWidth, newHeight);
      };

      window.addEventListener('resize', handleResize);

      // Cleanup
      return () => {
        window.removeEventListener('resize', handleResize);
        cancelAnimationFrame(animationId);
        renderer.dispose();
        if (containerRef.current && renderer.domElement.parentNode === containerRef.current) {
          containerRef.current.removeChild(renderer.domElement);
        }
      };
    } catch (err) {
      setError('Error initializing 3D viewer');
      setLoading(false);
      console.error('ModelViewer error:', err);
    }
  }, [modelUrl]);

  return (
    <div className="relative w-full h-full bg-void-900 rounded-3xl overflow-hidden border border-white/10">
      <div ref={containerRef} className="w-full h-full" />

      {/* Loading indicator */}
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-ion-400 mb-4" />
            <p className="text-chrome-300">Loading {modelName}...</p>
          </div>
        </div>
      )}

      {/* Error state */}
      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/70">
          <div className="text-center">
            <p className="text-red-100 mb-2">⚠️ {error}</p>
            <p className="text-chrome-400 text-sm">Try another model</p>
          </div>
        </div>
      )}

      {/* Controls */}
      <div className="absolute top-4 right-4 flex gap-2">
        <button
          onClick={() => setAutoRotate(!autoRotate)}
          className={`px-3 py-2 rounded-lg text-sm font-medium transition ${
            autoRotate
              ? 'bg-ion-400/20 border border-ion-400 text-ion-100'
              : 'bg-white/5 border border-white/10 text-chrome-400 hover:border-white/20'
          }`}
        >
          {autoRotate ? '⏸ Rotating' : '▶ Auto-Rotate'}
        </button>
      </div>

      {/* Help text */}
      <div className="absolute bottom-4 left-4 text-xs text-chrome-500 pointer-events-none">
        Drag to rotate • Scroll to zoom • Right-click to pan
      </div>
    </div>
  );
}
