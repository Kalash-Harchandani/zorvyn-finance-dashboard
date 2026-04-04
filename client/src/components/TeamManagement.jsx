import React, { useState } from 'react';

const TeamManagement = ({ teamMembers, onCreateMember }) => {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    roleName: 'Accountant'
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onCreateMember(formData);
    setFormData({ username: '', email: '', password: '', roleName: 'Accountant' });
    setShowForm(false);
  };

  return (
    <div className="team-management">
      <header style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem'}}>
        <div>
          <h2 style={{fontSize: '2rem'}}>Organization Assets</h2>
          <p className="text-muted small">SECURE USER MANAGEMENT FOR THE WORKSPACE</p>
        </div>
        <button className="btn-elite" onClick={() => setShowForm(!showForm)}>
          {showForm ? 'CANCEL' : '+ ADD TEAM MEMBER'}
        </button>
      </header>

      {showForm && (
        <div className="card-container" style={{marginBottom: '3rem', border: '1px solid var(--primary-glow)', animation: 'fadeInSlide 0.4s'}}>
          <h3>Initialize New Node</h3>
          <p className="text-muted small" style={{marginBottom: '2rem'}}>NEW OPERATORS RECEIVE SECURE CREDENTIALS IMMEDIATELY</p>
          <form onSubmit={handleSubmit}>
            <div className="form-group row">
              <div className="input-group">
                <label>Username</label>
                <input 
                  type="text" 
                  className="input-stealth"
                  placeholder="Unique Identifier" 
                  value={formData.username} 
                  onChange={e => setFormData({...formData, username: e.target.value})} 
                  required 
                />
              </div>
              <div className="input-group">
                <label>Secure Email</label>
                <input 
                  type="email" 
                  className="input-stealth"
                  placeholder="name@organization.com" 
                  value={formData.email} 
                  onChange={e => setFormData({...formData, email: e.target.value})} 
                  required 
                />
              </div>
            </div>
            
            <div className="form-group row">
              <div className="input-group">
                <label>Initial Access Key</label>
                <input 
                  type="password" 
                  className="input-stealth"
                  placeholder="Temporary Password" 
                  value={formData.password} 
                  onChange={e => setFormData({...formData, password: e.target.value})} 
                  required 
                />
              </div>
              <div className="input-group">
                <label>Security Role</label>
                <select 
                  className="input-stealth"
                  value={formData.roleName} 
                  onChange={e => setFormData({...formData, roleName: e.target.value})}
                >
                  <option value="Admin">Admin (Full Control)</option>
                  <option value="Accountant">Accountant (Ledger Write)</option>
                  <option value="Auditor">Auditor (Log Read)</option>
                  <option value="Viewer">Viewer (Read Only)</option>
                </select>
              </div>
            </div>
            
            <button type="submit" className="btn-elite btn-block">DEPLOY OPERATOR</button>
          </form>
        </div>
      )}

      <div className="card-container">
        <h3>ACTIVE WORKSPACE PERSONNEL</h3>
        <table className="transaction-table">
          <thead>
            <tr>
              <th>Operator</th>
              <th>Identifier</th>
              <th>Clearance</th>
              <th style={{textAlign: 'right'}}>Joined Archive</th>
            </tr>
          </thead>
          <tbody>
            {teamMembers.map(member => (
              <tr key={member.id}>
                <td><strong style={{color: 'white'}}>{member.username}</strong></td>
                <td>{member.email}</td>
                <td>
                  <span className={`badge badge-${member.role_name.toLowerCase().replace(' ', '')}`}>
                    {member.role_name}
                  </span>
                </td>
                <td style={{textAlign: 'right'}}>{new Date(member.created_at).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TeamManagement;
