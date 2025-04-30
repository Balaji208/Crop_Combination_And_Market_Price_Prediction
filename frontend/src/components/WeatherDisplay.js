const WeatherDisplay = ({
  fetchWeather,
  weatherData,
  cumulativeRainfall,
  pincode,
  setPincode,
  autoFetch,
}) => (
  <div>
    {!autoFetch && (
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">Pincode</label>
        <input
          type="text"
          value={pincode}
          onChange={(e) => setPincode(e.target.value)}
          placeholder="Enter 6-digit pincode"
          className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          disabled={!fetchWeather}
        />
      </div>
    )}
    {fetchWeather && weatherData && (
      <div className="text-gray-700">
        <p>Current Temperature: {weatherData.current.temp} °C</p>
        <p>Current Humidity: {weatherData.current.humidity} %</p>
        <p>7-Day Cumulative Rainfall: {cumulativeRainfall.toFixed(2)} mm</p>
      </div>
    )}
  </div>
);

export default WeatherDisplay;