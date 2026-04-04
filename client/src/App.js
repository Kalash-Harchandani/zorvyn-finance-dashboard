import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

const API_URL = 'http://localhost:5000/api/v1';

function App() {
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')) || null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [summary, setSummary] = useState(null);
  const [records, setRecords] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    if (token) {
      fetchDashboard();
      fetchRecords();
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
      console.error(err);
      if(err.response?.status === 403) {
         setSummary({ error: 'You do not have permission to view the dashboard overview.' });
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
      console.error(err);
      if(err.response?.status === 403) {
        setRecords([{ id: 'error', notes: 'You do not have permission to view records lists.' }]);
      }
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
        <h2>Welcome, {user?.username} ({user?.role})</h2>
        <button onClick={handleLogout} className="logout-btn">Logout</button>
      </header>

      <section className="summary">
        <h3>Dashboard Summary</h3>
        {summary?.error ? (
           <p className="error">{summary.error}</p>
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

      <section className="records">
        <h3>Financial Records</h3>
        {records.length > 0 && records[0].id === 'error' ? (
           <p className="error">{records[0].notes}</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Category</th>
                <th>Type</th>
                <th>Amount</th>
                <th>Notes</th>
              </tr>
            </thead>
            <tbody>
              {records.map(r => (
                <tr key={r.id}>
                  <td>{r.date?.substring(0, 10)}</td>
                  <td>{r.category}</td>
                  <td>{r.type}</td>
                  <td>${r.amount}</td>
                  <td>{r.notes}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </div>
  );
}

export default App;
