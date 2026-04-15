import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { Trash2, TrendingUp, TrendingDown, Wallet, ShoppingBag, Plane, Zap, Landmark, Coffee, FileText, ArrowDownRight, ArrowUpRight, Briefcase, ShoppingCart, Palette, BookOpen } from 'lucide-react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { AuthContext } from '../context/AuthContext';
import API_URL from '../config/api';

const Dashboard = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Form State
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState('expense');
  const [category, setCategory] = useState('General');
  
  const { user } = useContext(AuthContext);

  const fetchTransactions = async () => {
    try {
      const token = sessionStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };
      
      const [expenseRes, incomeRes] = await Promise.all([
        axios.get(`${API_URL}/api/expense`, { headers }),
        axios.get(`${API_URL}/api/income`, { headers })
      ]);
      
      const expenses = expenseRes.data.map(e => ({ ...e, apiType: 'expense' }));
      const incomes = incomeRes.data.map(i => ({ ...i, apiType: 'income', type: 'income' }));
      
      setTransactions([...expenses, ...incomes].sort((a, b) => new Date(b.date) - new Date(a.date)));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
    // Default category based on type
    if (type === 'income') setCategory('Salary');
    else setCategory('Food');
  }, [type]);

  const handleAddTransaction = async (e) => {
    e.preventDefault();
    if (!title || !amount) return;
    
    try {
      const token = sessionStorage.getItem('token');
      const endpoint = type === 'income' ? '/api/income' : '/api/expense';
      await axios.post(`${API_URL}${endpoint}`, { 
        title, 
        amount: Number(amount), 
        category,
        type
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTitle('');
      setAmount('');
      fetchTransactions();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id, apiType) => {
    try {
      const token = sessionStorage.getItem('token');
      const endpoint = apiType === 'income' ? '/api/income' : '/api/expense';
      await axios.delete(`${API_URL}${endpoint}/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTransactions(transactions.filter(t => t._id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const incomeTransactions = transactions.filter(t => t.type === 'income');
  const totalIncome = incomeTransactions.reduce((acc, curr) => acc + curr.amount, 0);
  const expenseTransactions = transactions.filter(t => t.type === 'expense' || !t.type);
  const totalExpense = expenseTransactions.reduce((acc, curr) => acc + curr.amount, 0); 
  const balance = totalIncome - totalExpense;

  const incomeGrouped = incomeTransactions.reduce((acc, curr) => {
    const existing = acc.find(item => item.name === curr.category);
    if (existing) existing.value += curr.amount;
    else acc.push({ name: curr.category || 'Other', value: curr.amount });
    return acc;
  }, []);

  const INCOME_COLORS = ['#ef4444', '#8b5cf6', '#f97316', '#3b82f6', '#10b981'];

  const getIncomeIcon = (cat) => {
    switch(cat?.toLowerCase()) {
      case 'salary': return <div style={{padding:'10px', background:'rgba(100, 116, 139, 0.1)', borderRadius:'50%'}}><Briefcase size={20} color="#64748b" /></div>;
      case 'freelance': return <div style={{padding:'10px', background:'rgba(249, 115, 22, 0.1)', borderRadius:'50%'}}><Palette size={20} color="#f97316" /></div>;
      case 'investments': return <div style={{padding:'10px', background:'rgba(59, 130, 246, 0.1)', borderRadius:'50%'}}><Landmark size={20} color="#6b7280" /></div>;
      case 'other': return <div style={{padding:'10px', background:'rgba(16, 185, 129, 0.1)', borderRadius:'50%'}}><BookOpen size={20} color="#10b981" /></div>;
      default: return <div style={{padding:'10px', background:'rgba(100, 116, 139, 0.1)', borderRadius:'50%'}}><Briefcase size={20} color="#64748b" /></div>;
    }
  };

  const expenseChartData = expenseTransactions.slice(0, 6).map(t => ({
    name: t.title.length > 10 ? t.title.substring(0, 10) + '...' : t.title,
    amount: t.amount,
    category: t.category,
    fullDate: new Date(t.date).toLocaleDateString()
  })).reverse();

  const getCategoryIcon = (cat) => {
    switch(cat?.toLowerCase()) {
      case 'shopping': return <div style={{padding:'10px', background:'rgba(236, 72, 153, 0.1)', borderRadius:'50%'}}><ShoppingBag size={20} color="#ec4899" /></div>;
      case 'travel': return <div style={{padding:'10px', background:'rgba(59, 130, 246, 0.1)', borderRadius:'50%'}}><Plane size={20} color="#3b82f6" /></div>;
      case 'food': return <div style={{padding:'10px', background:'rgba(245, 158, 11, 0.1)', borderRadius:'50%'}}><Coffee size={20} color="#f59e0b" /></div>;
      case 'bills': return <div style={{padding:'10px', background:'rgba(234, 179, 8, 0.1)', borderRadius:'50%'}}><Zap size={20} color="#eab308" /></div>;
      case 'loan repayment': return <div style={{padding:'10px', background:'rgba(99, 102, 241, 0.1)', borderRadius:'50%'}}><Landmark size={20} color="#6366f1" /></div>;
      default: return <div style={{padding:'10px', background:'rgba(100, 116, 139, 0.1)', borderRadius:'50%'}}><FileText size={20} color="#64748b" /></div>;
    }
  };

  const incomeCategories = ['Salary', 'Freelance', 'Investments', 'Other'];
  const expenseCategories = ['Food', 'Travel', 'Shopping', 'Bills', 'General'];
  const currentCategories = type === 'income' ? incomeCategories : expenseCategories;

  // Chart Data
  const chartData = [
    { name: 'Income', value: totalIncome },
    { name: 'Expenses', value: totalExpense },
    { name: 'Total Balance', value: balance > 0 ? balance : 0 }
  ];
  const COLORS = ['#10b981', '#ef4444', '#3b82f6']; // Green, Red, Blue

  if (loading) return <div style={{ textAlign: 'center', marginTop: '50px' }}>Loading...</div>;

  return (
    <div className="dashboard-container">
      {/* Profile Header section */}
      <div className="profile-header glass-panel" style={{ display: 'flex', alignItems: 'center', gap: '20px', padding: '20px', marginBottom: '30px', borderRadius: '15px' }}>
        <img 
          src={user?.profilePicture || "https://via.placeholder.com/150"} 
          alt="Profile" 
          style={{ width: '80px', height: '80px', borderRadius: '50%', objectFit: 'cover', border: '3px solid var(--primary)' }}
        />
        <div>
          <h2 style={{ margin: 0, color: 'var(--text-main)', fontSize: '1.8rem' }}>Welcome, {user?.name}</h2>
          <p style={{ margin: '5px 0 0 0', color: 'var(--text-muted)', fontSize: '1rem' }}>{user?.profession || 'Member'}</p>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card glass-panel" style={{ borderLeft: '4px solid #3b82f6' }}>
          <div className="stat-title">Available Balance</div>
          <div className="stat-value"><Wallet size={24} style={{ display: 'inline', color: '#3b82f6', marginRight: '8px' }}/>₹{balance.toLocaleString()}</div>
        </div>
        <div className="stat-card glass-panel" style={{ borderLeft: '4px solid var(--success)' }}>
          <div className="stat-title">Total Income</div>
          <div className="stat-value" style={{ color: 'var(--success)' }}><TrendingUp size={24} style={{ display: 'inline', color: 'var(--success)', marginRight: '8px' }}/>₹{totalIncome.toLocaleString()}</div>
        </div>
        <div className="stat-card glass-panel" style={{ borderLeft: '4px solid var(--danger)' }}>
          <div className="stat-title">Total Expenses</div>
          <div className="stat-value" style={{ color: 'var(--danger)' }}><TrendingDown size={24} style={{ display: 'inline', color: 'var(--danger)', marginRight: '8px' }}/>₹{totalExpense.toLocaleString()}</div>
        </div>
      </div>

      <div className="content-grid" style={{ gridTemplateColumns: 'minmax(300px, 1fr) 2fr', gap: '24px', display: 'grid' }}>
        <div className="left-column" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Add Transaction Section */}
          <div className="add-expense-section glass-panel" style={{ padding: '24px' }}>
            <h3 style={{ marginBottom: '20px' }}>Add Transaction</h3>
            
            <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
              <button 
                type="button"
                className={`btn ${type === 'income' ? 'btn-primary' : ''}`}
                style={{ flex: 1, backgroundColor: type === 'income' ? 'var(--success)' : 'transparent', color: type === 'income' ? 'white' : 'var(--text-main)', border: '1px solid var(--success)' }}
                onClick={() => setType('income')}
              >
                Income
              </button>
              <button 
                type="button"
                className={`btn ${type === 'expense' ? 'btn-primary' : ''}`}
                style={{ flex: 1, backgroundColor: type === 'expense' ? 'var(--danger)' : 'transparent', color: type === 'expense' ? 'white' : 'var(--text-main)', border: '1px solid var(--danger)' }}
                onClick={() => setType('expense')}
              >
                Expense
              </button>
            </div>

            <form onSubmit={handleAddTransaction}>
              <div className="form-group">
                <label>Resource / Expenditure Name</label>
                <input type="text" className="form-input" value={title} onChange={(e)=>setTitle(e.target.value)} placeholder={type === 'income' ? 'e.g. Monthly Salary' : 'e.g. Grocery Shop'} required />
              </div>
              <div className="form-group">
                <label>Amount (₹)</label>
                <input type="number" className="form-input" value={amount} onChange={(e)=>setAmount(e.target.value)} required />
              </div>
              <div className="form-group">
                <label>Category</label>
                <select className="form-input" value={category} onChange={(e)=>setCategory(e.target.value)}>
                  {currentCategories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
              <button type="submit" className="btn btn-primary" style={{ width: '100%', backgroundColor: type === 'income' ? 'var(--success)' : 'var(--primary)' }}>
                Add {type === 'income' ? 'Income' : 'Expense'}
              </button>
            </form>
          </div>

          {/* Pie Chart Section */}
          <div className="chart-section glass-panel" style={{ padding: '24px', height: '350px' }}>
             <h3 style={{ marginBottom: '20px', textAlign: 'center' }}>Income, Expenses & Balance</h3>
             <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `₹${value}`} />
                <Legend verticalAlign="bottom" height={36}/>
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="recent-expenses-section">
          <div className="glass-panel" style={{ padding: '24px', minHeight: '100%' }}>
            <h3 style={{ marginBottom: '20px' }}>Recent Transactions</h3>
            {transactions.length === 0 ? (
              <p style={{ color: 'var(--text-muted)' }}>No transactions found. Start tracking!</p>
            ) : (
              <div className="expense-list">
                {transactions.map(t => (
                  <div key={t._id} className="expense-item glass-panel" style={{ borderLeft: `4px solid ${t.type === 'income' ? 'var(--success)' : 'var(--danger)'}` }}>
                    <div className="expense-info">
                      <div className="title">
                        {t.title} 
                        <span style={{
                          fontSize:'0.7rem', 
                          padding:'2px 6px', 
                          background: t.type === 'income' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)', 
                          color: t.type === 'income' ? 'var(--success)' : 'var(--danger)',
                          borderRadius:'10px', 
                          marginLeft:'10px'
                        }}>
                          {t.category}
                        </span>
                      </div>
                      <div className="date">{new Date(t.date).toLocaleDateString()}</div>
                    </div>
                    <div className="expense-amount" style={{ color: t.type === 'income' ? 'var(--success)' : 'var(--danger)' }}>
                      {t.type === 'income' ? '+' : '-'} ₹{t.amount}
                      <button className="delete-btn" onClick={() => handleDelete(t._id, t.apiType)} style={{ marginLeft: '10px' }}>
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* New Section: Detailed Expenses & Bar Chart */}
      <div className="expenses-visual-grid" style={{ display: 'grid', gridTemplateColumns: 'minmax(300px, 1fr) 1.5fr', gap: '24px', marginTop: '24px', paddingBottom: '30px' }}>
        
        {/* Left: Expenses List */}
        <div className="expenses-list glass-panel" style={{ padding: '24px' }}>
          <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom: '24px'}}>
            <h3 style={{margin: 0}}>Expenses</h3>
            <button style={{padding: '6px 16px', borderRadius: '20px', border:'1px solid var(--border-color)', background:'var(--panel-bg)', color:'var(--text-main)', cursor:'pointer', fontSize: '0.85rem'}}>See All <ArrowDownRight size={14} style={{display:'inline', verticalAlign:'middle'}}/></button>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {expenseTransactions.slice(0, 4).map(t => (
              <div key={`exp-${t._id}`} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                  {getCategoryIcon(t.category)}
                  <div>
                    <div style={{ fontWeight: 'bold', color: 'var(--text-main)', fontSize: '1rem' }}>{t.title}</div>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginTop: '4px' }}>
                      {new Date(t.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </div>
                  </div>
                </div>
                <div style={{ background: 'rgba(239, 68, 68, 0.1)', color: 'var(--danger)', padding: '6px 12px', borderRadius: '8px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.9rem' }}>
                  - ₹{t.amount} <ArrowDownRight size={16} />
                </div>
              </div>
            ))}
            {expenseTransactions.length === 0 && (
              <div style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '20px 0' }}>No expenses recorded yet.</div>
            )}
          </div>
        </div>

        {/* Right: Bar Chart */}
        <div className="expenses-chart glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column' }}>
          <h3 style={{ marginBottom: '30px' }}>Last 30 Days Expenses</h3>
          <div style={{ flex: 1, minHeight: '300px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={expenseChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }} barSize={40}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: 'var(--text-muted)', fontSize: 12 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: 'var(--text-muted)', fontSize: 12 }} />
                <Tooltip 
                  cursor={{ fill: 'transparent' }}
                  contentStyle={{ backgroundColor: 'var(--panel-bg)', borderColor: 'var(--border-color)', borderRadius: '10px', boxShadow: '0 4px 15px rgba(0,0,0,0.2)' }}
                  itemStyle={{ fontWeight: 'bold', color: 'var(--text-main)' }}
                  formatter={(value) => [`₹${value}`, 'Amount']}
                />
                <Bar 
                  dataKey="amount" 
                  fill="#a855f7" 
                  radius={[8, 8, 8, 8]} 
                  background={{ fill: 'rgba(168, 85, 247, 0.1)', radius: [8, 8, 8, 8] }} 
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* New Section: Detailed Income & Donut Chart */}
      <div className="income-visual-grid" style={{ display: 'grid', gridTemplateColumns: 'minmax(300px, 1.5fr) 1fr', gap: '24px', marginTop: '24px', paddingBottom: '30px' }}>
        
        {/* Left: Donut Chart */}
        <div className="income-chart glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', position: 'relative' }}>
          <h3 style={{ marginBottom: '10px' }}>Last 60 Days Income</h3>
          <div style={{ flex: 1, minHeight: '300px', position: 'relative' }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={incomeGrouped.length > 0 ? incomeGrouped : [{name: 'No Income', value: 1}]}
                  cx="50%"
                  cy="50%"
                  innerRadius={75}
                  outerRadius={105}
                  paddingAngle={2}
                  dataKey="value"
                  stroke="none"
                >
                  {incomeGrouped.length > 0 ? incomeGrouped.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={INCOME_COLORS[index % INCOME_COLORS.length]} />
                  )) : <Cell fill="rgba(255,255,255,0.05)" />}
                </Pie>
                {incomeGrouped.length > 0 && <Tooltip formatter={(value) => `₹${value}`} contentStyle={{ backgroundColor: 'var(--panel-bg)', borderColor: 'var(--border-color)', borderRadius: '10px'}} itemStyle={{ fontWeight: 'bold', color: 'var(--text-main)' }} />}
                <Legend iconType="circle" verticalAlign="bottom" height={36} wrapperStyle={{ fontSize: '0.85rem' }}/>
              </PieChart>
            </ResponsiveContainer>
            <div style={{ position: 'absolute', top: 'calc(50% - 18px)', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center', pointerEvents: 'none' }}>
               <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom:'4px' }}>Total Income</div>
               <div style={{ color: 'var(--text-main)', fontSize: '1.4rem', fontWeight: 'bold' }}>₹{totalIncome.toLocaleString()}</div>
            </div>
          </div>
        </div>

        {/* Right: Income List */}
        <div className="income-list glass-panel" style={{ padding: '24px' }}>
          <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom: '24px'}}>
            <h3 style={{margin: 0}}>Income</h3>
            <button style={{padding: '6px 16px', borderRadius: '20px', border:'1px solid var(--border-color)', background:'var(--panel-bg)', color:'var(--text-main)', cursor:'pointer', fontSize: '0.85rem'}}>See All <ArrowUpRight size={14} style={{display:'inline', verticalAlign:'middle'}}/></button>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {incomeTransactions.slice(0, 5).map(t => (
              <div key={`inc-${t._id}`} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                  {getIncomeIcon(t.category)}
                  <div>
                    <div style={{ fontWeight: 'bold', color: 'var(--text-main)', fontSize: '1rem' }}>{t.title}</div>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginTop: '4px' }}>
                      {new Date(t.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </div>
                  </div>
                </div>
                <div style={{ background: 'rgba(16, 185, 129, 0.1)', color: 'var(--success)', padding: '6px 12px', borderRadius: '8px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.9rem' }}>
                  + ₹{t.amount} <ArrowUpRight size={16} />
                </div>
              </div>
            ))}
            {incomeTransactions.length === 0 && (
              <div style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '20px 0' }}>No income recorded yet.</div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;
