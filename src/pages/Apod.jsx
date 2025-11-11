import { useMemo, useState } from "react";
import { useApod } from "../lib/hooks/useApod";

const today = new Date().toISOString().split("T")[0];

export default function APOD() {
  const [date, setDate] = useState("");
  const { data: apod, isPending: loading, error } = useApod(date);

  const infoList = useMemo(
    () => [
      { label: "Date", value: apod?.date ?? today },
      { label: "Credit", value: apod?.copyright || "NASA / ESA" },
      { label: "Media", value: apod?.media_type || "image" },
    ],
    [apod]
  );

  return (
    <div className="space-y-6">
      {/* Disclaimer Section */}
      <div className="border-l-4 border-amber-500 bg-amber-50 p-4 rounded-lg">
        <div className="flex gap-3">
          <span className="text-2xl shrink-0">⚠️</span>
          <div className="flex-1">
            <p className="font-semibold text-amber-900">API Status</p>
            <p className="text-sm text-amber-800 mt-1">
              This API may be rate-limited or archived by NASA. If you encounter errors, 
              <a 
                href="https://apod.nasa.gov/apod/archivepixFull.html" 
                target="_blank" 
                rel="noreferrer"
                className="font-semibold underline hover:text-amber-900 ml-1"
              >
                visit the official APOD archive →
              </a>
            </p>
          </div>
        </div>
      </div>

      <section className="panel border border-slate-200 bg-white p-6">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-slate-500">APOD</p>
            <h2 className="mt-2 text-2xl font-semibold text-slate-900">
              Astronomy Picture of the Day
            </h2>
            <p className="mt-2 text-sm text-slate-600">
              Explore NASA&apos;s daily highlight with full context, credits, and HD downloads.
            </p>
          </div>
          <label className="text-sm text-slate-700">
            <span className="mb-2 block text-xs uppercase tracking-[0.3em] text-slate-500">
              Choose a date
            </span>
            <input
              type="date"
              max={today}
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2 text-slate-900 outline-none focus:border-indigo-400"
            />
          </label>
        </div>
      </section>

      {loading && (
        <div className="panel border border-slate-200 bg-white p-6 text-center text-sm text-slate-600">
          Fetching today&apos;s postcard…
        </div>
      )}

      {error && !loading && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error?.message}
        </div>
      )}

      {!loading && apod && !error && (
        <div className="grid gap-6 lg:grid-cols-[1.2fr,0.8fr]">
          <article className="neon-border rounded-2xl bg-white">
            <div className="relative">
              {apod.media_type === "image" ? (
                <img src={apod.url} alt={apod.title} className="w-full max-h-[600px] object-cover" loading="lazy" />
              ) : (
                <iframe
                  src={apod.url}
                  title={apod.title}
                  className="aspect-video w-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              )}
              {apod.hdurl && (
                <a
                  href={apod.hdurl}
                  target="_blank"
                  rel="noreferrer"
                  className="absolute right-4 top-4 rounded-full border border-white/70 bg-white/90 px-4 py-2 text-sm font-semibold text-slate-900"
                >
                  HD ↗
                </a>
              )}
            </div>
            <div className="space-y-3 border-t border-slate-100 p-5">
              <h3 className="text-xl font-semibold text-slate-900">{apod.title}</h3>
              <p className="text-sm text-slate-600">{apod.explanation}</p>
            </div>
          </article>

          <aside className="panel border border-slate-200 bg-white p-5">
            <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Details</p>
            <dl className="mt-4 space-y-3 text-sm text-slate-800">
              {infoList.map((info) => (
                <div key={info.label} className="rounded-xl border border-slate-100 bg-slate-50 px-4 py-3">
                  <dt className="text-xs uppercase tracking-[0.3em] text-slate-500">{info.label}</dt>
                  <dd className="mt-1 text-slate-900">{info.value}</dd>
                </div>
              ))}
            </dl>
          </aside>
        </div>
      )}
    </div>
  );
}
