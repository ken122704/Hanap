import { db } from "../firebase/firebase-config";
import { 
  collection, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc,
  arrayUnion // <--- This is critical for adding items to a list
} from "firebase/firestore";

const userCollectionRef = collection(db, "users");

class UserDataService {
  
  // Create a new user
  addUser = (newUser) => {
    return addDoc(userCollectionRef, newUser);
  };

  // Update an existing user
  updateUser = (id, updatedUser) => {
    const userDoc = doc(db, "users", id);
    return updateDoc(userDoc, updatedUser);
  };

  // Delete a user
  deleteUser = (id) => {
    const userDoc = doc(db, "users", id);
    return deleteDoc(userDoc);
  };

  // Get all users
  getAllUsers = () => {
    return getDocs(userCollectionRef);
  };

  // --- THIS IS THE FUNCTION YOUR APP CAN'T FIND ---
  addRoleToUser = (id, newRole) => {
    const userDoc = doc(db, "users", id);
    return updateDoc(userDoc, {
      roles: arrayUnion(newRole) 
    });
  };
}

export default new UserDataService();