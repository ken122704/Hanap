import React, { useState, useEffect } from 'react';
import { AVAILABLE_ROLES } from '../roles';

const UserCard = ({ user, onDelete, onAddRole, onDeleteRole, onEditUser }) => {
  // --- EDIT STATE ---
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(user.name);
  const [editedRegistry, setEditedRegistry] = useState(user.registry_number || ""); // <--- NEW
  const [editedRoles, setEditedRoles] = useState([]);

  // --- ADD ROLE STATE ---
  const [isAdding, setIsAdding] = useState(false);
  const [newRoleDuty, setNewRoleDuty] = useState("");
  const [newRoleDate, setNewRoleDate] = useState("");

  // Sync state when props change (in case DB updates from elsewhere)
  useEffect(() => {
    if (user.roles) setEditedRoles(user.roles);
    if (user.registry_number) setEditedRegistry(user.registry_number);
  }, [user.roles, user.registry_number]);

  // --- HELPERS ---
  const formatDate = (timestamp) => {
    if (!timestamp) return "";
    if (timestamp.toDate) return timestamp.toDate().toISOString().split('T')[0];
    return new Date(timestamp).toISOString().split('T')[0];
  };

  const displayDate = (timestamp) => {
    if (!timestamp) return "N/A";
    if (timestamp.toDate) return timestamp.toDate().toLocaleDateString();
    return new Date(timestamp).toLocaleDateString();
  };

  // --- EDIT LOGIC ---
  const toggleEdit = () => {
    setIsEditing(!isEditing);
    // Reset to current values on open/close
    setEditedName(user.name);
    setEditedRegistry(user.registry_number || "");
    setEditedRoles(user.roles ? [...user.roles] : []);
  };

  const handleRegistryEdit = (e) => {
    const value = e.target.value.toUpperCase();
    if (/^[A-Z0-9]*$/.test(value) && value.length <= 13) {
        setEditedRegistry(value);
    }
  };

  const handleRoleChange = (index, field, value) => {
    const updatedRoles = [...editedRoles];
    updatedRoles[index] = { ...updatedRoles[index], [field]: value };
    setEditedRoles(updatedRoles);
  };

  const saveAllChanges = () => {
    // Validation on Save
    if (editedRegistry.length !== 13) return alert("Registry Number must be 13 chars");

    onEditUser(user.id, { 
        name: editedName, 
        registry_number: editedRegistry,
        roles: editedRoles 
    });
    setIsEditing(false);
  };

  // --- ADD ROLE LOGIC ---
  const handleSaveNewRole = () => {
    if (!newRoleDuty) return;
    onAddRole(user.id, newRoleDuty, newRoleDate);
    setIsAdding(false);
    setNewRoleDuty(""); setNewRoleDate("");
  };

  return (
    <div className="user-card">
      <div className="card-header">
        {/* --- VIEW VS EDIT MODE: HEADER --- */}
        {isEditing ? (
            <div style={{width: '100%'}}>
                <input 
                    value={editedName} 
                    onChange={(e) => setEditedName(e.target.value)}
                    className="edit-input-name"
                    placeholder="Full Name"
                    style={{marginBottom: '5px'}}
                />
                <input 
                    value={editedRegistry}
                    onChange={handleRegistryEdit}
                    placeholder="Registry No."
                    style={{
                        width: '100%', padding: '5px', 
                        fontFamily: 'monospace', border: '1px solid #ccc', borderRadius: '4px'
                    }}
                />
            </div>
        ) : (
            <div style={{width: '100%'}}>
                <h3>{user.name}</h3>
                <div style={{
                    fontSize: '0.8rem', color: '#555', background: '#f0f0f0', 
                    display: 'inline-block', padding: '2px 6px', borderRadius: '4px',
                    fontFamily: 'monospace', marginTop: '5px'
                }}>
                    #{user.registry_number || "NO-ID"}
                </div>
            </div>
        )}

        <div className="card-actions" style={{marginLeft: '10px', minWidth: '80px', textAlign: 'right'}}>
            {isEditing ? (
                <>
                    <button onClick={saveAllChanges} className="btn-success">💾</button>
                    <button onClick={toggleEdit} className="btn-cancel">✕</button>
                </>
            ) : (
                <>
                    <button onClick={toggleEdit} className="btn-icon">✎</button>
                    <button className="btn-danger" onClick={() => onDelete(user.id)}>🗑</button>
                </>
            )}
        </div>
      </div>
      
      {/* --- ROLES LIST --- */}
      <div className="roles-container">
        {isEditing ? (
            // EDIT MODE ROLES
            <div className="edit-roles-list">
                {editedRoles.map((role, index) => (
                    <div key={index} className="edit-role-row">
                        <select 
                            value={role.duty} 
                            onChange={(e) => handleRoleChange(index, 'duty', e.target.value)}
                            className="edit-input-small"
                        >
                            {AVAILABLE_ROLES.map(r => <option key={r} value={r}>{r}</option>)}
                        </select>
                        <input 
                            type="date"
                            value={typeof role.swore_date === 'string' ? role.swore_date : formatDate(role.swore_date)}
                            onChange={(e) => handleRoleChange(index, 'swore_date', e.target.value)}
                            className="edit-input-small"
                        />
                    </div>
                ))}
            </div>
        ) : (
            // VIEW MODE ROLES
            <>
                {user.roles && user.roles.map((role, index) => (
                <div key={index} className="role-chip">
                    <div>
                        <strong>{role.duty}</strong>
                        <br/>
                        <span className="role-date">{displayDate(role.swore_date)}</span>
                    </div>
                    <button 
                        onClick={() => onDeleteRole(user.id, role)} 
                        style={{ background: 'transparent', border: 'none', color: '#ff4d4d', cursor: 'pointer', fontWeight: 'bold', fontSize: '16px', marginLeft: '10px' }}
                    >
                    &times;
                    </button>
                </div>
                ))}
                {(!user.roles || user.roles.length === 0) && <p style={{color: '#999'}}>No roles assigned.</p>}
            </>
        )}
      </div>

      {/* --- ADD ROLE BUTTON (Hidden when editing) --- */}
      {!isEditing && (
          !isAdding ? (
            <button className="btn-secondary" onClick={() => setIsAdding(true)}>+ Add Role</button>
          ) : (
            <div className="add-role-form">
              <select 
                  value={newRoleDuty} 
                  onChange={(e) => setNewRoleDuty(e.target.value)}
                  style={{ padding: '8px', marginBottom: '5px', width: '100%', borderRadius: '4px', border: '1px solid #ccc' }}
                  autoFocus
              >
                  <option value="" disabled>Select Role...</option>
                  {AVAILABLE_ROLES.map(r => <option key={r} value={r}>{r}</option>)}
              </select>
              <input type="date" value={newRoleDate} onChange={(e) => setNewRoleDate(e.target.value)} />
              <div style={{display: 'flex', gap: '10px'}}>
                <button className="btn-primary" onClick={handleSaveNewRole} style={{flex: 1}}>Add</button>
                <button onClick={() => setIsAdding(false)} style={{background: '#ddd', flex: 1}}>Cancel</button>
              </div>
            </div>
          )
      )}
    </div>
  );
};

export default UserCard;