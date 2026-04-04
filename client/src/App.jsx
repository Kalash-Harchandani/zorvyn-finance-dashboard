import React, { useState, useEffect, useCallback } from 'react';
import './App.css';
import Sidebar from './components/Sidebar';
import Topbar from './components/Topbar';
import StatCards from './components/StatCards';
import TransactionForm from './components/TransactionForm';
import TransactionTable from './components/TransactionTable';
import WelcomeInfo from './components/WelcomeInfo';
import AuditLogView from './components/AuditLogView';
import TeamManagement from './components/TeamManagement';

const API_BASE = 'http://localhost:5005/api/v1';

function App() {
  const getStoredUser = () => {
    try {
      const stored = localStorage.getItem('user');
      return (stored && stored !== 'undefined') ? JSON.parse(stored) : null;
    } catch (e) {
      return null;
    }
  };

  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [user, setUser] = useState(getStoredUser());
  const [activeTab, setActiveTab] = useState('welcome');
  const [records, setRecords] = useState([]);
  const [summary, setSummary] = useState({ total_income: 0, total_expense: 0, net_balance: 0 });
  const [auditLogs, setAuditLogs] = useState([]);
  const [formData, setFormData] = useState({ date: new Date().toISOString().split('T')[0], category: 'General', type: 'expense', amount: '', notes: '' });
  const [authForm, setAuthForm] = useState({ 
    username: '', 
    email: '', 
    password: '', 
    organization: 'Zorvyn Headquarters', 
    role: 'Admin' 
  });
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState('');

  const fetchData = useCallback(async () => {
    if (!token) return;
    try {
      const headers = { 'Authorization': `Bearer ${token}` };
      
      const recRes = await fetch(`${API_BASE}/records`, { headers });
      const sumRes = await fetch(`${API_BASE}/records/summary`, { headers });

      const recData = await recRes.json();
      const sumData = await sumRes.json();

      if (recRes.ok && Array.isArray(recData.data)) {
        setRecords(recData.data);
      }
      if (sumRes.ok && sumData.data && sumData.data.summary) {
        setSummary(sumData.data.summary);
      }
    } catch (err) {
      console.error(err);
      if (err.status === 401) handleLogout();
    }
  }, [token]);

  const fetchAuditLogs = useCallback(async () => {
    if (!token || !['Super Admin', 'Admin', 'Auditor'].includes(user?.role)) return;
    try {
      const res = await fetch(`${API_BASE}/audit/logs`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const resData = await res.json();
      if (res.ok && Array.isArray(resData.data)) {
        setAuditLogs(resData.data);
      }
    } catch (err) {
      console.error(err);
    }
  }, [token, user]);

  useEffect(() => {
    if (token) {
      fetchData();
      fetchAuditLogs();
    }
  }, [token, activeTab, fetchData, fetchAuditLogs]);

  const handleAuth = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const endpoint = isLogin ? 'login' : 'register';
      const body = isLogin 
        ? { email: authForm.email, password: authForm.password }
        : { 
            username: authForm.username, 
            email: authForm.email, 
            password: authForm.password, 
            organizationName: authForm.organization,
            role: authForm.role 
          };

      const res = await fetch(`${API_BASE}/auth/${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      const data = await res.json();
      
      if (!res.ok) throw new Error(data.error || 'Authentication failed');

      const userData = data.data;
      localStorage.setItem('token', userData.token);
      localStorage.setItem('user', JSON.stringify(userData));
      setToken(userData.token);
      setUser(userData);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
    setActiveTab('welcome');
  };

  const handleAddTransaction = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await fetch(`${API_BASE}/records`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });
      
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to record transaction');
      }

      setFormData({ date: new Date().toISOString().split('T')[0], category: 'General', type: 'expense', amount: '', notes: '' });
      fetchData();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDeleteTransaction = async (id) => {
    try {
      const res = await fetch(`${API_BASE}/records/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error);
      }
      fetchData();
    } catch (err) {
      setError(`Permission Denied: ${err.message}`);
    }
  };

  if (!token) {
    return (
      <div className="landing-grid">
        <div style={{padding: '4rem', display: 'flex', flexDirection: 'column', justifyContent: 'center'}}>
          <h1 style={{fontSize: '3rem', fontWeight: '800', marginBottom: '1rem', letterSpacing: '-0.03em'}}>Zorvyn Finance</h1>
          <p style={{fontSize: '1.1rem', color: '#666', maxWidth: '500px', marginBottom: '2rem'}}>
            Secure, enterprise-grade multi-tenant financial ledger. Strict role-based access control and comprehensive audit transparency.
          </p>
          
          <div className="access-matrix">
            <div className="matrix-tile">
              <h5>Administrator</h5>
              <p>Full control over teams and financial auditing.</p>
              <div style={{marginTop: '10px', fontSize: '0.7rem', fontFamily: 'monospace', color: 'var(--primary)'}}>
                ID: <strong>superadmin@zorvyn.com</strong> | PW: <strong>password123</strong>
              </div>
            </div>
            <div className="matrix-tile">
              <h5>Accountant</h5>
              <p>Execute and manage fiscal records and journals.</p>
              <div style={{marginTop: '10px', fontSize: '0.7rem', fontFamily: 'monospace', color: 'var(--primary)'}}>
                ID: <strong>accountant@zorvyn.com</strong> | PW: <strong>password123</strong>
              </div>
            </div>
            <div className="matrix-tile">
              <h5>Auditor</h5>
              <p>Read-only access to complete system audit trails.</p>
              <div style={{marginTop: '10px', fontSize: '0.7rem', fontFamily: 'monospace', color: 'var(--primary)'}}>
                ID: <strong>auditor@zorvyn.com</strong> | PW: <strong>password123</strong>
              </div>
            </div>
            <div className="matrix-tile">
              <h5>Viewer</h5>
              <p>High-level operational overview and summaries.</p>
              <div style={{marginTop: '10px', fontSize: '0.7rem', fontFamily: 'monospace', color: 'var(--primary)'}}>
                ID: <strong>viewer@zorvyn.com</strong> | PW: <strong>password123</strong>
              </div>
            </div>
          </div>
        </div>

        <div className="login-section">
          <div className="card-container" style={{width: '100%', maxWidth: '380px'}}>
            <h3 style={{marginBottom: '0.5rem'}}>{isLogin ? 'Authentication' : 'Registration'}</h3>
            <p style={{fontSize: '0.8rem', color: '#888', marginBottom: '2rem'}}>Identify your tenant and credentials.</p>
            
            {error && <div className="rbac-denied" style={{marginBottom: '1.5rem'}}>{error}</div>}
            
            <form onSubmit={handleAuth} className="minimal-form">
              <label>Identity Email</label>
              <input type="email" value={authForm.email} onChange={e => setAuthForm({...authForm, email: e.target.value})} required />
              
              <label>Secure Access Password</label>
              <input type="password" value={authForm.password} onChange={e => setAuthForm({...authForm, password: e.target.value})} required />
              
              {!isLogin && (
                <>
                  <label>Identifier ID (Username)</label>
                  <input type="text" value={authForm.username} onChange={e => setAuthForm({...authForm, username: e.target.value})} required />
                  
                  <label>Organization Domain</label>
                  <input type="text" value={authForm.organization} onChange={e => setAuthForm({...authForm, organization: e.target.value})} required />
                </>
              )}
              
              <button type="submit" className="btn-primary" style={{width: '100%'}}>
                {isLogin ? 'Sign In' : 'Create Account'}
              </button>
            </form>
            
            <button className="menu-item" style={{width: '100%', marginTop: '1.5rem', textAlign: 'center', fontSize: '0.8rem'}} onClick={() => setIsLogin(!isLogin)}>
              {isLogin ? "Need a new workspace? Register here." : "Already have an account? Sign in."}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="app-layout">
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        user={user} 
        onLogout={handleLogout} 
      />
      
      <div className="main-wrapper">
        <Topbar user={user} />
        
        <main className="content-area">
          {error && <div className="rbac-denied">{error}</div>}

          {activeTab === 'welcome' && <WelcomeInfo user={user} />}
          
          {activeTab === 'overview' && (
            <div>
              <header className="section-header">
                <h3>Financial Dashboard</h3>
              </header>
              <StatCards summary={summary} />
              
              <div className="dashboard-grid">
                <TransactionForm 
                  formData={formData} 
                  setFormData={setFormData} 
                  onSubmit={handleAddTransaction} 
                  userRole={user?.role}
                />
                
                <div className="card-container">
                  <header className="section-header">
                    <h3>Journal Entries</h3>
                  </header>
                  <TransactionTable 
                    records={records} 
                    onDelete={handleDeleteTransaction} 
                    userRole={user?.role} 
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'transactions' && (
            <div className="card-container">
              <header className="section-header">
                <h3>Master Journal</h3>
              </header>
              <TransactionTable 
                records={records} 
                onDelete={handleDeleteTransaction} 
                userRole={user?.role} 
              />
            </div>
          )}

          {activeTab === 'activity' && (
             <div className="card-container">
              <header className="section-header">
               <h3>Audit Trail</h3>
             </header>
             <AuditLogView auditLogs={auditLogs} userRole={user?.role} />
           </div>
          )}
          
          {activeTab === 'team' && <TeamManagement user={user} token={token} />}
        </main>
      </div>
    </div>
  );
}

export default App;
