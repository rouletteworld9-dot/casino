import { useQuery } from "@tanstack/react-query";
import adminUsersApi from "../api/admin/adminUsersApi";

export const useAdminUsers = () => {
  const getAllUsers = useQuery({
    queryKey: ["AllUsers"],
    queryFn: () => adminUsersApi.getAllUsers(),
  });
  return {
    adminAllUsers : getAllUsers.data
  }
};
