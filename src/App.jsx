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
import Models3D from "./pages/Models3D";
import "./styles.css";

const navItems = [
  { path: "/", label: "Overview" },
  { path: "/earth", label: "Earth" },
  { path: "/asteroids", label: "Asteroids" },
  { path: "/models", label: "3D Models" },
  { path: "/apod", label: "APOD" },
  { path: "/mars", label: "Mars" },
];

export default function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [hearts, setHearts] = useState(() => {
    const saved = localStorage.getItem("nasa-explorer-hearts");
    return saved ? parseInt(saved, 10) : 0;
  });

  const toggleMenu = () => setMenuOpen((prev) => !prev);
  const closeMenu = () => setMenuOpen(false);

  const addHeart = () => {
    const newCount = hearts + 1;
    setHearts(newCount);
    localStorage.setItem("nasa-explorer-hearts", newCount.toString());
  };

  return (
    <Router>
      <div className="flex min-h-screen flex-col bg-slate-50 text-slate-900">
        <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur">
          <div className="mx-auto flex max-w-10xl items-center justify-between px-3 py-4 sm:px-4 lg:px-6">
            <Link
              to="/"
              className="flex items-center gap-3 font-semibold text-slate-900"
              onClick={closeMenu}
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 text-lg">
                NE
              </div>
              <div>
                <p className="text-sm font-semibold">NASA Explorer</p>
                <p className="text-xs text-slate-500">Live Feed</p>
              </div>
            </Link>
            <div className="flex items-center gap-2 sm:gap-3">
              <nav className="hidden items-center gap-1 rounded-full border border-slate-200 bg-slate-50 px-2 py-1 text-sm font-medium md:flex">
                {navItems.map((item) => (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    onClick={closeMenu}
                    className={({ isActive }) =>
                      `rounded-full px-3 py-1 transition ${
                        isActive
                          ? "bg-white text-slate-900 shadow-sm"
                          : "text-slate-500 hover:text-slate-900"
                      }`
                    }
                  >
                    {item.label}
                  </NavLink>
                ))}
              </nav>
              
              {/* Heart Counter */}
              <button
                type="button"
                onClick={addHeart}
                className="flex items-center gap-1 rounded-full border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-600 hover:border-red-300 hover:bg-red-50 hover:text-red-600 transition"
                aria-label="Add a heart"
              >
                <span className="text-base">♥</span>
                <span className="hidden sm:inline">{hearts}</span>
              </button>

              {/* GitHub Link */}
              <a
                href="https://github.com/koder849/nasa-explorer"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 text-slate-600 hover:bg-slate-100 transition"
                aria-label="View on GitHub"
              >
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v 3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                </svg>
              </a>

              <button
                type="button"
                onClick={toggleMenu}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 text-slate-900 md:hidden"
                aria-label="Toggle navigation menu"
                aria-expanded={menuOpen}
              >
                {menuOpen ? "✕" : "☰"}
              </button>
            </div>
          </div>
          {menuOpen && (
            <div className="border-t border-slate-200 bg-white px-3 py-3 sm:px-4 lg:px-6 md:hidden">
              <div className="flex flex-col gap-2 text-sm font-semibold">
                {navItems.map((item) => (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    onClick={closeMenu}
                    className={({ isActive }) =>
                      `rounded-lg px-3 py-2 ${
                        isActive ? "bg-slate-100 text-slate-900" : "text-slate-500"
                      }`
                    }
                  >
                    {item.label}
                  </NavLink>
                ))}
                <Link
                  to="/models"
                  onClick={closeMenu}
                  className="rounded-lg bg-slate-900 px-3 py-2 text-center text-white"
                >
                  Submit data
                </Link>
              </div>
            </div>
          )}
        </header>

        <main className="flex-1 bg-slate-50">
          <div className="mx-auto max-w-10xl px-3 py-2 sm:px-4 lg:px-6">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/apod" element={<APOD />} />
              <Route path="/mars" element={<Mars />} />
              <Route path="/earth" element={<Earth />} />
              <Route path="/asteroids" element={<Asteroids />} />
              <Route path="/models" element={<Models3D />} />
            </Routes>
          </div>
        </main>

        <footer className="border-t border-slate-200 bg-white py-4 text-xs text-slate-500">
          <div className="mx-auto flex max-w-10xl flex-wrap items-center justify-between gap-3 px-3 sm:px-4 lg:px-6">
            <span>
              Made with{" "}
              <span className="text-red-500">♥</span> by{" "}
              <a
                href="https://github.com/koder849"
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-slate-900 hover:text-slate-700 transition"
              >
                Komal
              </a>
            </span>
            <div className="flex items-center gap-4">
              <span>NASA Open APIs</span>
              <span>© {new Date().getFullYear()}</span>
            </div>
          </div>
        </footer>
      </div>
    </Router>
  );
}
