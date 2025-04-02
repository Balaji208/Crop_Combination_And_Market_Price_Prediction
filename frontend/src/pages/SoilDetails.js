import React from "react";
import { useNavigate } from "react-router-dom";
import SoilInputForm from "../components/SoilInputForm";
import WeatherSelector from "../components/WeatherSelector";
import WeatherDisplay from "../components/WeatherDisplay";
import ErrorMessage from "../components/ErrorMessage";
import useWeatherData from "../hooks/useWeatherData";
import axios from "axios";
import { Sprout } from "lucide-react";

const SoilDetails = () => {
  const navigate = useNavigate();

  const [pincode, setPincode] = React.useState("");
  const [soilData, setSoilData] = React.useState({
    nitrogen: "",
    potassium: "",
    phosphorus: "",
    ph: "",
  });
  const [error, setError] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  const {
    weatherData,
    cumulativeRainfall,
    fetchWeather,
    setFetchWeather,
    error: weatherError,
    setError: setWeatherError,
  } = useWeatherData(pincode);

  const handlePredict = async () => {
    const { nitrogen, phosphorus, potassium, ph } = soilData;

    if (!nitrogen || !phosphorus || !potassium || !ph) {
      setError("Please fill in all soil composition fields (N, P, K, pH).");
      return;
    }

    if (!pincode) {
      setError("Please enter a pincode to fetch weather data.");
      return;
    }

    if (!weatherData) {
      setError("Weather data not available. Please check your pincode and try again.");
      return;
    }

    const requestData = {
      N: Number(nitrogen),
      P: Number(phosphorus),
      K: Number(potassium),
      temperature: weatherData.current.temp || 0,
      humidity: weatherData.current.humidity || 0,
      ph: Number(ph),
      rainfall: cumulativeRainfall || 0, // Use 8-day cumulative rainfall
    };

    setLoading(true);
    try {
      const response = await axios.post("http://127.0.0.1:5000/predict", requestData);
      const prediction = response.data;
      navigate("/result", { state: { prediction } });
    } catch (err) {
      console.error("Error:", err);
      setError("Failed to get prediction.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-green-100 py-12 px-4">
      <div className="container mx-auto max-w-4xl mb-8">
        <div className="flex items-center justify-center mb-6">
          <Sprout size={40} className="text-green-600" />
          <h1 className="text-3xl font-bold text-green-700">AgriPredict</h1>
        </div>

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-green-600 to-green-700 py-6 px-8">
            <h2 className="text-2xl font-bold text-white mb-2">Land Details & Weather</h2>
            <p className="text-green-100">
              Enter your soil composition and pincode to get optimal crop recommendations
            </p>
          </div>

          <div className="p-8">
            <div className="bg-green-50 p-6 rounded-xl mb-8 border border-green-100 shadow-sm">
              <h3 className="text-lg font-semibold text-green-800 mb-4 flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-2 text-green-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
                  />
                </svg>
                Soil Composition
              </h3>
              <SoilInputForm soilData={soilData} setSoilData={setSoilData} />
            </div>

            <div className="bg-blue-50 p-6 rounded-xl mb-6 border border-blue-100 shadow-sm">
              <h3 className="text-lg font-semibold text-blue-800 mb-4 flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-2 text-blue-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z"
                  />
                </svg>
                Weather Information
              </h3>
              <WeatherSelector fetchWeather={fetchWeather} setFetchWeather={setFetchWeather} />
              <div className="mt-4">
                <WeatherDisplay
                  fetchWeather={fetchWeather}
                  weatherData={weatherData}
                  cumulativeRainfall={cumulativeRainfall}
                  pincode={pincode}
                  setPincode={setPincode}
                />
              </div>
            </div>

            <ErrorMessage error={error || weatherError} />

            <div className="flex items-center justify-between mt-8">
              <button
                onClick={() => navigate("/")}
                className="px-6 py-3 bg-white border border-green-500 text-green-600 rounded-lg hover:bg-green-50 focus:ring-2 focus:ring-green-200 focus:outline-none transition-all duration-300 flex items-center"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 19l-7-7m0 0l7-7m-7 7h18"
                  />
                </svg>
                Back to Home
              </button>

              <button
                onClick={handlePredict}
                disabled={loading}
                className={`px-8 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg font-semibold shadow-md hover:from-green-600 hover:to-green-700 focus:ring-2 focus:ring-green-500 focus:outline-none transition-all duration-300 flex items-center ${
                  loading ? "opacity-70 cursor-not-allowed" : ""
                }`}
              >
                {loading ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Processing...
                  </>
                ) : (
                  <>
                    Get Prediction
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 ml-2"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mt-8">
          <div className="bg-white p-5 rounded-xl shadow-md border-l-4 border-green-500">
            <div className="flex items-center mb-3">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-green-500 mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <h3 className="font-semibold text-green-700">Need Help?</h3>
            </div>
            <p className="text-sm text-gray-600">
              Ideal N, P, K values range between 0-100. pH typically ranges from 0-14, with 7 being neutral.
            </p>
          </div>

          <div className="bg-white p-5 rounded-xl shadow-md border-l-4 border-blue-500">
            <div className="flex items-center mb-3">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-blue-500 mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
              <h3 className="font-semibold text-blue-700">Weather Tip</h3>
            </div>
            <p className="text-sm text-gray-600">
              Enter a valid pincode to fetch real-time weather data for your location.
            </p>
          </div>

          <div className="bg-white p-5 rounded-xl shadow-md border-l-4 border-yellow-500">
            <div className="flex items-center mb-3">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-yellow-500 mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <h3 className="font-semibold text-yellow-700">Remember</h3>
            </div>
            <p className="text-sm text-gray-600">
              Rainfall is measured in mm. Temperature is in Celsius. Humidity is measured as a percentage.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SoilDetails;