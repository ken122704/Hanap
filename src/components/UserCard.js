import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom'; // <-- 1. Import ReactDOM for portals
import { AVAILABLE_ROLES } from '../roles';

const UserCard = ({ user, onDelete, onEditUser, onToggleStatus }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(user.name || "");
  const [editedRegistry, setEditedRegistry] = useState(user.registry_number || "");
  const [editedControl, setEditedControl] = useState(user.controlNumber || "");
  const [editedPrk, setEditedPrk] = useState(user.prkGrp || "");
  
  const [editedBirth, setEditedBirth] = useState(user.birthDate || "");
  const [editedBautismo, setEditedBautismo] = useState(user.bautismoDate || "");
  const [editedKasal, setEditedKasal] = useState(user.kasalDate || "");
  const [editedAsawa, setEditedAsawa] = useState(user.asawa || "");
  
  const [editedHanapbuhay, setEditedHanapbuhay] = useState(user.hanapbuhay || "");
  const [editedEdukasyon, setEditedEdukasyon] = useState(user.edukasyon || "");
  
  const [editedRoles, setEditedRoles] = useState([]);
  const [editedESig, setEditedESig] = useState(user.eSigUrl || "");
  const [isSigModalOpen, setIsSigModalOpen] = useState(false);

  useEffect(() => {
    setEditedName(user.name || "");
    setEditedRegistry(user.registry_number || "");
    setEditedControl(user.controlNumber || "");
    setEditedPrk(user.prkGrp || "");
    setEditedBirth(user.birthDate || "");
    setEditedBautismo(user.bautismoDate || "");
    setEditedKasal(user.kasalDate || "");
    setEditedAsawa(user.asawa || "");
    setEditedHanapbuhay(user.hanapbuhay || "");
    setEditedEdukasyon(user.edukasyon || "");
    setEditedRoles(user.roles ? [...user.roles] : []);
    setEditedESig(user.eSigUrl || "");
  }, [user]);

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

  const toggleEdit = () => {
    setIsEditing(!isEditing);
    setEditedName(user.name || "");
    setEditedRegistry(user.registry_number || "");
    setEditedControl(user.controlNumber || "");
    setEditedPrk(user.prkGrp || "");
    setEditedBirth(user.birthDate || "");
    setEditedBautismo(user.bautismoDate || "");
    setEditedKasal(user.kasalDate || "");
    setEditedAsawa(user.asawa || "");
    setEditedHanapbuhay(user.hanapbuhay || "");
    setEditedEdukasyon(user.edukasyon || "");
    setEditedRoles(user.roles ? [...user.roles] : []);
    setEditedESig(user.eSigUrl || "");
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

  const addNewRoleField = () => {
    setEditedRoles([...editedRoles, { duty: "", swore_date: "" }]);
  };

  const removeRoleField = (index) => {
    const updatedRoles = [...editedRoles];
    updatedRoles.splice(index, 1);
    setEditedRoles(updatedRoles);
  };

  const handleSignatureChange = (e) => {
    const file = e.target.files[0];
    if (!file) {
      setEditedESig(""); 
      return;
    }

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target.result;
      
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 500; 
        const MAX_HEIGHT = 500;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) { height *= MAX_WIDTH / width; width = MAX_WIDTH; }
        } else {
          if (height > MAX_HEIGHT) { width *= MAX_HEIGHT / height; height = MAX_HEIGHT; }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        
        ctx.fillStyle = "white";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0, width, height);

        const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.6);
        const sizeInBytes = Math.round((compressedDataUrl.length * 3) / 4);
        if (sizeInBytes > 150 * 1024) {
           alert("Image is still too complex/large after compression. Please try a different photo.");
           e.target.value = ""; 
           return;
        }

        setEditedESig(compressedDataUrl); 
      };
    };
  };

  const handleRemoveSignature = () => {
    setEditedESig(""); 
    const fileInput = document.getElementById(`file-input-${user.id}`);
    if (fileInput) fileInput.value = ""; 
  };

  const saveAllChanges = () => {
    const cleanRoles = editedRoles.filter(r => r.duty !== "");

    onEditUser(user.id, { 
        name: editedName, 
        registry_number: editedRegistry,
        controlNumber: editedControl,
        prkGrp: editedPrk,
        birthDate: editedBirth,
        bautismoDate: editedBautismo,
        kasalDate: editedKasal,
        asawa: editedKasal ? editedAsawa : "", 
        hanapbuhay: editedHanapbuhay,
        edukasyon: editedEdukasyon,
        roles: cleanRoles,
        eSigUrl: editedESig 
    });
    setIsEditing(false);
  };

  const currentStatus = user.status || "Active";
  const isActive = currentStatus === "Active";

  return (
    <div className="user-card" style={{ opacity: isActive ? 1 : 0.7 }}>
      {/* HEADER */}
      <div className="card-header" style={{ borderBottom: 'none', paddingBottom: '0', marginBottom: '10px' }}>
        <div style={{width: '100%'}}>
          <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap'}}>
            {isEditing ? (
              <input 
                  value={editedName} 
                  onChange={(e) => setEditedName(e.target.value)}
                  className="edit-input-name"
                  placeholder="Full Name"
                  style={{marginBottom: '5px', width: '100%', maxWidth: '300px'}}
              />
            ) : (
              <h3 style={{marginBottom: '5px'}}>{user.name}</h3>
            )}
            
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              <button type="button" onClick={() => onToggleStatus(user.id, currentStatus)} className="btn" style={{
                  padding: '4px 10px', fontSize: '0.75rem', borderRadius: '20px',
                  border: isActive ? '1px solid var(--secondary)' : '1px solid var(--border)',
                  backgroundColor: isActive ? 'var(--chip-bg)' : 'var(--bg-body)', 
                  color: isActive ? 'var(--primary)' : 'var(--text-muted)'
              }}>
                  {isActive ? '● Active' : '○ Inactive'}
              </button>
              
              {isEditing ? (
                  <>
                      <button type="button" onClick={saveAllChanges} className="btn btn-success" style={{padding: '4px 8px'}}>💾</button>
                      <button type="button" onClick={toggleEdit} className="btn btn-cancel" style={{padding: '4px 8px'}}>✕</button>
                  </>
              ) : (
                  <>
                      <button type="button" onClick={toggleEdit} className="btn btn-icon">✎</button>
                      <button type="button" className="btn btn-danger" onClick={() => onDelete(user.id)} style={{padding: '4px 8px'}}>🗑</button>
                  </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* DETAILS */}
      <div style={{ background: 'var(--bg-body)', padding: '15px', borderRadius: 'var(--radius-sm)', marginBottom: '15px', fontSize: '0.85rem' }}>
        {isEditing ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <input placeholder="Control No." value={editedControl} onChange={e => setEditedControl(e.target.value)} className="edit-input-small"/>
            <input placeholder="Registry No." value={editedRegistry} onChange={handleRegistryEdit} className="edit-input-small" style={{fontFamily: 'monospace'}}/>
            <input placeholder="PRK-GRP (ex: 3-4)" value={editedPrk} onChange={e => setEditedPrk(e.target.value)} className="edit-input-small"/>
            
            <div className="grid-2-col" style={{ marginTop: '5px' }}>
              <div><small style={{color: 'var(--text-muted)'}}>Birth Date</small><input type="date" value={editedBirth} onChange={e => setEditedBirth(e.target.value)} className="edit-input-small"/></div>
              <div><small style={{color: 'var(--text-muted)'}}>Bautismo</small><input type="date" value={editedBautismo} onChange={e => setEditedBautismo(e.target.value)} className="edit-input-small"/></div>
              <div><small style={{color: 'var(--text-muted)'}}>Kasal</small><input type="date" value={editedKasal} onChange={e => setEditedKasal(e.target.value)} className="edit-input-small"/></div>
              {editedKasal && <div><small style={{color: 'var(--text-muted)'}}>Asawa</small><input placeholder="Spouse" value={editedAsawa} onChange={e => setEditedAsawa(e.target.value)} className="edit-input-small"/></div>}
            </div>
            
            <input placeholder="Hanapbuhay" value={editedHanapbuhay} onChange={e => setEditedHanapbuhay(e.target.value)} className="edit-input-small" style={{marginTop: '5px'}}/>
            <select value={editedEdukasyon} onChange={e => setEditedEdukasyon(e.target.value)} className="edit-input-small">
              <option value="">Select Edukasyon...</option>
              <option value="Elementary">Elementary</option>
              <option value="High School">High School</option>
              <option value="Senior High School">Senior High School</option>
              <option value="College">College</option>
              <option value="Vocational">Vocational</option>
              <option value="Postgraduate">Postgraduate</option>
              <option value="Others">Others</option>
            </select>
          </div>
        ) : (
          <div className="grid-2-col">
            <div><strong style={{color: 'var(--text-muted)'}}>Control No:</strong> <br/>{user.controlNumber || "-"}</div>
            <div><strong style={{color: 'var(--text-muted)'}}>Registry:</strong> <br/>{user.registry_number || "-"}</div>
            <div><strong style={{color: 'var(--text-muted)'}}>PRK-GRP:</strong> <br/>{user.prkGrp || "-"}</div>
            <div><strong style={{color: 'var(--text-muted)'}}>Birth:</strong> <br/>{user.birthDate || "-"}</div>
            <div><strong style={{color: 'var(--text-muted)'}}>Bautismo:</strong> <br/>{user.bautismoDate || "-"}</div>
            <div><strong style={{color: 'var(--text-muted)'}}>Kasal:</strong> <br/>{user.kasalDate || "-"}</div>
            {user.kasalDate && <div style={{gridColumn: '1 / -1'}}><strong style={{color: 'var(--text-muted)'}}>Asawa:</strong> <br/>{user.asawa || "-"}</div>}
            <div><strong style={{color: 'var(--text-muted)'}}>Hanapbuhay:</strong> <br/>{user.hanapbuhay || "-"}</div>
            <div><strong style={{color: 'var(--text-muted)'}}>Edukasyon:</strong> <br/>{user.edukasyon || "-"}</div>
          </div>
        )}
      </div>

      {/* SIGNATURE SECTION */}
      <div style={{ marginBottom: '15px', padding: '10px', border: '1px dashed var(--border)', borderRadius: 'var(--radius-sm)', textAlign: 'center' }}>
        <p style={{ margin: '0 0 5px 0', fontSize: '0.8rem', fontWeight: 'bold', color: 'var(--primary)' }}>E-SIG</p>
        
        {!isEditing ? (
          user.eSigUrl ? (
            <img 
              src={user.eSigUrl} 
              alt="Electronic Signature" 
              style={{ maxHeight: '60px', maxWidth: '100%', objectFit: 'contain', cursor: 'pointer' }} 
              onClick={() => setIsSigModalOpen(true)}
              title="Click to view full image"
            />
          ) : (
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: 0 }}>No signature uploaded.</p>
          )
        ) : (
          <div style={{ textAlign: 'left' }}>
            <input 
              id={`file-input-${user.id}`}
              type="file" 
              accept="image/*" 
              onChange={handleSignatureChange} 
              style={{ fontSize: '0.8rem', width: '100%', marginBottom: '5px' }} 
            />
            {editedESig && (
              <div style={{ textAlign: 'center', marginTop: '10px' }}>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Current Signature:</span><br/>
                <div style={{ display: 'inline-block', position: 'relative' }}>
                  <img src={editedESig} alt="Preview" style={{ maxHeight: '50px', objectFit: 'contain', border: '1px solid var(--border)', padding: '2px', borderRadius: '4px' }} />
                  <button 
                    type="button"
                    onClick={handleRemoveSignature}
                    className="btn btn-danger"
                    style={{ position: 'absolute', top: '-8px', right: '-8px', borderRadius: '50%', width: '22px', height: '22px', padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                    title="Remove signature"
                  >
                    &times;
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* ROLES SECTION */}
      <div className="roles-container" style={{ marginBottom: 0 }}>
        {isEditing ? (
            <div className="edit-roles-list">
                <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Assign Roles</label>
                {editedRoles.map((role, index) => (
                    <div key={index} className="edit-role-row grid-roles" style={{ position: 'relative' }}>
                        <select 
                            value={role.duty} 
                            onChange={(e) => handleRoleChange(index, 'duty', e.target.value)}
                            className="edit-input-small"
                        >
                            <option value="" disabled>Select Role...</option>
                            {AVAILABLE_ROLES.map(r => <option key={r} value={r}>{r}</option>)}
                        </select>
                        <div style={{ display: 'flex', gap: '5px', alignItems: 'center' }}>
                          <input 
                              type="date"
                              value={typeof role.swore_date === 'string' ? role.swore_date : formatDate(role.swore_date)}
                              onChange={(e) => handleRoleChange(index, 'swore_date', e.target.value)}
                              className="edit-input-small"
                              style={{ flex: 1 }}
                          />
                          <button type="button" onClick={() => removeRoleField(index)} className="btn-icon" style={{ color: 'var(--danger)', padding: '5px' }}>&times;</button>
                        </div>
                    </div>
                ))}
                <button type="button" className="btn btn-outline" onClick={addNewRoleField} style={{ width: '100%', borderStyle: 'dashed', marginTop: '5px' }}>
                  + Add Role
                </button>
            </div>
        ) : (
            <>
                {user.roles && user.roles.map((role, index) => (
                <div key={index} className="role-chip" style={{ cursor: 'default' }}>
                    <div>
                        <strong>{role.duty}</strong>
                        <span className="role-date">{displayDate(role.swore_date)}</span>
                    </div>
                </div>
                ))}
                {(!user.roles || user.roles.length === 0) && <p style={{color: 'var(--text-muted)', fontSize: '0.85rem'}}>No roles assigned.</p>}
            </>
        )}
      </div>

      {/* FULL VIEW SIGNATURE MODAL - Rendered cleanly via Portal to document.body */}
      {isSigModalOpen && ReactDOM.createPortal(
        <div 
          style={{ 
            position: 'fixed', 
            top: 0, 
            left: 0, 
            width: '100vw', 
            height: '100vh', 
            backgroundColor: 'rgba(15, 23, 42, 0.85)', 
            backdropFilter: 'blur(4px)', 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            zIndex: 999999, 
            padding: '20px' 
          }} 
          onClick={() => setIsSigModalOpen(false)}
        >
          <div 
            style={{ 
              backgroundColor: 'var(--bg-card)', 
              padding: '20px', 
              borderRadius: 'var(--radius-md)', 
              position: 'relative', 
              maxWidth: '90%', 
              maxHeight: '90%', 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center',
              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.3)'
            }}
            onClick={(e) => e.stopPropagation()} 
          >
            <button 
              type="button"
              onClick={() => setIsSigModalOpen(false)} 
              className="btn btn-danger"
              style={{ 
                position: 'absolute', 
                top: '-12px', 
                right: '-12px', 
                borderRadius: '50%', 
                width: '32px', 
                height: '32px', 
                padding: 0, 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                boxShadow: '0 4px 6px rgba(0,0,0,0.2)',
                cursor: 'pointer'
              }}
            >
              &times;
            </button>
            <img 
              src={user.eSigUrl} 
              alt="Full E-Signature" 
              style={{ maxWidth: '100%', maxHeight: '70vh', objectFit: 'contain', borderRadius: '4px' }} 
            />
            <p style={{ margin: '15px 0 0 0', color: 'var(--text-main)', fontWeight: 'bold', fontSize: '1rem' }}>
              {user.name}'s Signature
            </p>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
};

export default UserCard;