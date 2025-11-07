import { Link } from "react-router-dom";

const showcaseCards = [
  {
    title: "Astronomy Picture",
    description: "Daily image or video with credits, HD assets, and metadata.",
    path: "/apod",
    label: "APOD feed",
  },
  {
    title: "Mars Rover Feed",
    description: "Filter Curiosity imagery by sol and instrument instantly.",
    path: "/mars",
    label: "Rover data",
  },
  {
    title: "Earth EPIC Frames",
    description: "Natural-color EPIC captures with coordinates for reference.",
    path: "/earth",
    label: "DSCOVR",
  },
  {
    title: "Asteroid Watch",
    description: "Seven-day near-Earth object report with velocity + range.",
    path: "/asteroids",
    label: "NEO watch",
  },
];

const quickInsights = [
  { label: "APIs live", value: "4" },
  { label: "Avg response", value: "218 ms" },
  { label: "Assets cached", value: "38" },
  { label: "Rate limit", value: "40% free" },
];

export default function Home() {
  return (
    <div className="space-y-8">
      <section className="panel rounded-2xl border border-slate-200 bg-white px-6 py-8">
        <div className="flex flex-wrap items-center gap-3 text-xs font-semibold text-slate-500">
          <span className="rounded-full border border-slate-200 px-3 py-1">
            NASA feeds for builders
          </span>
          <span className="rounded-full border border-slate-200 px-3 py-1">
            Updated hourly
          </span>
        </div>
        <div className="mt-6 grid gap-8 lg:grid-cols-[1.2fr,0.8fr]">
          <div>
            <h1 className="text-4xl font-semibold text-slate-900 sm:text-5xl">
              Space data showcase
            </h1>
            <p className="mt-4 text-lg text-slate-600">
              Explore inspiring datasets and missions powered by NASA APIs.
              Each module demonstrates what you can build with live telemetry,
              imagery, and 3D assets.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                to="/models"
                className="rounded-full bg-slate-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
              >
                Browse 3D library
              </Link>
              <Link
                to="/apod"
                className="rounded-full border border-slate-200 px-6 py-3 text-sm font-semibold text-slate-900 transition hover:border-slate-300"
              >
                View today&apos;s APOD
              </Link>
            </div>
          </div>
          <div className="grid gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4 sm:grid-cols-2">
            {quickInsights.map((stat) => (
              <div key={stat.label} className="rounded-xl border border-white bg-white px-4 py-3">
                <p className="text-2xl font-semibold text-slate-900">
                  {stat.value}
                </p>
                <p className="text-xs uppercase tracking-[0.25em] text-slate-500">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-slate-500">
              Modules
            </p>
            <h2 className="text-2xl font-semibold text-slate-900">
              Quick launch
            </h2>
          </div>
          <Link
            to="/models"
            className="rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-900 hover:border-slate-300"
          >
            Submit showcase →
          </Link>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {showcaseCards.map((tile) => (
            <Link
              key={tile.path}
              to={tile.path}
              className="neon-border rounded-2xl bg-white p-5"
            >
              <p className="text-xs uppercase tracking-[0.3em] text-slate-500">
                {tile.label}
              </p>
              <h3 className="mt-2 text-xl font-semibold text-slate-900">
                {tile.title}
              </h3>
              <p className="mt-2 text-sm text-slate-600">{tile.description}</p>
              <span className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-indigo-600">
                Open module <span aria-hidden>→</span>
              </span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
