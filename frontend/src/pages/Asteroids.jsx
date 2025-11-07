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
      <section className="panel border border-slate-200 bg-white p-6">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Near-Earth Objects</p>
            <h2 className="mt-2 text-2xl font-semibold text-slate-900">Asteroid Watch</h2>
            <p className="mt-2 text-sm text-slate-600">
              Review NASA&apos;s rolling seven-day feed. Hazard tags, miss distance, and velocity are surfaced per object.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="text-sm text-slate-700">
              <span className="mb-2 block text-xs uppercase tracking-[0.3em] text-slate-500">Start date</span>
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
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2 text-slate-900 outline-none focus:border-indigo-400"
              />
            </label>
            <label className="text-sm text-slate-700">
              <span className="mb-2 block text-xs uppercase tracking-[0.3em] text-slate-500">End date</span>
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
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2 text-slate-900 outline-none focus:border-indigo-400"
              />
            </label>
          </div>
        </div>
        <div className="mt-6 grid gap-4 text-center text-sm text-slate-900 sm:grid-cols-3">
          <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
            <p className="text-2xl font-semibold">{asteroids.length || "—"}</p>
            <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Objects shown</p>
          </div>
          <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
            <p className="text-2xl font-semibold">
              {new Date(startDate).toLocaleDateString(undefined, { month: "short", day: "numeric" })}
            </p>
            <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Range start</p>
          </div>
          <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
            <p className="text-2xl font-semibold">
              {new Date(endDate).toLocaleDateString(undefined, { month: "short", day: "numeric" })}
            </p>
            <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Range end</p>
          </div>
        </div>
      </section>

      {loading && (
        <div className="panel border border-slate-200 bg-white p-6 text-center text-sm text-slate-600">
          Tracking near-Earth objects…
        </div>
      )}

      {error && !loading && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error?.message}</div>
      )}

      {!loading && !error && (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          {asteroids.length ? (
            asteroids.map((asteroid) => {
              const approach = asteroid.close_approach_data?.[0];
              const distance = Number(approach?.miss_distance?.kilometers)?.toLocaleString();
              const velocity = Number(approach?.relative_velocity?.kilometers_per_hour)?.toLocaleString();

              return (
                <article key={asteroid.id} className="neon-border rounded-2xl bg-white p-5">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-slate-900">{asteroid.name}</h3>
                    <span
                      className={`rounded-full border px-3 py-1 text-xs font-semibold ${
                        asteroid.is_potentially_hazardous_asteroid
                          ? "border-red-200 bg-red-50 text-red-700"
                          : "border-emerald-200 bg-emerald-50 text-emerald-700"
                      }`}
                    >
                      {asteroid.is_potentially_hazardous_asteroid ? "Hazard" : "Monitored"}
                    </span>
                  </div>
                  <dl className="mt-4 space-y-2 text-sm text-slate-600">
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
            <div className="rounded-2xl border border-dashed border-slate-200 p-8 text-center text-slate-500">
              No near-Earth objects detected for the selected range.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
