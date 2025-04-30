import React from 'react'; // Note: useState is imported but not used
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import SoilDetails from './pages/SoilDetails';
import Auth from './components/Auth';
import ResultPage from './pages/ResultPage';
import HomeDashboard from './pages/HomeDashboard';
import PricePrediction from './pages/PricePrediction';
import History  from './pages/History';
const ProtectedRoute = ({ children }) => {
  const isAuthenticated = !!localStorage.getItem('username');
  return isAuthenticated ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Auth />} />
        <Route path="/signup" element={<Auth />} />
        <Route path="/home" element={<ProtectedRoute><HomeDashboard /></ProtectedRoute>} />
        <Route path="/soil-details" element={<ProtectedRoute><SoilDetails /></ProtectedRoute>} />
        <Route path="/result" element={<ProtectedRoute><ResultPage /></ProtectedRoute>} />
        <Route path="/price-prediction" element= {<ProtectedRoute><PricePrediction/></ProtectedRoute>}/>
        <Route path="/history" element= {<ProtectedRoute><History/></ProtectedRoute>}/> 
      </Routes>
    </Router>
  );
}

export default App;