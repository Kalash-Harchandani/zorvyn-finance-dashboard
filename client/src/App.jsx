import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import './App.css';

// Components
import Sidebar from './components/Sidebar';
import StatCards from './components/StatCards';
import TransactionForm from './components/TransactionForm';
import TransactionTable from './components/TransactionTable';
import AuditLogView from './components/AuditLogView';
import WelcomeInfo from './components/WelcomeInfo';

const API_URL = 'http://localhost:5005/api/v1';

function App() {
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')) || null);
  const [activeTab, setActiveTab] = useState('welcome');
  
  // Auth State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');

  // Data State
  const [summary, setSummary] = useState(null);
  const [records, setRecords] = useState([]);
  const [auditLogs, setAuditLogs] = useState([]);
  const [formData, setFormData] = useState({
    amount: '',
    type: 'expense',
    category: '',
    date: new Date().toISOString().split('T')[0],
    notes: ''
  });

  const fetchDashboard = useCallback(async () => {
    try {
      const { data } = await axios.get(`${API_URL}/records/dashboard`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSummary(data.data.summary);
    } catch (err) {
      if (err.response?.status === 403) {
        setSummary({ error: 'Access Restricted for Dashboard Summary.' });
      }
    }
  }, [token]);

  const fetchRecords = useCallback(async () => {
    try {
      const { data } = await axios.get(`${API_URL}/records`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setRecords(data.data);
    } catch (err) {
      if (err.response?.status === 403) {
        setRecords([{ id: 'error', notes: 'Your role cannot view the transaction database.' }]);
      }
    }
  }, [token]);

  const fetchAuditLogs = useCallback(async () => {
    try {
      const { data } = await axios.get(`${API_URL}/records/audit-logs`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAuditLogs(data.data);
    } catch (err) {
      if (err.response?.status === 403) {
        setAuditLogs([{ id: 'error', notes: 'Access Restricted' }]);
      }
    }
  }, [token]);

  const fetchAllData = useCallback(() => {
    fetchDashboard();
    fetchRecords();
    fetchAuditLogs();
  }, [fetchDashboard, fetchRecords, fetchAuditLogs]);

  useEffect(() => {
    if (token) {
      fetchAllData();
    }
  }, [token, fetchAllData]);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(`${API_URL}/auth/login`, { email, password });
      const userData = data.data;
      setToken(userData.token);
      setUser(userData);
      localStorage.setItem('token', userData.token);
      localStorage.setItem('user', JSON.stringify(userData));
      setAuthError('');
      setActiveTab('welcome'); // Start at welcome info
    } catch (err) {
      setAuthError(err.response?.data?.message || 'Authentication Failed');
    }
  };

  const handleLogout = () => {
    setToken('');
    setUser(null);
    setSummary(null);
    setRecords([]);
    setAuditLogs([]);
    localStorage.clear();
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_URL}/records`, formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setFormData({ amount: '', type: 'expense', category: '', date: new Date().toISOString().split('T')[0], notes: '' });
      fetchAllData();
    } catch (err) {
      alert(err.response?.data?.message || 'Creation Restricted');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this record?')) return;
    try {
      await axios.delete(`${API_URL}/records/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchAllData();
    } catch (err) {
      alert(err.response?.data?.message || 'Deletion Restricted');
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
        {/* PUBLIC LANDING PAGE */}
        {(!token || activeTab === 'welcome') && (
          <div className="welcome-and-login">
            <WelcomeInfo />
            
            {!token && (
              <div className="landing-login-section card-container">
                <h3>🔓 Access Your Financial Console</h3>
                <p className="text-muted">Enter credentials from any profile above to start testing.</p>
                <form onSubmit={handleLogin} className="create-form" style={{marginTop: '20px'}}>
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
                  <button type="submit" className="btn btn-primary btn-block">Login to Dashboard</button>
                </form>
                {authError && <p className="warning-text" style={{marginTop: '15px'}}>{authError}</p>}
              </div>
            )}

            {token && activeTab === 'welcome' && (
               <div className="card-container" style={{marginTop: '30px', textAlign: 'center'}}>
                  <p>You are currently authenticated as <strong>{user.username}</strong>.</p>
                  <button className="btn btn-primary" onClick={() => setActiveTab('overview')}>Go to My Console</button>
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
                  <h3>Recent Financial Activity</h3>
                  <TransactionTable records={records.slice(0, 5)} onDelete={handleDelete} />
               </div>
            </div>
          </div>
        )}

        {token && activeTab === 'transactions' && (
          <div className="transactions-view">
             <div className="card-container">
                <header style={{display: 'flex', justifyContent: 'space-between', marginBottom: '20px'}}>
                   <h3>All Transactions</h3>
                   <button className="btn btn-primary btn-sm" onClick={() => setActiveTab('overview')}>+ Add Record</button>
                </header>
                <TransactionTable records={records} onDelete={handleDelete} />
             </div>
          </div>
        )}

        {token && activeTab === 'activity' && (
          <div className="audit-view">
             <div className="card-container">
                <AuditLogView auditLogs={auditLogs} />
             </div>
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
