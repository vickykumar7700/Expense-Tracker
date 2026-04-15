import { useState, useEffect } from 'react';
import axios from 'axios';
import { Trash2 } from 'lucide-react';
import API_URL from '../config/api';

const AdminPanel = () => {
  const [users, setUsers] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const token = sessionStorage.getItem('token');
        const headers = { Authorization: `Bearer ${token}` };
        
        const [usersRes, expRes, incRes] = await Promise.all([
          axios.get(`${API_URL}/api/auth/users`, { headers }),
          axios.get(`${API_URL}/api/expense/all`, { headers }),
          axios.get(`${API_URL}/api/income/all`, { headers })
        ]);
        
        setUsers(usersRes.data);
        
        const allExpenses = expRes.data.map(e => ({ ...e, type: 'expense' }));
        const allIncomes = incRes.data.map(i => ({ ...i, type: 'income' }));
        const combined = [...allExpenses, ...allIncomes].sort((a,b) => new Date(b.date) - new Date(a.date));
        
        setExpenses(combined);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchAdminData();
  }, []);

  const handleDeleteTransaction = async (id, type) => {
    try {
      if (!window.confirm(`Are you sure you want to delete this ${type}?`)) return;
      const token = sessionStorage.getItem('token');
      const endpoint = type === 'income' ? '/api/income' : '/api/expense';
      
      await axios.delete(`${API_URL}${endpoint}/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setExpenses(expenses.filter(ex => ex._id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <div style={{ textAlign: 'center', marginTop: '50px' }}>Loading Admin Board...</div>;

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h2 className="text-gradient">Admin Dashboard</h2>
      </div>

      <div className="content-grid" style={{ gridTemplateColumns: '1fr 1fr' }}>
        <div className="glass-panel" style={{ padding: '24px' }}>
          <h3 style={{ marginBottom: '20px' }}>Registered Users ({users.length})</h3>
          <div style={{ overflowX: 'auto' }}>
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                </tr>
              </thead>
              <tbody>
                {users.map(u => (
                  <tr key={u._id}>
                    <td>{u.name}</td>
                    <td>{u.email}</td>
                    <td>{u.isAdmin ? <span style={{color: 'var(--secondary)'}}>Admin</span> : 'User'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '24px' }}>
          <h3 style={{ marginBottom: '20px' }}>All Platform Transactions</h3>
          <div className="expense-list">
            {expenses.map(exp => (
              <div key={exp._id} className="expense-item glass-panel">
                <div className="expense-info">
                  <div className="title">{exp.title}</div>
                  <div className="date">By: {exp.userId?.name} | {new Date(exp.date).toLocaleDateString()}</div>
                </div>
                <div className="expense-amount" style={{ color: exp.type === 'income' ? 'var(--success)' : 'var(--danger)'}}>
                  {exp.type === 'income' ? '+' : '-'} ₹{exp.amount}
                  <button className="delete-btn" onClick={() => handleDeleteTransaction(exp._id, exp.type)}>
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
            {expenses.length === 0 && <p>No expenses recorded on platform.</p>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
