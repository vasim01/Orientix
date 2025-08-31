import React, { useState, useEffect } from "react";
import AlarmClock from "./components/AlarmClock";
import Stopwatch from "./components/Stopwatch";
import Timer from "./components/Timer";
import Weather from "./components/Weather";

function App() {
  const [orientation, setOrientation] = useState("portrait-primary");
  const currentYear = new Date().getFullYear();

  useEffect(() => {
    const updateOrientation = () => {
      if (screen.orientation) {
        setOrientation(screen.orientation.type);
      } else if (window.orientation !== undefined) {
        if (window.orientation === 0) setOrientation("portrait-primary");
        else if (window.orientation === 90) setOrientation("landscape-primary");
        else if (window.orientation === -90 || window.orientation === 270)
          setOrientation("landscape-secondary");
        else if (window.orientation === 180)
          setOrientation("portrait-secondary");
      }
    };

    window.addEventListener("orientationchange", updateOrientation);
    updateOrientation();
    return () =>
      window.removeEventListener("orientationchange", updateOrientation);
  }, []);

  // Map orientation to human-readable text
  const orientationMapping = {
    "portrait-primary": "Portrait Mode (Upright Orientation)",
    "landscape-primary": "Landscape Mode (Right-Side Up Orientation)",
    "portrait-secondary": "Portrait Mode (Upside Down Orientation)",
    "landscape-secondary": "Landscape Mode (Right-Side Up Orientation)",
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-purple-400 via-pink-400 to-indigo-500 text-white p-4 transition-all duration-700">
      <h1 className="text-3xl md:text-4xl font-extrabold mb-6 drop-shadow-lg animate-bounce">
        📱 Orientix
      </h1>

      <div className="w-full max-w-md mx-auto">
        <div className="bg-white/30 backdrop-blur-md rounded-2xl shadow-xl p-6 mb-4 transition-all duration-500 animate-fade-in">
          {orientation === "portrait-primary" && <AlarmClock />}
          {orientation === "landscape-primary" && <Stopwatch />}
          {orientation === "portrait-secondary" && <Timer />}
          {orientation === "landscape-secondary" && <Weather />}
        </div>
      </div>

      <p className="mt-6 text-white/90 text-sm md:text-base text-center font-medium">
        Current Orientation:{" "}
        <b>{orientationMapping[orientation] || orientation}</b>
      </p>

      {/* Footer */}
      <footer className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50 bg-white/20 backdrop-blur-md text-white/90 px-4 py-2 rounded-full text-sm shadow-md">
        © {currentYear} • Developed by <strong>Vasim</strong> • Orientix v1.0
      </footer>
    </div>
  );
}

export default App;
