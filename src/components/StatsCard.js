import React from 'react';

const StatsCard = ({ users }) => {
  // 1. Total Head Count
  const totalMembers = users.length;

  // 2. Total Roles Assigned (If one person has 2 roles, this adds 2)
  const totalRolesAssigned = users.reduce((acc, user) => {
    return acc + (user.roles ? user.roles.length : 0);
  }, 0);

  // 3. Breakdown per Role
  const roleBreakdown = users.reduce((acc, user) => {
    if (user.roles) {
      user.roles.forEach(role => {
        // Normalize role name to uppercase to avoid "admin" vs "Admin" duplicates
        const dutyName = role.duty.toUpperCase(); 
        acc[dutyName] = (acc[dutyName] || 0) + 1;
      });
    }
    return acc;
  }, {});

  return (
    <div className="stats-container" style={styles.container}>
      {/* Card 1: Total Members */}
      <div style={styles.card}>
        <h4 style={styles.title}>Total Members</h4>
        <h2 style={styles.number}>{totalMembers}</h2>
        <p style={styles.sub}>Per Head</p>
      </div>

      {/* Card 2: Total Roles */}
      <div style={styles.card}>
        <h4 style={styles.title}>Total Assignments</h4>
        <h2 style={styles.number}>{totalRolesAssigned}</h2>
        <p style={styles.sub}>Overall Roles</p>
      </div>

      {/* Card 3: Breakdown */}
      <div style={{...styles.card, flex: 2}}>
        <h4 style={styles.title}>Role Breakdown</h4>
        <div style={styles.grid}>
          {Object.entries(roleBreakdown).map(([role, count]) => (
            <div key={role} style={styles.badge}>
              <span>{role}:</span> <strong>{count}</strong>
            </div>
          ))}
          {Object.keys(roleBreakdown).length === 0 && <span style={{color:'#999'}}>No roles assigned yet.</span>}
        </div>
      </div>
    </div>
  );
};

// Simple internal styles for this component
const styles = {
  container: {
    display: 'flex',
    gap: '20px',
    marginBottom: '30px',
    flexWrap: 'wrap'
  },
  card: {
    background: 'white',
    padding: '20px',
    borderRadius: '12px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
    flex: 1,
    minWidth: '150px',
    textAlign: 'center'
  },
  title: { margin: '0 0 10px 0', color: '#666', fontSize: '0.9rem', textTransform: 'uppercase' },
  number: { margin: 0, fontSize: '2.5rem', color: '#4A90E2' },
  sub: { margin: '5px 0 0 0', color: '#aaa', fontSize: '0.8rem' },
  grid: { display: 'flex', gap: '10px', flexWrap: 'wrap', justifyContent: 'center' },
  badge: { background: '#f0f4f8', padding: '5px 10px', borderRadius: '5px', fontSize: '0.85rem' }
};

export default StatsCard;