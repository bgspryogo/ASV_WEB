import React from "react";
import { AppProvider } from "./context/Context";
import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "./assets/vite.svg";
import heroImg from "./assets/hero.png";
import { useAppContext } from "./context/Context.jsx";
import Navbar from "./navbar/Navbar.jsx";
import Monitoring from "./monitoring_page/Monitoring.jsx";
import DataLog from "./data_log/Data.jsx";
import "./App.css";

function AppContent() {
  const { viewState } = useAppContext();

  return (
    <>
      <Navbar />
      {viewState === 1 && <Monitoring />}
      {viewState === 2 && <DataLog />}
    </>
  );
}

function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default App;
