import { User } from "lucide-react";
import React from "react";

const UserProfile = () => {
  return (
    <div className="w-full min-h-screen p-3 text-white bg-deepPurple text-3xl">
      <h1 className="flex items-center space-x-3">
        <User size={30} className="text-yellow-600" />
        <span className="text-2xl font-bold">My Profile</span>
      </h1>
    </div>
  );
};

export default UserProfile;
