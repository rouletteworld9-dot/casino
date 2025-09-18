import { useState, useMemo } from "react";
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
  const [deleteUserId, setDeleteUserId] = useState(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const [pendingStatusUser, setPendingStatusUser] = useState(null);
  const [statusDialogOpen, setStatusDialogOpen] = useState(false);
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
    setPendingStatusUser(user);
    setStatusDialogOpen(true);
  };

  const confirmStatusChange = async () => {
    if (!pendingStatusUser) return;
    const newStatus =
      pendingStatusUser.status === "active" ? "banned" : "active";
    try {
      await updateStatusFn({ id: pendingStatusUser._id, status: newStatus });
    } catch (err) {
    } finally {
      setPendingStatusUser(null);
      setStatusDialogOpen(false);
    }
  };

  const handleDeleteUser = (user) => {
    setConfirmDeleteId(user._id);
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

  const confirmDelete = async () => {
    if (!confirmDeleteId) return;
    setDeleteUserId(confirmDeleteId);
    try {
      await deleteUserFn(confirmDeleteId);
    } catch (err) {
    } finally {
      setDeleteUserId(null);
      setConfirmDeleteId(null);
      setConfirmOpen(false);
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
                    <ConfirmDialog
                      open={statusDialogOpen}
                      title={
                        pendingStatusUser &&
                        pendingStatusUser.status === "active"
                          ? "Confirm Ban"
                          : "Confirm Activate"
                      }
                      message={
                        pendingStatusUser &&
                        pendingStatusUser.status === "active"
                          ? "Are you sure you want to ban this user? They will not be able to access their account."
                          : "Are you sure you want to activate this user? They will reagain access to their account."
                      }
                      onCancel={() => {
                        setStatusDialogOpen(false);
                        setPendingStatusUser(null);
                      }}
                      onConfirm={confirmStatusChange}
                    />
                    <ActionButton
                      label={
                        deletingUserId === user._id
                          ? "Deleting.."
                          : "Delete User"
                      }
                      color="red"
                      onClick={() => handleDeleteUser(user)}
                      icon={<Trash size={16} className="-ml-1" />}
                      disabled={deleteUserId === user._id}
                    />
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
        title="Confirm Delete"
        message="Are you sure you want to delete this user? This action cannot be undone."
        onCancel={() => {
          setConfirmOpen(false);
          setConfirmDeleteId(null);
        }}
        onConfirm={confirmDelete}
      />
    </motion.div>
  );
};

export default Members;
