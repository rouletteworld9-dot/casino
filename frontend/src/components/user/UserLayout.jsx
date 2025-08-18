import { Outlet } from "react-router-dom";
import Header from "../header";
import UserSidebar from "./UserSidebar";

const UserLayout = () => {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header at the top */}
      <Header />

      {/* Sidebar + content wrapper */}
      <div className="flex flex-1">
        {/* Sidebar on the left */}
        <UserSidebar />

        {/* Main content area */}
        <div className="flex-1  overflow-auto ml-60 min-h-0">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default UserLayout;
