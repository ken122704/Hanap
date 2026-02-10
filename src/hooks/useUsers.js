import { useState, useEffect, useCallback } from "react";
import UserDataService from "../services/user.service";

export const useUsers = () => {
  const [users, setUsers] = useState([]);

  // Function to fetch data from the Service
  const fetchUsers = useCallback(async () => {
    try {
      const data = await UserDataService.getAllUsers();
      setUsers(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    } catch (err) {
      console.error("Error fetching users:", err);
    }
  }, []);

  // Initial fetch when component loads
  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  return { users, fetchUsers };
};