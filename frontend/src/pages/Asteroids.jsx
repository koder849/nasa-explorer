import { useState } from "react";
import { useAsteroids } from "../lib/hooks/useAsteroids";

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
const twoDaysAgo = new Date(Date.now() - 2 * DAY_MS);

export default function Asteroids() {
  const [startDate, setStartDate] = useState(formatDate(twoDaysAgo));
  const [endDate, setEndDate] = useState(formatDate(today));
  const { data: asteroids = [], isPending: loading, error } = useAsteroids(startDate, endDate);

  return (
    <div className="space-y-6">
      <section className="panel border border-white/10 p-5">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.4em] text-chrome-500">Near-Earth Objects</p>
            <h2 className="mt-2 text-2xl font-semibold text-white">Asteroid Watch</h2>
            <p className="text-sm text-chrome-300">
              Visualise the active 7-day feed and inspect hazard tags, miss distances, and velocities from a clean monochrome card
              system.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="text-sm text-white">
              <span className="mb-2 block text-xs uppercase tracking-[0.3em] text-chrome-500">Start date</span>
              <input
                type="date"
                max={endDate}
                value={startDate}
                onChange={(e) => {
                  let start = e.target.value;
                  let end = endDate;

                  if (new Date(start) > new Date(end)) {
                    end = start;
                  }

                  [start, end] = clampRange(start, end);
                  setStartDate(start);
                  setEndDate(end);
                }}
                className="w-full rounded-2xl border border-white/10 bg-void-900 px-4 py-2 text-white outline-none transition focus:border-ion-400"
              />
            </label>
            <label className="text-sm text-white">
              <span className="mb-2 block text-xs uppercase tracking-[0.3em] text-chrome-500">End date</span>
              <input
                type="date"
                min={startDate}
                value={endDate}
                onChange={(e) => {
                  let end = e.target.value;
                  let start = startDate;

                  if (new Date(end) < new Date(start)) {
                    start = end;
                  }

                  [start, end] = clampRange(start, end);
                  setStartDate(start);
                  setEndDate(end);
                }}
                className="w-full rounded-2xl border border-white/10 bg-void-900 px-4 py-2 text-white outline-none transition focus:border-ion-400"
              />
            </label>
          </div>
        </div>
        <div className="mt-6 grid gap-4 text-center text-sm text-white sm:grid-cols-3">
          <div className="rounded-2xl border border-white/5 bg-white/5 px-4 py-3">
            <p className="text-2xl font-semibold">{asteroids.length || "—"}</p>
            <p className="text-xs uppercase tracking-[0.3em] text-chrome-500">Objects shown</p>
          </div>
          <div className="rounded-2xl border border-white/5 bg-white/5 px-4 py-3">
            <p className="text-2xl font-semibold">
              {new Date(startDate).toLocaleDateString(undefined, { month: "short", day: "numeric" })}
            </p>
            <p className="text-xs uppercase tracking-[0.3em] text-chrome-500">Range start</p>
          </div>
          <div className="rounded-2xl border border-white/5 bg-white/5 px-4 py-3">
            <p className="text-2xl font-semibold">
              {new Date(endDate).toLocaleDateString(undefined, { month: "short", day: "numeric" })}
            </p>
            <p className="text-xs uppercase tracking-[0.3em] text-chrome-500">Range end</p>
          </div>
        </div>
      </section>

      {loading && (
        <div className="panel border border-white/10 p-6 text-center text-sm text-chrome-300">Tracking near-Earth objects…</div>
      )}

      {error && !loading && (
        <div className="rounded-2xl border border-red-400/40 bg-red-500/10 p-4 text-sm text-red-100">{error?.message}</div>
      )}

      {!loading && !error && (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          {asteroids.length ? (
            asteroids.map((asteroid) => {
              const approach = asteroid.close_approach_data?.[0];
              const distance = Number(approach?.miss_distance?.kilometers)?.toLocaleString();
              const velocity = Number(approach?.relative_velocity?.kilometers_per_hour)?.toLocaleString();

              return (
                <article key={asteroid.id} className="neon-border rounded-3xl border border-white/10 bg-void-900 p-5">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-white">{asteroid.name}</h3>
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${
                        asteroid.is_potentially_hazardous_asteroid
                          ? "bg-red-500/20 text-red-100"
                          : "bg-emerald-500/20 text-emerald-100"
                      }`}
                    >
                      {asteroid.is_potentially_hazardous_asteroid ? "Hazard" : "Monitored"}
                    </span>
                  </div>
                  <dl className="mt-4 space-y-2 text-sm text-chrome-300">
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
            <div className="rounded-3xl border border-dashed border-white/20 p-8 text-center text-chrome-400">
              No near-Earth objects detected for the selected range.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
