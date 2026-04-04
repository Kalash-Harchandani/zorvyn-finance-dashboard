import React, { useState, useEffect, useCallback } from 'react';
import './App.css';
import Sidebar from './components/Sidebar';
import WelcomeInfo from './components/WelcomeInfo';
import TransactionForm from './components/TransactionForm';
import TransactionTable from './components/TransactionTable';
import StatCards from './components/StatCards';
import AuditLogView from './components/AuditLogView';
import AccessDenied from './components/AccessDenied';
import TeamManagement from './components/TeamManagement';

const API_BASE = 'http://localhost:5005/api/v1';

function App() {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')) || null);
  const [activeTab, setActiveTab] = useState('welcome');
  
  // Data States
  const [records, setRecords] = useState([]);
  const [summary, setSummary] = useState({ total_income: 0, total_expense: 0, net_balance: 0 });
  const [auditLogs, setAuditLogs] = useState([]);
  const [teamMembers, setTeamMembers] = useState([]);
  
  // Form States
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [organizationName, setOrganizationName] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [authError, setAuthError] = useState('');
  const [formData, setFormData] = useState({
    amount: '',
    type: 'expense',
    category: 'General',
    date: new Date().toISOString().split('T')[0],
    notes: ''
  });

  const fetchData = useCallback(async () => {
    if (!token) return;
    try {
      const headers = { 'Authorization': `Bearer ${token}` };
      
      // Fetch Dashboard
      const dashRes = await fetch(`${API_BASE}/records/dashboard`, { headers });
      const dashData = await dashRes.json();
      if (dashData.status === 'success') setSummary(dashData.data.summary);

      // Fetch Records
      const recRes = await fetch(`${API_BASE}/records`, { headers });
      const recData = await recRes.json();
      if (recData.status === 'success') setRecords(recData.data);

      // Fetch Audit Logs (If permitted)
      if (['Super Admin', 'Admin', 'Auditor'].includes(user.role)) {
        const auditRes = await fetch(`${API_BASE}/records/audit-logs`, { headers });
        const auditData = await auditRes.json();
        if (auditData.status === 'success') setAuditLogs(auditData.data);
      }

      // Fetch Team Members (If permitted)
      if (['Super Admin', 'Admin'].includes(user.role)) {
        const teamRes = await fetch(`${API_BASE}/auth/team`, { headers });
        const teamData = await teamRes.json();
        if (teamData.status === 'success') setTeamMembers(teamData.data);
      }
    } catch (err) {
      console.error('Fetch error:', err);
    }
  }, [token, user]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setAuthError('');
    try {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (data.status === 'success') {
        localStorage.setItem('token', data.data.token);
        localStorage.setItem('user', JSON.stringify({
          username: data.data.username,
          role: data.data.role,
          organization: data.data.organization || 'Internal'
        }));
        setToken(data.data.token);
        setUser({
          username: data.data.username,
          role: data.data.role,
          organization: data.data.organization || 'Internal'
        });
        setActiveTab('overview');
      } else {
        setAuthError(data.message || 'Login failed');
      }
    } catch (err) {
      setAuthError('Server error. Please check if backend is running.');
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setAuthError('');
    try {
      const res = await fetch(`${API_BASE}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: email.split('@')[0], email, password, organizationName })
      });
      const data = await res.json();
      if (data.status === 'success') {
        setIsRegistering(false);
        setAuthError('Registration successful! Please login.');
      } else {
        setAuthError(data.message || 'Registration failed');
      }
    } catch (err) {
      setAuthError('Server error.');
    }
  };

  const handleCreateTeamMember = async (memberData) => {
    try {
      const res = await fetch(`${API_BASE}/auth/team`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(memberData)
      });
      const data = await res.json();
      if (data.status === 'success') {
        fetchData();
      } else {
        alert(data.message);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
    setActiveTab('welcome');
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_BASE}/records`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        setFormData({ ...formData, amount: '', notes: '' });
        fetchData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this record?')) return;
    try {
      const res = await fetch(`${API_BASE}/records/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="app-layout">
      {token && (
        <Sidebar 
          activeTab={activeTab} 
          setActiveTab={setActiveTab} 
          user={user} 
          onLogout={handleLogout} 
        />
      )}

      <main className="main-content-view">
        {(!token || activeTab === 'welcome') && (
          <div className="welcome-and-login">
            <WelcomeInfo />
            
            {!token && (
              <div className="landing-login-section card-container">
                <h3>{isRegistering ? '🏢 Create Your Organization' : '🔓 Access Your Financial Console'}</h3>
                <p className="text-muted">
                  {isRegistering 
                    ? 'Start your own private workspace and invite your team.' 
                    : 'Enter credentials from any profile above to start testing.'}
                </p>
                <form onSubmit={isRegistering ? handleRegister : handleLogin} className="create-form" style={{marginTop: '20px'}}>
                  {isRegistering && (
                    <input 
                      type="text" 
                      placeholder="Organization Name (e.g. Acme Corp)" 
                      value={organizationName} 
                      onChange={e => setOrganizationName(e.target.value)} 
                      required
                    />
                  )}
                  <input 
                    type="email" 
                    placeholder="Email address" 
                    value={email} 
                    onChange={e => setEmail(e.target.value)} 
                    required
                  />
                  <input 
                    type="password" 
                    placeholder="Password" 
                    value={password} 
                    onChange={e => setPassword(e.target.value)} 
                    required
                  />
                  <button type="submit" className="btn btn-primary btn-block">
                    {isRegistering ? 'Register & Create Workspace' : 'Login to Dashboard'}
                  </button>
                </form>
                {authError && <p className="warning-text" style={{marginTop: '15px'}}>{authError}</p>}
                
                <div style={{marginTop: '20px', textAlign: 'center'}}>
                  <button className="btn-link" onClick={() => setIsRegistering(!isRegistering)}>
                    {isRegistering ? 'Already have a workspace? Login' : 'Need a new private workspace? Register here'}
                  </button>
                </div>
              </div>
            )}

            {token && activeTab === 'welcome' && (
               <div className="card-container" style={{marginTop: '30px', textAlign: 'center'}}>
                  <p>You are moving through the <strong>{user.organization}</strong> workspace as <strong>{user.username}</strong>.</p>
                  <button className="btn btn-primary" onClick={() => setActiveTab('overview')}>Go to Console</button>
               </div>
            )}
          </div>
        )}
        
        {token && activeTab === 'overview' && (
          <div className="dashboard-content">
            <StatCards summary={summary} />
            <div className="dashboard-grid">
               <TransactionForm 
                 formData={formData} 
                 setFormData={setFormData} 
                 onSubmit={handleCreate} 
               />
                <div className="card-container">
                  <header style={{display: 'flex', justifyContent: 'space-between', marginBottom: '15px'}}>
                     <h3>Recent Activity</h3>
                     <small className="text-muted">Reflects your organization's latest moves</small>
                  </header>
                  {records.length > 0 ? (
                    <TransactionTable records={records.slice(0, 5)} onDelete={handleDelete} />
                  ) : (
                    <div className="empty-state" style={{padding: '40px', textAlign: 'center', background: '#f8fafc', border: '2px dashed #e2e8f0', borderRadius: '12px'}}>
                      <div style={{fontSize: '2rem', marginBottom: '10px'}}>📝</div>
                      <p className="text-muted">No transactions yet. Use the form on the left to add your first record!</p>
                    </div>
                  )}
               </div>
            </div>
          </div>
        )}

        {token && activeTab === 'transactions' && (
          <div className="transactions-view">
             <div className="card-container">
                <header style={{display: 'flex', justifyContent: 'space-between', marginBottom: '20px'}}>
                   <h3>All Transactions</h3>
                   <button className="btn btn-primary btn-sm" onClick={() => setActiveTab('overview')}>+ Add New Record</button>
                </header>
                {records.length > 0 ? (
                  <TransactionTable records={records} onDelete={handleDelete} />
                ) : (
                  <div className="empty-state" style={{padding: '60px', textAlign: 'center'}}>
                    <div style={{fontSize: '3rem', marginBottom: '20px'}}>📂</div>
                    <h4>Your financial history is empty</h4>
                    <p className="text-muted">Once you start adding income or expenses, they will appear here with full details.</p>
                    <button className="btn btn-primary" style={{marginTop: '20px'}} onClick={() => setActiveTab('overview')}>Get Started</button>
                  </div>
                )}
             </div>
          </div>
        )}

        {token && activeTab === 'activity' && (
          <div className="audit-view">
             <div className="card-container">
                {['Super Admin', 'Admin', 'Auditor'].includes(user.role) 
                  ? (
                    <>
                      <header style={{marginBottom: '20px'}}>
                        <h3>System Transparency</h3>
                        <p className="text-muted small">Every write/delete action is logged here for 100% audit compliance.</p>
                      </header>
                      <AuditLogView auditLogs={auditLogs} />
                    </>
                  )
                  : <AccessDenied message="Only Administrators and Auditors can view system logs." />
                }
             </div>
          </div>
        )}

        {token && activeTab === 'team' && (
          <div className="team-view">
              {['Super Admin', 'Admin'].includes(user.role) 
                ? <TeamManagement teamMembers={teamMembers} onCreateMember={handleCreateTeamMember} />
                : <AccessDenied message="Only Workspace Admins can manage the team." />
              }
          </div>
        )}

        {!token && activeTab !== 'welcome' && (
          <div className="card-container">
             <p>Please login from the Home page to access this feature.</p>
             <button className="btn btn-primary" onClick={() => setActiveTab('welcome')}>Back to Home</button>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
