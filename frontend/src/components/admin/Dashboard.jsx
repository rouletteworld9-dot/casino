import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FaShoppingCart, FaMinus, FaTimes, FaBars } from 'react-icons/fa';

const Dashboard = () => {
  const [currentPeriod, setCurrentPeriod] = useState('20250808010402');
  const [countdown, setCountdown] = useState(21);
  const [nextResult, setNextResult] = useState('');
  const [resultHistory, setResultHistory] = useState([
    { period: '20250808010401', number: '3', bigSmall: 'Small', color: 'green' },
    { period: '20250808010400', number: '0', bigSmall: 'Small', color: 'red' },
    { period: '20250808010399', number: '9', bigSmall: 'Big', color: 'green' },
  ]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          // Generate new period and reset countdown
          const newPeriod = generateNewPeriod();
          setCurrentPeriod(newPeriod);
          return 60; // Reset to 60 seconds
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const generateNewPeriod = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hour = String(now.getHours()).padStart(2, '0');
    const minute = String(now.getMinutes()).padStart(2, '0');
    const second = String(now.getSeconds()).padStart(2, '0');
    return `${year}${month}${day}${hour}${minute}${second}`;
  };

  const handleSubmitResult = () => {
    if (nextResult.trim()) {
      // Add logic to submit the result
      console.log('Submitting result:', nextResult);
      setNextResult('');
    }
  };

  const getColorClass = (color) => {
    switch (color) {
      case 'red': return 'text-red-500';
      case 'green': return 'text-green-500';
      case 'purple': return 'text-purple-500';
      default: return 'text-white';
    }
  };

  const getColorDot = (color) => {
    const colorMap = {
      red: 'bg-red-500',
      green: 'bg-green-500',
      purple: 'bg-purple-500'
    };
    return (
      <div className={`w-3 h-3 rounded-full ${colorMap[color] || 'bg-gray-500'}`}></div>
    );
  };

  return (
    <div className="space-y-6 p-6 bg-[#2C023B] min-h-screen rounded-lg">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">Dashboard V5</h2>
        <div className="flex gap-2">
          <button className="p-2 text-gray-400 hover:text-white">
            <FaMinus />
          </button>
          <button className="p-2 text-gray-400 hover:text-white">
            <FaTimes />
          </button>
        </div>
      </div>

      {/* WinGO Time Options */}
      <div className="grid grid-cols-4 gap-4 bg-purple-100 rounded-lg p-7">
        {/* <div className='grid grid-cols-4 bg-gray-400 rounded-lg p-5'> */}
        {['1M WinGO 1 min', '3M WinGO 3 min', '5M WinGO 5 min', '10M WinGO 10 min'].map((option) => (
          <motion.button
            key={option}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="bg-orange-500 hover:bg-orange-600 text-white font-semibold py-7 px-11 rounded-lg transition-colors"
          >
            {option}
          </motion.button>
        ))}
        {/* </div> */}
      </div>

      {/* Join Options - Colors & Total */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: 'Join Red', icon: 'red', value: '0.00' },
          { label: 'Join Violet', icon: 'purple', value: '0.00' },
          { label: 'Join Green', icon: 'green', value: '0.00' },
          { label: 'Total Amount', icon: 'blue', value: '0.00' }
        ].map((option) => (
          <motion.div
            key={option.label}
            whileHover={{ scale: 1.02 }}
            className="bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-lg cursor-pointer transition-colors"
          >
            <div className="flex items-center justify-between">
              <span className="font-semibold">{option.label}</span>
              <FaShoppingCart className={`text-${option.icon === 'blue' ? 'lightblue' : option.icon}-300`} />
            </div>
            <div className="text-xl font-bold mt-2">{option.value}</div>
          </motion.div>
        ))}
      </div>

      {/* Join Options - Numbers & Size */}
      <div className="grid grid-cols-4 gap-4">
        {[
          '0 Join 0', '1 Join 1', '2 Join 2', '3 Join 3',
          '4 Join 4', '5 Join 5', '6 Join 6', '7 Join 7',
          '8 Join 8', '9 Join 9', 'B Join Big', 'S Join Small'
        ].map((option) => (
          <motion.button
            key={option}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-6 rounded-lg transition-colors"
          >
            <div>{option.split(' ')[0]}</div>
            <div className="text-sm opacity-90">{option.split(' ').slice(1).join(' ')}</div>
            <div className="text-lg font-bold">0.00</div>
          </motion.button>
        ))}
      </div>

      {/* Betting Statistics */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-purple-100 text-gray-900 opacity-60 rounded-lg p-4 border border-gray-700"
      >
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Betting Statistics</h3>
          <button className="text-gray-900 hover:text-white">
            <FaMinus />
          </button>
        </div>
        <div className="text-gray-400 text-sm">Statistics will be displayed here</div>
      </motion.div>

      {/* Current Period and Countdown */}
      <div className="bg-blue-600 text-white p-4 rounded-lg">
        <div className="flex justify-between items-center">
          <span className="font-semibold">Period: {currentPeriod}</span>
          <span className="font-bold text-xl">
            {String(Math.floor(countdown / 60)).padStart(2, '0')}:{String(countdown % 60).padStart(2, '0')}
          </span>
        </div>
      </div>

      {/* Result History Table */}
      <div className="bg-purple-100 text-gray-900 rounded-lg p-4 border border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Result History</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-700 text-gray-900">
                <th className="text-left py-2">Periods</th>
                <th className="text-left py-2">Number</th>
                <th className="text-left py-2">Big/Small</th>
                <th className="text-left py-2">Colour</th>
              </tr>
            </thead>
            <tbody>
              {resultHistory.map((result, index) => (
                <tr key={index} className="border-b border-gray-700">
                  <td className="py-2 text-gray-900">{result.period}</td>
                  <td className={`py-2 font-semibold ${getColorClass(result.color)}`}>
                    {result.number}
                  </td>
                  <td className="py-2 text-gray-900">{result.bigSmall}</td>
                  <td className="py-2">{getColorDot(result.color)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Adjusting the Result Section */}
      <div className="bg-purple-100 text-gray-900 rounded-lg p-4 border border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Adjusting the result</h3>
        <div className="text-gray-900 text-sm mb-4">
          <p>0 (Red and Purple) | 5 (Blue and Purple) | 1, 3, 7, 9 (Blue) | 2, 4, 6, 8 (Red)</p>
        </div>
        <div className="mb-4">
          <span className="text-gray-900">Next Result: </span>
          <span className="text-blue-400 font-semibold">Random</span>
        </div>
        <div className="flex gap-4 items-end">
          <div className="flex-1">
            <label className="block text-gray-900 text-sm mb-2">Enter the result (e.g., 1)</label>
            <input
              type="text"
              value={nextResult}
              onChange={(e) => setNextResult(e.target.value)}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
              placeholder="Enter result..."
            />
          </div>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleSubmitResult}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors"
          >
            Submit
          </motion.button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;


