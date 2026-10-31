import React from 'react';
import { SproutIcon, ShieldCheckIcon, PhoneIcon } from './Icons';

export const Footer = ({ onNavigate }) => {
  return (
    <footer className="footer-container">
      <div className="footer-top-grid">
        {/* Col 1: Brand Info */}
        <div className="footer-col brand-col">
          <div className="footer-brand" onClick={() => onNavigate('home')}>
            <div className="footer-brand-icon">
              <SproutIcon size={24} />
            </div>
            <span className="footer-brand-title">Crop<span className="brand-accent">Kart</span></span>
          </div>
          <p className="footer-mission">
            India's direct agricultural trade marketplace connecting progressive farmers with licensed wholesale buyers, eliminating middleman commissions and assuring farm-gate freshness.
          </p>
          <div className="footer-guarantee-pill">
            <ShieldCheckIcon size={16} />
            <span>100% Verified Farmer Network</span>
          </div>
        </div>

        {/* Col 2: Quick Links */}
        <div className="footer-col">
          <h4 className="footer-col-title">Marketplace</h4>
          <ul className="footer-links">
            <li><button type="button" onClick={() => onNavigate('home')}>Home Overview</button></li>
            <li><button type="button" onClick={() => onNavigate('explore')}>Explore All Crops</button></li>
            <li><button type="button" onClick={() => onNavigate('explore')}>Vegetables Direct</button></li>
            <li><button type="button" onClick={() => onNavigate('explore')}>Grains & Cereals</button></li>
            <li><button type="button" onClick={() => onNavigate('explore')}>Fresh Fruits</button></li>
          </ul>
        </div>

        

        {/* Col 4: Platform Notice */}
        <div className="footer-col">
          <h4 className="footer-col-title">Platform Architecture</h4>
          <p className="footer-tech-note">
            Built as a modern, decoupled React frontend with standardized data models, ready for live Firebase Firestore and WhatsApp Business Cloud API hooks.
          </p>
          <div className="footer-helpline">
            <PhoneIcon size={16} />
            <span>Kisan Trade Helpline: 9661927508</span>
          </div>
        </div>
      </div>

      <div className="footer-bottom-bar">
        <div className="footer-bottom-inner">
          <p>© {new Date().getFullYear()} CropKart Agricultural Technologies. All rights reserved.</p>
          <div className="footer-legal-links">
            <span>Direct Farm Sourcing</span>
            <span className="dot">•</span>
            <span>Zero Commission Model</span>
            <span className="dot">•</span>
            <span>Fair Trade Standards</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
