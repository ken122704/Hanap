import { useState } from 'react';
import { Timestamp } from 'firebase/firestore';
import UserDataService from '../services/user.service';
import { useUsers } from '../hooks/useUsers';
import UserForm from '../components/UserForm';
import UserCard from '../components/UserCard';

const Home = () => {
  const { users, fetchUsers } = useUsers();

  const [newName, setNewName] = useState("");
  const [newDuty, setNewDuty] = useState("");
  const [newSworeDate, setNewSworeDate] = useState("");

  const createUser = async () => {
    if(!newName || !newDuty) return alert("Please fill in Name and Role");

    const newUser = { 
      name: newName, 
      roles: [
        {
          duty: newDuty, 
          swore_date: newSworeDate ? Timestamp.fromDate(new Date(newSworeDate)) : null
        }
      ]
    };
    
    await UserDataService.addUser(newUser);
    setNewName(""); setNewDuty(""); setNewSworeDate("");
    fetchUsers();
  };

  // UPDATED: Now accepts role details as arguments
  const handleAddRole = async (userId, duty, date) => {
    const newRole = {
      duty: duty,
      swore_date: date ? Timestamp.fromDate(new Date(date)) : null
    };

    await UserDataService.addRoleToUser(userId, newRole);
    fetchUsers(); 
  };

  const deleteUser = async (id) => {
    if(window.confirm("Are you sure you want to delete this user?")) {
        await UserDataService.deleteUser(id);
        fetchUsers();
    }
  };

  return (
    <div className="App">
      <h1>Hanap</h1>
      
      {/* Top Form for creating NEW members */}
      <UserForm 
        newName={newName} setNewName={setNewName}
        newDuty={newDuty} setNewDuty={setNewDuty}
        newSworeDate={newSworeDate} setNewSworeDate={setNewSworeDate}
        onCreate={createUser}
      />

      {/* Grid of existing members */}
      <div className="user-grid">
        {users.map((user) => (
          <UserCard 
            key={user.id} 
            user={user} 
            onAddRole={handleAddRole} // Pass the updated function
            onDelete={deleteUser} 
          />
        ))}
      </div>
    </div>
  );
};

export default Home;