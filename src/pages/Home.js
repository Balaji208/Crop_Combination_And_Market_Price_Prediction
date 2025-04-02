import { Sprout } from "lucide-react";
import React from "react";
import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();
  const isAuthenticated = !!localStorage.getItem("username");
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-green-100">
      {/* Navigation Bar */}
      <nav className="bg-gradient-to-r from-green-600 to-green-700 p-4 shadow-lg">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-2">
          <Sprout size={40} className="text-white" />
            <h1 className="text-white text-2xl font-bold">AgriPredict</h1>
          </div>
          <div className="space-x-4">
            {isAuthenticated ? (
              <button
                onClick={() => {
                  localStorage.removeItem("username");
                  navigate("/login");
                }}
                className="text-white bg-red-600 hover:bg-red-700 px-6 py-2 rounded-full font-semibold transition duration-300 shadow-md"
              >
                Logout
              </button>
            ) : (
              <>
                <button
                  onClick={() => navigate("/login")}
                  className="text-green-700 bg-white hover:bg-green-50 px-6 py-2 rounded-full font-semibold transition duration-300 shadow-md"
                >
                  Login
                </button>
                <button
                  onClick={() => navigate("/signup")}
                  className="text-white bg-green-700 hover:bg-green-800 px-6 py-2 rounded-full font-semibold transition duration-300 shadow-md border border-white"
                >
                  Signup
                </button>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="container mx-auto py-20 px-4 text-center">
        <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-xl p-8 transform hover:scale-[1.01] transition duration-300">
          <h2 className="text-5xl font-bold text-green-700 mb-6">
            Welcome to <span className="text-green-500">AgriPredict</span>
          </h2>
          <p className="text-xl text-gray-700 mb-10 leading-relaxed">
            Empowering farmers with smart crop selection and market predictions
            using cutting-edge machine learning.
          </p>
          <button
            onClick={() => navigate("/soil-details")}
            className="bg-gradient-to-r from-green-500 to-green-600 text-white px-8 py-4 rounded-lg font-semibold hover:from-green-600 hover:to-green-700 transition duration-300 shadow-lg transform hover:-translate-y-1 text-lg"
          >
            Get Started - Enter Soil Details
          </button>
        </div>
      </div>

      {/* Feature Cards */}
      <div className="container mx-auto py-12 px-4">
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-xl shadow-lg transform hover:scale-105 transition duration-300">
            <div className="rounded-full bg-green-100 w-16 h-16 flex items-center justify-center mb-4 mx-auto">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-green-700 text-center mb-3">Crop Recommendations</h3>
            <p className="text-gray-600 text-center">
              Get accurate crop suggestions based on soil metrics, weather data, and environmental factors.
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-lg transform hover:scale-105 transition duration-300">
            <div className="rounded-full bg-green-100 w-16 h-16 flex items-center justify-center mb-4 mx-auto">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-green-700 text-center mb-3">Sub-crop Suggestions</h3>
            <p className="text-gray-600 text-center">
              Enhance soil health and promote sustainable farming practices with companion crops.
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-lg transform hover:scale-105 transition duration-300">
            <div className="rounded-full bg-green-100 w-16 h-16 flex items-center justify-center mb-4 mx-auto">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-green-700 text-center mb-3">Market Price Predictions</h3>
            <p className="text-gray-600 text-center">
              Maximize profits with real-time market price predictions using dynamic government data.
            </p>
          </div>
        </div>
      </div>

      {/* About Website Section */}
      <div className="bg-white py-16 px-4 shadow-inner">
        <div className="container mx-auto">
          <h3 className="text-3xl font-bold text-green-600 text-center mb-10 relative">
            <span className="bg-gradient-to-r from-green-400 to-green-600 bg-clip-text text-transparent">About Our Platform</span>
            <div className="h-1 w-24 bg-gradient-to-r from-green-400 to-green-600 mx-auto mt-4"></div>
          </h3>
          
          <div className="bg-green-50 p-8 rounded-2xl shadow-md max-w-4xl mx-auto">
            <p className="text-gray-700 text-lg leading-relaxed">
              AgriPredict is a web application designed to address the
              sustainability crisis in agriculture by assisting farmers in making
              informed decisions. Built by a team from{" "}
              <span className="font-semibold text-green-700">PES University</span> and presented at the{" "}
              <span className="font-semibold text-green-700">
                2024 IEEE 9th International Conference for Convergence in
                Technology (I2CT)
              </span>
              , our platform leverages machine learning to provide:
            </p>
            
            <ul className="mt-6 space-y-4">
              <li className="flex items-start">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-500 mr-2 flex-shrink-0 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-gray-700">
                  Accurate crop recommendations based on soil metrics (N, P, K),
                  weather data, and environmental factors.
                </span>
              </li>
              <li className="flex items-start">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-500 mr-2 flex-shrink-0 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-gray-700">
                  Sub-crop suggestions to enhance soil health and promote
                  sustainable farming practices.
                </span>
              </li>
              <li className="flex items-start">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-500 mr-2 flex-shrink-0 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-gray-700">
                  Real-time market price predictions using dynamic datasets from
                  government sources, helping farmers maximize profits.
                </span>
              </li>
            </ul>
            
            <div className="mt-8 p-4 bg-green-100 rounded-lg border border-green-200">
              <p className="text-gray-700 text-lg leading-relaxed">
                With a main crop prediction accuracy of <span className="font-bold text-green-700">99.5%</span> and
                market price prediction accuracy of <span className="font-bold text-green-700">94%</span>,
                AgriPredict combines traditional agricultural wisdom with modern
                technology to empower farmers towards a sustainable and profitable
                future.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-green-600 to-green-700 py-16 px-4">
        <div className="container mx-auto text-center">
          <h3 className="text-3xl font-bold text-white mb-6">Ready to optimize your farm?</h3>
          <p className="text-lg text-green-100 mb-8 max-w-2xl mx-auto">
            Join thousands of farmers who are making data-driven decisions to improve yield and profitability.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button
              onClick={() => navigate("/signup")}
              className="bg-white text-green-700 px-8 py-3 rounded-lg font-semibold hover:bg-green-50 transition duration-300 shadow-lg text-lg"
            >
              Create Account
            </button>
            <button
              onClick={() => navigate("/soil-details")}
              className="bg-transparent text-white border-2 border-white px-8 py-3 rounded-lg font-semibold hover:bg-green-700 transition duration-300 shadow-lg text-lg"
            >
              Try Without Account
            </button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-green-800 text-white py-8 text-center">
        <div className="container mx-auto">
          <div className="flex justify-center items-center mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-green-300 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
            <h2 className="text-2xl font-bold text-green-300">AgriPredict</h2>
          </div>
          <p className="text-green-100">&copy; 2025 AgriPredict. All rights reserved.</p>
          <div className="mt-4 flex justify-center space-x-4">
            <a href="#" className="text-green-300 hover:text-white transition duration-300">Privacy Policy</a>
            <a href="#" className="text-green-300 hover:text-white transition duration-300">Terms of Service</a>
            <a href="#" className="text-green-300 hover:text-white transition duration-300">Contact Us</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Home;