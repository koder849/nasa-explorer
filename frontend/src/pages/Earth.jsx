import { useMemo, useState } from "react";
import { useEarth } from "../lib/hooks/useEarth";

export default function Earth() {
  const [date, setDate] = useState("");
  const { data: images = [], isPending: loading, error } = useEarth(date);

  const stats = useMemo(
    () => [
      { label: "Frames", value: images.length },
      { label: "Date filter", value: date || "Latest" },
      { label: "Cadence", value: "~2 hrs" },
    ],
    [images.length, date]
  );

  return (
    <div className="space-y-6">
      <section className="panel border border-white/10 p-5">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="space-y-2">
            <p className="text-xs uppercase tracking-[0.4em] text-chrome-500">DSCOVR • EPIC</p>
            <h2 className="text-2xl font-semibold text-white">Earth in natural color</h2>
            <p className="text-sm text-chrome-300">
              EPIC monitors our planet from L1. Select a date to relive a specific atmospheric event or leave the filter empty for
              the freshest imagery.
            </p>
          </div>
          <label className="text-sm text-white">
            <span className="mb-2 block text-xs uppercase tracking-[0.3em] text-chrome-500">Filter by date</span>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full rounded-2xl border border-white/10 bg-void-900 px-4 py-2 text-white outline-none transition focus:border-ion-400"
            />
          </label>
        </div>
        <div className="mt-6 grid gap-4 text-sm text-white sm:grid-cols-3">
          {stats.map((stat) => (
            <div key={stat.label} className="rounded-2xl border border-white/5 bg-white/5 px-4 py-3 text-center">
              <p className="text-2xl font-semibold">{stat.value}</p>
              <p className="text-xs uppercase tracking-[0.3em] text-chrome-500">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {loading && (
        <div className="panel border border-white/10 p-6 text-center text-sm text-chrome-300">Syncing with DSCOVR…</div>
      )}

      {error && !loading && (
        <div className="rounded-2xl border border-red-400/40 bg-red-500/10 p-4 text-sm text-red-100">{error?.message}</div>
      )}

      {!loading && !error && (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
          {images.length ? (
            images.map((item) => {
              const url = item.url;
              const lat = item.centroid_coordinates?.lat;
              const latDisplay = typeof lat === "number" ? `${lat.toFixed(2)}°` : "N/A";

              return (
                <article
                  key={item.identifier}
                  className="neon-border rounded-3xl border border-white/10 bg-void-900 shadow-black/40 drop-shadow-lg"
                >
                  <div className="relative h-64 overflow-hidden rounded-3xl">
                    <img src={url} alt={item.caption} className="h-full w-full object-cover" loading="lazy" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                    <p className="absolute bottom-3 left-4 rounded-full border border-white/20 px-3 py-1 text-xs uppercase tracking-[0.3em] text-white">
                      {item.date}
                    </p>
                  </div>
                  <div className="space-y-2 border-t border-white/5 p-4 text-sm">
                    <h3 className="text-lg font-semibold text-white">{item.caption}</h3>
                    <p className="text-chrome-300">Centroid latitude: {latDisplay}</p>
                    <a href={url} target="_blank" rel="noreferrer" className="text-xs font-semibold text-white">
                      Download full image →
                    </a>
                  </div>
                </article>
              );
            })
          ) : (
            <div className="rounded-3xl border border-dashed border-white/20 p-8 text-center text-chrome-400">
              No EPIC imagery for that date. Clear the filter to see the latest capture.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
