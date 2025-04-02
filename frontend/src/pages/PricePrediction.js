import { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import statesAndMarkets from "../cleaned_states_markets.json";
import { useLocation, useNavigate } from "react-router-dom";

// Mock data for commodities
const commodities = [
  "Apple",
  "Apricot(Jardalu/Khumani)",
  "Bajra(Pearl Millet/Cumbu)",
  "Banana",
  "Bengal Gram(Gram)(Whole)",
  "Ber(Zizyphus/Borehannu)",
  "Black Gram Dal (Urd Dal)",
  "Black Pepper",
  "Bottle gourd",
  "Cardamoms",
  "Chakotha",
  "Cherry",
  "Chikoos(Sapota)",
  "Cocoa",
  "Coconut",
  "Coffee",
  "Cotton",
  "Cowpea (Lobia/Karamani)",
  "Custard Apple(Sharifa)",
  "Fig(Anjura/Anjeer)",
  "Foxtail Millet(Navane)",
  "Ginger(Green)",
  "Grapes",
  "Green Gram (Moong)(Whole)",
  "Groundnut",
  "Guava",
  "Jack Fruit",
  "Jowar",
  "Jute",
  "Kabuli Channa(Chickpeas-White)",
  "Karbuja(Musk Melon)",
  "Kinnow",
  "Lemon",
  "Lentil (Masur)(Whole)",
  "Maize",
  "Mango",
  "Moath Dal",
  "Orange",
  "Papaya",
  "Pear(Marasebu)",
  "Pegeon Pea (Arhar Fali)",
  "Pineapple",
  "Plum",
  "Pomegranate",
  "Pumpkin",
  "Rice",
  "Sesamum(Sesame,Gingelly,Til)",
  "Soyabean",
  "Sugarcane",
  "Tomato",
  "Turmeric",
  "Water Melon",
];

export default function PricePrediction() {
  const location = useLocation();
  const [state, setState] = useState("");
  const [market, setMarket] = useState("");
  const [selectedCommodities, setSelectedCommodities] = useState([]);
  const [commodity, setCommodity] = useState("");
  const [markets, setMarkets] = useState([]);
  const [predictions, setPredictions] = useState({});
  const [failedPredictions, setFailedPredictions] = useState({});
  const [timeframe, setTimeframe] = useState("one_month");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  // Pre-fill commodities from ResultPage
  useEffect(() => {
    const crops = location.state?.crops;
    if (crops) {
      const { main, subs } = crops;
      const subCropNames = subs.map((sub) => sub.sub_crop);
      const allCrops = [main, ...subCropNames].filter((crop) =>
        commodities.includes(crop)
      );
      setSelectedCommodities(allCrops);
    }
  }, [location.state]);

  // Update markets when state changes
  useEffect(() => {
    if (state && statesAndMarkets[state]) {
      setMarkets(statesAndMarkets[state]);
      setMarket("");
    } else {
      setMarkets([]);
    }
  }, [state]);

  // Add commodity to the selected list
  const addCommodity = () => {
    if (commodity && !selectedCommodities.includes(commodity)) {
      setSelectedCommodities([...selectedCommodities, commodity]);
      setCommodity("");
    }
  };

  // Remove commodity from the selected list
  const removeCommodity = (commodityToRemove) => {
    setSelectedCommodities(
      selectedCommodities.filter((c) => c !== commodityToRemove)
    );
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!state || !market || selectedCommodities.length === 0) {
      setError("Please select state, market, and at least one commodity");
      return;
    }

    setLoading(true);
    setError("");
    setPredictions({});
    setFailedPredictions({});

    try {
      const results = {};
      const errors = {};

      for (const commodity of selectedCommodities) {
        try {
          const payload = { state, market, commodity };
          const response = await fetch("http://localhost:5000/predict_prices", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          });

          if (!response.ok) {
            throw new Error(`API error: ${response.statusText}`);
          }

          const data = await response.json();
          if (data.error) {
            throw new Error(data.error);
          }
          console.log(data);
          results[commodity] = data;
        } catch (err) {
          errors[commodity] = err.message;
          console.error(`Failed to fetch prediction for ${commodity}:`, err);
        }
      }

      setPredictions(results);
      setFailedPredictions(errors);
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Format data for the chart (only successful predictions)
  const formatChartData = () => {
    if (!predictions || Object.keys(predictions).length === 0) return [];

    const chartData = [];
    const successfulCommodities = Object.keys(predictions);
    if (successfulCommodities.length === 0) return [];

    const dates =
      predictions[successfulCommodities[0]]?.predictions[timeframe]?.dates ||
      [];

    if (!dates.length) return [];

    dates.forEach((date, index) => {
      const dataPoint = { date };
      successfulCommodities.forEach((commodity) => {
        const prices =
          predictions[commodity]?.predictions[timeframe]?.predicted_prices ||
          [];
        dataPoint[commodity] = prices[index] || null;
      });
      chartData.push(dataPoint);
    });

    return chartData;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-50 py-10">
      <div className="container mx-auto px-6 max-w-6xl">
        <h1 className="text-4xl font-extrabold text-green-700 mb-8 text-center tracking-tight drop-shadow-md">
          Agricultural Market Price Prediction
        </h1>

        {/* Form Section */}
        <div className="bg-white rounded-xl shadow-2xl p-8 mb-10 transform hover:shadow-3xl transition-shadow duration-300">
          <h2 className="text-2xl font-bold text-green-600 mb-6 text-center">
            Select Parameters
          </h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-2">
                State
              </label>
              <select
                value={state}
                onChange={(e) => setState(e.target.value)}
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition duration-200 text-gray-700"
              >
                <option value="">Select State</option>
                {Object.keys(statesAndMarkets).map((stateName) => (
                  <option key={stateName} value={stateName}>
                    {stateName}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-2">
                Market
              </label>
              <select
                value={market}
                onChange={(e) => setMarket(e.target.value)}
                disabled={!state}
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition duration-200 text-gray-700 disabled:bg-gray-200 disabled:cursor-not-allowed"
              >
                <option value="">Select Market</option>
                {markets.map((marketName) => (
                  <option key={marketName} value={marketName}>
                    {marketName}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-2">
                Commodity
              </label>
              <div className="flex items-center">
                <select
                  value={commodity}
                  onChange={(e) => setCommodity(e.target.value)}
                  className="flex-1 p-3 bg-gray-50 border border-gray-200 rounded-l-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition duration-200 text-gray-700"
                >
                  <option value="">Select Commodity</option>
                  {commodities.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={addCommodity}
                  className="bg-green-600 text-white px-5 py-3 rounded-r-lg hover:bg-green-700 focus:ring-2 focus:ring-green-500 focus:outline-none transition duration-200"
                >
                  Add
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-2">
                Selected Commodities
              </label>
              <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg min-h-16 shadow-inner">
                {selectedCommodities.length === 0 ? (
                  <p className="text-gray-500 italic text-center">
                    No commodities selected
                  </p>
                ) : (
                  <div className="flex flex-wrap gap-3">
                    {selectedCommodities.map((c) => (
                      <span
                        key={c}
                        className="bg-green-100 text-green-800 px-3 py-1 rounded-full flex items-center shadow-sm hover:bg-green-200 transition duration-200"
                      >
                        {c}
                        <button
                          type="button"
                          onClick={() => removeCommodity(c)}
                          className="ml-2 text-green-800 hover:text-red-600 focus:outline-none"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-green-600 to-green-700 text-white px-6 py-3 rounded-lg font-semibold hover:from-green-700 hover:to-green-800 focus:ring-2 focus:ring-green-500 focus:outline-none transition duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed shadow-md"
                disabled={
                  loading ||
                  !state ||
                  !market ||
                  selectedCommodities.length === 0
                }
              >
                {loading ? "Predicting..." : "Predict Prices"}
              </button>
            </div>

            {error && (
              <div className="text-red-600 text-sm bg-red-50 p-3 rounded-lg shadow-inner">
                {error}
              </div>
            )}
          </form>
        </div>

        {/* Results Section */}
        {Object.keys(predictions).length > 0 || Object.keys(failedPredictions).length > 0 ? (
          <>
            {formatChartData().length > 0 ? (
              <div className="bg-white rounded-xl shadow-2xl p-8 mb-10 transform hover:shadow-3xl transition-shadow duration-300">
                <h2 className="text-2xl font-bold text-green-700 mb-6 text-center">
                  Price Predictions
                </h2>

                <div className="mb-8">
                  <label className="block text-sm font-semibold text-gray-800 mb-3 text-center">
                    Prediction Timeframe
                  </label>
                  <div className="flex flex-wrap justify-center gap-3">
                    {["one_week", "one_month", "three_months", "six_months"].map((tf) => (
                      <button
                        key={tf}
                        onClick={() => setTimeframe(tf)}
                        className={`px-5 py-2 rounded-lg font-medium shadow-md transition duration-200 ${
                          timeframe === tf
                            ? "bg-green-600 text-white hover:bg-green-700"
                            : "bg-gray-200 text-gray-800 hover:bg-gray-300"
                        }`}
                      >
                        {tf
                          .replace("_", " ")
                          .replace(/\b\w/g, (c) => c.toUpperCase())}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="mb-10 h-72 md:h-96">
                  <h3 className="text-xl font-semibold text-gray-800 mb-4 text-center">
                    Price Trend Chart
                  </h3>
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={formatChartData()}
                      margin={{ top: 10, right: 40, left: 20, bottom: 10 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis dataKey="date" stroke="#6b7280" />
                      <YAxis stroke="#6b7280" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#fff",
                          border: "1px solid #e5e7eb",
                          borderRadius: "8px",
                          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                        }}
                      />
                      <Legend wrapperStyle={{ paddingTop: "10px" }} />
                      {Object.keys(predictions).map((commodity, index) => {
                        const colors = [
                          "#047857",
                          "#0369a1",
                          "#7c3aed",
                          "#b91c1c",
                          "#c2410c",
                          "#15803d",
                          "#4338ca",
                          "#be185d",
                        ];
                        return (
                          <Line
                            key={commodity}
                            type="monotone"
                            dataKey={commodity}
                            stroke={colors[index % colors.length]}
                            strokeWidth={2}
                            activeDot={{ r: 8 }}
                          />
                        );
                      })}
                    </LineChart>
                  </ResponsiveContainer>
                </div>

                <div className="overflow-x-auto">
                  <h3 className="text-xl font-semibold text-gray-800 mb-4 text-center">
                    Predicted Prices (₹ / Qunital)
                  </h3>
                  <table className="min-w-full divide-y divide-gray-200 bg-gray-50 rounded-lg shadow-inner">
                    <thead className="bg-green-100">
                      <tr>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-green-800 uppercase tracking-wider">
                          Date
                        </th>
                        {Object.keys(predictions).map((commodity) => (
                          <th
                            key={commodity}
                            className="px-6 py-4 text-left text-sm font-semibold text-green-800 uppercase tracking-wider"
                          >
                            {commodity}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {formatChartData().map((row, rowIndex) => (
                        <tr
                          key={rowIndex}
                          className={
                            rowIndex % 2 === 0 ? "bg-white" : "bg-gray-50"
                          }
                        >
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {row.date}
                          </td>
                          {Object.keys(predictions).map((commodity) => (
                            <td
                              key={`${row.date}-${commodity}`}
                              className="px-6 py-4 whitespace-nowrap text-sm text-gray-900"
                            >
                              {row[commodity] ? row[commodity].toFixed(2) : "N/A"}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : null}

            {Object.keys(failedPredictions).length > 0 && (
              <div className="bg-white rounded-xl shadow-2xl p-8 mb-10 transform hover:shadow-3xl transition-shadow duration-300">
                <h2 className="text-2xl font-bold text-red-600 mb-6 text-center">
                  Failed Price Predictions
                </h2>
                <ul className="space-y-4 max-w-2xl mx-auto">
                  {Object.entries(failedPredictions).map(([commodity, errorMsg]) => (
                    <li
                      key={commodity}
                      className="flex items-start bg-red-50 p-4 rounded-lg shadow-sm"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6 text-red-500 mr-3 flex-shrink-0"
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
                      <span className="text-gray-800">
                        <span className="font-semibold text-red-600">{commodity}:</span>{" "}
                        {errorMsg}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {Object.keys(predictions).length === 0 && Object.keys(failedPredictions).length > 0 && (
              <div className="bg-white rounded-xl shadow-2xl p-8 text-center transform hover:shadow-3xl transition-shadow duration-300">
                <h2 className="text-2xl font-bold text-red-600 mb-4">
                  No Price Predictions Available
                </h2>
                <p className="text-gray-600 text-lg">
                  No price data could be predicted for any selected commodities. Please try different parameters.
                </p>
              </div>
              
            )}
            <div className="flex justify-center mt-6">
      <button
        onClick={() => navigate("/home")}
        className="bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-green-600 hover:to-green-700 focus:ring-2 focus:ring-green-400 focus:outline-none transition-all duration-300 shadow-md"
      >
        Back to Home
      </button>
    </div>
          </>
        ) : null}
      </div>
    </div>
  );
}