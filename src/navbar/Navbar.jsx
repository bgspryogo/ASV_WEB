import React from "react";
import unjLogo from "../assets/unj.png";
import rcLogo from "../assets/robotic.jpg";
import { useAppContext } from "../context/Context.jsx";
import "./Navbar.css";

function Navbar() {
  const { viewState, setViewState, track, trackSelector, mode, modeSelector } =
    useAppContext();

  return (
    <nav>
      <div className="nav-left">
        <img src={unjLogo} alt="UNJ Logo" />
        <img src={rcLogo} alt="Jong Jayakarta Logo" />
        <div className="logoText">
          <p>Varuna Aether </p>
          <p>Universitas Negeri Jakarta</p>
        </div>
      </div>
      <div className="nav-right">
        <button
          className={`toggleView ${viewState === 1 ? "active" : ""}`}
          onClick={() => setViewState(1)}
        >
          Monitoring
        </button>
        <button
          className={`toggleView ${viewState === 2 ? "active" : ""}`}
          onClick={() => setViewState(2)}
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
