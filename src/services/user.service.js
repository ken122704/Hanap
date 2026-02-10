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

const userCollectionRef = collection(db, "users");

class UserDataService {
  
  addUser = (newUser) => {
    return addDoc(userCollectionRef, newUser);
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

export default new UserDataService();