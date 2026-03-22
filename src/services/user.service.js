import { db } from "../firebase/firebase-config";
import { 
  collection, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc,
  arrayUnion,
  arrayRemove // <--- NEW IMPORT
} from "firebase/firestore";
import { auth } from "../firebase/firebase-config";

const userCollectionRef = collection(db, "users");

class UserDataService {
  
  addUser = (newUser) => {
    const currentUserId = auth.currentUser.uid;

    const userWithId = {
    ...newUser,
    userId: currentUserId
    };

    return addDoc(userCollectionRef, userWithId);
  };

  updateUser = (id, updatedUser) => {
    const userDoc = doc(db, "users", id);
    return updateDoc(userDoc, updatedUser);
  };

  deleteUser = (id) => {
    const userDoc = doc(db, "users", id);
    return deleteDoc(userDoc);
  };

  getAllUsers = () => {
    return getDocs(userCollectionRef);
  };

  addRoleToUser = (id, newRole) => {
    const userDoc = doc(db, "users", id);
    return updateDoc(userDoc, {
      roles: arrayUnion(newRole) 
    });
  };

  removeRoleFromUser = (id, roleToDelete) => {
    const userDoc = doc(db, "users", id);
    return updateDoc(userDoc, {
      roles: arrayRemove(roleToDelete) 
    });
  };
}

const userService = new UserDataService();
export default userService;