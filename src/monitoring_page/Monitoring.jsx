import React, { useState, useEffect, useRef } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Polyline,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "./Monitoring.css";

// Fix default leaflet marker icons broken by Vite
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

const isDev = import.meta.env.DEV;

const TOP_VIEW_SRC = isDev ? "http://localhost:8889/top_view/" : "/top_view/";
const UNDERWATER_SRC = isDev
  ? "http://localhost:8889/underwater/"
  : "/underwater/";
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

const initialTelemetry = {
  battery: null,
  watchdog: null,
  sog: null,
  cog: null,
  coordinate: null, // { lat, lon }
};

// Custom boat marker icon
const boatIcon = L.divIcon({
  className: "",
  html: `<div style="
    width:12px;height:12px;
    background:#2f81f7;
    border:2px solid #fff;
    border-radius:50%;
    box-shadow:0 0 6px rgba(47,129,247,0.8);
  "></div>`,
  iconSize: [12, 12],
  iconAnchor: [6, 6],
});

// Waypoint marker icon
const waypointIcon = L.divIcon({
  className: "",
  html: `<div style="
    width:8px;height:8px;
    background:#f85149;
    border:2px solid #fff;
    border-radius:50%;
  "></div>`,
  iconSize: [8, 8],
  iconAnchor: [4, 4],
});

// Auto-pan map to follow the boat
function MapFollower({ position }) {
  const map = useMap();
  useEffect(() => {
    if (position) map.setView(position, map.getZoom(), { animate: true });
  }, [position, map]);
  return null;
}

function GPSMap({ coordinate, trackHistory, waypoints }) {
  const defaultPos = [-6.2, 106.8]; // fallback center
  const position = coordinate ? [coordinate.lat, coordinate.lon] : null;

  return (
    <MapContainer
      center={position ?? defaultPos}
      zoom={17}
      style={{ width: "100%", height: "100%" }}
      zoomControl={false}
    >
      {/* Online tile — falls back gracefully when offline */}
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>'
        errorTileUrl=""
      />

      {/* Waypoints */}
      {waypoints.map((wp, i) => (
        <Marker key={i} position={[wp.lat, wp.lon]} icon={waypointIcon} />
      ))}

      {/* Track history polyline */}
      {trackHistory.length > 1 && (
        <Polyline
          positions={trackHistory}
          color="#2f81f7"
          weight={2}
          opacity={0.7}
        />
      )}

      {/* Current boat position */}
      {position && (
        <>
          <Marker position={position} icon={boatIcon} />
          <MapFollower position={position} />
        </>
      )}
    </MapContainer>
  );
}

function Monitoring() {
  const [clock, setClock] = useState(formatNow());
  const [telemetry, setTelemetry] = useState(initialTelemetry);
  const [trackHistory, setTrackHistory] = useState([]); // [[lat, lon], ...]
  const [waypoints, setWaypoints] = useState([]); // [{ lat, lon }, ...]

  // Live clock
  useEffect(() => {
    const id = setInterval(() => setClock(formatNow()), 1000);
    return () => clearInterval(id);
  }, []);

  // Telemetry polling
  useEffect(() => {
    let cancelled = false;

    async function fetchTelemetry() {
      try {
        const res = await fetch(`${API_BASE}/api/telemetry`);
        if (!res.ok) return;
        const data = await res.json();
        if (!cancelled) {
          setTelemetry((prev) => ({ ...prev, ...data }));
          // Append to track history when coordinate updates
          if (data.coordinate) {
            setTrackHistory((prev) => [
              ...prev,
              [data.coordinate.lat, data.coordinate.lon],
            ]);
          }
        }
      } catch (err) {
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

  // Waypoint polling — Flask should expose /api/waypoints
  // returning [{ lat, lon }, ...]
  useEffect(() => {
    let cancelled = false;

    async function fetchWaypoints() {
      try {
        const res = await fetch(`${API_BASE}/api/waypoints`);
        if (!res.ok) return;
        const data = await res.json();
        if (!cancelled) setWaypoints(data);
      } catch (err) {
        console.log("[waypoints] fetch failed:", err.message);
      }
    }

    fetchWaypoints();
    const id = setInterval(fetchWaypoints, 5000); // less frequent
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
            <GPSMap
              coordinate={telemetry.coordinate}
              trackHistory={trackHistory}
              waypoints={waypoints}
            />
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
