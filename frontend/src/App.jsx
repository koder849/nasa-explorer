import { useState } from "react";
import { BrowserRouter as Router, Routes, Route, NavLink, Link } from "react-router-dom";
import Home from "./pages/Home";
import APOD from "./pages/Apod";
import Mars from "./pages/Mars";
import Earth from "./pages/Earth";
import Asteroids from "./pages/Asteroids";
import "./styles.css";

const navItems = [
  { path: "/", label: "Home" },
  { path: "/apod", label: "APOD" },
  { path: "/mars", label: "Mars" },
  { path: "/earth", label: "Earth" },
  { path: "/asteroids", label: "Asteroids" },
];

export default function App() {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => setMenuOpen((prev) => !prev);
  const closeMenu = () => setMenuOpen(false);

  return (
    <Router>
      <div className="min-h-dvh bg-night-500"/>
        <div className="star-field"></div>
        <div className="cosmic-glow"></div>
        
        {/* Content Wrapper */}
        <div className="relative z-10 flex min-h-dvh flex-col">
        
        <header className="sticky top-0 z-40 border-b border-white/10 bg-night-600/80 backdrop-blur-xl">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
            <Link
              to="/"
              className="group flex items-center gap-4"
              onClick={closeMenu}
            >
              <div className="relative flex h-10 w-10 items-center justify-center overflow-hidden rounded-xl bg-gradient-to-br from-cosmic-500 to-cosmic-600 shadow-lg transition-all duration-300 group-hover:shadow-cosmic">
                <div className="absolute inset-[2px] rounded-lg bg-night-500 transition-all duration-300 group-hover:inset-[1.5px]"></div>
                <div className="relative z-10 text-lg font-bold text-cosmic-200">N</div>
              </div>
              <span className="bg-gradient-to-r from-white to-white/80 bg-clip-text font-display text-xl tracking-wide text-transparent">
                NASA Explorer
              </span>
            </Link>

            <nav className="hidden items-center gap-2 md:flex">
              {navItems.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={closeMenu}
                  className={({ isActive }) =>
                    `nav-link ${isActive ? "active" : ""
                    }`
                  }
                >
                  {item.label}
                </NavLink>
              ))}
            </nav>

            <button
              type="button"
              onClick={toggleMenu}
              className="group relative h-10 w-10 rounded-lg border border-white/10 bg-night-600/50 text-white transition-colors duration-300 hover:border-cosmic-500/30 hover:text-cosmic-400 md:hidden"
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

          {menuOpen && (
            <div className="animate-slide-down border-t border-white/5 bg-night-600/95 backdrop-blur-xl md:hidden">
              <nav className="divide-y divide-white/5">
                {navItems.map((item) => (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    onClick={closeMenu}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-6 py-4 text-sm font-medium transition-colors ${
                        isActive
                          ? "bg-cosmic-500/5 text-cosmic-400"
                          : "text-starlight-400 hover:bg-night-700/50 hover:text-white"
                      }`
                    }
                  >
                    <span className={`h-1.5 w-1.5 rounded-full ${
                      isActive ? "bg-cosmic-400" : "bg-starlight-700"
                    }`}></span>
                    {item.label}
                  </NavLink>
                ))}
              </nav>
            </div>
          )}
        </header>

        <main className="flex-1 px-4 py-8 sm:px-6 sm:py-12">
          <div className="mx-auto max-w-7xl space-y-8">
            <div className="animate-fade-in overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-night-600/90 to-night-700/70 p-1 backdrop-blur-sm">
              <div className="flex items-center gap-3 rounded-xl bg-cosmic-500/5 px-5 py-4">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-cosmic-500/10 text-cosmic-400">
                  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 2v2m0 16v2M4 12H2m20 0h-2m-2.05-6.95l-1.41 1.41M5.46 18.54l-1.41 1.41m0-14l1.41 1.41m11.13 11.13l1.41 1.41M12 7a5 5 0 110 10 5 5 0 010-10z" />
                  </svg>
                </span>
                <span className="bg-gradient-to-r from-cosmic-200 to-cosmic-100/80 bg-clip-text text-sm font-medium text-transparent">
                  Explore NASA's data through an immersive interface
                </span>
              </div>
            </div>

            <div className="grid-fade-in">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/apod" element={<APOD />} />
                <Route path="/mars" element={<Mars />} />
                <Route path="/earth" element={<Earth />} />
                <Route path="/asteroids" element={<Asteroids />} />
              </Routes>
            </div>
          </div>
        </main>

        <footer className="mt-auto border-t border-white/10 bg-night-600/90 px-4 py-8 backdrop-blur-xl sm:px-6">
          <div className="mx-auto flex max-w-7xl flex-col items-center gap-6 sm:flex-row sm:justify-between">
            <div className="flex flex-col items-center gap-3 sm:items-start">
              <div className="flex items-center gap-2">
                <span className="inline-flex h-8 items-center gap-2 rounded-lg bg-night-700/80 px-3 text-xs font-medium text-starlight-300">
                  Built with NASA Open APIs
                </span>
                <span className="inline-flex h-8 items-center gap-2 rounded-lg bg-night-700/80 px-3 text-xs font-medium text-starlight-300">
                  {new Date().getFullYear()}
                </span>
              </div>
              <div className="flex items-center gap-4 text-xs">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-night-700/80 px-3 py-1 text-starlight-300">
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500"></span>
                  </span>
                  Systems online
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-night-700/80 px-3 py-1 text-starlight-300">
                  <span className="h-1.5 w-1.5 rounded-full bg-cosmic-400"></span>
                  Live data
                </span>
              </div>
            </div>
            <p className="text-sm font-medium">
              <span className="bg-gradient-to-r from-cosmic-200 to-cosmic-100/80 bg-clip-text text-transparent">
                Keep exploring the cosmos
              </span>
            </p>
          </div>
        </footer>
      </div>
    </Router>
  );
}
