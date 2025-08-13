import { useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

const WithdrawalSettings = () => {
  const [settings, setSettings] = useState({ minWithdrawal: 100, maxWithdrawal: 10000 });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try { 
      const token = localStorage.getItem('token');
      await axios.put('/api/admin/withdrawal-settings', settings, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      toast.success('Settings updated');
    } catch (error) {
      console.error('Error updating settings:', error);
      toast.error('Error updating settings');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="bg-slate-900/60 backdrop-blur p-6 rounded-lg shadow-lg border border-slate-800"
    >
      <h2 className="text-2xl font-bold text-emerald-300 mb-4">Withdrawal Settings</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-slate-300 mb-1">Minimum Withdrawal (INR)</label>
          <input
            type="number"
            value={settings.minWithdrawal}
            onChange={(e) => setSettings({ ...settings, minWithdrawal: e.target.value })}
            className="w-full p-2 bg-slate-800 text-white rounded border border-slate-700"
          />
        </div>
        <div className="mb-4">
          <label className="block text-slate-300 mb-1">Maximum Withdrawal (INR)</label>
          <input
            type="number"
            value={settings.maxWithdrawal}
            onChange={(e) => setSettings({ ...settings, maxWithdrawal: e.target.value })}
            className="w-full p-2 bg-slate-800 text-white rounded border border-slate-700"
          />
        </div>
        <button
          type="submit"
          className="bg-emerald-600/90 text-white px-4 py-2 rounded hover:bg-emerald-600"
        >
          Save Settings
        </button>
      </form>
    </motion.div>
  );
};

export default WithdrawalSettings;