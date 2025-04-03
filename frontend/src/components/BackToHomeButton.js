import { useNavigate } from "react-router-dom";

const BackToHomeButton = () => {
  const navigate = useNavigate();

  return (
    <div className="flex justify-center mt-6">
      <button
        onClick={() => navigate("/home")}
        className="bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-green-600 hover:to-green-700 focus:ring-2 focus:ring-green-400 focus:outline-none transition-all duration-300 shadow-md"
      >
        Back to Home
      </button>
    </div>
  );
};

export default BackToHomeButton;