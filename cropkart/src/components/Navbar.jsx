import React, { useState } from 'react';
import { SproutIcon, ShoppingBagIcon, UserIcon, MenuIcon, XIcon, SearchIcon } from './Icons';

export const Navbar = ({ currentPage, onNavigate, onOpenLogin, user, ordersCount = 0 }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNav = (page) => {
    onNavigate(page);
    setMobileMenuOpen(false);
  };

  return (
    <header className="navbar-container">
      <div className="navbar-inner">
        {/* Brand Logo */}
        <div className="brand" onClick={() => handleNav('home')}>
          <div className="brand-icon-wrapper">
            <SproutIcon size={26} className="brand-icon" />
          </div>
          <div className="brand-text">
            <span className="brand-title">Crop<span className="brand-accent">Kart</span></span>
            <span className="brand-subtitle">Farmer to Wholesaler</span>
          </div>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="desktop-nav">
          <button 
            type="button" 
            className={`nav-link ${currentPage === 'home' ? 'active' : ''}`}
            onClick={() => handleNav('home')}
          >
            Home
          </button>
          <button 
            type="button" 
            className={`nav-link ${currentPage === 'explore' ? 'active' : ''}`}
            onClick={() => handleNav('explore')}
          >
            Explore Crops
            <span className="nav-badge">11 Fresh</span>
          </button>
          {ordersCount > 0 && (
            <button 
              type="button" 
              className={`nav-link ${currentPage === 'orders' ? 'active' : ''}`}
              onClick={() => handleNav('orders')}
            >
              <ShoppingBagIcon size={16} />
              My Orders
              <span className="orders-pill">{ordersCount}</span>
            </button>
          )}
        </nav>

        {/* Right Action Buttons */}
        <div className="navbar-actions">
          <button 
            type="button" 
            className="explore-cta-btn"
            onClick={() => handleNav('explore')}
          >
            <SearchIcon size={16} />
            <span>Search Crops</span>
          </button>

          {user ? (
            <div className="user-profile-badge" onClick={onOpenLogin}>
              <div className="user-avatar">{user.name.charAt(0)}</div>
              <div className="user-info-text">
                <span className="user-name">{user.name}</span>
                <span className="user-role">{user.role}</span>
              </div>
            </div>
          ) : (
            <button type="button" className="login-btn" onClick={onOpenLogin}>
              <UserIcon size={18} />
              <span>Login</span>
            </button>
          )}

          {/* Mobile hamburger button */}
          <button 
            type="button" 
            className="mobile-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <XIcon size={24} /> : <MenuIcon size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="mobile-menu">
          <button 
            type="button" 
            className={`mobile-nav-link ${currentPage === 'home' ? 'active' : ''}`}
            onClick={() => handleNav('home')}
          >
            Home
          </button>
          <button 
            type="button" 
            className={`mobile-nav-link ${currentPage === 'explore' ? 'active' : ''}`}
            onClick={() => handleNav('explore')}
          >
            Explore Crops
          </button>
          {ordersCount > 0 && (
            <button 
              type="button" 
              className={`mobile-nav-link ${currentPage === 'orders' ? 'active' : ''}`}
              onClick={() => handleNav('orders')}
            >
              My Orders ({ordersCount})
            </button>
          )}
          <div className="mobile-menu-divider" />
          <button 
            type="button" 
            className="mobile-login-btn"
            onClick={() => {
              setMobileMenuOpen(false);
              onOpenLogin();
            }}
          >
            <UserIcon size={18} />
            <span>{user ? `Signed in as ${user.name}` : 'Login / Register'}</span>
          </button>
        </div>
      )}
    </header>
  );
};
