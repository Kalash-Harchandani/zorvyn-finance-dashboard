import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const TeamManagement = ({ user, token }) => {
  const [team, setTeam] = useState([]);
  const [newMember, setNewMember] = useState({ username: '', email: '', password: '', role: 'Viewer' });
  const [error, setError] = useState('');

  const fetchTeam = useCallback(async () => {
    try {
      const res = await axios.get('http://localhost:5005/api/v1/auth/team', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data && Array.isArray(res.data.data)) {
        setTeam(res.data.data);
      }
    } catch (err) {
      console.error('Failed to fetch team:', err);
    }
  }, [token]);

  useEffect(() => {
    fetchTeam();
  }, [fetchTeam]);

  const handleInvite = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!newMember.email.includes('@')) {
      setError('A valid identity email is required for secure provisioning.');
      return;
    }

    try {
      await axios.post('http://localhost:5005/api/v1/auth/team', {
        username: newMember.username,
        email: newMember.email,
        password: newMember.password,
        roleName: newMember.role
      }, { headers: { Authorization: `Bearer ${token}` } });
      
      setNewMember({ username: '', email: '', password: '', role: 'Viewer' });
      fetchTeam();
    } catch (err) {
      setError(err.response?.data?.error || 'Provisioning failed');
    }
  };

  return (
    <div className="card-container">
      <header className="section-header">
        <h3>Team Administration</h3>
        <span className="badge badge-income">Organization: {user?.organization}</span>
      </header>

      <div className="dashboard-grid">
        {/* Provisioning Form */}
        <div className="card-container" style={{padding: '1.5rem', background: 'var(--bg-subtle)'}}>
          <h4>Provision New Entry</h4>
          <p style={{fontSize: '0.75rem', color: '#888', marginBottom: '1.5rem'}}>
            Add a new member to the {user?.organization} tenant domain.
          </p>
          
          {error && <div className="rbac-denied" style={{marginBottom: '1rem'}}>{error}</div>}
          
          <form onSubmit={handleInvite} className="minimal-form">
            <label>Identifier ID (Username)</label>
            <input 
              type="text" 
              value={newMember.username} 
              onChange={e => setNewMember({...newMember, username: e.target.value})} 
              required 
            />

            <label>Identity Email (Required for Auth)</label>
            <input 
              type="email" 
              placeholder="operator@organization.com"
              value={newMember.email} 
              onChange={e => setNewMember({...newMember, email: e.target.value})} 
              required 
            />
            
            <label>Initial Security Credential</label>
            <input 
              type="password" 
              value={newMember.password} 
              onChange={e => setNewMember({...newMember, password: e.target.value})} 
              required 
            />
            
            <label>Designated Operational Role</label>
            <select 
              value={newMember.role} 
              onChange={e => setNewMember({...newMember, role: e.target.value})}
            >
              <option value="Admin">Administrator</option>
              <option value="Accountant">Accountant</option>
              <option value="Auditor">Auditor</option>
              <option value="Viewer">Viewer</option>
            </select>
            
            <button type="submit" className="btn-primary" style={{width: '100%', marginTop: '1rem'}}>
              Commit Admission
            </button>
          </form>
        </div>

        {/* Personnel List */}
        <div className="card-container" style={{padding: '0'}}>
          <header className="section-header" style={{padding: '1rem 1.5rem'}}>
            <h3>Active Personnel</h3>
          </header>
          <div className="table-wrapper">
            <table className="enterprise-table">
              <thead>
                <tr>
                  <th style={{paddingLeft: '1.5rem'}}>Identifier ID</th>
                  <th>Authority Level</th>
                  <th style={{textAlign: 'right', paddingRight: '1.5rem'}}>Status</th>
                </tr>
              </thead>
              <tbody>
                {team.length > 0 ? (
                  team.map(m => (
                    <tr key={m.id}>
                      <td style={{paddingLeft: '1.5rem', fontWeight: '600'}}>{m.username} <span style={{fontWeight: '400', fontSize: '0.7rem', color: '#888'}}>({m.email})</span></td>
                      <td><span className="role-badge">{m.role_name?.toUpperCase() || m.role?.toUpperCase() || 'OPERATOR'}</span></td>
                      <td style={{textAlign: 'right', paddingRight: '1.5rem'}}>
                        <span className="badge badge-income">ACTIVE_SESSION</span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="3" style={{textAlign: 'center', padding: '2rem', color: '#999'}}>
                      No additional personnel found in this tenant scope.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeamManagement;
