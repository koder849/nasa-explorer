import { useEffect, useMemo, useState } from "react";
import api from "../lib/api";

const formatEpicUrl = (item) => {
  const date = item.date.split(" ")[0];
  const [year, month, day] = date.split("-");
  return `https://epic.gsfc.nasa.gov/archive/natural/${year}/${month}/${day}/jpg/${item.image}.jpg`;
};

export default function Earth() {
  const [date, setDate] = useState("");
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let ignore = false;
    const fetchImages = async () => {
      setLoading(true);
      setError("");
      try {
        const params = date ? { date } : undefined;
        const response = await api.get("/earth/epic", { params });
        if (!ignore) {
          if (Array.isArray(response.data)) {
            setImages(response.data.slice(0, 6));
          } else if (response.data?.error) {
            throw new Error(response.data.error);
          } else {
            setImages([]);
          }
        }
      } catch (err) {
        if (!ignore) setError(err.message);
      } finally {
        if (!ignore) setLoading(false);
      }
    };
    fetchImages();
    return () => {
      ignore = true;
    };
  }, [date]);

  const stats = useMemo(
    () => [
      { label: "Snapshots", value: images.length },
      { label: "Date filter", value: date || "Latest" },
      { label: "Cadence", value: "~2 hrs" },
    ],
    [images.length, date]
  );

  return (
    <div className="space-y-6">
      <section className="rounded-3xl border border-white/10 bg-gradient-to-br from-emerald-500/10 via-slate-900/70 to-slate-900/30 p-6 shadow-2xl shadow-emerald-500/10">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="space-y-3">
            <p className="text-xs uppercase tracking-[0.4em] text-emerald-200/80">DSCOVR • EPIC</p>
            <h2 className="text-3xl font-semibold text-white">Earth in natural color</h2>
            <p className="text-sm text-slate-300">
              EPIC watches our planet from a million miles away. Filter by date to relive specific atmospheric events or leave it
              empty for the freshest view.
            </p>
          </div>
          <label className="text-sm text-slate-300">
            <span className="mb-2 block text-xs uppercase tracking-[0.3em] text-slate-400">Filter by date</span>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full rounded-2xl border border-white/15 bg-slate-950/70 px-4 py-2 text-white outline-none transition focus:border-emerald-400/60"
            />
          </label>
        </div>
        <div className="mt-6 grid gap-4 text-sm text-slate-200 sm:grid-cols-3">
          {stats.map((stat) => (
            <div key={stat.label} className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-center">
              <div className="text-2xl font-semibold text-white">{stat.value}</div>
              <p className="text-xs uppercase tracking-[0.3em] text-slate-400">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {loading && (
        <div className="rounded-3xl border border-white/10 bg-slate-900/70 p-6 text-center text-sm text-slate-300">
          Syncing with DSCOVR...
        </div>
      )}

      {error && !loading && (
        <div className="rounded-3xl border border-rose-500/40 bg-rose-950/40 p-4 text-sm text-rose-100">{error}</div>
      )}

      {!loading && !error && (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
          {images.length ? (
            images.map((item) => {
              const url = formatEpicUrl(item);
              const lat = item.centroid_coordinates?.lat;
              const latDisplay = typeof lat === "number" ? lat.toFixed(2) : "N/A";

              return (
                <article
                  key={item.identifier}
                  className="rounded-3xl border border-white/10 bg-slate-900/60 shadow-lg shadow-black/20 transition hover:-translate-y-1 hover:border-emerald-300/40"
                >
                  <div className="relative h-64 overflow-hidden rounded-3xl">
                    <img src={url} alt={item.caption} className="h-full w-full object-cover" loading="lazy" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    <p className="absolute bottom-3 left-4 rounded-full border border-white/20 px-3 py-1 text-xs uppercase tracking-[0.3em] text-white">
                      {item.date}
                    </p>
                  </div>
                  <div className="space-y-2 p-5 text-sm">
                    <h3 className="text-lg font-semibold text-white">{item.caption}</h3>
                    <p className="text-slate-300">Centroid latitude: {latDisplay}°</p>
                    <a
                      href={url}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-300 transition hover:text-emerald-200"
                    >
                      Download full image →
                    </a>
                  </div>
                </article>
              );
            })
          ) : (
            <div className="rounded-3xl border border-dashed border-white/20 p-8 text-center text-slate-400">
              No EPIC imagery for that date. Try clearing the filter to see the most recent captures.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
