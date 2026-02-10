import React from 'react';

const UserForm = ({ newName, setNewName, newDuty, setNewDuty, newSworeDate, setNewSworeDate, onCreate }) => {
  return (
    <div className="form-card">
      <div className="input-group">
        <label>Full Name</label>
        <input 
          placeholder='Ex. Juan Dela Cruz' 
          value={newName}
          onChange={(e) => setNewName(e.target.value)} 
        />
      </div>

      <div className="input-group">
        <label>Initial Role</label>
        <input 
          placeholder='Ex. President' 
          value={newDuty}
          onChange={(e) => setNewDuty(e.target.value)} 
        />
      </div>

      <div className="input-group">
        <label>Swore Date</label>
        <input 
          type="date" 
          value={newSworeDate} 
          onChange={(e) => setNewSworeDate(e.target.value)} 
        />
      </div>

      <div className="input-group">
        <label>&nbsp;</label> {/* Spacer for alignment */}
        <button className="btn-primary" onClick={onCreate}>
          + Create User
        </button>
      </div>
    </div>
  );
};

export default UserForm;