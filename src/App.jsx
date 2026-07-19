import React from "react";
import { AppProvider } from "./context/Context";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./navbar/Navbar.jsx";
import Monitoring from "./monitoring_page/Monitoring.jsx";
import DataLog from "./data_log/Data.jsx";
import "./App.css";

function AppContent() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Navigate to="/monitoring" replace />} />
        <Route path="/monitoring" element={<Monitoring />} />
        <Route path="/tracker" element={<DataLog />} />
      </Routes>
    </>
  );
}

function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </AppProvider>
  );
}

export default App;
