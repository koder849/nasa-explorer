import { Link } from "react-router-dom";

const heroMetrics = [
  { label: "APIs", value: "4", detail: "active feeds" },
  { label: "Latency", value: "218ms", detail: "avg response" },
  { label: "Assets", value: "38", detail: "cached visuals" },
];

const missionTiles = [
  {
    title: "Astronomy Picture",
    description:
      "High resolution daily picture with expanded context and download links.",
    path: "/apod",
    meta: "APOD • updated daily",
  },
  {
    title: "Mars Rover Feed",
    description:
      "Filter Curiosity imagery by sol and instrument for field analysis.",
    path: "/mars",
    meta: "Rover • RAW imagery",
  },
  {
    title: "Earth EPIC Frames",
    description:
      "Natural color snapshots from a million miles away with coordinates.",
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
  {
    title: "Downlink health",
    status: "Nominal",
    detail: "No packet loss detected",
  },
  { title: "Cache refresh", status: "27s ago", detail: "Auto-heal is active" },
  { title: "Rate limit", status: "40%", detail: "Remaining quota safe" },
];

export default function Home() {
  return (
    <div className="space-y-8">
      <section className="grid gap-5 md:grid-cols-2">
        {missionTiles.map((tile) => (
          <Link
            key={tile.path}
            to={tile.path}
            className="neon-border panel-light flex flex-col gap-3 rounded-3xl border border-white/10 bg-white/5 p-5 transition hover:-translate-y-0.5"
          >
            <div className="text-xs uppercase tracking-[0.4em] text-chrome-500">
              {tile.meta}
            </div>
            <h3 className="text-xl font-semibold text-white">{tile.title}</h3>
            <p className="text-sm text-chrome-300">{tile.description}</p>
            <span className="text-sm font-medium text-white">
              Enter module ↗
            </span>
          </Link>
        ))}
      </section>
    </div>
  );
}
