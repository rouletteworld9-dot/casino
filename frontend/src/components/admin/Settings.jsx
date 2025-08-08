import { useState } from 'react';
import { motion } from 'framer-motion';

const Settings = () => {
  const [theme, setTheme] = useState('dark');
  const [profile, setProfile] = useState({ name: 'Admin', email: 'admin@example.com' });

  const handleSave = (e) => {
    e.preventDefault();
    // Persist settings as needed
    alert('Settings saved');
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="bg-white opacity-70 text-gray-900 backdrop-blur p-6 rounded-lg shadow-lg border border-slate-800"
    >
      <h2 className="text-2xl font-bold text-gray-900 mb-4">Settings</h2>
      <form onSubmit={handleSave} className="space-y-6">
        <div>
          <label className="block text-gray-800 font-semibold mb-1">Theme</label>
          <select
            value={theme}
            onChange={(e) => setTheme(e.target.value)}
            className="w-full rounded border border-slate-700 bg-slate-800 p-2 text-slate-100"
          >
            <option value="dark">Dark</option>
            <option value="light">Light</option>
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-800 font-semibold mb-1">Name</label>
            <input
              value={profile.name}
              onChange={(e) => setProfile({ ...profile, name: e.target.value })}
              className="w-full rounded border border-slate-700 bg-slate-800 p-2 text-slate-100"
            />
          </div>
          <div>
            <label className="block text-gray-800 font-semibold mb-1">Email</label>
            <input
              type="email"
              value={profile.email}
              onChange={(e) => setProfile({ ...profile, email: e.target.value })}
              className="w-full rounded border border-slate-700 bg-slate-800 p-2 text-slate-100"
            />
          </div>
        </div>

        <button type="submit" className="rounded bg-[#0069D9] rald-600/90 px-4 py-2 text-white hover:bg-[#0069d9b6] active:bg-[#145ba7]">
          Save Changes
        </button>
      </form>
    </motion.div>
  );
};

export default Settings;


