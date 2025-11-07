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
  { path: "/apod", label: "APOD" },
  { path: "/mars", label: "Mars" },
  { path: "/earth", label: "Earth" },
  { path: "/asteroids", label: "Asteroids" },
  { path: "/models", label: "3D Models" },
];

export default function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const toggleMenu = () => setMenuOpen((prev) => !prev);
  const closeMenu = () => setMenuOpen(false);

  return (
    <Router>
      <div className="min-h-screen bg-slate-50 text-slate-900">
        <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur">
          <div className="mx-auto flex max-w-6xl items-center justify-between px-3 py-4 sm:px-4 lg:px-6">
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
                <p className="text-xs text-slate-500">Live resources</p>
              </div>
            </Link>
            <div className="flex items-center gap-4">
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
              <div className="hidden items-center gap-3 md:flex">
                <span className="flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                  <span className="h-2 w-2 rounded-full bg-emerald-500" />
                  Systems good
                </span>
                <Link
                  to="/models"
                  className="rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800"
                >
                  Submit data
                </Link>
              </div>
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
          <div className="mx-auto max-w-6xl px-3 py-8 sm:px-4 lg:px-6">
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
          <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-3 sm:px-4 lg:px-6">
            <span>NASA Open APIs</span>
            <span>© {new Date().getFullYear()}</span>
          </div>
        </footer>
      </div>
    </Router>
  );
}
