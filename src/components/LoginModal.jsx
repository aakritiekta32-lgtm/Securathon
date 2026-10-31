import React, { useState } from 'react';
import { XIcon, UserIcon, ShieldCheckIcon, SproutIcon } from './Icons';

export const LoginModal = ({ user, onClose, onLogin, onLogout }) => {
  const [role, setRole] = useState('wholesaler');
  const [phone, setPhone] = useState('');
  const [name, setName] = useState('');

  const handleDemoLogin = (selectedRole) => {
    if (selectedRole === 'wholesaler') {
      onLogin({
        id: 'usr-wholesaler-1',
        name: 'Vikas Agarwal',
        company: 'Agarwal Agro Traders',
        role: 'Wholesaler',
        location: 'APMC Market, Mumbai',
        phone: '98210 55432'
      });
    } else {
      onLogin({
        id: 'usr-farmer-1',
        name: 'Ramesh Patel',
        company: 'Sahyadri Bio-Farms',
        role: 'Verified Farmer',
        location: 'Nashik, Maharashtra',
        phone: '98231 44521'
      });
    }
    onClose();
  };

  const handleCustomSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    onLogin({
      id: `usr-${Date.now()}`,
      name: name.trim(),
      role: role === 'wholesaler' ? 'Wholesaler' : 'Farmer',
      location: 'India',
      phone: phone.trim() || '98765 00000'
    });
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container login-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="login-header-text">
            <h2 className="modal-title">
              {user ? 'My Account Profile' : 'Sign In to CropKart'}
            </h2>
            <p className="modal-sub">
              {user ? 'Manage your trading profile' : 'Access direct farm auctions and wholesale supply'}
            </p>
          </div>
          <button type="button" className="btn-close-modal" onClick={onClose} aria-label="Close modal">
            <XIcon size={20} />
          </button>
        </div>

        <div className="modal-body">
          {user ? (
            <div className="authenticated-profile-view">
              <div className="auth-avatar-large">{user.name.charAt(0)}</div>
              <h3 className="auth-user-name">{user.name}</h3>
              <span className="auth-role-tag">{user.role}</span>
              <p className="auth-location">{user.company ? `${user.company} • ` : ''}{user.location}</p>

              <div className="auth-account-stats">
                <div className="stat-card">
                  <span className="stat-num">Verified</span>
                  <span className="stat-label">KYC Status</span>
                </div>
                <div className="stat-card">
                  <span className="stat-num">Active</span>
                  <span className="stat-label">Trade Gate</span>
                </div>
              </div>

              <button 
                type="button" 
                className="btn-logout"
                onClick={() => {
                  onLogout();
                  onClose();
                }}
              >
                Sign Out
              </button>
            </div>
          ) : (
            <div className="login-form-area">
              {/* Role Toggle Tabs */}
              <div className="role-tabs">
                <button 
                  type="button" 
                  className={`role-tab ${role === 'wholesaler' ? 'active' : ''}`}
                  onClick={() => setRole('wholesaler')}
                >
                  <UserIcon size={16} />
                  <span>Wholesaler / Buyer</span>
                </button>
                <button 
                  type="button" 
                  className={`role-tab ${role === 'farmer' ? 'active' : ''}`}
                  onClick={() => setRole('farmer')}
                >
                  <SproutIcon size={16} />
                  <span>Farmer / Producer</span>
                </button>
              </div>

              {/* One-click quick demo buttons */}
              <div className="quick-demo-section">
                <span className="quick-demo-title">Quick One-Click Demo Sign-In:</span>
                <div className="quick-demo-buttons">
                  <button 
                    type="button" 
                    className="demo-pill-btn"
                    onClick={() => handleDemoLogin('wholesaler')}
                  >
                    Login as Wholesaler (Vikas Agarwal)
                  </button>
                  <button 
                    type="button" 
                    className="demo-pill-btn secondary"
                    onClick={() => handleDemoLogin('farmer')}
                  >
                    Login as Farmer (Ramesh Patel)
                  </button>
                </div>
              </div>

              <div className="divider-or"><span>OR SIGN IN WITH PHONE</span></div>

              <form onSubmit={handleCustomSubmit} className="login-custom-form">
                <div className="form-group">
                  <label className="form-label">Full Name</label>
                  <input 
                    type="text" 
                    value={name} 
                    onChange={(e) => setName(e.target.value)}
                    className="form-input" 
                    placeholder="Enter your name" 
                    required 
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Phone Number</label>
                  <div className="phone-input-wrapper">
                    <span className="phone-prefix">+91</span>
                    <input 
                      type="tel" 
                      value={phone} 
                      onChange={(e) => setPhone(e.target.value)}
                      className="form-input phone-input" 
                      placeholder="10-digit number" 
                      maxLength={10} 
                    />
                  </div>
                </div>
                <button type="submit" className="btn-login-submit">
                  Continue with OTP
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
