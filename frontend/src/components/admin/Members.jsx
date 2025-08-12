import { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { FaSearch, FaUser, FaLock, FaFolder } from 'react-icons/fa';

const Members = () => {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false); 

  // Mock data to match the image - replace with actual API call
  const mockUsers = [
    { id: 7370094, name: 'John Doe', phone: '6206328226', bitCoin: 30000.00, amount: 50000.00, status: 'Active', password: '753753' },
    { id: 5506936, name: 'Preeti Sharma', phone: '6280983499', bitCoin: 50000.00, amount: 50000.00, status: 'Active', password: '753753' },
    { id: 8627152, name: 'Mohamed Ali', phone: '8437347911', bitCoin: 50000.00, amount: 50000.00, status: 'Active', password: '753753' },
    { id: 1234567, name: 'Vinay Kumar', phone: '9876543210', bitCoin: 1400.00, amount: 25000.00, status: 'Active', password: '123456' },
    { id: 2345678, name: 'Omar Ali', phone: '8765432109', bitCoin: 60000.00, amount: 75000.00, status: 'Active', password: '654321' },
    { id: 3456789, name: 'Rohan Sharma', phone: '7654321098', bitCoin:1223.00, amount: 30000.00, status: 'Active', password: '789012' },
    { id: 4567890, name: 'Disha Patel', phone: '6543210987', bitCoin: 3000.00, amount: 45000.00, status: 'Active', password: '345678' },
    { id: 5678901, name: 'vihan Kumar', phone: '5432109876', bitCoin: 2232.00, amount: 60000.00, status: 'Active', password: '901234' },
    { id: 6789012, name: 'Udit Kumar', phone: '4321098765', bitCoin: 1334.00, amount: 35000.00, status: 'Active', password: '567890' },
    { id: 7890123, name: 'Rohit Mishra', phone: '3210987654', bitCoin: 12000.00, amount: 55000.00, status: 'Active', password: '234567' },
  ];

  useEffect(() => {
    // For now, use mock data - replace with actual API call
    setUsers(mockUsers);
    setTotalPages(Math.ceil(mockUsers.length / 10)); // 10 items per page
  }, []);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleProfile = (userId) => {
    console.log('View profile for user:', userId);
    // Add profile view logic
  };

  const handleLockUp = (userId) => {
    console.log('Lock up user:', userId);
    // Add lock up logic
  };

 const filteredUsers = users.filter(user =>
  user.name.toLowerCase().includes(searchTerm.trim().toLowerCase()) ||
  user.phone.includes(searchTerm.trim()) ||
  user.id.toString().includes(searchTerm.trim())
);
  const usersPerPage = 10;
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.50 }}
      className="bg-white p-6 rounded-lg shadow-lg"
    >
      {/* Header */}
      <h2 className="text-3xl font-bold text-gray-800 mb-6">Members list</h2>
      
      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative">
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Enter the member you are looking for"
            value={searchTerm}
            onChange={handleSearch}
            className="w-full pl-10 pr-4 py-3 text-gray-900 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-3 font-semibold text-gray-700">Name</th>
              <th className="p-3 font-semibold text-gray-700">Phone no.</th>
              <th className="p-3 font-semibold text-gray-700">Bit Coin</th>
              <th className="p-3 font-semibold text-gray-700">Amount</th>
              <th className="p-3 font-semibold text-gray-700">Status</th>
              <th className="p-3 font-semibold text-gray-700">Password</th>
              <th className="p-3 font-semibold text-gray-700">Action</th>
            </tr>
          </thead>
          <tbody>
            {currentUsers.map((user, index) => (
              <tr key={user.id} className="border-b border-gray-200 hover:bg-gray-50">
                <td className="p-3 text-gray-700">{user.name}</td>
                <td className="p-3">
                  <span className="text-gray-700">{user.phone}</span>
                </td>
                <td className="p-3 text-gray-700">{user.bitCoin.toLocaleString('en-IN', { minimumFractionDigits: 2})}</td>
                <td className="p-3 text-gray-700">{user.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                <td className="p-3">
                  <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-sm font-medium">
                    {user.status}
                  </span>
                </td>
                <td className="p-3 text-gray-700">{user.password}</td>
                <td className="p-3">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleProfile(user.id)}
                      className="bg-blue-600 text-white px-3 py-1 rounded text-sm flex items-center space-x-1 hover:bg-blue-700 transition-colors"
                    >
                      <FaFolder className="text-xs" />
                      <span>Profile</span>
                    </button>
                    <button
                      onClick={() => handleLockUp(user.id)}
                      className="bg-red-600 text-white px-3 py-1 rounded text-sm flex items-center space-x-1 hover:bg-red-700 transition-colors"
                    >
                      <FaLock className="text-xs" />
                      <span>Lock Up</span>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-end items-center mt-6 space-x-4 text-gray-900">
        <button
          onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className="px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Previous
        </button>
        <span className="text-gray-700">
          {currentPage}/{totalPages}
        </span>
        <button
          onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
          className="px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Next
        </button>
      </div>
    </motion.div>
  );
};

export default Members;