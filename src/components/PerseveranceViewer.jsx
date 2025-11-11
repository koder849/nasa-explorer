import { useEffect, useRef } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

export default function PerseveranceViewer() {
  const containerRef = useRef(null);
  const rendererRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf3f4f6);
    scene.fog = new THREE.Fog(0xf3f4f6, 100, 1000);

    // Camera setup
    const camera = new THREE.PerspectiveCamera(
      75,
      containerRef.current.clientWidth / containerRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.set(0, 5, 8);
    camera.lookAt(0, 0, 0);

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(
      containerRef.current.clientWidth,
      containerRef.current.clientHeight
    );
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.shadowMap.enabled = true;
    containerRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(10, 20, 10);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 2048;
    directionalLight.shadow.mapSize.height = 2048;
    scene.add(directionalLight);

    // Ground plane for reference
    const groundGeometry = new THREE.PlaneGeometry(20, 20);
    const groundMaterial = new THREE.ShadowMaterial({ opacity: 0.3 });
    const ground = new THREE.Mesh(groundGeometry, groundMaterial);
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -3;
    ground.receiveShadow = true;
    scene.add(ground);

    // Load the Perseverance rover model
    const loader = new GLTFLoader();
    loader.load(
      "https://raw.githubusercontent.com/nasa/NASA-3D-Resources/master/3D%20Models/Mars%202020%20Perseverance%20Rover/Mars%202020%20Perseverance%20Rover.glb",
      (gltf) => {
        const model = gltf.scene;
        model.castShadow = true;
        model.receiveShadow = true;

        // Traverse and set shadow properties
        model.traverse((node) => {
          if (node.isMesh) {
            node.castShadow = true;
            node.receiveShadow = true;
          }
        });

        scene.add(model);
      },
      (progress) => {
        // Loading progress
        const percentComplete = (progress.loaded / progress.total) * 100;
        if (containerRef.current) {
          const loadingElement = containerRef.current.querySelector(".loading");
          if (loadingElement) {
            loadingElement.textContent = `Loading ${Math.round(percentComplete)}%`;
          }
        }
      },
      (error) => {
        console.error("Failed to load model:", error);
        if (containerRef.current) {
          containerRef.current.innerHTML = `
            <div class="flex items-center justify-center w-full h-full bg-slate-100 rounded-lg">
              <div class="text-center text-slate-600">
                <p class="font-semibold">Unable to load 3D model</p>
                <p class="text-sm">Please check your internet connection</p>
              </div>
            </div>
          `;
        }
      }
    );

    // Mouse controls
    let isDragging = false;
    let previousMousePosition = { x: 0, y: 0 };
    let rotation = { x: 0, y: 0 };

    renderer.domElement.addEventListener("mousedown", (e) => {
      isDragging = true;
      previousMousePosition = { x: e.clientX, y: e.clientY };
    });

    renderer.domElement.addEventListener("mousemove", (e) => {
      if (isDragging) {
        const deltaX = e.clientX - previousMousePosition.x;
        const deltaY = e.clientY - previousMousePosition.y;

        rotation.y += deltaX * 0.005;
        rotation.x += deltaY * 0.005;

        previousMousePosition = { x: e.clientX, y: e.clientY };
      }
    });

    renderer.domElement.addEventListener("mouseup", () => {
      isDragging = false;
    });

    renderer.domElement.addEventListener("wheel", (e) => {
      e.preventDefault();
      camera.position.z += e.deltaY * 0.01;
      camera.position.z = Math.max(5, Math.min(30, camera.position.z));
    });

    // Animation loop
    let animationFrameId;
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      // Apply rotation with easing
      camera.position.x = Math.sin(rotation.y) * 8 * Math.cos(rotation.x);
      camera.position.y = 5 + Math.sin(rotation.x) * 3;
      camera.position.z = Math.cos(rotation.y) * 8 * Math.cos(rotation.x);
      camera.lookAt(0, 0, 0);

      renderer.render(scene, camera);
    };
    animate();

    // Handle window resize
    const handleResize = () => {
      if (!containerRef.current) return;
      const width = containerRef.current.clientWidth;
      const height = containerRef.current.clientHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    window.addEventListener("resize", handleResize);

    // Cleanup
    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
      renderer.dispose();
      if (containerRef.current && renderer.domElement.parentNode === containerRef.current) {
        containerRef.current.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div className="relative w-full h-full">
      <div
        ref={containerRef}
        className="w-full h-full bg-linear-to-b from-slate-100 to-slate-50"
        style={{ minHeight: "400px" }}
      />
      <div className="absolute top-4 right-4 bg-white/80 backdrop-blur px-3 py-2 rounded-lg text-xs text-slate-600">
        <p>🖱️ Drag to rotate | Scroll to zoom</p>
      </div>
    </div>
  );
}
