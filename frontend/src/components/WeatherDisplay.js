import React from "react";

const WeatherDisplay = ({ fetchWeather, weatherData, cumulativeRainfall, pincode, setPincode, loading }) => {
  return (
    <div className="space-y-4 mt-4">
      <div className="form-group">
        <label className="block text-sm font-medium text-gray-700">Pincode</label>
        <input
          type="text"
          value={pincode}
          onChange={(e) => setPincode(e.target.value)}
          placeholder="Enter Pincode (e.g., 793108)"
          className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500"
        />
      </div>
      {loading ? (
        <p className="text-gray-500">Loading weather data...</p>
      ) : weatherData ? (
        <div className="text-gray-700">
          <h2 className="text-lg font-semibold">Weather Information:</h2>
          <p>Temperature: {weatherData.current.temp} °C (Current)</p>
          <p>Humidity: {weatherData.current.humidity}% (Current)</p>
          <p>Rainfall: {cumulativeRainfall.toFixed(2)} mm (Next 7 Days)</p>
        </div>
      ) : pincode ? (
        <p className="text-red-500">Failed to load weather data. Check pincode or try again.</p>
      ) : null}
    </div>
  );
};

export default WeatherDisplay;