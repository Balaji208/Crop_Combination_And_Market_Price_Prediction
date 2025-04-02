import { Sprout } from 'lucide-react';
import React from 'react';
import { useNavigate } from 'react-router-dom';

const HomeDashboard = () => {
  const navigate = useNavigate();
  const username = localStorage.getItem('username') || 'User';

  const handleLogout = () => {
    localStorage.removeItem('username');
    navigate('/login');
  };

  // Get current date for greeting
  const today = new Date();
  const formattedDate = today.toLocaleDateString('en-US', { 
    weekday: 'long', 
    month: 'long', 
    day: 'numeric' 
  });

  // Dashboard feature tiles
  const features = [
    {
      title: "Soil Analysis",
      description: "Input your soil composition data to get detailed analysis.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
        </svg>
      ),
      action: () => navigate('/soil-details')
    },
    {
      title: "Crop Recommendations",
      description: "Get personalized crop suggestions based on your soil conditions.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11.5V14m0-2.5v-6a1.5 1.5 0 113 0m-3 6a1.5 1.5 0 00-3 0v2a7.5 7.5 0 0015 0v-5a1.5 1.5 0 00-3 0m-6-3V11m0-5.5v-1a1.5 1.5 0 013 0v1m0 0V11m0-5.5a1.5 1.5 0 013 0v3m0 0V11" />
        </svg>
      ),
      action: () => navigate('/soil-details')
    },
    {
      title: "Market Price Forecasts",
      description: "View predicted market prices for recommended crops.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      action: () => navigate('/soil-details')
    },
    {
      title: "History & Records",
      description: "View your past analyses and track results over time.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
      ),
      action: () => navigate('/history')
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-green-100">
      {/* Header */}
      <header className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-6 flex justify-between items-center">
          <div className="flex items-center">
          <Sprout size={40} className="text-green-600" />
            <h1 className="text-2xl font-bold text-green-800">AgriPredict</h1>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center bg-white border border-red-500 text-red-600 py-2 px-4 rounded-lg hover:bg-red-50 transition duration-300"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Logout
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Welcome Card */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="flex items-start">
            <div>
              <p className="text-gray-500">{formattedDate}</p>
              <h2 className="text-3xl font-bold text-green-800 mt-1">Welcome back, {username}!</h2>
              <div className="h-1 w-24 bg-gradient-to-r from-green-400 to-green-600 mt-2 mb-4"></div>
              <p className="text-gray-600 max-w-xl">
                Make informed decisions about your crops with our cutting-edge soil analysis 
                and recommendation tools. Start by analyzing your soil composition to get personalized 
                suggestions and market forecasts.
              </p>
            </div>
            <div className="hidden md:block ml-auto">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-24 w-24 text-green-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
          </div>
        </div>

        {/* Feature Tiles */}
        <div className="grid md:grid-cols-2 gap-6">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="bg-white rounded-lg shadow-md p-6 transition duration-300 transform hover:scale-105 hover:shadow-lg cursor-pointer"
              onClick={feature.action}
            >
              <div className="flex items-start mb-4">
                <div className="bg-green-100 rounded-full p-3 mr-4">
                  {feature.icon}
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-green-800">{feature.title}</h3>
                  <p className="text-gray-600 mt-1">{feature.description}</p>
                </div>
              </div>
              <div className="flex justify-end">
                <div className="text-green-600 font-medium flex items-center">
                  <span>Get Started</span>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Start Button */}
        <div className="mt-8 text-center">
          <button
            onClick={() => navigate('/soil-details')}
            className="bg-gradient-to-r from-green-500 to-green-600 text-white py-3 px-8 rounded-lg font-semibold hover:from-green-600 hover:to-green-700 transition duration-300 shadow-md flex items-center mx-auto"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            Start New Analysis
          </button>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white mt-12 py-6 border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 text-center text-gray-500">
          <p>© 2025 AgriPredict - Smart Agriculture Solutions</p>
        </div>
      </footer>
    </div>
  );
};

export default HomeDashboard;