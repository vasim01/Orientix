import React, { useState, useRef } from "react";

const Stopwatch = () => {
  const [time, setTime] = useState(0); // total seconds
  const [isRunning, setIsRunning] = useState(false);
  const [laps, setLaps] = useState([]);
  const intervalRef = useRef(null);

  // Format time as HH:MM:SS
  const formatTime = (t) => {
    const hours = Math.floor(t / 3600).toString().padStart(2, "0");
    const minutes = Math.floor((t % 3600) / 60).toString().padStart(2, "0");
    const seconds = (t % 60).toString().padStart(2, "0");
    return `${hours}:${minutes}:${seconds}`;
  };

  const startPause = () => {
    if (isRunning) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
      setIsRunning(false);
    } else {
      intervalRef.current = setInterval(() => {
        setTime((t) => t + 1);
      }, 1000);
      setIsRunning(true);
    }
  };

  const reset = () => {
    clearInterval(intervalRef.current);
    intervalRef.current = null;
    setTime(0);
    setIsRunning(false);
    setLaps([]);
  };

  const recordLap = () => {
    if (isRunning) setLaps((prev) => [formatTime(time), ...prev]);
  };

  return (
    <div className="text-center p-6">
      <h2 className="text-2xl font-bold mb-2">⏱ Stopwatch</h2>
      <p className="text-xl font-mono mb-4">{formatTime(time)}</p>

      <div className="flex justify-center gap-2 mb-4">
        <button
          onClick={startPause}
          className={`bg-white/80 text-purple-600 font-bold py-2 px-4 rounded-full shadow-lg hover:scale-105 transition-all`}
        >
          {isRunning ? "Pause" : "Start"}
        </button>
        <button
          onClick={reset}
          className="bg-red-500/80 text-white font-bold py-2 px-4 rounded-full shadow-lg hover:scale-105 transition-all"
        >
          Reset
        </button>
        <button
          onClick={recordLap}
          className="bg-green-500/80 text-white font-bold py-2 px-4 rounded-full shadow-lg hover:scale-105 transition-all"
          disabled={!isRunning}
        >
          Lap
        </button>
      </div>

      {laps.length > 0 && (
        <div className="text-left max-w-xs mx-auto mt-4">
          <h3 className="font-semibold mb-2">Laps:</h3>
          <ol className="list-decimal list-inside">
            {laps.map((lap, index) => (
              <li key={index}>{lap}</li>
            ))}
          </ol>
        </div>
      )}
    </div>
  );
};

export default Stopwatch;
