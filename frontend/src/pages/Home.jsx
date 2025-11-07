import { Link } from "react-router-dom";

const heroMetrics = [
  { label: "NASA APIs", value: "4", detail: "live endpoints" },
  { label: "Avg. latency", value: "~220", detail: "ms per query" },
  { label: "Imagery cached", value: "30+", detail: "assets per view" },
];

const missionTiles = [
  {
    title: "Astronomy Picture of the Day",
    description: "Witness today’s featured cosmic story with context, credit, and HD download.",
    path: "/apod",
    accent: "from-cyan-500/20 via-cyan-500/5 to-blue-500/10",
    badge: "Daily",
  },
  {
    title: "Mars Rover Photos",
    description: "Scrub Curiosity’s raw photo feed by sol and camera with elegant filtering.",
    path: "/mars",
    accent: "from-pink-500/20 via-orange-500/10 to-rose-500/10",
    badge: "Rover",
  },
  {
    title: "Earth EPIC Imagery",
    description: "High-resolution natural-color Earth snapshots with download links.",
    path: "/earth",
    accent: "from-emerald-500/20 via-teal-500/10 to-green-500/10",
    badge: "DSCOVR",
  },
  {
    title: "Near-Earth Objects",
    description: "Monitor hazardous objects with orbital data, distances, and velocities.",
    path: "/asteroids",
    accent: "from-indigo-500/20 via-purple-500/10 to-violet-500/10",
    badge: "NEO",
  },
];

const quickLinks = [
  { title: "API Reference", value: "api.nasa.gov", hint: "Check limits" },
  { title: "Status", value: "All systems go", hint: "99.9% uptime" },
  { title: "Last sync", value: "Just now", hint: "Automatic refresh" },
];

export default function Home() {
  return (
    <div className="space-y-12">
      <section className="grid gap-8 rounded-[2.5rem] border border-white/10 bg-gradient-to-br from-slate-900/80 via-slate-900/40 to-slate-900/10 p-8 shadow-2xl shadow-cyan-500/10 ring-1 ring-white/5 lg:grid-cols-[1.1fr,0.9fr]">
        <div className="space-y-6">
          <p className="text-xs uppercase tracking-[0.5em] text-cyan-200/80">Mission Control</p>
          <h1 className="text-4xl font-semibold leading-tight text-white sm:text-5xl">
            A cinematic way to explore NASA&apos;s open data feed.
          </h1>
          <p className="text-lg text-slate-300">
            Designed with shadcn-inspired motion and glassmorphism accents, this dashboard gives you immediate access to APOD,
            Mars rover imagery, EPIC Earth shots, and near-Earth objects—optimized for every device.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              to="/apod"
              className="animate-in fade-in rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 px-6 py-3 text-sm font-semibold text-slate-900 shadow-lg shadow-cyan-500/40 transition hover:scale-105"
            >
              Launch APOD
            </Link>
            <Link
              to="/mars"
              className="rounded-full border border-white/15 px-6 py-3 text-sm font-semibold text-white transition hover:border-cyan-300/60"
            >
              View Mars feed
            </Link>
          </div>
        </div>
        <div className="grid gap-4 rounded-3xl border border-white/5 bg-white/5 p-6 text-sm text-slate-200 sm:grid-cols-3 sm:text-center">
          {heroMetrics.map((metric) => (
            <div key={metric.label} className="animate-in slide-in-from-bottom-6 rounded-2xl border border-white/10 bg-slate-900/50 p-4">
              <div className="text-3xl font-semibold text-white">{metric.value}</div>
              <p className="text-xs uppercase tracking-[0.3em] text-slate-400">{metric.label}</p>
              <p className="text-[0.7rem] text-slate-500">{metric.detail}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-5">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.4em] text-slate-500">Destinations</p>
            <h2 className="text-2xl font-semibold text-white">Pick a mission</h2>
          </div>
          <p className="text-sm text-slate-400">Each route hooks into a dedicated NASA REST endpoint.</p>
        </div>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {missionTiles.map((tile) => (
            <Link
              key={tile.path}
              to={tile.path}
              className={`group animate-in fade-in rounded-3xl border border-white/15 bg-gradient-to-br ${tile.accent} p-6 transition duration-300 hover:-translate-y-1 hover:border-cyan-300/50 hover:shadow-2xl hover:shadow-cyan-500/20`}
            >
              <div className="flex items-center justify-between">
                <span className="rounded-full border border-white/20 px-3 py-1 text-xs uppercase tracking-[0.3em] text-slate-200">
                  {tile.badge}
                </span>
                <span className="text-sm text-cyan-200 transition group-hover:translate-x-1">→</span>
              </div>
              <h3 className="mt-4 text-xl font-semibold text-white">{tile.title}</h3>
              <p className="mt-2 text-sm text-slate-200">{tile.description}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="grid gap-6 rounded-3xl border border-white/10 bg-slate-900/40 p-6 sm:grid-cols-[2fr,1fr]">
        <div className="space-y-4">
          <div className="flex items-center gap-3 text-xs uppercase tracking-[0.4em] text-slate-500">
            <span className="h-1.5 w-1.5 rounded-full bg-cyan-400" />
            Live telemetry
          </div>
          <div className="grid gap-4 text-sm text-slate-300 md:grid-cols-3">
            {["Seamless mobile layout", "Shadcn-style animations", "Dark glass aesthetic"].map((item) => (
              <div
                key={item}
                className="rounded-2xl border border-white/5 bg-slate-950/50 px-4 py-3 text-center text-white shadow-lg shadow-black/20"
              >
                {item}
              </div>
            ))}
          </div>
        </div>
        <div className="space-y-3 rounded-2xl border border-white/5 bg-slate-950/40 p-4">
          {quickLinks.map((link) => (
            <div
              key={link.title}
              className="flex items-center justify-between rounded-xl border border-white/5 bg-white/5 px-3 py-3 text-sm"
            >
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-slate-500">{link.title}</p>
                <p className="text-base text-white">{link.value}</p>
              </div>
              <p className="text-xs text-slate-400">{link.hint}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
