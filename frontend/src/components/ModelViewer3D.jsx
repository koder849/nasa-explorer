import { useEffect, useState } from "react";

export default function ModelViewer3D({ model }) {
  const [autoRotate, setAutoRotate] = useState(true);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const handleChange = () => setAutoRotate(!query.matches);
    handleChange();
    query.addEventListener("change", handleChange);
    return () => query.removeEventListener("change", handleChange);
  }, []);

  return (
    <div className="w-full h-full flex flex-col">
      <div className="flex-1 overflow-hidden">
        <model-viewer
          src={model.url}
          alt={model.description}
          camera-controls
          ar
          ar-modes="webxr scene-viewer quick-look"
          shadow-intensity="1"
          exposure="0.8"
          style={{ width: "100%", height: "100%" }}
          auto-rotate={autoRotate ? true : undefined}
        >
          {model.hotspots?.map((hotspot) => (
            <button
              key={hotspot.slot}
              slot={hotspot.slot}
              data-position={hotspot.position}
              data-normal={hotspot.normal}
              className="rounded-full border border-white/70 bg-black/50 px-3 py-1 text-xs font-semibold text-white"
            >
              {hotspot.label}
            </button>
          ))}
        </model-viewer>
      </div>
    </div>
  );
}
