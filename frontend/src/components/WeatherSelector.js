import React from "react";

const WeatherSelector = ({ fetchWeather, setFetchWeather }) => (
  <div className="form-group mt-4">
    <label className="block text-sm font-medium text-gray-700">Weather Data Source</label>
    <select
      value={fetchWeather}
      onChange={(e) => setFetchWeather(e.target.value === "true")}
      className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500"
    >
      <option value="true">Fetch Automatically</option>
      <option value="false">Fetch on Pincode Input</option>
    </select>
  </div>
);

export default WeatherSelector;