import { useState, useEffect } from 'react';
import './App.css';
import { db } from './firebase-config';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from "firebase/firestore";
import { Timestamp } from 'firebase/firestore';

function App() {
  const [newName, setNewName] = useState("");
  const [newDuty, setNewDuty] = useState("");
  const [newSworeDate, setNewSworeDate] = useState(null);

  const [users, setUsers] = useState([]);
  const userCollectionRef = collection(db, "users");

  const createUser = async () => {
    await addDoc(userCollectionRef, { name: newName, duty: newDuty, swore_date: newSworeDate ? Timestamp.fromDate(newSworeDate) : null });
  }

  const updateUser = async (id) => {
    const newFields = { name: newName, duty: newDuty, swore_date: newSworeDate ? Timestamp.fromDate(newSworeDate) : null };
    const userDoc = doc(db, "users", id);
    await updateDoc(userDoc, newFields);
  }

  const deleteUser = async (id) => {
    const userDoc = doc(db, "users", id);
    await deleteDoc(userDoc);
  }

  useEffect(() => {

    const getUsers = async () => {
      const data = await getDocs(userCollectionRef);
      setUsers(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    };

    getUsers();
  }, []);


  return (
    <div className="App"> 
      <input placeholder='Name...' onChange={(event) => setNewName(event.target.value)} />
      <input placeholder='Duty...' onChange={(event) => setNewDuty(event.target.value)} />
      <input placeholder='Swore Date...' type="date" onChange={(event) => setNewSworeDate(event.target.valueAsDate)} />
      <button onClick={createUser}> Create User </button>
      {users.map((user) => {
        return <div key={user.id}>
          <h1>Name: {user.name}</h1>
          <h1>Duty: {user.duty}</h1>
          <h1>Swore Date: {user.swore_date ? user.swore_date.toDate().toLocaleDateString() : "No date available"}</h1>
          <button onClick={() => updateUser(user.id)}> Update </button>
          <button onClick={() => deleteDoc(doc(db, "users", user.id))}> Delete </button>
        </div>
      })}
    </div>
  );
}

export default App;
