import { useQuery } from "@tanstack/react-query";
import adminUsersApi from "../api/admin/adminUsersApi";

export const useAdminUsers = () => {
  const getAllUsers = useQuery({
    queryKey: ["AllUsers"],
    queryFn: () => adminUsersApi.getAllUsers(),
  });

  return {
    adminAllUsers: getAllUsers.data,
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
  };
};
