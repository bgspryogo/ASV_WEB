import React, { createContext, useContext, useState } from "react";

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [viewState, setViewState] = useState(1);
  const [track, setTrack] = useState("A");
  const [mode, setMode] = useState("Auto");

  const trackSelector = () => {
    setTrack((prev) => (prev === "A" ? "B" : "A"));
  };

  const modeSelector = () => {
    setMode((prev) => (prev === "Auto" ? "Manual" : "Auto"));
  };

  const value = {
    viewState,
    setViewState,
    track,
    setTrack,
    trackSelector,
    mode,
    setMode,
    modeSelector,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useAppContext() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useAppContext must be used inside AppProvider");
  return ctx;
}
