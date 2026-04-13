import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Eye } from 'lucide-react';
import API_URL from '../config/api';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [profession, setProfession] = useState(''); // New Profile field
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      await axios.post(`${API_URL}/api/auth/register`, { name, email, password, profession });
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="light-auth-container">
      <div className="light-auth-card">
        
        {/* Modern styled header integrated as a tab-like structure for consistency */}
        <div className="auth-tabs" style={{ justifyContent: 'center' }}>
          <div className="auth-tab active" style={{ cursor: 'default' }}>
            Create Account
          </div>
        </div>

        {error && <div style={{ color: '#d32f2f', marginBottom: '15px', textAlign: 'center' }}>{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="light-form-group">
            <label>Full Name <span className="required">*</span></label>
            <input 
              type="text" 
              className="light-form-input" 
              placeholder="Full Name"
              value={name} 
              onChange={(e) => setName(e.target.value)} 
              required 
            />
          </div>

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
          </div>

          <div className="light-form-group">
            <label>Profession</label>
            <input 
              type="text" 
              className="light-form-input" 
              placeholder="E.g. Software Engineer"
              value={profession} 
              onChange={(e) => setProfession(e.target.value)} 
            />
          </div>

          <button type="submit" className="light-btn-primary" disabled={loading} style={{ marginTop: '20px' }}>
            {loading ? 'Creating account...' : 'Register'}
          </button>
        </form>

        <div className="register-link-container">
          <span style={{ color: '#333' }}>Already have an account? </span>
          <Link to="/login" className="light-link">Login here</Link>
        </div>

      </div>
    </div>
  );
};

export default Register;
