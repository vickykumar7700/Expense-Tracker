import { useState, useContext } from 'react';
import { createPortal } from 'react-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { X } from 'lucide-react';
import API_URL from '../config/api';

const ProfileModal = ({ onClose }) => {
  const { user, updateUser } = useContext(AuthContext);
  const [profilePicture, setProfilePicture] = useState(user?.profilePicture || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await axios.put(`${API_URL}/api/auth/profile`, { profilePicture });
      updateUser(res.data);
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return createPortal(
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="glass-panel" style={{ width: '100%', maxWidth: '400px', padding: '24px', position: 'relative' }}>
        <button onClick={onClose} style={{ position: 'absolute', top: '15px', right: '15px', background: 'transparent', border: 'none', color: 'var(--text-main)', cursor: 'pointer' }}>
          <X size={24} />
        </button>
        
        <h3 style={{ marginBottom: '20px', textAlign: 'center' }}>Update Profile</h3>
        
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
          <img 
            src={profilePicture || user?.profilePicture || "https://via.placeholder.com/150"} 
            alt="Preview" 
            style={{ width: '100px', height: '100px', borderRadius: '50%', objectFit: 'cover', border: '3px solid var(--primary)' }}
          />
        </div>

        {error && <div style={{ color: 'var(--danger)', marginBottom: '15px', textAlign: 'center', fontSize: '0.9rem' }}>{error}</div>}

        <form onSubmit={handleSave}>
          <div className="form-group" style={{ marginBottom: '20px' }}>
            <label>Profile Picture URL</label>
            <input 
              type="text" 
              className="form-input" 
              placeholder="https://example.com/photo.jpg"
              value={profilePicture} 
              onChange={(e) => setProfilePicture(e.target.value)} 
            />
          </div>
          <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={loading}>
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
        </form>
      </div>
    </div>,
    document.body
  );
};

export default ProfileModal;
