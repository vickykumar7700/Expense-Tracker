import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { ShoppingBag, Plane, Zap, Landmark, Coffee, FileText, Plus, Download, ArrowDownRight, X, ImageIcon } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { AuthContext } from '../context/AuthContext';
import API_URL from '../config/api';

const Expense = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  const { user } = useContext(AuthContext);

  const handleAddExpense = async (e) => {
    e.preventDefault();
    if (!title || !amount) return;
    setError('');
    try {
      const token = sessionStorage.getItem('token');
      await axios.post(`${API_URL}/api/expense`, { 
        title, 
        amount: Number(amount), 
        category: title, // Using Input as category for auto icon matching
        type: 'expense',
        date
      }, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setTitle('');
      setAmount('');
      setDate(new Date().toISOString().split('T')[0]);
      setIsModalOpen(false);
      setError('');
      fetchTransactions();
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message || 'Failed to add expense';
      setError(errorMsg);
      console.error(err);
    }
  };

  const fetchTransactions = async () => {
    try {
      const token = sessionStorage.getItem('token');
      const res = await axios.get(`${API_URL}/api/expense`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      // Filter for expense only
      setTransactions(res.data.filter(t => t.type === 'expense' || !t.type));
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message || 'Failed to fetch expenses';
      console.error('Fetch error:', err);
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const getExpenseIcon = (cat) => {
    switch(cat?.toLowerCase()) {
      case 'shopping': return <div style={{padding:'10px', background:'rgba(236, 72, 153, 0.1)', borderRadius:'50%'}}><ShoppingBag size={20} color="#ec4899" /></div>;
      case 'travel': return <div style={{padding:'10px', background:'rgba(59, 130, 246, 0.1)', borderRadius:'50%'}}><Plane size={20} color="#3b82f6" /></div>;
      case 'food': return <div style={{padding:'10px', background:'rgba(245, 158, 11, 0.1)', borderRadius:'50%'}}><Coffee size={20} color="#f59e0b" /></div>;
      case 'bills': 
      case 'electricity bill': return <div style={{padding:'10px', background:'rgba(234, 179, 8, 0.1)', borderRadius:'50%'}}><Zap size={20} color="#eab308" /></div>;
      case 'loan repayment': return <div style={{padding:'10px', background:'rgba(99, 102, 241, 0.1)', borderRadius:'50%'}}><Landmark size={20} color="#6366f1" /></div>;
      default: return <div style={{padding:'10px', background:'rgba(100, 116, 139, 0.1)', borderRadius:'50%'}}><FileText size={20} color="#64748b" /></div>;
    }
  };

  const chartData = transactions.slice()
    .sort((a,b) => new Date(a.date) - new Date(b.date))
    .slice(-15) // last 15 entries for area chart to look nice
    .map(t => ({
      uid: t._id,
      name: new Date(t.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }),
      amount: t.amount,
      title: t.title
    }));

  if (loading) return <div style={{ textAlign: 'center', marginTop: '50px' }}>Loading...</div>;

  return (
    <div className="dashboard-container" style={{ paddingBottom: '40px' }}>
      
      {/* Expense Overview Chart */}
      <div className="glass-panel" style={{ padding: '30px', marginBottom: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '30px' }}>
          <div>
            <h2 style={{ margin: '0 0 10px 0', fontSize: '1.5rem', color: 'var(--text-main)' }}>Expense Overview</h2>
            <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.9rem' }}>Track your spending trends over time and gain insights into where your money goes.</p>
          </div>
          <button 
            onClick={() => setIsModalOpen(true)}
            style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px', borderRadius: '12px', background: 'rgba(168, 85, 247, 0.1)', color: '#a855f7', border: 'none', fontWeight: 'bold', cursor: 'pointer' }}
          >
            <Plus size={18} /> Add Expense
          </button>
        </div>

        <div style={{ height: '350px', width: '100%' }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 20, right: 0, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="uid" tickFormatter={(uid) => chartData.find(d => d.uid === uid)?.name} axisLine={false} tickLine={false} tick={{ fill: 'var(--text-muted)', fontSize: 12 }} dy={10} />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: 'var(--text-muted)', fontSize: 12 }} />
              <Tooltip 
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div style={{ backgroundColor: 'var(--panel-bg)', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '12px', boxShadow: '0 4px 15px rgba(0,0,0,0.1)' }}>
                        <p style={{ margin: '0 0 5px 0', fontWeight: 'bold', color: 'var(--text-main)', fontSize: '1.05rem' }}>
                          {payload[0].payload.title}
                        </p>
                        <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                          Amount: <span style={{ fontWeight: 'bold', color: 'var(--text-main)' }}>₹{payload[0].value}</span>
                        </p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Area type="monotone" dataKey="amount" stroke="#8b5cf6" strokeWidth={3} fillOpacity={1} fill="url(#colorAmount)" activeDot={{ r: 6 }} dot={{ r: 4, strokeWidth: 2, fill: 'var(--panel-bg)', stroke: '#8b5cf6' }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Expense Sources Grid */}
      <div className="glass-panel" style={{ padding: '30px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <h2 style={{ margin: 0, fontSize: '1.4rem', color: 'var(--text-main)' }}>All Expanses</h2>
          <button style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', borderRadius: '12px', background: 'var(--panel-bg)', border: '1px solid var(--border-color)', color: 'var(--text-main)', cursor: 'pointer', fontSize: '0.9rem' }}>
            <Download size={16} /> Download
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))', gap: '20px' }}>
          {transactions.map(t => (
            <div key={t._id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '15px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                {getExpenseIcon(t.category)}
                <div>
                  <div style={{ fontWeight: 'bold', color: 'var(--text-main)', fontSize: '1.05rem', marginBottom: '4px' }}>{t.title}</div>
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                    {new Date(t.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </div>
                </div>
              </div>
              <div style={{ background: 'rgba(239, 68, 68, 0.1)', color: 'var(--danger)', padding: '6px 12px', borderRadius: '8px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.95rem' }}>
                - ₹{t.amount} <ArrowDownRight size={16} />
              </div>
            </div>
          ))}
          {transactions.length === 0 && (
            <div style={{ color: 'var(--text-muted)', padding: '20px 0', gridColumn: '1 / -1' }}>No expenses recorded yet.</div>
          )}
        </div>
      </div>

      {/* Add Expense Modal */}
      {isModalOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, backdropFilter: 'blur(5px)' }}>
          <div className="glass-panel" style={{ width: '100%', maxWidth: '500px', padding: '30px', position: 'relative', background: 'var(--panel-bg)', borderRadius: '20px' }}>
            <button 
              onClick={() => setIsModalOpen(false)} 
              style={{ position: 'absolute', top: '24px', right: '24px', background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
              <X size={20} />
            </button>
            <h2 style={{ marginTop: 0, marginBottom: '24px', fontSize: '1.4rem' }}>Add Expense</h2>
            
            {error && (
              <div style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', padding: '12px', borderRadius: '8px', marginBottom: '20px', fontSize: '0.9rem' }}>
                {error}
              </div>
            )}
            
            <form onSubmit={handleAddExpense}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '24px' }}>
                <div style={{ width: '50px', height: '50px', borderRadius: '12px', background: 'rgba(139, 92, 246, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#8b5cf6' }}>
                  <ImageIcon size={24} />
                </div>
                <div style={{ fontWeight: '500', color: 'var(--text-main)' }}>Pick Icon</div>
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', color: 'var(--text-main)' }}>Expense Source</label>
                <input 
                  type="text" 
                  value={title} 
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Shopping, Bills, etc"
                  style={{ width: '100%', padding: '12px 15px', borderRadius: '10px', border: '1px solid var(--border-color)', background: 'rgba(255,255,255,0.05)', color: 'var(--text-main)', fontSize: '1rem' }}
                  required
                />
              </div>
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', color: 'var(--text-main)' }}>Amount</label>
                <input 
                  type="number" 
                  value={amount} 
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="e.g. 5000"
                  style={{ width: '100%', padding: '12px 15px', borderRadius: '10px', border: '1px solid var(--border-color)', background: 'rgba(255,255,255,0.05)', color: 'var(--text-main)', fontSize: '1rem' }}
                  required
                />
              </div>
              <div style={{ marginBottom: '30px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', color: 'var(--text-main)' }}>Date</label>
                <input 
                  type="date" 
                  value={date} 
                  onChange={(e) => setDate(e.target.value)}
                  style={{ width: '100%', padding: '12px 15px', borderRadius: '10px', border: '1px solid var(--border-color)', background: 'rgba(255,255,255,0.05)', color: 'var(--text-main)', fontSize: '1rem' }}
                  required
                />
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <button type="submit" style={{ padding: '12px 24px', borderRadius: '10px', background: '#8b5cf6', color: 'white', border: 'none', fontWeight: 'bold', cursor: 'pointer', fontSize: '1rem' }}>
                  Add Expense
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Expense;
