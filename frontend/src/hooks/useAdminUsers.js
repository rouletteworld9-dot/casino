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
    deleteUser: deleteUserMutation,
    adminAllUsersLoading: getAllUsers.isLoading,
    
    
  };
};

export const useSingleUser = (id) => {
  const getSingleUser = useQuery({
    queryKey: ["user", id],
    queryFn: () => adminUsersApi.getSingleUser(id),
    enabled: !!id,
  });
  return {
    singleUser: getSingleUser.data,

  }
};
