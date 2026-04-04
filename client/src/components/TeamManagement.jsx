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
      <header style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px'}}>
        <h2>👥 Organization Team</h2>
        <button className="btn btn-primary btn-sm" onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Cancel' : '+ Add Member'}
        </button>
      </header>

      {showForm && (
        <div className="card-container" style={{marginBottom: '30px', animation: 'slideDown 0.3s ease-out'}}>
          <h3>Invite New Member</h3>
          <form onSubmit={handleSubmit} className="create-form">
            <div className="form-grid">
              <input 
                type="text" 
                placeholder="Username" 
                value={formData.username} 
                onChange={e => setFormData({...formData, username: e.target.value})} 
                required 
              />
              <input 
                type="email" 
                placeholder="Email Address" 
                value={formData.email} 
                onChange={e => setFormData({...formData, email: e.target.value})} 
                required 
              />
              <input 
                type="password" 
                placeholder="Temporary Password" 
                value={formData.password} 
                onChange={e => setFormData({...formData, password: e.target.value})} 
                required 
              />
              <select 
                value={formData.roleName} 
                onChange={e => setFormData({...formData, roleName: e.target.value})}
              >
                <option value="Accountant">Accountant</option>
                <option value="Auditor">Auditor</option>
                <option value="Viewer">Viewer</option>
                <option value="Admin">Admin</option>
              </select>
            </div>
            <button type="submit" className="btn btn-primary" style={{marginTop: '15px'}}>Create Member</button>
          </form>
        </div>
      )}

      <div className="card-container">
        <table className="transaction-table">
          <thead>
            <tr>
              <th>User</th>
              <th>Email</th>
              <th>Role</th>
              <th>Joined</th>
            </tr>
          </thead>
          <tbody>
            {teamMembers.map(member => (
              <tr key={member.id}>
                <td><strong>{member.username}</strong></td>
                <td>{member.email}</td>
                <td>
                  <span className={`badge badge-${member.role_name.toLowerCase().replace(' ', '')}`}>
                    {member.role_name}
                  </span>
                </td>
                <td>{new Date(member.created_at).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TeamManagement;
