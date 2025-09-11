import { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';

const BrowseRecharge = () => {
  const [deposits, setDeposits] = useState([]);

  useEffect(() => {
    const fetchDeposits = async () => {
      try {
        const token = localStorage.getItem('token');
        const { data } = await axios.get('/api/admin/transactions?type=deposit', {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        setDeposits(Array.isArray(data?.data) ? data.data : []);
      } catch (error) {
        console.error('Error fetching deposits:', error);
        setDeposits([]);
      }
    };
    fetchDeposits();
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="bg-white text-gray-900 backdrop-blur p-6 rounded-lg shadow-lg border border-slate-800"
    >
      <h2 className="text-2xl font-bold text-neon-pink mb-4">Browse Recharge</h2>
      <table className="w-full text-left text-sm md:text-base">
        <thead>
          <tr className="bg-slate-800/80 text-slate-200">
            <th className="p-2">User</th>
            <th className="p-2">Amount</th>
            <th className="p-2">Status</th>
            <th className="p-2">Date</th>
          </tr>
        </thead>
        <tbody>
          {deposits.map((d) => (
            <tr key={d._id} className="border-b border-slate-800/80 text-gray-900">
              <td className="p-2">{d.userId?.name}</td>
              <td className="p-2">{d?.amount} INR</td>
              <td className="p-2">{d.status}</td>
              <td className="p-2">{new Date(d.createdAt).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </motion.div>
  );
};

export default BrowseRecharge;