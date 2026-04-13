import { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { Eye } from 'lucide-react';
import API_URL from '../config/api';

const Login = () => {
  const [tab, setTab] = useState('user'); // 'user' or 'admin'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const res = await axios.post(`${API_URL}/api/auth/login`, { email, password });
      
      if (tab === 'admin' && !res.data.user.isAdmin) {
         setError('You are not authorized as an Admin');
         setLoading(false);
         return;
      }
      
      login(res.data.user, res.data.token);
      navigate(tab === 'admin' ? '/admin' : '/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="light-auth-container">
      <div className="light-auth-card">
        
        <div className="auth-tabs">
          <div 
            className={`auth-tab ${tab === 'user' ? 'active' : ''}`}
            onClick={() => setTab('user')}
          >
            User
          </div>
          <div 
            className={`auth-tab ${tab === 'admin' ? 'active' : ''}`}
            onClick={() => setTab('admin')}
          >
            Admin
          </div>
        </div>

        {error && <div style={{ color: '#d32f2f', marginBottom: '15px', textAlign: 'center' }}>{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="light-form-group">
            <label>Email Address <span className="required">*</span></label>
            <input 
              type="email" 
              className="light-form-input" 
              placeholder="Email Address"
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required 
            />
          </div>

          <div className="light-form-group">
            <label>Password <span className="required">*</span></label>
            <div className="password-wrapper">
              <input 
                type={showPassword ? "text" : "password"} 
                className="light-form-input" 
                placeholder="Password"
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                required 
              />
              <div className="eye-icon" onClick={() => setShowPassword(!showPassword)}>
                <Eye size={20} color="#FF7A00"/>
              </div>
            </div>
            <div className="forgot-password">
              <a href="#">Forgot Password</a>
            </div>
          </div>

          <button type="submit" className="light-btn-primary" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <div className="register-link-container">
          <span style={{ color: '#333' }}>New User ? </span>
          <Link to="/register" className="light-link">Register Now</Link>
        </div>

      </div>
    </div>
  );
};

export default Login;
