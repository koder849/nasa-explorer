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
      <section className="panel border border-white/10 p-5">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="space-y-2">
            <p className="text-xs uppercase tracking-[0.4em] text-chrome-500">APOD</p>
            <h2 className="text-2xl font-semibold text-white">Astronomy Picture of the Day</h2>
            <p className="text-sm text-chrome-300">
              Dial back in time to review NASA&apos;s daily highlight. Every card includes context, credit, and HD references inside a
              monochrome shadcn layout.
            </p>
          </div>
          <label className="text-sm text-chrome-200">
            <span className="mb-2 block text-xs uppercase tracking-[0.3em] text-chrome-500">Choose a date</span>
            <input
              type="date"
              max={today}
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full rounded-2xl border border-white/10 bg-void-900 px-4 py-2 text-white outline-none transition focus:border-ion-400"
            />
          </label>
        </div>
      </section>

      {loading && (
        <div className="panel border border-white/10 p-6 text-center text-sm text-chrome-300">Fetching today&apos;s postcard…</div>
      )}

      {error && !loading && (
        <div className="rounded-2xl border border-red-400/40 bg-red-500/10 p-4 text-sm text-red-100">{error?.message}</div>
      )}

      {!loading && apod && !error && (
        <div className="grid gap-6 lg:grid-cols-[1.2fr,0.8fr]">
          <article className="neon-border overflow-hidden rounded-3xl border border-white/10 bg-void-900">
            <div className="relative">
              {apod.media_type === "image" ? (
                <img src={apod.url} alt={apod.title} className="max-h-[640px] w-full object-cover" loading="lazy" />
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
                  className="absolute right-4 top-4 rounded-full border border-white/30 bg-void-900/80 px-3 py-1 text-xs font-semibold text-white"
                >
                  HD ↗
                </a>
              )}
            </div>
            <div className="space-y-3 border-t border-white/5 p-5">
              <h3 className="text-xl font-semibold text-white">{apod.title}</h3>
              <p className="text-sm text-chrome-300">{apod.explanation}</p>
            </div>
          </article>

          <aside className="panel border border-white/10 p-5">
            <p className="text-xs uppercase tracking-[0.4em] text-chrome-500">Details</p>
            <dl className="mt-4 space-y-3 text-sm text-white">
              {infoList.map((info) => (
                <div key={info.label} className="rounded-2xl border border-white/5 bg-white/5 px-4 py-3">
                  <dt className="text-xs uppercase tracking-[0.3em] text-chrome-500">{info.label}</dt>
                  <dd className="mt-1 text-chrome-100">{info.value}</dd>
                </div>
              ))}
            </dl>
          </aside>
        </div>
      )}
    </div>
  );
}
