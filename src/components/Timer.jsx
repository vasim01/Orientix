import { useState, useEffect, useRef } from "react";

export default function Timer() {
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isTimeUp, setIsTimeUp] = useState(false);

  const timerAudio = useRef(null);
  const intervalRef = useRef(null);

  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;

  // Unlock audio for iOS Safari
  const unlockAudio = () => {
    const a = timerAudio.current;
    if (!a) return;

    if (!window.audioCtx) {
      window.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }

    window.audioCtx.resume().then(() => {
      a.muted = true;
      a.loop = true;
      const p = a.play();
      if (p && typeof p.then === "function") {
        p.then(() => {
          a.pause();
          a.currentTime = 0;
          a.muted = false;
        }).catch(() => {});
      }
    });
  };

  // Timer countdown logic
  useEffect(() => {
    if (isRunning && !isPaused && time > 0) {
      intervalRef.current = setInterval(() => setTime((prev) => prev - 1), 1000);
    } else if (time === 0 && isRunning) {
      clearInterval(intervalRef.current);
      setIsRunning(false);
      setIsTimeUp(true);

      const a = timerAudio.current;
      if (a) {
        const p = a.play();
        if (p && typeof p.then === "function") {
          p.catch(() => console.warn("⚠️ iOS blocked audio."));
        }
      }
    }
    return () => clearInterval(intervalRef.current);
  }, [isRunning, isPaused, time]);

  const startTimer = () => {
    if (time <= 0) {
      alert("Please set a valid time first.");
      return;
    }
    setIsRunning(true);
    setIsPaused(false);
    setIsTimeUp(false);
    unlockAudio();
  };

  const pauseResumeTimer = () => {
    setIsPaused((prev) => !prev);
  };

  const stopAlert = () => {
    setIsTimeUp(false);
    if (timerAudio.current) {
      timerAudio.current.pause();
      timerAudio.current.currentTime = 0;
    }
    setIsRunning(false);
    setIsPaused(false);
  };

  const setCustomTimer = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const mm = parseInt(formData.get("mm") || "0");
    const ss = parseInt(formData.get("ss") || "0");
    setTime(mm * 60 + ss);
    setIsRunning(false);
    setIsPaused(false);
    setIsTimeUp(false);
  };

  const resetTimer = () => {
    setIsRunning(false);
    setTime(0);
    setIsTimeUp(false);
    if (timerAudio.current) {
      timerAudio.current.pause();
      timerAudio.current.currentTime = 0;
    }
  };

  const formatTime = (t) => {
    const minutes = Math.floor(t / 60).toString().padStart(2, "0");
    const seconds = (t % 60).toString().padStart(2, "0");
    return `${minutes}:${seconds}`;
  };

  return (
    <div className="flex flex-col items-center justify-center p-6">
      <h2 className="text-2xl font-bold mb-4">⏳ Timer</h2>
      <p className="text-xl font-mono mb-4">{formatTime(time)}</p>

      {/* Custom input */}
      <form onSubmit={setCustomTimer} className="flex space-x-2 mb-4">
        <input
          name="mm"
          type="number"
          min="0"
          max="59"
          placeholder="MM"
          className="w-16 p-2 border rounded text-black"
          disabled={isRunning}
        />
        <input
          name="ss"
          type="number"
          min="0"
          max="59"
          placeholder="SS"
          className="w-16 p-2 border rounded text-black"
          disabled={isRunning}
        />
        <button
          type="submit"
          className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
          disabled={isRunning}
        >
          Set Time
        </button>
      </form>

      {/* Controls */}
      <div className="flex space-x-4 mb-4">
        <button
          onClick={startTimer}
          className={`px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition ${
            isRunning || time === 0 ? "opacity-50 cursor-not-allowed" : ""
          }`}
          disabled={isRunning || time === 0}
        >
          Start
        </button>
        <button
          onClick={pauseResumeTimer}
          className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition"
          disabled={!isRunning}
        >
          {isPaused ? "Play" : "Pause"}
        </button>
        <button
          onClick={stopAlert}
          className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
        >
          Reset
        </button>
      </div>

      {/* Alert */}
      {isTimeUp && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-yellow-100 dark:bg-yellow-200 rounded-2xl p-6 w-80 text-center shadow-2xl animate-fade-in">
            <p className="text-xl font-bold text-red-600 mb-4">⏰ Time’s up!</p>
            <button
              onClick={stopAlert}
              className="bg-red-600 text-white font-semibold py-2 px-6 rounded-full shadow hover:bg-red-700 transition"
            >
              Stop
            </button>
          </div>
        </div>
      )}

      <audio ref={timerAudio} src="assets/timer.mp3" preload="auto" loop />
    </div>
  );
}
