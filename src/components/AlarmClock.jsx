import React, { useState, useEffect, useRef } from "react";

const AlarmClock = () => {
  const [time, setTime] = useState(new Date());
  const [alarmTime, setAlarmTime] = useState(""); // "HH:MM:SS"
  const [alarmSet, setAlarmSet] = useState(false);
  const [alarmTriggered, setAlarmTriggered] = useState(false);
  const alarmAudio = useRef(null);

  // Detect iOS devices
  const isIOS =
    /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;

  // Update time every second
  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  // Unlock audio for iOS Safari
  const unlockAudio = () => {
    const a = alarmAudio.current;
    if (!a) return;

    // Create AudioContext for iOS
    if (!window.audioCtx) {
      window.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }

    // Resume AudioContext on user gesture
    window.audioCtx.resume().then(() => {
      a.muted = true;
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

  // Trigger alarm
  useEffect(() => {
    if (!alarmSet || !alarmTime) return;

    const current = time.toTimeString().slice(0, 8); // HH:MM:SS
    if (current === alarmTime && !alarmTriggered) {
      setAlarmTriggered(true);
      setAlarmSet(false);

      const a = alarmAudio.current;
      let audioPlayed = false;

      if (a) {
        a.loop = true;
        const p = a.play();
        if (p && typeof p.then === "function") {
          p
            .then(() => {
              audioPlayed = true;
            })
            .catch(() => {
              console.warn(
                "⚠️ iOS blocked autoplay. Only showing alert."
              );
            });
        }
      }

      // For iOS, even if audio is blocked, show alert
      if (isIOS && !audioPlayed) {
        setAlarmTriggered(true);
      }
    }
  }, [time, alarmSet, alarmTime, alarmTriggered, isIOS]);

  const handleSetAlarm = () => {
    if (!alarmTime) {
      window.alert("Please select a valid time.");
      return;
    }

    // Add seconds :00 if not provided
  let timeWithSeconds = alarmTime;
  if (alarmTime.length === 5) { // HH:MM
    timeWithSeconds += ":00";
  }

  setAlarmTime(timeWithSeconds);
    setAlarmSet(true);
    setAlarmTriggered(false);
    unlockAudio(); // prime audio for iOS
  };

  const handleResetAlarm = () => {
    setAlarmSet(false);
    setAlarmTriggered(false);
    setAlarmTime("");
    if (alarmAudio.current) {
      alarmAudio.current.pause();
      alarmAudio.current.currentTime = 0;
      alarmAudio.current.loop = false;
    }
    unlockAudio(); // also prime on reset
  };

  const stopRinging = () => {
    setAlarmTriggered(false);
    if (alarmAudio.current) {
      alarmAudio.current.pause();
      alarmAudio.current.currentTime = 0;
      alarmAudio.current.loop = false;
    }
  };

  // Helper to convert "HH:MM:SS" to 12-hour format
  const formatTo12Hour = (time24) => {
    if (!time24) return "";
    const [hh, mm, ss] = time24.split(":");
    let hour = parseInt(hh, 10);
    const ampm = hour >= 12 ? "PM" : "AM";
    hour = hour % 12;
    if (hour === 0) hour = 12;
    return `${hour.toString().padStart(2, "0")}:${mm}:${ss} ${ampm}`;
  };

  return (
    <div className="text-center">
      <h2 className="text-2xl font-bold mb-2">⏰ Alarm Clock</h2>
      <p className="text-xl font-mono mb-4">{time.toLocaleTimeString()}</p>

      <div className="flex justify-center items-center gap-2">
        <input
          type="time"
          step="1"
          value={alarmTime}
          onChange={(e) => setAlarmTime(e.target.value)}
          className="p-2 rounded-md text-black"
        />
        <button
          onClick={handleSetAlarm}
          className="bg-white/80 text-purple-600 font-bold py-2 px-4 rounded-full shadow-lg hover:scale-105 transition-all"
        >
          Set Alarm
        </button>
        <button
          onClick={handleResetAlarm}
          className="bg-red-500/80 text-white font-bold py-2 px-4 rounded-full shadow-lg hover:scale-105 transition-all"
        >
          Reset
        </button>
      </div>

      {alarmSet && (
        <p className="mt-2 text-white/80">Alarm set for {formatTo12Hour(alarmTime)}</p>
      )}

      {alarmTriggered && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 transition-opacity">
          <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 w-80 text-center shadow-2xl animate-fade-in">
            <h3 className="text-2xl font-bold mb-2 text-red-600">⏰ Alarm Ringing!</h3>
            <p className="mb-4 text-gray-700 dark:text-gray-200">Time: {formatTo12Hour(alarmTime)}</p>
            <button
              onClick={stopRinging}
              className="bg-red-600 text-white font-semibold py-2 px-6 rounded-full shadow hover:bg-red-700 transition"
            >
              Stop Alarm
            </button>
          </div>
        </div>
      )}

      <audio ref={alarmAudio} src="assets/alarm.mp3" preload="auto" />
    </div>
  );
};

export default AlarmClock;
