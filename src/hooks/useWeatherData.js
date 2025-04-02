import { useState, useEffect } from "react";
import axios from "axios";

const useWeatherData = (pincode) => {
  const [weatherData, setWeatherData] = useState(null);
  const [cumulativeRainfall, setCumulativeRainfall] = useState(0);
  const [fetchWeather, setFetchWeather] = useState(true);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const apiKey = "4fb4ab3828a77ad38f04560066b6bdd3"; // For OpenWeatherMap geocoding

  const fetchWeatherData = async (lat, lon) => {
    console.log("Fetching weather data for lat:", lat, "lon:", lon);
    try {
      const response = await axios.get(
        `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&hourly=temperature_2m,relative_humidity_2m&daily=precipitation_sum&timezone=Asia/Kolkata&forecast_days=7`
      );
      const data = response.data;
      console.log("Weather data received:", data);

      // Get current conditions from the latest hourly data
      const currentHourIndex = 0; // Use the first hour (most recent)
      const currentTemp = data.hourly.temperature_2m[currentHourIndex];
      const currentHumidity = data.hourly.relative_humidity_2m[currentHourIndex];

      // Structure weatherData to mimic previous format
      setWeatherData({
        current: {
          temp: currentTemp,
          humidity: currentHumidity,
        },
        daily: data.daily.precipitation_sum.map((rain) => ({
          rain: rain || 0,
        })),
      });

      // Calculate cumulative rainfall for 7 days
      const totalRainfall = data.daily.precipitation_sum
        .slice(0, 7)
        .reduce((sum, rain) => sum + (rain || 0), 0);
      setCumulativeRainfall(totalRainfall);

      setError("");
    } catch (err) {
      console.error("Weather fetch error:", err.message);
      setError(`Failed to fetch weather data from Open-Meteo: ${err.message}`);
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
      setLoading(false);
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
      setLoading(false);
    }
  };

  useEffect(() => {
    if (pincode && fetchWeather) {
      fetchCoordinatesFromPincode(pincode);
    } else {
      setWeatherData(null);
      setCumulativeRainfall(0);
      setError("");
      setLoading(false);
    }
  }, [pincode, fetchWeather]);

  return { weatherData, cumulativeRainfall, fetchWeather, setFetchWeather, error, setError, loading };
};

export default useWeatherData;