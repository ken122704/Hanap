import { useState } from 'react';
import { Timestamp } from 'firebase/firestore';
import UserDataService from '../services/user.service';
import { useUsers } from '../hooks/useUsers';
import UserForm from '../components/UserForm';
import UserCard from '../components/UserCard';

const Home = () => {
  const { users, fetchUsers } = useUsers();

  // 1. SEARCH STATE
  const [searchTerm, setSearchTerm] = useState("");

  const [newName, setNewName] = useState("");
  const [newDuty, setNewDuty] = useState("");
  const [newSworeDate, setNewSworeDate] = useState("");

  // --- CREATE USER ---
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

  // --- ADD ROLE (With Duplicate Check) ---
  const handleAddRole = async (userId, duty, date) => {
    // Find the user first
    const targetUser = users.find(u => u.id === userId);
    
    // 2. PREVENT DUPLICATE ROLES
    // Check if ANY role in their list matches the new duty name
    if (targetUser && targetUser.roles && targetUser.roles.some(r => r.duty.toLowerCase() === duty.toLowerCase())) {
        alert(`This user is already a "${duty}"!`);
        return; 
    }

    const newRole = {
      duty: duty,
      swore_date: date ? Timestamp.fromDate(new Date(date)) : null
    };

    await UserDataService.addRoleToUser(userId, newRole);
    fetchUsers(); 
  };

  // --- 3. DELETE ROLE ---
  const handleDeleteRole = async (userId, roleToDelete) => {
    if(window.confirm(`Remove role "${roleToDelete.duty}" from this user?`)) {
      await UserDataService.removeRoleFromUser(userId, roleToDelete);
      fetchUsers();
    }
  };

  const deleteUser = async (id) => {
    if(window.confirm("Are you sure you want to delete this user?")) {
        await UserDataService.deleteUser(id);
        fetchUsers();
    }
  };

  // --- FILTER LOGIC ---
  // We filter the list BEFORE mapping it in the return statement
  const filteredUsers = users.filter((user) => {
    const lowerSearch = searchTerm.toLowerCase();
    // Search by Name OR by Role
    const matchesName = user.name.toLowerCase().includes(lowerSearch);
    const matchesRole = user.roles && user.roles.some(r => r.duty.toLowerCase().includes(lowerSearch));
    
    return matchesName || matchesRole;
  });

  return (
    <div className="App">
      <h1>Hanap Member Management</h1>

      {/* SEARCH BAR */}
      <div style={{ marginBottom: '20px', maxWidth: '400px', margin: '0 auto 30px auto' }}>
        <input 
          placeholder="🔍 Search by Name or Role..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ccc' }}
        />
      </div>
      
      <UserForm 
        newName={newName} setNewName={setNewName}
        newDuty={newDuty} setNewDuty={setNewDuty}
        newSworeDate={newSworeDate} setNewSworeDate={setNewSworeDate}
        onCreate={createUser}
      />

      <div className="user-grid">
        {/* Use filteredUsers instead of users */}
        {filteredUsers.map((user) => (
          <UserCard 
            key={user.id} 
            user={user} 
            onAddRole={handleAddRole}
            onDelete={deleteUser}
            onDeleteRole={handleDeleteRole} // Pass the new handler
          />
        ))}
        {filteredUsers.length === 0 && (
          <p style={{textAlign: 'center', gridColumn: '1/-1', color: '#888'}}>No members found matching "{searchTerm}"</p>
        )}
      </div>
    </div>
  );
};

export default Home;