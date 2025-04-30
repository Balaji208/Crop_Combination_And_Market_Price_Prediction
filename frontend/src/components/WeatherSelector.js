const WeatherSelector = ({ fetchWeather, setFetchWeather, autoFetch, setAutoFetch }) => (
  <div className="flex items-center space-x-4">
    <label className="flex items-center space-x-2">
      <input
        type="checkbox"
        checked={fetchWeather}
        onChange={(e) => setFetchWeather(e.target.checked)}
        className="h-5 w-5 text-green-600 rounded focus:ring-green-500"
      />
      <span className="text-gray-700">Fetch Weather Data</span>
    </label>
    {fetchWeather && (
      <label className="flex items-center space-x-2">
        <input
          type="checkbox"
          checked={autoFetch}
          onChange={(e) => setAutoFetch(e.target.checked)}
          className="h-5 w-5 text-blue-600 rounded focus:ring-blue-500"
        />
        <span className="text-gray-700">Use My Location</span>
      </label>
    )}
  </div>
);

export default WeatherSelector;