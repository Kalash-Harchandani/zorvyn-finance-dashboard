import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

const API_URL = 'http://localhost:5005/api/v1';

function App() {
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')) || null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [summary, setSummary] = useState(null);
  const [records, setRecords] = useState([]);
  const [auditLogs, setAuditLogs] = useState([]);
  const [error, setError] = useState('');

  // Form State
  const [formData, setFormData] = useState({
    amount: '',
    type: 'expense',
    category: '',
    date: new Date().toISOString().split('T')[0],
    notes: ''
  });

  useEffect(() => {
    if (token) {
      fetchDashboard();
      fetchRecords();
      fetchAuditLogs();
    }
  }, [token]);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(`${API_URL}/auth/login`, { email, password });
      setToken(data.data.token);
      setUser(data.data);
      localStorage.setItem('token', data.data.token);
      localStorage.setItem('user', JSON.stringify(data.data));
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Login Failed');
    }
  };

  const handleLogout = () => {
    setToken('');
    setUser(null);
    setSummary(null);
    setRecords([]);
    setAuditLogs([]);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  const fetchDashboard = async () => {
    try {
      const { data } = await axios.get(`${API_URL}/records/dashboard`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSummary(data.data.summary);
    } catch (err) {
      if(err.response?.status === 403) {
         setSummary({ error: 'Permission Denied: Cannot view dashboard summary.' });
      }
    }
  };

  const fetchRecords = async () => {
    try {
      const { data } = await axios.get(`${API_URL}/records`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setRecords(data.data);
    } catch (err) {
      if(err.response?.status === 403) {
        setRecords([{ id: 'error', notes: 'Permission Denied: Cannot view records list.' }]);
      }
    }
  };

  const fetchAuditLogs = async () => {
    try {
      const { data } = await axios.get(`${API_URL}/records/audit-logs`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAuditLogs(data.data);
    } catch (err) {
      if(err.response?.status === 403) {
        setAuditLogs([{ id: 'error', action_type: 'Permission Denied', username: 'System', timestamp: '' }]);
      }
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_URL}/records`, formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setFormData({ amount: '', type: 'expense', category: '', date: new Date().toISOString().split('T')[0], notes: '' });
      fetchDashboard();
      fetchRecords();
      fetchAuditLogs();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to create record');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure?')) return;
    try {
      await axios.delete(`${API_URL}/records/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchDashboard();
      fetchRecords();
      fetchAuditLogs();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete record');
    }
  };

  if (!token) {
    return (
      <div className="container login-container">
        <h2>Zorvyn Finance</h2>
        <form onSubmit={handleLogin}>
          <input 
            type="email" 
            placeholder="Email (e.g. superadmin@zorvyn.com)" 
            value={email} 
            onChange={e => setEmail(e.target.value)} 
          />
          <input 
            type="password" 
            placeholder="Password (e.g. superadmin123)" 
            value={password} 
            onChange={e => setPassword(e.target.value)} 
          />
          <button type="submit">Login</button>
        </form>
        {error && <p className="error">{error}</p>}
      </div>
    );
  }

  return (
    <div className="container dashboard">
      <header>
        <div>
           <h2>Zorvyn Finance</h2>
           <p>Logged in as: <strong>{user?.username}</strong> | Role: <span className="badge">{user?.role}</span></p>
        </div>
        <button onClick={handleLogout} className="logout-btn">Logout</button>
      </header>

      <section className="summary">
        <h3>Analytics Overview</h3>
        {summary?.error ? (
           <p className="error-box">{summary.error}</p>
        ) : summary ? (
          <div className="cards">
            <div className="card income">Income: ${summary.total_income}</div>
            <div className="card expense">Expense: ${summary.total_expense}</div>
            <div className={`card net ${summary.net_balance >= 0 ? 'positive' : 'negative'}`}>
              Net: ${summary.net_balance}
            </div>
          </div>
        ) : <p>Loading summary...</p>}
      </section>

      <div className="main-content">
        <section className="create-section">
          <h3>Add New Transaction</h3>
          <form onSubmit={handleCreate} className="create-form">
            <input type="number" placeholder="Amount" value={formData.amount} onChange={e => setFormData({...formData, amount: e.target.value})} />
            <select value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})}>
              <option value="expense">Expense</option>
              <option value="income">Income</option>
            </select>
            <input type="text" placeholder="Category (e.g. Food)" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} />
            <input type="date" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} />
            <textarea placeholder="Notes" value={formData.notes} onChange={e => setFormData({...formData, notes: e.target.value})} />
            <button type="submit">Add Record</button>
          </form>
        </section>

        <section className="records">
          <h3>Recent Transactions</h3>
          {records.length > 0 && records[0].id === 'error' ? (
             <p className="error-box">{records[0].notes}</p>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Category</th>
                  <th>Type</th>
                  <th>Amount</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {records.map(r => (
                  <tr key={r.id}>
                    <td>{r.date?.substring(0, 10)}</td>
                    <td>{r.category}</td>
                    <td className={r.type}>{r.type.toUpperCase()}</td>
                    <td>${r.amount}</td>
                    <td>
                      <button onClick={() => handleDelete(r.id)} className="delete-btn">Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {auditLogs.length > 0 && (
             <div className="audit-section">
               <h3>Activity Log (Auditor Only)</h3>
                {auditLogs[0].id === 'error' ? (
                  <p className="info-box">Only Auditors and Admins can view the central Activity Log.</p>
                ) : (
                  <ul className="audit-list">
                    {auditLogs.map(log => (
                      <li key={log.id}>
                        <strong>{log.username}</strong> performed <strong>{log.action_type}</strong> on {log.target_table} ({log.timestamp.replace('T', ' ').substring(0, 19)})
                      </li>
                    ))}
                  </ul>
                )}
             </div>
          )}
        </section>
      </div>
    </div>
  );
}

export default App;
