import React, { useState } from 'react';
import { Timestamp } from 'firebase/firestore';

const UserCard = ({ user, onDelete, onAddRole }) => {
  // Local state for the "Add Role" mini-form
  const [isAdding, setIsAdding] = useState(false);
  const [roleDuty, setRoleDuty] = useState("");
  const [roleDate, setRoleDate] = useState("");

  const formatDate = (timestamp) => {
    if (!timestamp) return "N/A";
    if (timestamp.toDate) return timestamp.toDate().toLocaleDateString();
    return new Date(timestamp).toLocaleDateString();
  };

  const handleSaveRole = () => {
    if (!roleDuty) return;
    
    // Send the data back up to the parent
    onAddRole(user.id, roleDuty, roleDate);
    
    // Reset local form
    setIsAdding(false);
    setRoleDuty("");
    setRoleDate("");
  };

  return (
    <div className="user-card">
      <div className="card-header">
        <h3>{user.name}</h3>
        <button className="btn-danger" onClick={() => onDelete(user.id)}>Delete</button>
      </div>
      
      <div className="roles-container">
        {user.roles && user.roles.map((role, index) => (
          <div key={index} className="role-chip">
            <strong>{role.duty}</strong>
            <span className="role-date">{formatDate(role.swore_date)}</span>
          </div>
        ))}
        {(!user.roles || user.roles.length === 0) && <p style={{color: '#999'}}>No roles assigned.</p>}
      </div>

      {/* UX: Only show inputs if user clicks "Add Role" */}
      {!isAdding ? (
        <button className="btn-secondary" onClick={() => setIsAdding(true)}>
          + Add Another Role
        </button>
      ) : (
        <div className="add-role-form">
          <input 
            placeholder="New Role (e.g. Treasurer)" 
            value={roleDuty}
            onChange={(e) => setRoleDuty(e.target.value)}
            autoFocus
          />
          <input 
            type="date"
            value={roleDate}
            onChange={(e) => setRoleDate(e.target.value)}
          />
          <div style={{display: 'flex', gap: '10px'}}>
            <button className="btn-primary" onClick={handleSaveRole} style={{flex: 1}}>Save</button>
            <button onClick={() => setIsAdding(false)} style={{background: '#ddd', flex: 1}}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserCard;