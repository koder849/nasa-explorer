import { useMemo, useState } from "react";
import { useMars } from "../lib/hooks/useMars";
import ApiDeprecatedWarning from "../components/ApiDeprecatedWarning";

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

  const sol = useMemo(() => {
    if (!solInput.trim()) return 1000;
    const parsed = Number(solInput);
    return Number.isFinite(parsed) && parsed >= 0 ? parsed : 1000;
  }, [solInput]);

  const { data: photos = [], isPending: loading, error } = useMars(sol, camera);

  const statCards = [
    { label: "Selected sol", value: sol },
    { label: "Camera", value: camera || "All instruments" },
    { label: "Photos", value: photos.length },
  ];

  return (
    <div className="space-y-6">
      <section className="panel border border-white/10 p-5">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="space-y-2">
            <p className="text-xs uppercase tracking-[0.4em] text-chrome-500">Curiosity Rover</p>
            <h2 className="text-2xl font-semibold text-white">Mars Rover Photos</h2>
            <p className="text-sm text-chrome-300">
              Pull sol-based imagery and filter by instrument. Data displays inside monochrome cards with subtle sci-fi glow.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="text-sm text-white">
              <span className="mb-2 block text-xs uppercase tracking-[0.3em] text-chrome-500">Sol (Martian day)</span>
              <input
                type="number"
                min="0"
                inputMode="numeric"
                value={solInput}
                onChange={(e) => setSolInput(e.target.value)}
                className="w-full rounded-2xl border border-white/10 bg-void-900 px-4 py-2 text-white outline-none transition focus:border-ion-400"
              />
            </label>
            <label className="text-sm text-white">
              <span className="mb-2 block text-xs uppercase tracking-[0.3em] text-chrome-500">Camera</span>
              <select
                value={camera}
                onChange={(e) => setCamera(e.target.value)}
                className="w-full rounded-2xl border border-white/10 bg-void-900 px-4 py-2 text-white outline-none transition focus:border-ion-400"
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
        <div className="mt-6 grid gap-4 text-sm text-white sm:grid-cols-3">
          {statCards.map((stat) => (
            <div key={stat.label} className="rounded-2xl border border-white/5 bg-white/5 px-4 py-3 text-center">
              <p className="text-2xl font-semibold">{stat.value}</p>
              <p className="text-xs uppercase tracking-[0.3em] text-chrome-500">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {loading && (
        <div className="panel border border-white/10 p-6 text-center text-sm text-chrome-300">
          Downloading imagery from sol {sol}…
        </div>
      )}

      {error && !loading && error.message === "ARCHIVED" && (
        <ApiDeprecatedWarning
          apiName="Mars Rover"
          message="The Mars Rover API has been archived by NASA and is no longer available. Historical rover data can be accessed through NASA's official archives."
          alternativeUrl="https://mars.nasa.gov/msl/home/"
        />
      )}

      {error && !loading && error.message !== "ARCHIVED" && (
        <div className="rounded-2xl border border-red-400/40 bg-red-500/10 p-4 text-sm text-red-100">{error?.message}</div>
      )}

      {!loading && !error && (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {photos.length ? (
            photos.map((photo) => (
              <article
                key={photo.id}
                className="neon-border overflow-hidden rounded-3xl border border-white/10 bg-void-900 shadow-lg shadow-black/40"
              >
                <div className="relative h-60 w-full overflow-hidden">
                  <img src={photo.img_src} alt={photo.camera?.full_name} className="h-full w-full object-cover" loading="lazy" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                  <div className="absolute bottom-3 left-3 rounded-full border border-white/30 px-3 py-1 text-xs uppercase tracking-[0.3em] text-white">
                    {photo.camera?.name}
                  </div>
                </div>
                <div className="space-y-2 border-t border-white/5 p-4 text-sm">
                  <div className="flex items-center justify-between text-xs uppercase tracking-[0.2em] text-chrome-500">
                    <span>Sol {photo.sol}</span>
                    <span>{photo.earth_date}</span>
                  </div>
                  <p className="text-base font-semibold text-white">{photo.camera?.full_name}</p>
                  <p className="text-chrome-300">Rover: {photo.rover?.name}</p>
                </div>
              </article>
            ))
          ) : (
            <div className="rounded-3xl border border-dashed border-white/20 p-8 text-center text-chrome-400">
              No photos for this sol/camera combination. Try another sol or reset the filters.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
