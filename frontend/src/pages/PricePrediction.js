import { useState } from "react";
import { useLocation } from "react-router-dom";
import PricePredictionForm from "../components/PricePredictionForm";
import PricePredictionChart from "../components/PricePredictionChart";
import PricePredictionTable from "../components/PricePredictionTable";
import FailedPredictions from "../components/FailedPredictions";
import NoPredictionsMessage from "../components/NoPredictionsMessage";
import BackToHomeButton from "../components/BackToHomeButton";

const PricePrediction = () => {
  const location = useLocation();
  const [predictions, setPredictions] = useState({});
  const [failedPredictions, setFailedPredictions] = useState({});
  const [timeframe, setTimeframe] = useState("one_month");
  const [error, setError] = useState("");

  const formatChartData = () => {
    if (!predictions || Object.keys(predictions).length === 0) return [];

    const chartData = [];
    const successfulCommodities = Object.keys(predictions);
    if (successfulCommodities.length === 0) return [];

    const dates =
      predictions[successfulCommodities[0]]?.predictions[timeframe]?.dates || [];
    if (!dates.length) return [];

    dates.forEach((date, index) => {
      const dataPoint = { date };
      successfulCommodities.forEach((commodity) => {
        const prices =
          predictions[commodity]?.predictions[timeframe]?.predicted_prices || [];
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
        <PricePredictionForm
          setPredictions={setPredictions}
          setFailedPredictions={setFailedPredictions}
          setError={setError}
          location={location}
        />
        {error && (
          <div className="text-red-600 text-sm bg-red-50 p-3 rounded-lg shadow-inner mb-10 mx-auto max-w-2xl">
            {error}
          </div>
        )}
        {(Object.keys(predictions).length > 0 || Object.keys(failedPredictions).length > 0) && (
          <>
            {formatChartData().length > 0 && (
              <>
                <PricePredictionChart
                  predictions={predictions}
                  timeframe={timeframe}
                  setTimeframe={setTimeframe}
                  formatChartData={formatChartData}
                />
                <PricePredictionTable predictions={predictions} formatChartData={formatChartData} />
              </>
            )}
            {Object.keys(failedPredictions).length > 0 && (
              <FailedPredictions failedPredictions={failedPredictions} />
            )}
            {Object.keys(predictions).length === 0 && Object.keys(failedPredictions).length > 0 && (
              <NoPredictionsMessage />
            )}
            <BackToHomeButton />
          </>
        )}
      </div>
    </div>
  );
};

export default PricePrediction;