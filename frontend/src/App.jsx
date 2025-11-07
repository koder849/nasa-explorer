import { useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  NavLink,
  Link,
} from "react-router-dom";
import Home from "./pages/Home";
import APOD from "./pages/Apod";
import Mars from "./pages/Mars";
import Earth from "./pages/Earth";
import Asteroids from "./pages/Asteroids";
import "./styles.css";

const navItems = [
  { path: "/", label: "Overview", subtitle: "Mission hub" },
  { path: "/apod", label: "APOD", subtitle: "Daily frames" },
  { path: "/mars", label: "Mars", subtitle: "Rover feed" },
  { path: "/earth", label: "Earth", subtitle: "EPIC shots" },
  { path: "/asteroids", label: "Asteroids", subtitle: "NEO watch" },
];

export default function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const toggleMenu = () => setMenuOpen((prev) => !prev);
  const closeMenu = () => setMenuOpen(false);

  return (
    <Router>
      <div className="min-h-dvh bg-void-950 text-chrome-100">
        <div className="relative mx-auto flex min-h-dvh max-w-7xl flex-col px-4 py-6 sm:px-6 lg:px-10">
          <div className="absolute inset-0 -z-10 opacity-80 blur-[160px]">
            <div className="absolute inset-x-8 top-12 h-48 rounded-full bg-ion-500/30" />
            <div className="absolute inset-x-1/4 top-0 h-32 rounded-full bg-white/10" />
          </div>

          <header className="panel relative mb-6 overflow-hidden border border-white/10 bg-void-900/70 p-5">
            <div className="absolute -left-32 top-0 h-40 w-40 rounded-full bg-ion-500/25 blur-3xl" />
            <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
              <Link
                to="/"
                className="flex items-center gap-4"
                onClick={closeMenu}
              >
                <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-void-800 shadow-glow">
                  <div className="signal-dot absolute h-2 w-2 rounded-full bg-ion-300" />
                  <span className="text-2xl font-semibold tracking-[0.3em] text-white">
                    NE
                  </span>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.5em] text-chrome-500">
                    Mission console
                  </p>
                  <p className="text-xl font-semibold text-white">
                    NASA Explorer
                  </p>
                </div>
              </Link>
              <div className="flex items-center gap-3">
                <div className="hidden sm:flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-xs uppercase tracking-[0.3em] text-chrome-300">
                  <span className="h-2 w-2 rounded-full bg-green-400" />
                  Systems nominal
                </div>
                <button
                  type="button"
                  onClick={toggleMenu}
                  className="relative flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-void-800 text-white transition hover:border-ion-400 hover:text-white md:hidden"
                  aria-label="Toggle navigation menu"
                  aria-expanded={menuOpen}
                >
                  <span className="sr-only">Toggle navigation</span>
                  <span
                    className={`absolute h-0.5 w-6 rounded-full bg-current transition-all duration-300 ${
                      menuOpen ? "rotate-45" : "-translate-y-2"
                    }`}
                  />
                  <span
                    className={`absolute h-0.5 w-6 rounded-full bg-current transition-all duration-300 ${
                      menuOpen ? "opacity-0" : "opacity-100"
                    }`}
                  />
                  <span
                    className={`absolute h-0.5 w-6 rounded-full bg-current transition-all duration-300 ${
                      menuOpen ? "-rotate-45" : "translate-y-2"
                    }`}
                  />
                </button>
              </div>
            </div>

            <nav className="mt-6 hidden grid-cols-5 gap-3 md:grid">
              {navItems.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={closeMenu}
                  className={({ isActive }) =>
                    `neon-border flex flex-col rounded-2xl border border-white/5 bg-white/5 px-4 py-3 text-left transition ${
                      isActive
                        ? "border-white/20 bg-white/10 text-white"
                        : "text-chrome-300 hover:border-white/20 hover:text-white"
                    }`
                  }
                >
                  <span className="text-sm font-semibold">{item.label}</span>
                  <span className="text-xs uppercase tracking-[0.3em] text-chrome-500">
                    {item.subtitle}
                  </span>
                </NavLink>
              ))}
            </nav>

            {menuOpen && (
              <div className="mt-4 grid gap-3 md:hidden">
                {navItems.map((item) => (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    onClick={closeMenu}
                    className={({ isActive }) =>
                      `rounded-2xl border border-white/10 px-4 py-3 text-sm font-medium ${
                        isActive ? "bg-white/10 text-white" : "text-chrome-300"
                      }`
                    }
                  >
                    <div className="flex items-center justify-between">
                      {item.label}
                      <span className="text-xs uppercase tracking-[0.2em] text-chrome-500">
                        {item.subtitle}
                      </span>
                    </div>
                  </NavLink>
                ))}
              </div>
            )}
          </header>

          <section className="panel mb-6 border border-white/10 p-5">
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center gap-3 rounded-2xl border border-white/5 bg-white/5 px-4 py-3 text-sm text-chrome-200">
                <div className="h-10 w-10 rounded-xl border border-white/10 bg-white/5 p-2">
                  <svg
                    className="h-full w-full text-ion-200"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  >
                    <path d="M12 3v3m0 12v3m9-9h-3M6 12H3m15.364-6.364-2.121 2.121M8.757 15.243l-2.121 2.121m0-12.728 2.121 2.121m8.486 8.486 2.121 2.121" />
                    <circle cx="12" cy="12" r="4" />
                  </svg>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.4em] text-chrome-500">
                    Live briefing
                  </p>
                  <p>Minimal sci-fi console for NASA data.</p>
                </div>
              </div>
              <div className="flex items-center gap-2 rounded-2xl border border-white/10 bg-void-800/70 px-4 py-2 text-xs uppercase tracking-[0.3em] text-chrome-400">
                <span className="h-2 w-2 rounded-full bg-green-400" />
                API latency &lt; 230ms
              </div>
            </div>
          </section>

          <main className="flex-1 rounded-[2rem] border border-white/5 bg-void-900/60 p-4 sm:p-6">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/apod" element={<APOD />} />
              <Route path="/mars" element={<Mars />} />
              <Route path="/earth" element={<Earth />} />
              <Route path="/asteroids" element={<Asteroids />} />
            </Routes>
          </main>

          <footer className="mt-8 border-t border-white/5 py-6 text-xs uppercase tracking-[0.3em] text-chrome-500">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <span>Built on NASA Open APIs</span>
              <span>© {new Date().getFullYear()}</span>
            </div>
          </footer>
        </div>
      </div>
    </Router>
  );
}
