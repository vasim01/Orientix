import React, { useState, useEffect } from "react";

const Weather = () => {
  const [weather, setWeather] = useState(null);
  const [location, setLocation] = useState({ city: "", country: "" });
  const [quote, setQuote] = useState("");
  const [theme, setTheme] = useState({ bg: "bg-white/90", icon: "☀️", text: "text-gray-800" });

  const cheerfulQuotes = [
    "Happiness is a warm sunbeam on a cloudy day.",
    "Smiles are contagious, let’s start an epidemic!",
    "Every cloud has a silver lining — go find it!",
    "Your vibe attracts your tribe — keep it cheerful!",
    "Life is better when you’re laughing."
  ];

  const inspiringQuotes = [
    "Even the darkest clouds can't hide the sun forever.",
    "Storms make trees take deeper roots.",
    "Believe in yourself and all that you are.",
    "Your only limit is you.",
    "Rise above the weather, and shine!"
  ];

  const flirtyQuotes = [
    "Are you a sunny day? Because you just brightened my mood!",
    "Is it the weather, or did you just make my heart race?",
    "I must be a snowflake, because I've fallen for you.",
    "Are you a breeze? Because you just blew me away!",
    "Are you the rain? Because you make everything feel fresh.",
    "Do you have a map? I keep getting lost in your eyes.",
    "You must be the sun, because you light up my world.",
    "Are you lightning? Because you just struck me!",
    "If kisses were raindrops, I’d send you a storm.",
    "Are you the clouds? Because you make my heart float."
  ];

  const weatherCodeMap = {
    0: { icon: "☀️", bg: "bg-yellow-200/80", text: "text-gray-800", type: "sunny" },
    1: { icon: "🌤", bg: "bg-yellow-100/80", text: "text-gray-800", type: "sunny" },
    2: { icon: "⛅", bg: "bg-gray-100/70", text: "text-gray-800", type: "cloudy" },
    3: { icon: "☁️", bg: "bg-gray-200/70", text: "text-gray-800", type: "cloudy" },
    45: { icon: "🌫", bg: "bg-gray-200/60", text: "text-gray-700", type: "cloudy" },
    48: { icon: "🌫", bg: "bg-gray-200/60", text: "text-gray-700", type: "cloudy" },
    51: { icon: "🌦", bg: "bg-blue-100/70", text: "text-gray-800", type: "rainy" },
    53: { icon: "🌦", bg: "bg-blue-200/70", text: "text-gray-800", type: "rainy" },
    55: { icon: "🌦", bg: "bg-blue-300/70", text: "text-gray-800", type: "rainy" },
    61: { icon: "🌧", bg: "bg-indigo-100/70", text: "text-gray-800", type: "rainy" },
    63: { icon: "🌧", bg: "bg-indigo-200/70", text: "text-gray-800", type: "rainy" },
    65: { icon: "🌧", bg: "bg-indigo-300/70", text: "text-gray-800", type: "rainy" },
    71: { icon: "❄️", bg: "bg-sky-100/70", text: "text-gray-800", type: "snowy" },
    73: { icon: "❄️", bg: "bg-sky-200/70", text: "text-gray-800", type: "snowy" },
    75: { icon: "❄️", bg: "bg-sky-300/70", text: "text-gray-800", type: "snowy" },
    80: { icon: "🌧", bg: "bg-indigo-200/70", text: "text-gray-800", type: "rainy" },
    81: { icon: "🌧", bg: "bg-indigo-300/70", text: "text-gray-800", type: "rainy" },
    82: { icon: "🌧", bg: "bg-indigo-400/70", text: "text-gray-800", type: "rainy" },
    95: { icon: "⛈", bg: "bg-indigo-400/70", text: "text-gray-800", type: "stormy" },
    96: { icon: "⛈", bg: "bg-indigo-400/70", text: "text-gray-800", type: "stormy" },
    99: { icon: "⛈", bg: "bg-indigo-500/70", text: "text-gray-800", type: "stormy" }
  };

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;
          fetchWeather(latitude, longitude);
          fetchLocation(latitude, longitude);
        },
        () => {
          fetchWeather(28.61, 77.21);
          fetchLocation(28.61, 77.21);
        }
      );
    } else {
      fetchWeather(28.61, 77.21);
      fetchLocation(28.61, 77.21);
    }
  }, []);

  const fetchWeather = async (lat, lon) => {
    try {
      const res = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`
      );
      const data = await res.json();
      setWeather(data.current_weather);
      updateTheme(data.current_weather);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchLocation = async (lat, lon) => {
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lon}`
      );
      const data = await res.json();
      setLocation({
        city: data.address.city || data.address.town || data.address.village || "",
        country: data.address.country || ""
      });
    } catch (err) {
      console.error(err);
    }
  };

  const updateTheme = (weather) => {
    if (!weather) return;
    const code = weather.weathercode;
    const mapped = weatherCodeMap[code] || { bg: "bg-white/90", icon: "🌤", text: "text-gray-800", type: "sunny" };
    setTheme({ bg: mapped.bg, icon: mapped.icon, text: mapped.text });
    pickQuote(mapped.type);
  };

  const pickQuote = (type) => {
    let list = [];
    switch (type) {
      case "sunny":
        list = cheerfulQuotes;
        break;
      case "cloudy":
      case "rainy":
      case "stormy":
        list = inspiringQuotes;
        break;
      case "snowy":
        list = flirtyQuotes;
        break;
      default:
        list = [...cheerfulQuotes, ...inspiringQuotes, ...flirtyQuotes];
    }
    setQuote(list[Math.floor(Math.random() * list.length)]);
  };

  return (
    <div className={`max-w-sm mx-auto p-6 rounded-3xl shadow-2xl backdrop-blur-md transition-all duration-1000 ${theme.bg} ${theme.text} flex flex-col items-center justify-center text-center`}>
      <h2 className="text-2xl font-bold mb-3">{theme.icon} Weather of the Day</h2>
      {weather ? (
        <>
          <p className="text-lg font-medium mb-1">
            {weather.temperature}°C • {weather.windspeed} km/h wind
          </p>
          <p className="text-sm text-gray-700 mb-3">
            {location.city}, {location.country}
          </p>
          <blockquote className="italic text-gray-800 text-sm">
            "{quote}"
          </blockquote>
        </>
      ) : (
        <p className="text-gray-500">Loading...</p>
      )}
    </div>
  );
};

export default Weather;
