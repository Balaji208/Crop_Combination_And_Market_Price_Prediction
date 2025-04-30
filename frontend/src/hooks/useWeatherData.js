import { useState, useEffect } from "react";
import axios from "axios";

const useWeatherData = () => {
  const [weatherData, setWeatherData] = useState(null);
  const [cumulativeRainfall, setCumulativeRainfall] = useState(0);
  const [fetchWeather, setFetchWeather] = useState(false); // False by default
  const [autoFetch, setAutoFetch] = useState(false); // New state for auto-fetch
  const [pincode, setPincode] = useState(""); // Still allow pincode input
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const apiKey = "4fb4ab3828a77ad38f04560066b6bdd3"; // OpenWeatherMap API key

  const fetchWeatherData = async (lat, lon) => {
    console.log("Fetching weather data for lat:", lat, "lon:", lon);
    setLoading(true);
    try {
      const response = await axios.get(
        `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&hourly=temperature_2m,relative_humidity_2m&daily=precipitation_sum&timezone=Asia/Kolkata&forecast_days=7`
      );
      const data = response.data;
      console.log("Weather data received:", data);

      const currentHourIndex = 0;
      const currentTemp = data.hourly.temperature_2m[currentHourIndex];
      const currentHumidity = data.hourly.relative_humidity_2m[currentHourIndex];

      setWeatherData({
        current: { temp: currentTemp, humidity: currentHumidity },
        daily: data.daily.precipitation_sum.map((rain) => ({ rain: rain || 0 })),
      });

      const totalRainfall = data.daily.precipitation_sum
        .slice(0, 7)
        .reduce((sum, rain) => sum + (rain || 0), 0);
      setCumulativeRainfall(totalRainfall);

      setError("");
    } catch (err) {
      console.error("Weather fetch error:", err.message);
      setError(`Failed to fetch weather data: ${err.message}`);
      setWeatherData(null);
      setCumulativeRainfall(0);
    } finally {
      setLoading(false);
    }
  };

  const fetchCoordinatesFromPincode = async (pincode) => {
    console.log("Fetching coordinates for pincode:", pincode);
    if (!/^\d{6}$/.test(pincode)) {
      setError("Please enter a valid 6-digit Indian pincode.");
      return;
    }
    setLoading(true);
    try {
      const response = await axios.get(
        `http://api.openweathermap.org/geo/1.0/zip?zip=${pincode},IN&appid=${apiKey}`,
        { timeout: 5000 }
      );
      const { lat, lon } = response.data;
      console.log("Coordinates received:", { lat, lon });
      await fetchWeatherData(lat, lon);
    } catch (err) {
      console.error("Pincode fetch error:", err.response ? err.response.data : err.message);
      setError(`Invalid pincode or failed to fetch coordinates: ${err.message}`);
      setWeatherData(null);
      setCumulativeRainfall(0);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserLocation = () => {
    if (navigator.geolocation) {
      setLoading(true);
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          console.log("User location:", { latitude, longitude });
          fetchWeatherData(latitude, longitude);
        },
        (err) => {
          console.error("Geolocation error:", err.message);
          setError("Failed to access your location. Please allow location access or enter a pincode.");
          setWeatherData(null);
          setCumulativeRainfall(0);
          setLoading(false);
        },
        { timeout: 10000, enableHighAccuracy: true }
      );
    } else {
      setError("Geolocation is not supported by your browser.");
    }
  };

  useEffect(() => {
    if (fetchWeather) {
      if (autoFetch) {
        fetchUserLocation();
      } else if (pincode) {
        fetchCoordinatesFromPincode(pincode);
      } else {
        setWeatherData(null);
        setCumulativeRainfall(0);
        setError("Please enter a pincode or enable auto-fetch.");
      }
    } else {
      setWeatherData(null);
      setCumulativeRainfall(0);
      setError("");
    }
  }, [fetchWeather, autoFetch, pincode]);

  return {
    weatherData,
    cumulativeRainfall,
    fetchWeather,
    setFetchWeather,
    autoFetch,
    setAutoFetch,
    pincode,
    setPincode,
    error,
    setError,
    loading,
  };
};

export default useWeatherData;