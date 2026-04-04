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
import { IconShield, IconAudit } from './Icons';

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

  // Integrated View Logic
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
        {/* ELITE LANDING PAGE: 2-PANEL SPLIT */}
        {(!token || activeTab === 'welcome') && (
          <div className="landing-split-container">
            <div className="landing-left-panel">
              <WelcomeInfo />
            </div>
            
            <div className="landing-right-panel">
              {!token ? (
                <div className="auth-portal-card">
                  <div style={{textAlign: 'center', marginBottom: '2rem'}}>
                    <h2 style={{fontSize: '2rem', marginBottom: '0.5rem'}}>
                      {isRegistering ? 'Create Workspace' : 'Control Portal'}
                    </h2>
                    <p style={{color: 'var(--text-secondary)', fontSize: '0.9rem'}}>
                      {isRegistering 
                        ? 'Boot a and new private organization instance.' 
                        : 'Enter credentials for secure instance access.'}
                    </p>
                  </div>

                  <form onSubmit={isRegistering ? handleRegister : handleLogin}>
                    {isRegistering && (
                      <input 
                        className="input-stealth"
                        type="text" 
                        placeholder="Organization Name" 
                        value={organizationName} 
                        onChange={e => setOrganizationName(e.target.value)} 
                        required
                      />
                    )}
                    <input 
                      className="input-stealth"
                      type="email" 
                      placeholder="Identifer (Email)" 
                      value={email} 
                      onChange={e => setEmail(e.target.value)} 
                      required
                    />
                    <input 
                      className="input-stealth"
                      type="password" 
                      placeholder="Access Code (Password)" 
                      value={password} 
                      onChange={e => setPassword(e.target.value)} 
                      required
                    />
                    <button type="submit" className="btn-elite">
                      {isRegistering ? 'INITIALIZE WORKSPACE' : 'AUTHENTICATE'}
                    </button>
                  </form>
                  
                  {authError && <p className="warning-text" style={{marginTop: '20px', textAlign: 'center', color: 'var(--error)'}}>{authError}</p>}
                  
                  <div style={{marginTop: '2rem', textAlign: 'center'}}>
                    <button className="btn-link" style={{color: 'var(--text-muted)', fontSize: '0.85rem'}} onClick={() => setIsRegistering(!isRegistering)}>
                      {isRegistering ? 'Existing Operator? Access Portal' : 'New Client? Request Instance'}
                    </button>
                  </div>
                </div>
              ) : (
                  <div className="auth-portal-card" style={{textAlign: 'center'}}>
                     <div style={{color: 'var(--primary)', marginBottom: '1.5rem', display: 'flex', justifyContent: 'center'}}>
                       <IconShield size={64} />
                     </div>
                     <h3>{user.organization}</h3>
                     <p style={{color: 'var(--text-secondary)', marginBottom: '2rem'}}>Connected as <strong>{user.username}</strong></p>
                     <button className="btn-elite" onClick={() => setActiveTab('overview')}>ENTER DASHBOARD</button>
                  </div>
              )}
            </div>
          </div>
        )}
        
        {token && activeTab === 'overview' && (
          <div className="dashboard-content">
            <StatCards summary={summary} />
            <div className={`dashboard-grid ${!['Super Admin', 'Admin', 'Accountant'].includes(user.role) ? 'no-sidebar' : ''}`}>
              {['Super Admin', 'Admin', 'Accountant'].includes(user.role) && (
                 <TransactionForm 
                   formData={formData} 
                   setFormData={setFormData} 
                   onSubmit={handleCreate} 
                 />
              )}
                <div className={`card-container ${!['Super Admin', 'Admin', 'Accountant'].includes(user.role) ? 'full-width' : ''}`}>
                  <header style={{display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem'}}>
                     <h3>LATEST LEDGER ACTIVITY</h3>
                     <small className="text-muted">SYNCED LIVE</small>
                  </header>
                  {records.length > 0 ? (
                    <TransactionTable 
                      records={records.slice(0, 5)} 
                      onDelete={handleDelete} 
                      userRole={user.role} 
                    />
                  ) : (
                    <div className="empty-state">
                      <div className="empty-state-icon" style={{color: 'var(--primary)'}}>
                        <IconAudit size={48} />
                      </div>
                      <h4>Ledger is currently empty</h4>
                      <p>
                        {['Super Admin', 'Admin', 'Accountant'].includes(user.role) 
                          ? 'Start by recording a transaction using the terminal on the left.'
                          : 'Administrative clearance required to initialize new records.'}
                      </p>
                    </div>
                  )}
               </div>
            </div>
          </div>
        )}

        {token && activeTab === 'transactions' && (
          <div className="transactions-view">
             <div className="card-container">
                <header style={{display: 'flex', justifyContent: 'space-between', marginBottom: '2rem'}}>
                   <h3>FULL TRANSACTION ARCHIVE</h3>
                   <button className="btn-elite" style={{padding: '8px 20px', fontSize: '0.8rem'}} onClick={() => setActiveTab('overview')}>+ NEW RECORD</button>
                </header>
                {records.length > 0 ? (
                  <TransactionTable records={records} onDelete={handleDelete} userRole={user.role} />
                ) : (
                  <div className="empty-state">
                    <div className="empty-state-icon" style={{color: 'var(--text-muted)'}}>
                      <IconAudit size={48} />
                    </div>
                    <h4>No data points available</h4>
                    <p>Once you initialize your first record, it will be archived here.</p>
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
