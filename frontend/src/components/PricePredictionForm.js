import { useState, useEffect } from "react";
import statesAndMarkets from "../cleaned_states_markets.json";
import { commodities } from "../utils/commodities";

const PricePredictionForm = ({
  setPredictions,
  setFailedPredictions,
  setError,
  location,
}) => {
  const [state, setState] = useState("");
  const [market, setMarket] = useState("");
  const [selectedCommodities, setSelectedCommodities] = useState([]);
  const [commodity, setCommodity] = useState("");
  const [markets, setMarkets] = useState([]);
  const [loading, setLoading] = useState(false);

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

  useEffect(() => {
    if (state && statesAndMarkets[state]) {
      setMarkets(statesAndMarkets[state]);
      setMarket("");
    } else {
      setMarkets([]);
    }
  }, [state]);

  const addCommodity = () => {
    if (commodity && !selectedCommodities.includes(commodity)) {
      setSelectedCommodities([...selectedCommodities, commodity]);
      setCommodity("");
    }
  };

  const removeCommodity = (commodityToRemove) => {
    setSelectedCommodities(
      selectedCommodities.filter((c) => c !== commodityToRemove)
    );
  };

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

          if (!response.ok) throw new Error(`API error: ${response.statusText}`);
          const data = await response.json();
          if (data.error) throw new Error(data.error);
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

  return (
    <div className="bg-white rounded-xl shadow-xl p-8 mb-10 border border-gray-100 transform hover:shadow-2xl transition-all duration-300">
      <div className="flex items-center justify-center mb-8">
        <div className="bg-green-100 rounded-full p-3 mr-3">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-green-700">Price Prediction Parameters</h2>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              State
            </label>
            <div className="relative">
              <select
                value={state}
                onChange={(e) => setState(e.target.value)}
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition duration-200 text-gray-700 appearance-none pr-10"
              >
                <option value="">Select State</option>
                {Object.keys(statesAndMarkets).map((stateName) => (
                  <option key={stateName} value={stateName}>{stateName}</option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                <svg className="w-5 h-5 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd"></path>
                </svg>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              Market
            </label>
            <div className="relative">
              <select
                value={market}
                onChange={(e) => setMarket(e.target.value)}
                disabled={!state}
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition duration-200 text-gray-700 disabled:bg-gray-100 disabled:text-gray-400 disabled:border-gray-200 disabled:cursor-not-allowed appearance-none pr-10"
              >
                <option value="">Select Market</option>
                {markets.map((marketName) => (
                  <option key={marketName} value={marketName}>{marketName}</option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                <svg className="w-5 h-5 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd"></path>
                </svg>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
            Commodity
          </label>
          <div className="flex items-center">
            <div className="relative flex-1">
              <select
                value={commodity}
                onChange={(e) => setCommodity(e.target.value)}
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-l-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition duration-200 text-gray-700 appearance-none pr-10"
              >
                <option value="">Select Commodity</option>
                {commodities.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                <svg className="w-5 h-5 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd"></path>
                </svg>
              </div>
            </div>
            <button
              type="button"
              onClick={addCommodity}
              disabled={!commodity}
              className="bg-green-600 text-white px-5 py-3 rounded-r-lg hover:bg-green-700 focus:ring-2 focus:ring-green-500 focus:outline-none transition duration-200 disabled:bg-green-300 disabled:cursor-not-allowed flex items-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Add
            </button>
          </div>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            Selected Commodities
          </label>
          <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg min-h-16 shadow-inner">
            {selectedCommodities.length === 0 ? (
              <div className="flex items-center justify-center text-gray-500 italic h-12">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                No commodities selected
              </div>
            ) : (
              <div className="flex flex-wrap gap-3">
                {selectedCommodities.map((c) => (
                  <span
                    key={c}
                    className="bg-green-100 text-green-800 px-3 py-1 rounded-full flex items-center shadow-sm border border-green-200"
                  >
                    <span className="mr-1">{c}</span>
                    <button
                      type="button"
                      onClick={() => removeCommodity(c)}
                      className="ml-1 p-1 rounded-full hover:bg-green-200 focus:outline-none focus:ring-2 focus:ring-green-500 transition duration-200"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="pt-4">
          <button
            type="submit"
            className="w-full flex items-center justify-center bg-gradient-to-r from-green-600 to-green-700 text-white px-6 py-3 rounded-lg font-semibold hover:from-green-700 hover:to-green-800 focus:ring-2 focus:ring-green-500 focus:outline-none transition duration-300 disabled:from-gray-400 disabled:to-gray-400 disabled:cursor-not-allowed shadow-md"
            disabled={loading || !state || !market || selectedCommodities.length === 0}
          >
            {loading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Predicting...
              </>
            ) : (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                Predict Prices
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default PricePredictionForm;