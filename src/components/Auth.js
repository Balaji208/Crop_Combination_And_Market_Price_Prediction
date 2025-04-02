import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, LockKeyhole, Eye, EyeOff, Loader2, Sprout, Mail } from 'lucide-react';

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [focused, setFocused] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    const url = isLogin ? 'http://localhost:5000/login' : 'http://localhost:5000/signup';
    const body = isLogin ? { email, password } : { username, email, password };

    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      setIsLoading(false);

      if (res.ok) {
        if (isLogin) {
          localStorage.setItem('username', data.username);
          navigate('/home');
        } else {
          setIsLogin(true);
        }
      } else {
        setError(data.message);
      }
    } catch (err) {
      setIsLoading(false);
      setError('An error occurred. Please try again.');
    }
  };

  return (
    <div className="flex flex-col md:flex-row justify-center items-center min-h-screen bg-gradient-to-br from-green-50 to-green-200 p-4 overflow-hidden">
      {/* Left side - Branding */}
      <div className="w-full md:w-1/2 flex flex-col justify-center items-center p-8">
        <div className="flex items-center gap-3 mb-6">
          <Sprout size={40} className="text-green-600" />
          <h1 className="text-4xl md:text-5xl font-bold text-green-800">AgriPredict</h1>
        </div>
        <p className="text-xl text-center text-green-700 mb-6 max-w-md">
          Smart crop recommendations and price predictions for modern farmers
        </p>
        <div className="hidden md:block w-full max-w-md">
          <div className="bg-white bg-opacity-80 backdrop-blur-lg rounded-lg p-6 shadow-lg border border-green-100">
            <div className="flex items-center gap-3 mb-3">
              <div className="bg-green-100 p-2 rounded-full">
                <Sprout size={20} className="text-green-600" />
              </div>
              <h3 className="font-semibold text-green-800">Crop Recommendations</h3>
            </div>
            <p className="text-green-700 mb-4 pl-10">Get personalized crop suggestions based on your soil, climate, and market conditions</p>
            
            <div className="flex items-center gap-3 mb-3">
              <div className="bg-green-100 p-2 rounded-full">
                <User size={20} className="text-green-600" />
              </div>
              <h3 className="font-semibold text-green-800">Price Predictions</h3>
            </div>
            <p className="text-green-700 pl-10">Advanced analytics to forecast market prices for your crops</p>
          </div>
        </div>
      </div>

      {/* Right side - Auth Form */}
      <div className="w-full md:w-1/2 flex justify-center items-center mt-8 md:mt-0">
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-md bg-white backdrop-blur-lg rounded-xl shadow-2xl p-8 border border-green-100"
        >
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-green-800">
              {isLogin ? 'Welcome Back' : 'Join AgriPredict'}
            </h2>
            <p className="text-green-600 mt-2">
              {isLogin ? 'Log in to access your dashboard' : 'Create an account to get started'}
            </p>
          </div>

          {!isLogin && (
            <div className={`mb-5 transform transition-all duration-300 ${focused === 'username' ? 'scale-102' : ''}`}>
              <label className="text-sm font-medium text-green-700 flex items-center gap-2 mb-1">
                <User size={16} className="text-green-600" /> Username
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Enter your username"
                  value={username}
                  onFocus={() => setFocused('username')}
                  onBlur={() => setFocused('')}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  className="w-full px-4 py-3 pl-10 border border-green-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent focus:outline-none text-gray-700 placeholder-gray-400 bg-green-50"
                />
                <User size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-green-500" />
              </div>
            </div>
          )}

          <div className={`mb-5 transform transition-all duration-300 ${focused === 'email' ? 'scale-102' : ''}`}>
            <label className="text-sm font-medium text-green-700 flex items-center gap-2 mb-1">
              <Mail size={16} className="text-green-600" /> Email
            </label>
            <div className="relative">
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onFocus={() => setFocused('email')}
                onBlur={() => setFocused('')}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 pl-10 border border-green-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent focus:outline-none text-gray-700 placeholder-gray-400 bg-green-50"
              />
              <Mail size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-green-500" />
            </div>
          </div>

          <div className={`mb-5 transform transition-all duration-300 ${focused === 'password' ? 'scale-102' : ''}`}>
            <label className="text-sm font-medium text-green-700 flex items-center gap-2 mb-1">
              <LockKeyhole size={16} className="text-green-600" /> Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onFocus={() => setFocused('password')}
                onBlur={() => setFocused('')}
                required
                className="w-full px-4 py-3 pl-10 border border-green-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent focus:outline-none text-gray-700 placeholder-gray-400 bg-green-50"
              />
              <LockKeyhole size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-green-500" />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-green-600 hover:text-green-800"
              >
                {!showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 text-red-700 p-3 rounded-lg mb-5 text-center border border-red-200">
              {error}
            </div>
          )}

          <div className="mt-8">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 focus:ring-2 focus:ring-green-500 focus:outline-none transition-all duration-300 flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Processing...</span>
                </>
              ) : isLogin ? (
                'Log In'
              ) : (
                'Create Account'
              )}
            </button>
          </div>

          <div className="mt-6 text-center">
            <p className="text-green-700">
              {isLogin ? "Don't have an account?" : 'Already have an account?'}{' '}
              <button
                type="button"
                onClick={() => {
                  setIsLogin(!isLogin);
                  setPassword('');
                  setError('');
                }}
                className="text-green-600 font-semibold hover:underline focus:outline-none"
              >
                {isLogin ? 'Sign Up' : 'Log In'}
              </button>
            </p>
          </div>

          {isLogin && (
            <div className="mt-4 text-center">
              <button
                type="button"
                className="text-green-600 text-sm hover:underline focus:outline-none"
              >
                Forgot password?
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default Auth;