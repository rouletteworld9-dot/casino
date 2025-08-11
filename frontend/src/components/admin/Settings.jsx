import { useState } from "react";
import { motion } from "framer-motion";

const Settings = () => {
  const [theme, setTheme] = useState("dark");
  const [profile, setProfile] = useState({
    name: "Admin",
    email: "admin@example.com",
  });

  const handleSave = (e) => {
    e.preventDefault();
    // Persist settings as needed
    alert("Settings saved");
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="bg-white opacity-70 text-gray-900 p-3 rounded-md"
    >
      <h2 className="text-2xl font-bold text-gray-900 mb-4">Settings</h2>
      <form onSubmit={handleSave} className="space-y-6 p-7 rounded-md ">
        <div className="shadow-sm shadow-black p-7 rounded-lg">
          <h3 className="mb-5 text-center text-gray-800 font-bold">
            Increase | Decrease For Members
          </h3>
          <input
            type="text"
            placeholder="Enter Account ID"
            className="w-full rounded border border-slate-700 bg-slate-100 p-2 text-slate-900 focus:outline-1 focus:outline-blue-500"
          />

          <div>
            <select
              name="action"
              id=""
              className="w-full mb-3 mt-3 rounded border border-slate-700 bg-slate-100 p-2 text-slate-900 focus:outline-1 focus:outline-blue-500"
            >
              <option value="action" className="mb-3">
                Select function
              </option>
              <option value="increase" className="mb-3">
                Increase (+)
              </option>
              <option value="decrease" className="mb-3">
                Decrease (-)
              </option>
            </select>
            <div>
              {/* <label className="block text-gray-800 font-semibold mb-1">Email</label> */}
              <input
                type="number"
                value={profile.amount}
                onChange={(e) =>
                  setProfile({ ...profile, amount: e.target.value })
                }
                placeholder="Enter Amount"
                className="w-full mb-3 rounded border border-slate-700 bg-slate-100 p-2 text-slate-900 focus:outline-1 focus:outline-blue-500"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full rounded bg-[#0069D9] rald-600/90 px-4 py-2 text-white hover:bg-[#0069d9b6] active:bg-[#145ba7] cursor-pointer"
          >
            Submit
          </button>
        </div>

        <div className="shadow-sm shadow-black rounded-lg">
          <div className=" p-7 rounded-lg">
            <div>
              <h3 className="mb-5 text-center text-gray-800 font-bold">
                Change Deposit Information
              </h3>
              <label for="banking" className="text-sky-500 font-bold">
                BANKING
              </label>
              <input
                type="number"
                placeholder="Rate"
                className="w-full rounded border border-slate-700 bg-slate-100 p-2 mb-3  mt-3 text-slate-900 focus:outline-1 focus:outline-blue-500"
              />
            </div>
            <input
              type="text"
              placeholder="
              Wallet Owner Name"
              className="w-full rounded border border-slate-700 bg-slate-100 p-2 mb-3 text-slate-900 focus:outline-1 focus:outline-blue-500"
            />
            <input
              type="text"
              placeholder="UPI ID"
              className="w-full rounded border border-slate-700 bg-slate-100 p-2 mb-3 text-slate-900 focus:outline-1 focus:outline-blue-500"
            />
             <input
              type="text"
              placeholder="USDR Wallet Address"
              className="w-full rounded border border-slate-700 bg-slate-100 p-2 mb-3 text-slate-900 focus:outline-1 focus:outline-blue-500"
            />
            <button
              type="submit"
              className="w-full rounded bg-[#0069D9] rald-600/90 px-4 py-2 text-white hover:bg-[#0069d9b6] active:bg-[#145ba7] cursor-pointer"
            >
              Submit
            </button>
          </div>
          <div className="p-7 rounded-lg">
            <div>
              <h3 className="mb-5 text-center text-gray-800 font-bold">
Manual Settings
              </h3>
              <label for="banking" className="text-sky-500 font-bold">
                RATE
              </label>
              <input
                type="number"
                placeholder="Rate"
                className="w-full rounded border border-slate-700 bg-slate-100 p-2 mb-3 mt-3 text-slate-900 focus:outline-1 focus:outline-blue-500"
              />
            </div>
            <input
              type="text"
              placeholder="Enter user's name"
              className="w-full rounded border border-slate-700 bg-slate-100 p-2 mb-3 text-slate-900 focus:outline-1 focus:outline-blue-500"
            />
            <input
              type="email"
              placeholder="Enter user's email"
              className="w-full rounded border border-slate-700 bg-slate-100 p-2 mb-3 text-slate-900 focus:outline-1 focus:outline-blue-500"
            />
            <button
              type="submit"
              className="w-full rounded bg-[#0069D9] rald-600/90 px-4 py-2 text-white hover:bg-[#0069d9b6] active:bg-[#145ba7] cursor-pointer"
            >
              Submit
            </button>
          </div>
        </div>
      </form>
    </motion.div>
  );
};

export default Settings;
