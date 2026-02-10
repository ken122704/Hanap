import React, { useState } from 'react';

// Added onDeleteRole prop
const UserCard = ({ user, onDelete, onAddRole, onDeleteRole }) => {
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
    onAddRole(user.id, roleDuty, roleDate);
    setIsAdding(false);
    setRoleDuty("");
    setRoleDate("");
  };

  return (
    <div className="user-card">
      <div className="card-header">
        <h3>{user.name}</h3>
        <button className="btn-danger" onClick={() => onDelete(user.id)}>Delete User</button>
      </div>
      
      <div className="roles-container">
        {user.roles && user.roles.map((role, index) => (
          <div key={index} className="role-chip">
            <div>
              <strong>{role.duty}</strong>
              <br/>
              <span className="role-date">{formatDate(role.swore_date)}</span>
            </div>
            
            {/* --- NEW DELETE ROLE BUTTON --- */}
            <button 
              onClick={() => onDeleteRole(user.id, role)}
              style={{
                background: 'transparent', 
                border: 'none', 
                color: '#ff4d4d', 
                cursor: 'pointer',
                fontWeight: 'bold',
                fontSize: '16px',
                marginLeft: '10px'
              }}
              title="Remove this role"
            >
              &times;
            </button>
          </div>
        ))}
        {(!user.roles || user.roles.length === 0) && <p style={{color: '#999'}}>No roles assigned.</p>}
      </div>

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