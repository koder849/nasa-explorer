import { useEffect, useMemo, useState } from "react";
import api from "../lib/api";

const cameraOptions = [
  { value: "", label: "All cameras" },
  { value: "FHAZ", label: "Front Hazard" },
  { value: "RHAZ", label: "Rear Hazard" },
  { value: "NAVCAM", label: "Navigation" },
  { value: "MAST", label: "Mastcam" },
  { value: "CHEMCAM", label: "ChemCam" },
];

export default function Mars() {
  const [solInput, setSolInput] = useState("1000");
  const [camera, setCamera] = useState("");
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const sol = useMemo(() => {
    if (!solInput.trim()) return 1000;
    const parsed = Number(solInput);
    return Number.isFinite(parsed) && parsed >= 0 ? parsed : 1000;
  }, [solInput]);

  useEffect(() => {
    let ignore = false;
    const fetchPhotos = async () => {
      setLoading(true);
      setError("");
      try {
        const params = { sol };
        if (camera) params.camera = camera;
        const response = await api.get("/mars/photos", { params });
        if (!ignore) {
          if (Array.isArray(response.data)) {
            setPhotos(response.data);
          } else if (Array.isArray(response.data?.photos)) {
            setPhotos(response.data.photos);
          } else if (response.data?.error || response.data?.message) {
            setError(response.data.error || response.data.message);
            setPhotos([]);
          } else {
            setPhotos([]);
          }
        }
      } catch (err) {
        if (!ignore) setError(err.message);
      } finally {
        if (!ignore) setLoading(false);
      }
    };
    fetchPhotos();
    return () => {
      ignore = true;
    };
  }, [sol, camera]);

  const statCards = [
    { label: "Selected sol", value: sol },
    { label: "Camera", value: camera || "All instruments" },
    { label: "Photos returned", value: photos.length },
  ];

  return (
    <div className="space-y-6">
      <section className="rounded-3xl border border-white/10 bg-gradient-to-br from-slate-900 via-slate-900/70 to-slate-900/30 p-6 shadow-xl shadow-pink-500/10">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="space-y-3">
            <p className="text-xs uppercase tracking-[0.4em] text-pink-200/70">Curiosity rover</p>
            <h2 className="text-3xl font-semibold text-white">Mars Rover Photos</h2>
            <p className="text-sm text-slate-300">
              Query raw imagery from Curiosity&apos;s instruments by Martian sol and camera—styled with the same shadcn-inspired
              polish across mobile and desktop.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="text-sm text-slate-300">
              <span className="mb-2 block text-xs uppercase tracking-[0.3em] text-slate-400">Sol (Martian day)</span>
              <input
                type="number"
                min="0"
                inputMode="numeric"
                value={solInput}
                onChange={(e) => setSolInput(e.target.value)}
                className="w-full rounded-2xl border border-white/15 bg-slate-950/70 px-4 py-2 text-white outline-none transition focus:border-pink-400/60"
              />
            </label>
            <label className="text-sm text-slate-300">
              <span className="mb-2 block text-xs uppercase tracking-[0.3em] text-slate-400">Camera</span>
              <select
                value={camera}
                onChange={(e) => setCamera(e.target.value)}
                className="w-full rounded-2xl border border-white/15 bg-slate-950/70 px-4 py-2 text-white outline-none transition focus:border-pink-400/60"
              >
                {cameraOptions.map((option) => (
                  <option key={option.value || "all"} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </div>
        <div className="mt-6 grid gap-4 text-sm text-slate-200 sm:grid-cols-3">
          {statCards.map((stat) => (
            <div key={stat.label} className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-center">
              <div className="text-2xl font-semibold text-white">{stat.value}</div>
              <p className="text-xs uppercase tracking-[0.3em] text-slate-400">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {loading && (
        <div className="rounded-3xl border border-white/10 bg-slate-900/70 p-6 text-center text-sm text-slate-300">
          Downloading imagery from sol {sol}...
        </div>
      )}

      {error && !loading && (
        <div className="rounded-3xl border border-rose-500/40 bg-rose-950/40 p-4 text-sm text-rose-100">{error}</div>
      )}

      {!loading && !error && (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {photos.length ? (
            photos.map((photo) => (
              <article
                key={photo.id}
                className="group overflow-hidden rounded-3xl border border-white/10 bg-slate-900/60 shadow-lg shadow-black/30 transition hover:-translate-y-1 hover:border-pink-300/40"
              >
                <div className="relative h-60 w-full overflow-hidden">
                  <img src={photo.img_src} alt={photo.camera?.full_name} className="h-full w-full object-cover" loading="lazy" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-70" />
                  <div className="absolute bottom-3 left-3 rounded-full border border-white/20 px-3 py-1 text-xs uppercase tracking-[0.3em] text-slate-100">
                    {photo.camera?.name}
                  </div>
                </div>
                <div className="space-y-2 p-5 text-sm">
                  <div className="flex items-center justify-between text-xs uppercase tracking-[0.2em] text-slate-400">
                    <span>Sol {photo.sol}</span>
                    <span>{photo.earth_date}</span>
                  </div>
                  <div className="text-base font-semibold text-white">{photo.camera?.full_name}</div>
                  <p className="text-slate-300">Rover: {photo.rover?.name}</p>
                </div>
              </article>
            ))
          ) : (
            <div className="rounded-3xl border border-dashed border-white/20 p-8 text-center text-slate-400">
              No photos for this sol/camera combination. Try another sol or reset the filters.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
