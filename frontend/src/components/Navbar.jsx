import { useContext, useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { LogOut, LayoutDashboard, ShieldAlert, Wallet, TrendingDown, Menu, X } from 'lucide-react';
import ProfileModal from './ProfileModal';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <>
      <button className="mobile-toggle" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
        {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {isMobileMenuOpen && (
        <div 
          className="sidebar-overlay" 
          onClick={() => setIsMobileMenuOpen(false)}
          style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            background: 'rgba(11, 15, 25, 0.6)', backdropFilter: 'blur(4px)', zIndex: 99
          }}
        />
      )}

      <div className={`sidebar ${isMobileMenuOpen ? 'open' : ''}`}>
      
      <div className="sidebar-profile" onClick={() => setIsProfileOpen(true)} title="Edit Profile">
        <img 
          src={user?.profilePicture || "https://ui-avatars.com/api/?name="+user?.name} 
          alt="Profile" 
        />
        <h3>{user?.name}</h3>
      </div>

      <div className="sidebar-nav">
        <Link to="/dashboard" className={`sidebar-link ${location.pathname === '/dashboard' ? 'active' : ''}`}>
          <LayoutDashboard size={20} /> Dashboard
        </Link>
        
        <Link to="/income" className={`sidebar-link ${location.pathname === '/income' ? 'active' : ''}`}>
          <Wallet size={20} /> Income
        </Link>
        
        <Link to="/expense" className={`sidebar-link ${location.pathname === '/expense' ? 'active' : ''}`}>
          <TrendingDown size={20} /> Expense
        </Link>

        {user?.isAdmin && (
          <Link to="/admin" className={`sidebar-link ${location.pathname === '/admin' ? 'active' : ''}`}>
            <ShieldAlert size={20} /> Admin Panel
          </Link>
        )}
      </div>

      <div style={{ marginTop: 'auto' }}>
        <button onClick={handleLogout} className="sidebar-link">
          <LogOut size={20} /> Logout
        </button>
      </div>
      
      {isProfileOpen && <ProfileModal onClose={() => setIsProfileOpen(false)} />}
      </div>
    </>
  );
};

export default Navbar;
