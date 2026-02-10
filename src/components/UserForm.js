import React, { useState } from 'react';
import { AVAILABLE_ROLES } from '../roles';

const UserForm = ({ onCreate }) => {
  // --- FORM STATE ---
  const [name, setName] = useState("");
  const [registryNumber, setRegistryNumber] = useState(""); // <--- NEW STATE
  
  const [pendingRoles, setPendingRoles] = useState([]);
  const [currentRole, setCurrentRole] = useState("");
  const [currentDate, setCurrentDate] = useState("");

  // --- VALIDATION: Only allow A-Z and 0-9, Max 13 chars ---
  const handleRegistryChange = (e) => {
    const value = e.target.value.toUpperCase();
    // Regex: Only letters and numbers allowed
    if (/^[A-Z0-9]*$/.test(value) && value.length <= 13) {
      setRegistryNumber(value);
    }
  };

  // --- ROLE LIST MANAGEMENT ---
  const addRoleToDraft = () => {
    if (!currentRole) return alert("Please select a role first.");
    if (pendingRoles.some(r => r.duty === currentRole)) {
        return alert("Role already added to list!");
    }

    const newRoleObj = {
        duty: currentRole,
        swore_date: currentDate
    };

    setPendingRoles([...pendingRoles, newRoleObj]);
    setCurrentRole("");
    setCurrentDate("");
  };

  const removeRoleFromDraft = (index) => {
    const updated = [...pendingRoles];
    updated.splice(index, 1);
    setPendingRoles(updated);
  };

  // --- SUBMIT ---
  const handleSubmit = () => {
    if (!name) return alert("Please enter a name.");
    

    if (pendingRoles.length === 0) return alert("Please add at least one role.");

    onCreate(name, registryNumber, pendingRoles);

    setName("");
    setRegistryNumber("");
    setPendingRoles([]);
  };

  return (
    <div className="form-card">
      <div className="input-group" style={{ marginBottom: '20px' }}>
        <label>Full Name</label>
        <input 
          placeholder='Ex. Juan Dela Cruz' 
          value={name} 
          onChange={(e) => setName(e.target.value)} 
        />
      </div>

      {/* --- REGISTRY NUMBER INPUT --- */}
      <div className="input-group">
        <label>Registry No. (13 Chars)</label>
        <input 
          placeholder='Ex. A1B2C3D4E5F6G' 
          value={registryNumber} 
          onChange={handleRegistryChange}
          style={{ letterSpacing: '1px', fontFamily: 'monospace', textTransform: 'uppercase' }} 
        />
        <div style={{
            fontSize: '0.75rem', 
            textAlign: 'right', 
            marginTop: '4px',
            color: registryNumber.length === 13 ? 'green' : '#999'
        }}>
            {registryNumber.length}/13 characters
        </div>
      </div>

      <div style={{ width: '100%', borderTop: '1px dashed #ddd', margin: '15px 0' }}></div>

      <div className="input-group">
        <label>Select Role</label>
        <select 
            value={currentRole} 
            onChange={(e) => setCurrentRole(e.target.value)}
            style={{ padding: '10px', borderRadius: '6px', border: '1px solid #ddd', fontSize: '1rem' }}
        >
            <option value="" disabled>Select...</option>
            {AVAILABLE_ROLES.map(r => <option key={r} value={r}>{r}</option>)}
        </select>
      </div>

      <div className="input-group">
        <label>Swore Date</label>
        <input 
          type="date" 
          value={currentDate} 
          onChange={(e) => setCurrentDate(e.target.value)} 
          style={{ padding: '10px', borderRadius: '6px', border: '1px solid #ddd', fontSize: '1rem' }}
        />
      </div>

      <div className="input-group">
        <label>&nbsp;</label>
        <button onClick={addRoleToDraft} className="btn-secondary" style={{ height: '42px' }}>
          + Add to List
        </button>
      </div>

      {/* --- PENDING ROLES LIST --- */}
      {pendingRoles.length > 0 && (
        <div style={{ width: '100%', marginTop: '15px' }}>
            <label style={{ fontSize: '0.8rem', color: '#666' }}>Roles to be assigned:</label>
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginTop: '5px' }}>
                {pendingRoles.map((role, index) => (
                    <div key={index} style={{ background: '#eef2f5', padding: '5px 10px', borderRadius: '20px', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span>{role.duty} <small>({role.swore_date || "No Date"})</small></span>
                        <button 
                            onClick={() => removeRoleFromDraft(index)} 
                            style={{ background: 'none', border: 'none', color: '#ff4d4d', cursor: 'pointer', fontWeight: 'bold' }}
                        >
                            &times;
                        </button>
                    </div>
                ))}
            </div>
        </div>
      )}

      <div style={{ width: '100%', marginTop: '20px' }}>
        <button className="btn-primary" style={{ width: '100%' }} onClick={handleSubmit}>
            Create User with {pendingRoles.length} Role{pendingRoles.length !== 1 ? 's' : ''}
        </button>
      </div>
    </div>
  );
};

export default UserForm;