import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import adminUsersApi from "../api/admin/adminUsersApi";

export const useAdminUsers = () => {
  const queryClient = useQueryClient();

  const getAllUsers = useQuery({
    queryKey: ["AllUsers"],
    queryFn: () => adminUsersApi.getAllUsers(),
  });

  const deleteUserMutation = useMutation({
    mutationFn: adminUsersApi.deleteUser,
    onSuccess: () => {
      queryClient.invalidateQueries(["AllUsers"]);
    },
  });

  return {
    adminAllUsers: getAllUsers.data,
    adminAllUsersLoading: getAllUsers.isLoading,
    deleteUser: deleteUserMutation,
  };
};
