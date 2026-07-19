import React from "react";
import unjLogo from "../assets/unj.png";
import rcLogo from "../assets/robotic.jpg";
import { useNavigate, useLocation } from "react-router-dom";
import { useAppContext } from "../context/Context.jsx";
import "./Navbar.css";

function Navbar() {
  const { track, trackSelector, mode, modeSelector } = useAppContext();
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <nav>
      <div className="nav-left">
        <img src={unjLogo} alt="UNJ Logo" />
        <img src={rcLogo} alt="Jong Jayakarta Logo" />
        <div className="logoText">
          <p>Varuna Aether</p>
          <p>Universitas Negeri Jakarta</p>
        </div>
      </div>
      <div className="nav-right">
        <button
          className={`toggleView ${location.pathname === "/monitoring" ? "active" : ""}`}
          onClick={() => navigate("/monitoring")}
        >
          Monitoring
        </button>
        <button
          className={`toggleView ${location.pathname === "/tracker" ? "active" : ""}`}
          onClick={() => navigate("/tracker")}
        >
          Data Log
        </button>
        <button className="toggleView" onClick={trackSelector}>
          Track: {track}
        </button>
        <button className="toggleView" onClick={modeSelector}>
          Mode: {mode}
        </button>
      </div>
    </nav>
  );
}

export default Navbar;
