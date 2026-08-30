import React, { useState } from 'react';
import { AVAILABLE_ROLES } from '../roles';

const UserForm = ({ onCreate }) => {
  const [name, setName] = useState("");
  const [registryNumber, setRegistryNumber] = useState("");
  const [pendingRoles, setPendingRoles] = useState([]);
  const [currentRole, setCurrentRole] = useState("");
  const [currentDate, setCurrentDate] = useState("");

  const [controlNumber, setControlNumber] = useState("");
  const [prkGrp, setPrkGrp] = useState("");
  const [prkError, setPrkError] = useState("");

  const [birthDate, setBirthDate] = useState("");
  const [bautismoDate, setBautismoDate] = useState("");
  const [kasalDate, setKasalDate] = useState("");
  const [asawa, setAsawa] = useState("");

  const [hanapbuhay, setHanapbuhay] = useState("");
  const [edukasyon, setEdukasyon] = useState("");

  const [eSigDataUrl, setESigDataUrl] = useState(""); 

  const handleRegistryChange = (e) => {
    const value = e.target.value.toUpperCase();
    if (/^[A-Z0-9]*$/.test(value) && value.length <= 13) {
      setRegistryNumber(value);
    }
  };

  const handlePrkChange = (e) => {
    const value = e.target.value;
    setPrkGrp(value);
    if (value && !/^\d+-\d+$/.test(value)) {
      setPrkError("Format must be number-number (Ex: 3-4)");
    } else {
      setPrkError("");
    }
  };

  // --- AUTO COMPRESSION LOGIC ---
  const handleSignatureChange = (e) => {
    const file = e.target.files[0];
    if (!file) {
      setESigDataUrl("");
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
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
          }
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

        setESigDataUrl(compressedDataUrl); 
      };
    };
  };

  const handleRemoveSignature = () => {
    setESigDataUrl(""); 
    const fileInput = document.getElementById("new-user-sig-input");
    if (fileInput) fileInput.value = ""; 
  };

  const addRoleToDraft = () => {
    if (!currentRole) return alert("Please select a role first.");
    if (pendingRoles.some(r => r.duty === currentRole)) return alert("Role already added to list!");

    const newRoleObj = { duty: currentRole, swore_date: currentDate };
    setPendingRoles([...pendingRoles, newRoleObj]);
    setCurrentRole("");
    setCurrentDate("");
  };

  const removeRoleFromDraft = (index) => {
    const updated = [...pendingRoles];
    updated.splice(index, 1);
    setPendingRoles(updated);
  };

  const handleSubmit = () => {
    if (!name) return alert("Please enter a name.");
    if (pendingRoles.length === 0) return alert("Please add at least one role.");
    if (prkError) return alert("Please fix the PRK-GRP format.");

    const newUserData = {
      name,
      registryNumber,
      controlNumber,
      prkGrp,
      birthDate,
      bautismoDate,
      kasalDate,
      asawa: kasalDate ? asawa : "", 
      hanapbuhay,
      edukasyon,
      roles: pendingRoles,
      status: "Active",
      eSigUrl: eSigDataUrl 
    };

    onCreate(newUserData);

    setName(""); setRegistryNumber(""); setControlNumber(""); setPrkGrp("");
    setBirthDate(""); setBautismoDate(""); setKasalDate(""); setAsawa("");
    setHanapbuhay(""); setEdukasyon(""); setPendingRoles([]); 
    setESigDataUrl("");
    const fileInput = document.getElementById("new-user-sig-input");
    if (fileInput) fileInput.value = ""; 
  };

  return (
    <div className="form-card">
      <h3 style={{ color: 'var(--primary)', marginBottom: '15px' }}>Identification</h3>
      
      <div className="input-group" style={{ marginBottom: '20px' }}>
        <label>Full Name</label>
        <input placeholder='Ex. Juan Dela Cruz' value={name} onChange={(e) => setName(e.target.value)} />
      </div>

      <div className="grid-2-col">
        <div className="input-group">
          <label>Control Number</label>
          <input placeholder='Ex. CTRL-001' value={controlNumber} onChange={(e) => setControlNumber(e.target.value)} />
        </div>
        <div className="input-group">
          <label>PRK-GRP</label>
          <input placeholder='Ex. 3-4' value={prkGrp} onChange={handlePrkChange} />
          {prkError && <div style={{ fontSize: '0.75rem', color: 'var(--danger)', marginTop: '4px' }}>{prkError}</div>}
        </div>
      </div>

      <div className="input-group" style={{ marginBottom: '15px' }}>
        <label>Registry No. (13 Chars)</label>
        <input 
          placeholder='Ex. A1B2C3D4E5F6G' 
          value={registryNumber} 
          onChange={handleRegistryChange}
          style={{ letterSpacing: '1px', fontFamily: 'monospace', textTransform: 'uppercase' }} 
        />
        <div style={{ fontSize: '0.75rem', textAlign: 'right', marginTop: '4px', color: registryNumber.length === 13 ? 'var(--success)' : 'var(--text-muted)' }}>
          {registryNumber.length}/13 characters
        </div>
      </div>

      <div style={{ width: '100%', borderTop: '1px dashed var(--border)', margin: '20px 0' }}></div>

      <h3 style={{ color: 'var(--primary)', marginBottom: '15px' }}>Personal Information</h3>
      
      {/* Replaced inline styles with grid-3-col */}
      <div className="grid-3-col" style={{ marginBottom: '15px' }}>
        <div className="input-group">
          <label>Birth Date</label>
          <input type="date" value={birthDate} onChange={(e) => setBirthDate(e.target.value)} />
        </div>
        <div className="input-group">
          <label>Bautismo</label>
          <input type="date" value={bautismoDate} onChange={(e) => setBautismoDate(e.target.value)} />
        </div>
        <div className="input-group">
          <label>Kasal</label>
          <input type="date" value={kasalDate} onChange={(e) => setKasalDate(e.target.value)} />
        </div>
      </div>

      {kasalDate && (
        <div className="input-group" style={{ marginBottom: '20px' }}>
          <label>Name of Asawa / Spouse</label>
          <input placeholder="Spouse's Name" value={asawa} onChange={(e) => setAsawa(e.target.value)} />
        </div>
      )}

      <div style={{ width: '100%', borderTop: '1px dashed var(--border)', margin: '20px 0' }}></div>

      <h3 style={{ color: 'var(--primary)', marginBottom: '15px' }}>Additional Information</h3>
      <div className="input-group" style={{ marginBottom: '15px' }}>
        <label>Hanapbuhay</label>
        <input placeholder="Occupation" value={hanapbuhay} onChange={(e) => setHanapbuhay(e.target.value)} />
      </div>
      
      <div className="input-group" style={{ marginBottom: '20px' }}>
        <label>Inabot ng Pinag-aralan</label>
        <select value={edukasyon} onChange={(e) => setEdukasyon(e.target.value)}>
          <option value="" disabled>Select Attainment...</option>
          <option value="Elementary">Elementary</option>
          <option value="High School">High School</option>
          <option value="Senior High School">Senior High School</option>
          <option value="College">College</option>
          <option value="Vocational">Vocational</option>
          <option value="Postgraduate">Postgraduate</option>
          <option value="Others">Others</option>
        </select>
      </div>

      <div style={{ width: '100%', borderTop: '1px dashed var(--border)', margin: '20px 0' }}></div>

      <h3 style={{ color: 'var(--primary)', marginBottom: '15px' }}>Electronic Signature</h3>
      <div className="input-group" style={{ marginBottom: '20px' }}>
        <label>Upload E-SIG</label>
        <input id="new-user-sig-input" type="file" accept="image/*" onChange={handleSignatureChange} style={{ padding: '5px' }} />
        {eSigDataUrl && (
          <div style={{ marginTop: '15px', padding: '10px', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', display: 'inline-block', position: 'relative' }}>
            <p style={{ margin: '0 0 10px 0', fontSize: '0.8rem', color: 'var(--text-muted)' }}>Preview:</p>
            <div style={{ display: 'inline-block', position: 'relative' }}>
              <img src={eSigDataUrl} alt="E-SIG Preview" style={{ maxHeight: '100px', borderRadius: '4px' }} />
              <button 
                type="button"
                onClick={handleRemoveSignature}
                style={{ position: 'absolute', top: '-10px', right: '-10px', background: 'var(--danger)', color: '#fff', border: 'none', borderRadius: '50%', width: '24px', height: '24px', cursor: 'pointer', fontSize: '14px', fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                title="Remove signature"
              >
                &times;
              </button>
            </div>
          </div>
        )}
      </div>

      <div style={{ width: '100%', borderTop: '1px dashed var(--border)', margin: '20px 0' }}></div>

      <h3 style={{ color: 'var(--primary)', marginBottom: '15px' }}>Roles & Duties</h3>
      
      {/* Replaced inline styles with grid-roles */}
      <div className="grid-roles" style={{ marginBottom: '20px' }}>
        <div className="input-group" style={{ marginBottom: 0 }}>
          <label>Select Role</label>
          <select value={currentRole} onChange={(e) => setCurrentRole(e.target.value)}>
            <option value="" disabled>Select...</option>
            {AVAILABLE_ROLES.map(r => <option key={r} value={r}>{r}</option>)}
          </select>
        </div>
        <div className="input-group" style={{ marginBottom: 0 }}>
          <label>Swore Date</label>
          <input type="date" value={currentDate} onChange={(e) => setCurrentDate(e.target.value)} />
        </div>
        <button onClick={addRoleToDraft} type="button" className="btn btn-secondary" style={{ height: '42px' }}>
          + Add
        </button>
      </div>

      {pendingRoles.length > 0 && (
        <div style={{ width: '100%', marginBottom: '20px' }}>
          <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Roles to be assigned:</label>
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginTop: '5px' }}>
            {pendingRoles.map((role, index) => (
              <div key={index} className="role-chip">
                <span>{role.duty} <small>({role.swore_date || "No Date"})</small></span>
                <button onClick={() => removeRoleFromDraft(index)} type="button" className="btn-icon" style={{ padding: '0 5px', color: 'var(--danger)' }}>&times;</button>
              </div>
            ))}
          </div>
        </div>
      )}

      <div style={{ width: '100%', marginTop: '30px' }}>
        <button className="btn btn-primary" type="button" style={{ width: '100%', padding: '15px', fontSize: '1.1rem' }} onClick={handleSubmit}>
          Save New Member Record
        </button>
      </div>
    </div>
  );
};

export default UserForm;