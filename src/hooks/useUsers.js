import { useState, useEffect } from "react";
import { db, auth } from "../firebase/firebase-config";
import { collection, onSnapshot, query, where } from "firebase/firestore";

export const useUsers = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    // 1. Identify who is currently logged in
    const currentUser = auth.currentUser;
    
    // If no one is logged in, empty the list and stop
    if (!currentUser) {
      setUsers([]);
      return;
    }

    const userCollectionRef = collection(db, "users");

    // 2. THE FILTER: Only get members where owner_uid matches the logged-in user
    const q = query(
      userCollectionRef, 
      where("owner_uid", "==", currentUser.uid)
    );

    // 3. Listen for live updates
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const usersData = snapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));

      // Sort the list alphabetically by name
      usersData.sort((a, b) => a.name.localeCompare(b.name));

      setUsers(usersData);
    });

    return () => unsubscribe();
  }, []); // Runs once when the dashboard loads

  return { users };
};