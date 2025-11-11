import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import ModelViewer3D from "../components/ModelViewer3D";

const showcaseCards = [
  {
    title: "Earth EPIC Frames",
    description: "Natural-color EPIC captures with coordinates for reference.",
    path: "/earth",
    label: "DSCOVR",
    image: "/epic.png",
  },
  {
    title: "Asteroid Watch",
    description: "Seven-day near-Earth object report with velocity + range.",
    path: "/asteroids",
    label: "NEO watch",
    image: "/asteroid.png",
  },
];

const perseveranceModel = {
  url: "https://raw.githubusercontent.com/nasa/NASA-3D-Resources/master/3D%20Models/Mars%202020%20Perseverance%20Rover/Mars%202020%20Perseverance%20Rover.glb",
  description: "Mars 2020 Perseverance Rover - Interactive 3D model",
  name: "Mars 2020 Perseverance Rover",
};

export default function Home() {
  const [showDisclaimer, setShowDisclaimer] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowDisclaimer(false);
    }, 60000); // 1 minute

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="space-y-2">
      {/* Disclaimer Section */}
      {showDisclaimer && (
        <div className="border-l-4 border-amber-500 bg-amber-50 p-3 rounded-lg flex gap-1 justify-between items-start animate-in">
          <div className="flex gap-2 flex-1">
            <span className="text-xl shrink-0">⚠️</span>
            <div className="flex-1">
              <p className="font-semibold text-amber-900 text-sm">API Notice</p>
              <p className="text-xs text-amber-800">
                <strong>APOD</strong> and <strong>Mars APIs</strong> are
                Archived by NASA. Other APIs may be rate-limited or unavailable.
                Try refreshing later if errors occur.
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowDisclaimer(false)}
            className="shrink-0 text-amber-600 hover:text-amber-900 transition ml-1"
            aria-label="Close disclaimer"
          >
            ✕
          </button>
        </div>
      )}

      <section className="panel rounded-2xl border border-slate-200 bg-white px-4 py-3">
        <div className="mt-3">
          <h1 className="text-3xl font-semibold text-slate-900 sm:text-5xl">
            Explore NASA's Universe
          </h1>
          <p className="mt-4 text-lg text-slate-600">
            Experience real-time mission data, interactive 3D models, and Earth
            observations all powered by NASA's public APIs.
          </p>
        </div>

        <section className="grid gap-4 lg:grid-cols-2">
          {/* Right side (Top on mobile): Perseverance 3D Model */}
          <div className="space-y-2 order-first lg:order-last">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-slate-500">
                  Featured
                </p>
                <h2 className="text-2xl font-semibold text-slate-900">
                  Perseverance Rover
                </h2>
              </div>
              <Link
                to="/models"
                className="rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-900 hover:border-slate-300"
              >
                Explore more (108+)→
              </Link>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 overflow-hidden">
              <div style={{ height: "580px", minHeight: "300px" }}>
                <ModelViewer3D model={perseveranceModel} />
              </div>
            </div>
            <p className="text-sm text-slate-600">
              NASA's Perseverance rover is a car-sized rover designed to explore
              Gale crater on Mars as part of the Mars 2020 mission. It's
              searching for signs of ancient microbial life and testing new
              technology for future human exploration. View the complete 3D
              model library with dozens of NASA spacecraft, rovers, and
              instruments.
            </p>
          </div>

          {/* Left side (Bottom on mobile): Detail cards grid + Historical data */}
          <div className="space-y-4 order-last ">
            {/* Featured modules */}
            <div className="space-y-2">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-slate-500">
                  Modules
                </p>
                <h2 className="text-2xl font-semibold text-slate-900">
                  Featured Pages
                </h2>
              </div>
              <div className="grid gap-3 grid-cols-2">
                {showcaseCards.map((tile) => (
                  <Link
                    key={tile.path}
                    to={tile.path}
                    className="neon-border rounded-2xl bg-white overflow-hidden hover:shadow-lg transition"
                  >
                    {tile.image && (
                      <div className="relative h-40 w-full overflow-hidden bg-slate-100">
                        <img
                          src={tile.image}
                          alt={tile.title}
                          className="w-full h-full object-cover hover:scale-105 transition duration-300"
                        />
                      </div>
                    )}
                    <div className="p-4">
                      <p className="text-xs uppercase tracking-[0.3em] text-slate-500">
                        {tile.label}
                      </p>
                      <h3 className="mt-2 text-sm font-semibold text-slate-900">
                        {tile.title}
                      </h3>
                      <p className="mt-2 text-xs text-slate-600">
                        {tile.description}
                      </p>
                      <span className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-indigo-600">
                        Explore <span aria-hidden>→</span>
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Historical data */}
            <div className="space-y-2">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-slate-500">
                  Archived APIs
                </p>
                <h2 className="text-2xl font-semibold text-slate-900">
                  Historical data
                </h2>
              </div>
              <div className="grid gap-3 grid-cols-2">
                <Link
                  to="/apod"
                  className="neon-border rounded-2xl bg-white overflow-hidden hover:shadow-lg transition"
                >
                  <div className="relative h-40 w-full overflow-hidden bg-slate-100">
                    <img
                      src="/apod.jpg"
                      alt="Astronomy Picture of the Day"
                      className="w-full h-full object-cover hover:scale-105 transition duration-300"
                    />
                  </div>
                  <div className="p-4">
                    <p className="text-xs uppercase tracking-[0.3em] text-slate-500">
                      APOD Feed
                    </p>
                    <h3 className="mt-2 text-sm font-semibold text-slate-900">
                      Astronomy Picture
                    </h3>
                    <p className="mt-2 text-xs text-slate-600">
                      Daily image or video with credits, HD assets, and
                      metadata.
                    </p>
                    <span className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-indigo-600">
                      View archive <span aria-hidden>→</span>
                    </span>
                  </div>
                </Link>
                <Link
                  to="/mars"
                  className="neon-border rounded-2xl bg-white overflow-hidden hover:shadow-lg transition"
                >
                  <div className="relative h-40 w-full overflow-hidden bg-slate-100">
                    <img
                      src="/mars.jpg"
                      alt="Mars Rover Feed"
                      className="w-full h-full object-cover hover:scale-105 transition duration-300"
                    />
                  </div>
                  <div className="p-4">
                    <p className="text-xs uppercase tracking-[0.3em] text-slate-500">
                      Rover Data
                    </p>
                    <h3 className="mt-2 text-sm font-semibold text-slate-900">
                      Mars Rover Feed
                    </h3>
                    <p className="mt-2 text-xs text-slate-600">
                      Filter Curiosity imagery by sol and instrument instantly.
                    </p>
                    <span className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-indigo-600">
                      View archive <span aria-hidden>→</span>
                    </span>
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </section>
    </div>
  );
}
