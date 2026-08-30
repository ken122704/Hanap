import React from 'react';

const StatsCard = ({ users }) => {
  const totalMembers = users.length;
  const activeCount = users.filter(u => !u.status || u.status === 'Active').length;
  const inactiveCount = users.filter(u => u.status === 'Inactive').length;

  const totalRolesAssigned = users.reduce((acc, user) => {
    return acc + (user.roles ? user.roles.length : 0);
  }, 0);

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
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem', marginBottom: '2.5rem' }}>
      
      {/* Card 1: Total Members */}
      <div className="card" style={{ textAlign: 'center' }}>
        <h4 style={{ color: 'var(--text-muted)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem', fontWeight: 700 }}>Total Members</h4>
        <h2 style={{ fontSize: '2.2rem', color: 'var(--primary)', fontWeight: 800, margin: 0 }}>{totalMembers}</h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginTop: '0.25rem' }}>Total Registered</p>
      </div>

      {/* Card 2: Status Breakdown */}
      <div className="card" style={{ textAlign: 'center' }}>
        <h4 style={{ color: 'var(--text-muted)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem', fontWeight: 700 }}>Member Status</h4>
        <div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center', marginTop: '0.5rem' }}>
            
            <div style={{ textAlign: 'center' }}>
                <h2 style={{ fontSize: '1.8rem', color: 'var(--primary)', fontWeight: 800, margin: 0 }}>{activeCount}</h2>
                <div style={{ fontSize: '0.7rem', color: 'var(--primary)', fontWeight: 700, textTransform: 'uppercase', marginTop: '2px' }}>Active</div>
            </div>

            <div style={{ width: '1px', height: '35px', background: 'var(--border)' }}></div>

            <div style={{ textAlign: 'center' }}>
                <h2 style={{ fontSize: '1.8rem', color: 'var(--text-muted)', fontWeight: 800, margin: 0 }}>{inactiveCount}</h2>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', marginTop: '2px' }}>Inactive</div>
            </div>

        </div>
      </div>

      {/* Card 3: Total Positions */}
      <div className="card" style={{ textAlign: 'center' }}>
        <h4 style={{ color: 'var(--text-muted)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem', fontWeight: 700 }}>Total Positions</h4>
        <h2 style={{ fontSize: '2.2rem', color: 'var(--primary)', fontWeight: 800, margin: 0 }}>{totalRolesAssigned}</h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginTop: '0.25rem' }}>Assigned Roles</p>
      </div>

      {/* Card 4: Role Distribution */}
      <div className="card" style={{ gridColumn: 'span auto' }}>
        <h4 style={{ color: 'var(--text-muted)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.75rem', fontWeight: 700, textAlign: 'center' }}>Role Distribution</h4>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', justifyContent: 'center' }}>
          {Object.entries(roleBreakdown).map(([role, count]) => (
            <div key={role} className="role-chip" style={{ margin: 0, fontSize: '0.8rem' }}>
              <span>{role}:</span>&nbsp;<strong>{count}</strong>
            </div>
          ))}
          {Object.keys(roleBreakdown).length === 0 && <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>No roles assigned yet.</span>}
        </div>
      </div>

    </div>
  );
};

export default StatsCard;