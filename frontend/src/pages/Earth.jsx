import { useMemo, useState } from "react";
import { useEarth } from "../lib/hooks/useEarth";
import ApiDeprecatedWarning from "../components/ApiDeprecatedWarning";

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
      <section className="panel border border-slate-200 bg-white p-6">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-slate-500">DSCOVR • EPIC</p>
            <h2 className="mt-2 text-2xl font-semibold text-slate-900">Earth in natural color</h2>
            <p className="mt-2 text-sm text-slate-600">
              EPIC monitors Earth from L1. Select a date for historical weather or leave blank for the latest capture.
            </p>
          </div>
          <label className="text-sm text-slate-700">
            <span className="mb-2 block text-xs uppercase tracking-[0.3em] text-slate-500">Filter by date</span>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2 text-slate-900 outline-none focus:border-indigo-400"
            />
          </label>
        </div>
        <div className="mt-6 grid gap-4 text-sm text-slate-900 sm:grid-cols-3">
          {stats.map((stat) => (
            <div key={stat.label} className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-center">
              <p className="text-2xl font-semibold">{stat.value}</p>
              <p className="text-xs uppercase tracking-[0.3em] text-slate-500">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {loading && (
        <div className="panel border border-slate-200 bg-white p-6 text-center text-sm text-slate-600">Syncing with DSCOVR…</div>
      )}

      {error && !loading && error.message === "ARCHIVED" && (
        <ApiDeprecatedWarning
          apiName="Earth EPIC"
          message="The Earth EPIC API has been archived by NASA and is no longer available. The data has been migrated to Earthdata GIBS API."
          alternativeUrl="https://earthdata.nasa.gov/eosdis/gibs"
        />
      )}

      {error && !loading && error.message !== "ARCHIVED" && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error?.message}</div>
      )}

      {!loading && !error && (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
          {images.length ? (
            images.map((item) => {
              const url = item.url;
              const lat = item.centroid_coordinates?.lat;
              const latDisplay =
                typeof lat === "number" ? `${lat.toFixed(2)}°` : "N/A";

              return (
                <article key={item.identifier} className="neon-border rounded-2xl bg-white">
                  <div className="relative justify-self-center h-110 w-110 overflow-hidden">
                    <img src={url} alt={item.caption} className="h-full w-full object-cover" loading="lazy" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    <p className="absolute bottom-3 left-4 rounded-full border border-white/50 px-3 py-1 text-xs uppercase tracking-[0.3em] text-white">
                      {item.date}
                    </p>
                  </div>
                  <div className="space-y-2 border-t border-slate-100 p-4 text-sm">
                    <p className="font-semibold text-slate-900">{item.caption}</p>
                    <p className="text-slate-600">Centroid latitude: {latDisplay}</p>
                    <a href={url} target="_blank" rel="noreferrer" className="text-xs font-semibold text-indigo-600">
                      Download full image →
                    </a>
                  </div>
                </article>
              );
            })
          ) : (
            <div className="rounded-2xl border border-dashed border-slate-200 p-8 text-center text-slate-500">
              No EPIC imagery for that date. Clear the filter to see the latest capture.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
