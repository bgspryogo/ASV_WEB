import React, { useState, useEffect } from "react";
import "./Monitoring.css";

// Vite: import.meta.env.DEV. If using Create React App instead,
// swap this for: process.env.NODE_ENV === "development"
const isDev = import.meta.env.DEV;

const TOP_VIEW_SRC = isDev ? "http://localhost:8889/top_view/" : "/top_view/";

const UNDERWATER_SRC = isDev
  ? "http://localhost:8889/underwater/"
  : "/underwater/";

// Flask backend base URL — swap this once your API is live
const API_BASE = isDev ? "http://localhost:5000" : "";

const DAY_SHORT = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
const MONTH_SHORT = [
  "JAN",
  "FEB",
  "MAR",
  "APR",
  "MAY",
  "JUN",
  "JUL",
  "AUG",
  "SEP",
  "OCT",
  "NOV",
  "DEC",
];

function formatNow() {
  const now = new Date();
  const day = DAY_SHORT[now.getDay()];
  const dd = String(now.getDate()).padStart(2, "0");
  const mon = MONTH_SHORT[now.getMonth()];
  const yyyy = now.getFullYear();
  const hh = String(now.getHours()).padStart(2, "0");
  const mm = String(now.getMinutes()).padStart(2, "0");
  const ss = String(now.getSeconds()).padStart(2, "0");
  return `${day}, ${dd} ${mon} ${yyyy}, ${hh}:${mm}:${ss}`;
}

// Default shape for telemetry — mirrors what /api/telemetry should return.
// Fill in real fields as your MAVLink bridge exposes them.
const initialTelemetry = {
  battery: null, // e.g. { percent: 87, voltage: 12.4 }
  watchdog: null, // e.g. { status: "OK", lastPing: "2026-07-18T10:22:00Z" }
  sog: null, // e.g. 2.3 (knots)
  cog: null, // e.g. 184 (degrees)
  coordinate: null, // e.g. { lat: -6.2, lon: 106.8 }
};

function Monitoring() {
  const [clock, setClock] = useState(formatNow());
  const [telemetry, setTelemetry] = useState(initialTelemetry);

  // Live clock
  useEffect(() => {
    const id = setInterval(() => setClock(formatNow()), 1000);
    return () => clearInterval(id);
  }, []);

  // Telemetry polling — swap the fetch URL/parsing once the Flask
  // endpoint is ready. Currently a no-op if the fetch fails, so the
  // UI just keeps showing placeholders instead of crashing.
  useEffect(() => {
    let cancelled = false;

    async function fetchTelemetry() {
      try {
        const res = await fetch(`${API_BASE}/api/telemetry`);
        if (!res.ok) return;
        const data = await res.json();
        if (!cancelled) setTelemetry((prev) => ({ ...prev, ...data }));
      } catch (err) {
        // Backend not up yet — safe to ignore during development
        console.log("[telemetry] fetch failed:", err.message);
      }
    }

    fetchTelemetry();
    const id = setInterval(fetchTelemetry, 1000);
    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, []);

  return (
    <main className="page-body">
      <div className="monitoring-grid">
        {/* LEFT: Webcam feeds */}
        <div className="webcam-stack">
          <div className="panel webcam-panel">
            <span className="panel__label">Top View</span>
            <iframe
              className="panel__feed"
              src={TOP_VIEW_SRC}
              frameBorder="0"
              scrolling="no"
              title="Top View"
            />
          </div>

          <div className="panel webcam-panel">
            <span className="panel__label">Underwater</span>
            <iframe
              className="panel__feed"
              src={UNDERWATER_SRC}
              frameBorder="0"
              scrolling="no"
              title="Underwater"
            />
          </div>
        </div>

        {/* MIDDLE: Battery / Watchdog + GPS */}
        <div className="middle-column">
          <div className="sog-cog-row">
            <div className="panel data-panel">
              <span className="panel__label">Battery</span>
              {telemetry.battery && (
                <span className="panel__value">
                  {telemetry.battery.percent}%
                </span>
              )}
            </div>
            <div className="panel data-panel">
              <span className="panel__label">Watchdog Time</span>
              {telemetry.watchdog && (
                <span className="panel__value">
                  {telemetry.watchdog.status}
                </span>
              )}
            </div>
          </div>

          <div className="panel gps-panel">
            <span className="panel__label">GPS View</span>
            <span className="panel__label panel__label--right">{clock}</span>
          </div>
        </div>

        {/* RIGHT: Info cards */}
        <div className="info-stack">
          <div className="panel info-panel">
            <span className="panel__label">SOG</span>
            {telemetry.sog !== null && (
              <span className="panel__value">{telemetry.sog} kn</span>
            )}
          </div>
          <div className="panel info-panel">
            <span className="panel__label">COG</span>
            {telemetry.cog !== null && (
              <span className="panel__value">{telemetry.cog}°</span>
            )}
          </div>
          <div className="panel info-panel">
            <span className="panel__label">Coordinate</span>
            {telemetry.coordinate && (
              <span className="panel__value">
                {telemetry.coordinate.lat.toFixed(4)},{" "}
                {telemetry.coordinate.lon.toFixed(4)}
              </span>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}

export default Monitoring;
