import { useState } from 'react';
import { Timestamp } from 'firebase/firestore';
import UserDataService from '../services/user.service';
import { useUsers } from '../hooks/useUsers';
import UserForm from '../components/UserForm';
import UserCard from '../components/UserCard';
import StatsCard from '../components/StatsCard';

const Home = () => {
  const { users, fetchUsers } = useUsers();
  const [searchTerm, setSearchTerm] = useState("");

  // --- CREATE USER ---
  const createUser = async (name, registryNumber, rolesArray) => {
    // 1. Convert Date strings to Firestore Timestamps
    const formattedRoles = rolesArray.map(role => ({
        duty: role.duty,
        swore_date: role.swore_date ? Timestamp.fromDate(new Date(role.swore_date)) : null
    }));

    // 2. Build User Object
    const newUser = { 
      name: name,
      registry_number: registryNumber, // <--- SAVING ID
      roles: formattedRoles
    };
    
    await UserDataService.addUser(newUser);
    fetchUsers();
  };

  // --- ADD ROLE ---
  const handleAddRole = async (userId, duty, date) => {
    const targetUser = users.find(u => u.id === userId);
    if (targetUser?.roles?.some(r => r.duty === duty)) {
        return alert(`This user is already a "${duty}"!`);
    }
    const newRole = { duty: duty, swore_date: date ? Timestamp.fromDate(new Date(date)) : null };
    await UserDataService.addRoleToUser(userId, newRole);
    fetchUsers(); 
  };

  // --- EDIT USER ---
  const handleEditUser = async (userId, updatedFields) => {
    const safeUpdates = { ...updatedFields };

    // Ensure dates in roles are timestamps
    if (safeUpdates.roles) {
        safeUpdates.roles = safeUpdates.roles.map(role => ({
            ...role,
            swore_date: typeof role.swore_date === 'string' && role.swore_date !== "" 
                ? Timestamp.fromDate(new Date(role.swore_date)) 
                : role.swore_date
        }));
    }

    await UserDataService.updateUser(userId, safeUpdates);
    fetchUsers();
  };

  // --- DELETE LOGIC ---
  const handleDeleteRole = async (userId, roleToDelete) => {
    if(window.confirm(`Remove role "${roleToDelete.duty}"?`)) {
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

  // --- FILTER LOGIC (Updated for Registry Number) ---
  const filteredUsers = users.filter((user) => {
    const lowerSearch = searchTerm.toLowerCase();
    
    const matchesName = user.name.toLowerCase().includes(lowerSearch);
    
    const matchesRole = user.roles && user.roles.some(r => r.duty.toLowerCase().includes(lowerSearch));
    
    const matchesReg = user.registry_number && user.registry_number.toLowerCase().includes(lowerSearch);
    
    return matchesName || matchesRole || matchesReg;
  });

  return (
    <div className="App">
      <h1>Hanap Member Management</h1>

      <StatsCard users={users} />

      <div style={{ marginBottom: '20px', maxWidth: '400px', margin: '0 auto 30px auto' }}>
        <input 
          placeholder="🔍 Search Name, Role, or Registry No..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ccc' }}
        />
      </div>
      
      {/* Form passes data to createUser */}
      <UserForm onCreate={createUser} />

      <div className="user-grid">
        {filteredUsers.map((user) => (
          <UserCard 
            key={user.id} 
            user={user} 
            onAddRole={handleAddRole}
            onDelete={deleteUser}
            onDeleteRole={handleDeleteRole}
            onEditUser={handleEditUser}
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