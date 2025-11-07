import { useEffect, useMemo, useState } from "react";
import api from "../lib/api";

const today = new Date().toISOString().split("T")[0];

export default function APOD() {
  const [date, setDate] = useState("");
  const [apod, setApod] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let ignore = false;
    const fetchApod = async () => {
      setLoading(true);
      setError("");
      try {
        const params = date ? { date } : undefined;
        const response = await api.get("/apod", { params });
        if (!ignore) {
          if (response.data?.error) {
            throw new Error(response.data.error);
          }
          setApod(response.data);
        }
      } catch (err) {
        if (!ignore) setError(err.message);
      } finally {
        if (!ignore) setLoading(false);
      }
    };
    fetchApod();
    return () => {
      ignore = true;
    };
  }, [date]);

  const infoList = useMemo(
    () => [
      { label: "Date", value: apod?.date ?? today },
      { label: "Credit", value: apod?.copyright || "NASA / ESA" },
      { label: "Media type", value: apod?.media_type || "image" },
    ],
    [apod]
  );

  return (
    <div className="space-y-6">
      <section className="glass rounded-3xl p-6 shadow-2xl shadow-cyan-500/10">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="space-y-3">
            <p className="text-xs uppercase tracking-[0.4em] text-cyan-200/80">Daily highlight</p>
            <div className="space-y-3 text-white">
              <h2 className="text-3xl font-semibold">Astronomy Picture of the Day</h2>
              <p className="text-sm text-slate-300">
                Immerse yourself in NASA&apos;s curated snapshot. Each frame arrives with scientific context, credit, and HD
                download links—styled with shadcn-inspired motion.
              </p>
            </div>
          </div>
          <label className="text-sm text-slate-300">
            <span className="mb-2 block text-xs uppercase tracking-[0.3em] text-slate-400">Choose a date</span>
            <div className="relative">
              <input
                type="date"
                max={today}
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full rounded-2xl border border-white/15 bg-slate-900/70 px-4 py-2 text-white outline-none transition focus:border-cyan-400/60"
              />
              <span className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-xs text-slate-500">UTC</span>
            </div>
          </label>
        </div>
      </section>

      {loading && (
        <div className="rounded-3xl border border-white/10 bg-slate-900/70 p-8 text-center text-sm text-slate-300">
          Fetching today&apos;s cosmic postcard...
          <div className="mt-4 h-2 w-32 rounded-full bg-white/10">
            <div className="h-full w-1/2 rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 animate-pulse" />
          </div>
        </div>
      )}

      {error && !loading && (
        <div className="rounded-3xl border border-rose-500/40 bg-rose-950/40 p-4 text-sm text-rose-200">{error}</div>
      )}

      {!loading && apod && !error && (
        <div className="grid gap-6 lg:grid-cols-[1.3fr,0.7fr]">
          <article className="relative overflow-hidden rounded-3xl border border-white/10 bg-slate-900/60 shadow-2xl shadow-black/30">
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent opacity-80" />
            {apod.media_type === "image" ? (
              <img
                src={apod.url}
                alt={apod.title}
                className="max-h-[640px] w-full object-cover"
                loading="lazy"
              />
            ) : (
              <iframe
                src={apod.url}
                title={apod.title}
                className="aspect-video w-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            )}
            <div className="pointer-events-none absolute inset-0 opacity-30 mix-blend-screen">
              <div className="h-full w-full animate-[pulse-glow_6s_ease-in-out_infinite]" />
            </div>
            {apod.hdurl && (
              <a
                href={apod.hdurl}
                target="_blank"
                rel="noreferrer"
                className="absolute right-6 top-6 inline-flex items-center gap-2 rounded-full border border-white/20 bg-slate-950/70 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-white backdrop-blur transition hover:border-cyan-300/60"
              >
                HD
                <span className="text-cyan-300">↗</span>
              </a>
            )}
          </article>

          <aside className="space-y-5 rounded-3xl border border-white/10 bg-white/5 p-6">
            <div className="space-y-3">
              <p className="text-xs uppercase tracking-[0.4em] text-slate-500">Mission log</p>
              <h3 className="text-2xl font-semibold text-white">{apod.title}</h3>
              <p className="text-sm leading-relaxed text-slate-300">{apod.explanation}</p>
            </div>
            <dl className="grid gap-3 text-sm text-slate-200">
              {infoList.map((info) => (
                <div key={info.label} className="rounded-2xl border border-white/5 bg-slate-900/40 px-4 py-3">
                  <dt className="text-xs uppercase tracking-[0.3em] text-slate-500">{info.label}</dt>
                  <dd className="mt-1 text-white">{info.value}</dd>
                </div>
              ))}
            </dl>
          </aside>
        </div>
      )}
    </div>
  );
}
