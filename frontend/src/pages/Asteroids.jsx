import { useEffect, useState } from "react";
import api from "../lib/api";

const formatDate = (date) => date.toISOString().split("T")[0];
const DAY_MS = 24 * 60 * 60 * 1000;
const clampRange = (startValue, endValue) => {
  const startDateObj = new Date(startValue);
  const endDateObj = new Date(endValue);
  const diffDays = Math.floor((endDateObj - startDateObj) / DAY_MS);

  if (diffDays > 6) {
    const newEnd = new Date(startDateObj.getTime() + 6 * DAY_MS);
    return [formatDate(startDateObj), formatDate(newEnd)];
  }

  return [formatDate(startDateObj), formatDate(endDateObj)];
};
const today = new Date();
const twoDaysAgo = new Date(Date.now() - 2 * 24 * 60 * 60 * 1000);

export default function Asteroids() {
  const [startDate, setStartDate] = useState(formatDate(twoDaysAgo));
  const [endDate, setEndDate] = useState(formatDate(today));
  const [asteroids, setAsteroids] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const handleStartChange = (value) => {
    let start = value;
    let end = endDate;

    if (new Date(value) > new Date(end)) {
      end = value;
    }

    [start, end] = clampRange(start, end);
    setStartDate(start);
    setEndDate(end);
  };

  const handleEndChange = (value) => {
    let end = value;
    let start = startDate;

    if (new Date(value) < new Date(start)) {
      start = value;
    }

    [start, end] = clampRange(start, end);
    setStartDate(start);
    setEndDate(end);
  };

  useEffect(() => {
    let ignore = false;
    const fetchAsteroids = async () => {
      setLoading(true);
      setError("");
      try {
        const response = await api.get("/asteroids/feed", {
          params: { start_date: startDate, end_date: endDate },
        });
        if (!ignore) {
          if (response.data?.near_earth_objects) {
            const flattened = Object.values(response.data.near_earth_objects).flat();
            setAsteroids(flattened.slice(0, 12));
          } else if (response.data?.error) {
            throw new Error(response.data.error);
          } else {
            setAsteroids([]);
          }
        }
      } catch (err) {
        if (!ignore) setError(err.message);
      } finally {
        if (!ignore) setLoading(false);
      }
    };
    fetchAsteroids();
    return () => {
      ignore = true;
    };
  }, [startDate, endDate]);

  return (
    <div className="space-y-6">
      <section className="rounded-3xl border border-white/10 bg-gradient-to-br from-violet-500/10 via-slate-900/70 to-slate-900/30 p-6 shadow-2xl shadow-violet-500/10">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.4em] text-violet-200/80">Near-Earth Objects</p>
            <h2 className="mt-3 text-3xl font-semibold text-white">Asteroid Watch</h2>
            <p className="text-sm text-slate-300">
              Visualize the current NEO feed within a sliding 7-day window. Responsive controls keep the interface fluid on phones
              or ultrawide displays.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="text-sm text-slate-300">
              <span className="mb-2 block text-xs uppercase tracking-[0.3em] text-slate-400">Start date</span>
              <input
                type="date"
                max={endDate}
                value={startDate}
                onChange={(e) => handleStartChange(e.target.value)}
                className="w-full rounded-2xl border border-white/15 bg-slate-950/70 px-4 py-2 text-white outline-none transition focus:border-violet-400/60"
              />
            </label>
            <label className="text-sm text-slate-300">
              <span className="mb-2 block text-xs uppercase tracking-[0.3em] text-slate-400">End date</span>
              <input
                type="date"
                min={startDate}
                value={endDate}
                onChange={(e) => handleEndChange(e.target.value)}
                className="w-full rounded-2xl border border-white/15 bg-slate-950/70 px-4 py-2 text-white outline-none transition focus:border-violet-400/60"
              />
            </label>
          </div>
        </div>
        <div className="mt-6 grid gap-4 text-center text-sm text-slate-200 sm:grid-cols-3">
          <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
            <div className="text-2xl font-semibold text-white">{asteroids.length || "—"}</div>
            <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Objects shown</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
            <div className="text-2xl font-semibold text-white">
              {new Date(startDate).toLocaleDateString(undefined, { month: "short", day: "numeric" })}
            </div>
            <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Range start</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
            <div className="text-2xl font-semibold text-white">
              {new Date(endDate).toLocaleDateString(undefined, { month: "short", day: "numeric" })}
            </div>
            <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Range end</p>
          </div>
        </div>
      </section>

      {loading && (
        <div className="rounded-3xl border border-white/10 bg-slate-900/70 p-6 text-center text-sm text-slate-300">
          Tracking near-Earth objects...
        </div>
      )}

      {error && !loading && (
        <div className="rounded-3xl border border-rose-500/40 bg-rose-950/40 p-4 text-sm text-rose-100">{error}</div>
      )}

      {!loading && !error && (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          {asteroids.length ? (
            asteroids.map((asteroid) => {
              const approach = asteroid.close_approach_data?.[0];
              const distance = Number(approach?.miss_distance?.kilometers)?.toLocaleString();
              const velocity = Number(approach?.relative_velocity?.kilometers_per_hour)?.toLocaleString();

              return (
                <article
                  key={asteroid.id}
                  className="rounded-3xl border border-white/10 bg-slate-900/60 p-5 shadow-lg transition hover:-translate-y-1 hover:border-violet-300/40"
                >
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-white">{asteroid.name}</h3>
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${
                        asteroid.is_potentially_hazardous_asteroid
                          ? "bg-rose-500/20 text-rose-200"
                          : "bg-emerald-500/20 text-emerald-200"
                      }`}
                    >
                      {asteroid.is_potentially_hazardous_asteroid ? "Hazard" : "Monitored"}
                    </span>
                  </div>
                  <dl className="mt-4 space-y-2 text-sm text-slate-300">
                    <div className="flex justify-between">
                      <dt>Absolute magnitude</dt>
                      <dd>{asteroid.absolute_magnitude_h}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt>Diameter (est.)</dt>
                      <dd>
                        {asteroid.estimated_diameter?.meters
                          ? `${asteroid.estimated_diameter.meters.estimated_diameter_min.toFixed(0)}–${asteroid.estimated_diameter.meters.estimated_diameter_max.toFixed(0)} m`
                          : "N/A"}
                      </dd>
                    </div>
                    <div className="flex justify-between">
                      <dt>Closest approach</dt>
                      <dd>{approach?.close_approach_date_full || "N/A"}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt>Miss distance</dt>
                      <dd>{distance ? `${distance} km` : "N/A"}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt>Velocity</dt>
                      <dd>{velocity ? `${velocity} km/h` : "N/A"}</dd>
                    </div>
                  </dl>
                </article>
              );
            })
          ) : (
            <div className="rounded-3xl border border-dashed border-white/20 p-8 text-center text-slate-400">
              No near-Earth objects detected for the selected range.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
