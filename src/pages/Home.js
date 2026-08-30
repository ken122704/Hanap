import { useState } from 'react';
import { Timestamp } from 'firebase/firestore';
import UserDataService from '../services/user.service';
import { useUsers } from '../hooks/useUsers';
import UserForm from '../components/UserForm';
import UserCard from '../components/UserCard';
import StatsCard from '../components/StatsCard';
import { auth } from '../firebase/firebase-config';
import { signOut } from 'firebase/auth';
import hanapLogo from '../assets/logo.png';

const Home = () => {
  const { users } = useUsers();
  const [searchTerm, setSearchTerm] = useState("");
 
  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Error signing out: ", error);
    }
  };

  // --- CREATE USER (Simplified for Base64) ---
  const createUser = async (newUserData) => {
    if (!auth.currentUser) return alert("You must be logged in to add members!");
    
    const formattedRoles = newUserData.roles ? newUserData.roles.map(role => ({
        duty: role.duty,
        swore_date: role.swore_date ? Timestamp.fromDate(new Date(role.swore_date)) : null
    })) : [];

    const newUser = { 
      ...newUserData,
      roles: formattedRoles,
      owner_uid: auth.currentUser.uid
    };
    
    await UserDataService.addUser(newUser);
  };

  const handleToggleStatus = async (id, currentStatus) => {
    const newStatus = currentStatus === "Active" ? "Inactive" : "Active";
    await UserDataService.updateUser(id, { status: newStatus });
  };

  const handleAddRole = async (userId, duty, date) => {
    const targetUser = users.find(u => u.id === userId);
    if (targetUser?.roles?.some(r => r.duty === duty)) {
        return alert(`This user is already a "${duty}"!`);
    }
    const newRole = { duty: duty, swore_date: date ? Timestamp.fromDate(new Date(date)) : null };
    await UserDataService.addRoleToUser(userId, newRole);
  };

  const handleEditUser = async (userId, updatedFields) => {
    const safeUpdates = { ...updatedFields };

    if (safeUpdates.roles) {
        safeUpdates.roles = safeUpdates.roles.map(role => ({
            ...role,
            swore_date: typeof role.swore_date === 'string' && role.swore_date !== "" 
                ? Timestamp.fromDate(new Date(role.swore_date)) 
                : role.swore_date
        }));
    }
    await UserDataService.updateUser(userId, safeUpdates);
  };

  const handleDeleteRole = async (userId, roleToDelete) => {
    if(window.confirm(`Remove role "${roleToDelete.duty}"?`)) {
      await UserDataService.removeRoleFromUser(userId, roleToDelete);
    }
  };

  const deleteUser = async (id) => {
    if(window.confirm("Are you sure you want to delete this user?")) {
        await UserDataService.deleteUser(id);
    }
  };

  const filteredUsers = users.filter((user) => {
    const lowerSearch = searchTerm.toLowerCase();
    
    const matchesName = user.name?.toLowerCase().includes(lowerSearch);
    const matchesReg = user.registry_number?.toLowerCase().includes(lowerSearch);
    const matchesControl = user.controlNumber?.toLowerCase().includes(lowerSearch);
    const matchesPrk = user.prkGrp?.toLowerCase().includes(lowerSearch);
    const matchesHanapbuhay = user.hanapbuhay?.toLowerCase().includes(lowerSearch);
    const matchesEdukasyon = user.edukasyon?.toLowerCase().includes(lowerSearch);
    const matchesRole = user.roles && user.roles.some(r => r.duty.toLowerCase().includes(lowerSearch));
    
    return matchesName || matchesRole || matchesReg || matchesControl || matchesPrk || matchesHanapbuhay || matchesEdukasyon;
  });

  return (
    <div className="App">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <img 
            src={hanapLogo} 
            alt="Hanap Logo" 
            style={{ width: '100px', height: '100px', objectFit: 'contain', borderRadius: '8px' }} 
        />
        <button onClick={handleLogout} className="btn-cancel" style={{ padding: '8px 16px', fontSize: '0.9rem' }}>
          Sign Out
        </button>
      </div>
      
      <StatsCard users={users} />

      <div style={{ marginBottom: '20px', maxWidth: '400px', margin: '0 auto 30px auto' }}>
        <input 
          placeholder="🔍 Search Name, Role, or Registry No..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ccc' }}
        />
      </div>
      
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
            onToggleStatus={handleToggleStatus}
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