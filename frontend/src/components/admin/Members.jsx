import { useState, useMemo } from "react";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import { Search, Lock, Folder, Trash } from "lucide-react";
import { useAdminUsers } from "../../hooks/useAdminUsers";
import ActionButton from "./ActionButton";
import Pagination from "../ui/Pagination";
import TableSkeleton from "../ui/Skeletons/TableSkeleton";
import { useNavigate } from "react-router-dom";
import ConfirmDialog from "../ui/ConfirmDialog";

const Members = () => {
  const {
    adminAllUsers = [],
    adminAllUsersLoading,
    deleteUserFn,
    updateStatusLoading,
    deleteUserLoading,
    updateStatusFn,
  } = useAdminUsers();
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const navigate = useNavigate();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmAction, setConfirmAction] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setPage(1);
  };
  const handleUpdateStatus = (user) => {
    const newStatus = user.status === "active" ? "banned" : "active";
    setConfirmOpen(true);
    setConfirmAction(updateStatusFn({ id: user._id, status: newStatus }));
  };

  const handleDeleteUser = (user) => {
    setConfirmAction(() => {
      deleteUserFn(user._id);
    });
    setConfirmOpen(true);
  };

  // Filtered users (memoized for performance)
  const filteredUsers = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    return adminAllUsers.filter(
      (u) =>
        u.name?.toLowerCase().includes(term) ||
        u.phone?.includes(term) ||
        u._id?.toString().includes(term)
    );
  }, [adminAllUsers, searchTerm]);

  // Paginated users (after filtering)
  const totalPages = Math.max(Math.ceil(filteredUsers.length / pageSize), 1);
  const startIndex = (page - 1) * pageSize;
  const paginatedUsers = filteredUsers.slice(startIndex, startIndex + pageSize);

  if (adminAllUsersLoading) {
    return <TableSkeleton />;
  }
  const handleDeleteUser = (id) => {
    setConfirmDeleteId(id);
  };

  const confirmDelete = async () => {
    if (!confirmDeleteId) return;
    try {
      await deleteUser.mutateAsync(confirmDeleteId);
      toast.success("User deleted successfully");
    } catch (err) {
      toast.error("Failed to delete user");
    } finally {
      setConfirmDeleteId(null);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="bg-midnightPurple text-white backdrop-blur-3xl p-6 rounded-lg shadow-lg border border-midnightPurple"
    >
      {/* Header */}
      <h2 className="text-2xl font-bold">Members list</h2>

      {/* Search Bar */}
      <div className="mt-6 mb-6 relative">
        <Search
          size={16}
          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
        />
        <input
          type="text"
          placeholder="Enter the member you are looking for"
          value={searchTerm}
          onChange={handleSearch}
          className="w-full sm:w-[35%] pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none text-sm text-white"
        />
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-deepPurple text-white">
              <th className="p-2">Name</th>
              <th className="p-2">Phone no.</th>
              <th className="p-2">Bit Coin</th>
              <th className="p-2">Amount</th>
              <th className="p-2">Status</th>
              <th className="p-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {paginatedUsers.map((user) => (
              <tr key={user._id} className="border-b border-deepPurple">
                <td className="p-2 text-sm">{user.name || "N/A"}</td>
                <td className="p-2 text-sm">{user.phone || "N/A"}</td>
                <td className="p-2 text-sm">
                  {user.playTokens?.toLocaleString("en-IN", {
                    minimumFractionDigits: 2,
                  }) || "0.00"}
                </td>
                <td className="p-2 text-sm">
                  {user.realBalance?.toLocaleString("en-IN", {
                    minimumFractionDigits: 2,
                  }) || "0.00"}
                </td>
                <td className="p-2">
                  <span
                    className={`px-3 py-1 rounded-full text-xs capitalize font-medium ${
                      user.status === "active"
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {user.status || "N/A"}
                  </span>
                </td>
                <td className="p-2">
                  <div className="flex space-x-2">
                    <ActionButton
                      label="Profile"
                      color="blue"
                      icon={<Folder size={16} className="-ml-1" />}
                      onClick={() => navigate(`/admin/member/${user._id}`)}
                    />
                    <ActionButton
                      label={
                        user.status === "active" ? "Ban User" : "Activate User"
                      }
                      color={user.status === "active" ? "orange" : "green"}
                      icon={<Lock size={16} className="-ml-1" />}
                      onClick={() => handleUpdateStatus(user)}
                      disabled={updateStatusLoading}
                    />
                    <ActionButton
                      label="Delete User"
                      color="red"
                      onClick={() => handleDeleteUser(user)}

                      icon={<Trash size={16} className="-ml-1" />}
                      disabled={deleteUserLoading}
                    />
      {/* Delete Confirmation Modal */}
      {confirmDeleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/5 backdrop-blur-xs">
          <div className="bg-midnightPurple border border-deepPurple rounded-2xl shadow-2xl p-7 w-full max-w-xs text-center">
            <h3 className="text-xl font-bold mb-2 text-white">Confirm Delete</h3>
            <p className="text-gray-300 mb-5">Are you sure you want to delete this user?</p>
            <div className="flex gap-3 justify-center">
              <button
                onClick={confirmDelete}
                className="px-5 py-2 rounded-lg bg-gradient-to-r from-red-600 to-pink-600 text-white font-semibold hover:from-red-700 hover:to-pink-700 transition disabled:opacity-60 cursor-pointer"
                disabled={deleteUser.isLoading}
              >
                {deleteUser.isLoading ? "Deleting..." : "Yes, Delete"}
              </button>
              <button
                onClick={() => setConfirmDeleteId(null)}
                className="px-5 py-2 rounded-lg bg-gradient-to-r from-gray-700 to-gray-900 text-white font-semibold hover:from-gray-600 hover:to-gray-800 transition disabled:opacity-60 cursor-pointer"
                disabled={deleteUser.isLoading}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <Pagination
        page={page}
        totalPages={totalPages}
        onPrev={() => setPage((p) => Math.max(1, p - 1))}
        onNext={() => setPage((p) => Math.min(totalPages, p + 1))}
      />

      <ConfirmDialog
        open={confirmOpen}
        title="Are you sure?"
        message="This action cannot be undone."
        onCancel={() => setConfirmOpen(false)}
        onConfirm={() => {
          confirmAction?.();
          setConfirmOpen(false);
        }}
      />
    </motion.div>
  );
};

export default Members;
