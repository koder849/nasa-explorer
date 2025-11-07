import { Link } from "react-router-dom";

const heroMetrics = [
  { label: "APIs", value: "4", detail: "active feeds" },
  { label: "Latency", value: "218ms", detail: "avg response" },
  { label: "Assets", value: "38", detail: "cached visuals" },
];

const missionTiles = [
  {
    title: "Astronomy Picture",
    description: "High resolution daily picture with expanded context and download links.",
    path: "/apod",
    meta: "APOD • updated daily",
  },
  {
    title: "Mars Rover Feed",
    description: "Filter Curiosity imagery by sol and instrument for field analysis.",
    path: "/mars",
    meta: "Rover • RAW imagery",
  },
  {
    title: "Earth EPIC Frames",
    description: "Natural color snapshots from a million miles away with coordinates.",
    path: "/earth",
    meta: "DSCOVR • 2hr cadence",
  },
  {
    title: "Asteroid Watch",
    description: "Track near-Earth objects, velocities and closest approaches.",
    path: "/asteroids",
    meta: "NEO • 7 day window",
  },
];

const quickSignals = [
  { title: "Downlink health", status: "Nominal", detail: "No packet loss detected" },
  { title: "Cache refresh", status: "27s ago", detail: "Auto-heal is active" },
  { title: "Rate limit", status: "40%", detail: "Remaining quota safe" },
];

export default function Home() {
  return (
    <div className="space-y-8">
      <div className="grid gap-6 lg:grid-cols-[1.2fr,0.8fr]">
        <section className="neon-border panel relative overflow-hidden border border-white/10 bg-void-900/70 p-6">
          <div className="absolute inset-0">
            <div className="grid-overlay" />
            <div className="absolute -right-20 top-10 h-48 w-48 rounded-full bg-ion-500/20 blur-3xl" />
          </div>
          <div className="relative space-y-6">
            <p className="text-xs uppercase tracking-[0.4em] text-chrome-400">Mission Control</p>
            <h1 className="text-3xl font-semibold text-white sm:text-4xl">
              A monochrome console for NASA&apos;s open telemetry.
            </h1>
            <p className="max-w-xl text-sm text-chrome-300">
              Navigate between APOD, Mars rovers, Earth EPIC frames and the asteroid feed inside a unified dashboard that
              embraces shadcn-inspired cards, clean typography and subtle sci-fi motion.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                to="/apod"
                className="inline-flex items-center gap-2 rounded-2xl border border-white/40 bg-white px-5 py-2 text-sm font-semibold text-void-900 transition hover:-translate-y-0.5"
              >
                Launch APOD
              </Link>
              <Link
                to="/mars"
                className="inline-flex items-center gap-2 rounded-2xl border border-white/20 px-5 py-2 text-sm font-semibold text-white transition hover:border-white/40"
              >
                Mars feed →
              </Link>
            </div>
          </div>
        </section>

        <section className="panel border border-white/10 p-5">
          <div className="grid gap-4 sm:grid-cols-3">
            {heroMetrics.map((metric) => (
              <article key={metric.label} className="rounded-2xl border border-white/5 bg-white/5 p-4 text-center">
                <p className="text-2xl font-semibold text-white">{metric.value}</p>
                <p className="text-xs uppercase tracking-[0.3em] text-chrome-500">{metric.label}</p>
                <p className="text-[0.7rem] text-chrome-400">{metric.detail}</p>
              </article>
            ))}
          </div>
          <div className="mt-4 rounded-2xl border border-white/5 bg-void-800/60 px-4 py-3 text-xs uppercase tracking-[0.3em] text-chrome-400">
            Console session encrypted • Dual factor command uplink enabled
          </div>
        </section>
      </div>

      <section className="grid gap-5 md:grid-cols-2">
        {missionTiles.map((tile) => (
          <Link
            key={tile.path}
            to={tile.path}
            className="neon-border panel-light flex flex-col gap-3 rounded-3xl border border-white/10 bg-white/5 p-5 transition hover:-translate-y-0.5"
          >
            <div className="text-xs uppercase tracking-[0.4em] text-chrome-500">{tile.meta}</div>
            <h3 className="text-xl font-semibold text-white">{tile.title}</h3>
            <p className="text-sm text-chrome-300">{tile.description}</p>
            <span className="text-sm font-medium text-white">Enter module ↗</span>
          </Link>
        ))}
      </section>

      <section className="grid gap-5 lg:grid-cols-[1.2fr,0.8fr]">
        <div className="panel border border-white/10 p-5">
          <p className="text-xs uppercase tracking-[0.4em] text-chrome-500">Console checklist</p>
          <div className="mt-4 grid gap-4 md:grid-cols-3">
            {["Responsive layout", "Dark/white palette", "Shadcn motion"].map((item) => (
              <div key={item} className="rounded-2xl border border-white/5 bg-white/5 px-4 py-3 text-sm text-white">
                {item}
              </div>
            ))}
          </div>
        </div>
        <div className="panel border border-white/10 p-5">
          <p className="text-xs uppercase tracking-[0.4em] text-chrome-500">Live signals</p>
          <div className="mt-4 space-y-3">
            {quickSignals.map((signal) => (
              <div key={signal.title} className="flex items-center justify-between rounded-2xl border border-white/5 bg-white/5 px-4 py-3">
                <div>
                  <p className="text-sm font-medium text-white">{signal.title}</p>
                  <p className="text-xs text-chrome-400">{signal.detail}</p>
                </div>
                <span className="text-xs font-semibold text-chrome-200">{signal.status}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
