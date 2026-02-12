import React from 'react';

const StatsCard = ({ users }) => {
  // 1. Total Head Count
  const totalMembers = users.length;

  // 2. Active vs Inactive Counts
  // Note: We treat undefined status as 'Active' for backward compatibility
  const activeCount = users.filter(u => !u.status || u.status === 'Active').length;
  const inactiveCount = users.filter(u => u.status === 'Inactive').length;

  // 3. Total Roles Assigned
  const totalRolesAssigned = users.reduce((acc, user) => {
    return acc + (user.roles ? user.roles.length : 0);
  }, 0);

  // 4. Breakdown per Role (Only showing ACTIVE members in the breakdown?)
  // Let's count ALL roles for now to match the "Total Roles" number.
  const roleBreakdown = users.reduce((acc, user) => {
    if (user.roles) {
      user.roles.forEach(role => {
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
        <p style={styles.sub}>Total Registered</p>
      </div>

      {/* Card 2: Status Breakdown (NEW) */}
      <div style={styles.card}>
        <h4 style={styles.title}>Member Status</h4>
        <div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center', marginTop: '5px' }}>
            
            {/* Active Count */}
            <div style={{ textAlign: 'center' }}>
                <h2 style={{ ...styles.number, fontSize: '2rem', color: '#0EA5E9' }}>{activeCount}</h2>
                <div style={{ fontSize: '0.75rem', color: '#0EA5E9', fontWeight: 'bold', textTransform: 'uppercase' }}>Active</div>
            </div>

            <div style={{ width: '1px', height: '40px', background: '#E5E7EB' }}></div>

            {/* Inactive Count */}
            <div style={{ textAlign: 'center' }}>
                <h2 style={{ ...styles.number, fontSize: '2rem', color: '#9CA3AF' }}>{inactiveCount}</h2>
                <div style={{ fontSize: '0.75rem', color: '#6B7280', fontWeight: 'bold', textTransform: 'uppercase' }}>Inactive</div>
            </div>

        </div>
      </div>

      {/* Card 3: Total Roles */}
      <div style={styles.card}>
        <h4 style={styles.title}>Total Positions</h4>
        <h2 style={styles.number}>{totalRolesAssigned}</h2>
        <p style={styles.sub}>Assigned Roles</p>
      </div>

      {/* Card 4: Breakdown */}
      <div style={{...styles.card, flex: 2, minWidth: '300px'}}>
        <h4 style={styles.title}>Role Distribution</h4>
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

// Internal styles
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
    borderRadius: '16px', // Matches your Sky Blue theme rounded corners
    boxShadow: '0 4px 6px -1px rgba(14, 165, 233, 0.1)',
    flex: 1,
    minWidth: '160px',
    textAlign: 'center',
    border: '1px solid #E0F2FE' // Subtle border matching theme
  },
  title: { margin: '0 0 10px 0', color: '#64748B', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: 'bold' },
  number: { margin: 0, fontSize: '2.5rem', color: '#0EA5E9' }, // Uses Primary Sky Blue
  sub: { margin: '5px 0 0 0', color: '#94A3B8', fontSize: '0.8rem' },
  grid: { display: 'flex', gap: '8px', flexWrap: 'wrap', justifyContent: 'center' },
  badge: { background: '#F0F9FF', color: '#0369A1', padding: '6px 10px', borderRadius: '8px', fontSize: '0.85rem', border: '1px solid #BAE6FD' }
};

export default StatsCard;