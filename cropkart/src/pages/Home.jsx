import React from 'react';
import { Carousel } from '../components/Carousel';
import { ProductCard } from '../components/ProductCard';
import { ArrowRightIcon, SproutIcon, ShieldCheckIcon, TruckIcon, StarIcon, CheckCircleIcon } from '../components/Icons';

export const Home = ({ onNavigate, featuredProducts = [], onSelectCrop, onBuyNow }) => {
  return (
    <div className="home-page-container">
      {/* 1. Full-screen Landing Page with Exactly Three Slides */}
      <Carousel onGetStarted={() => onNavigate('explore')} />

      {/* 2. Key Marketplace Metrics Banner */}
      <section className="stats-strip-section">
        <div className="stats-inner-grid">
          <div className="stat-item">
            <span className="stat-number">10,000+</span>
            <span className="stat-title">Registered Farmers</span>
            <span className="stat-subtitle">Across 14 agricultural belts</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">2,500+</span>
            <span className="stat-title">Active Wholesalers</span>
            <span className="stat-subtitle">APMC & retail mandis</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">100%</span>
            <span className="stat-title">Direct Trade</span>
            <span className="stat-subtitle">Transparent farm-gate rates</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">₹0</span>
            <span className="stat-title">Middleman Commission</span>
            <span className="stat-subtitle">More earnings for growers</span>
          </div>
        </div>
      </section>

      {/* 3. Featured Crops Preview */}
      <section className="featured-crops-section">
        <div className="section-header-row">
          <div>
            <span className="section-eyebrow">
              <SproutIcon size={16} />
              Fresh Today from Indian Farms
            </span>
            <h2 className="section-heading">Featured Wholesale Produce</h2>
            <p className="section-subheading">Hand-graded quality crops available for immediate batch dispatch.</p>
          </div>
          <button 
            type="button" 
            className="btn-view-all-crops"
            onClick={() => onNavigate('explore')}
          >
            <span>Explore All 11 Crops</span>
            <ArrowRightIcon size={18} />
          </button>
        </div>

        <div className="products-grid featured-grid">
          {featuredProducts.slice(0, 4).map((product) => (
            <ProductCard 
              key={product.id}
              product={product}
              onSelectCrop={onSelectCrop}
              onBuyNow={onBuyNow}
            />
          ))}
        </div>
      </section>

      {/* 4. How CropKart Works */}
      <section className="how-it-works-section">
        <div className="how-inner">
          <div className="text-center-wrapper">
            <span className="section-eyebrow">Simpler Trade Process</span>
            <h2 className="section-heading">How CropKart Connects the Agri Value Chain</h2>
            <p className="section-subheading">From farm harvest directly into your wholesale warehouse in 3 simple steps.</p>
          </div>

          <div className="steps-grid">
            <div className="step-card">
              <div className="step-number">01</div>
              <div className="step-icon-box">
                <SproutIcon size={28} />
              </div>
              <h3 className="step-title">Farmer Direct Listing</h3>
              <p className="step-desc">Farmers list harvested crops with actual photos, moisture levels, available weight, and transparent price expectations.</p>
            </div>

            <div className="step-card">
              <div className="step-number">02</div>
              <div className="step-icon-box">
                <ShieldCheckIcon size={28} />
              </div>
              <h3 className="step-title">Wholesaler Price Comparison</h3>
              <p className="step-desc">Wholesalers browse regional farmers, compare transparent price per kg, ratings, and inspect minimum order quantities.</p>
            </div>

            <div className="step-card">
              <div className="step-number">03</div>
              <div className="step-icon-box">
                <TruckIcon size={28} />
              </div>
              <h3 className="step-title">Instant Order & Farm Dispatch</h3>
              <p className="step-desc">Place orders directly on the platform with instant supplier confirmation and streamlined farm-gate delivery logistics.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Wholesaler & Farmer Trust Pillars */}
      <section className="trust-pillars-section">
        <div className="trust-grid">
          <div className="trust-text-block">
            <span className="section-eyebrow">Enterprise Agri Marketplace</span>
            <h2 className="section-heading">Built to Empower Indian Agriculture</h2>
            <p className="trust-desc">
              CropKart is specifically engineered for high-volume agricultural commerce. Whether you are an APMC trader, retail chain, or food processing unit, our platform ensures verified sourcing and reliable quality.
            </p>
            
            <div className="trust-points">
              <div className="trust-point-item">
                <CheckCircleIcon size={20} className="check-icon" />
                <span>Verified Farmer KYC & Quality Grading Standards</span>
              </div>
              <div className="trust-point-item">
                <CheckCircleIcon size={20} className="check-icon" />
                <span>Direct WhatsApp Order Status Updates & Invoicing</span>
              </div>
              <div className="trust-point-item">
                <CheckCircleIcon size={20} className="check-icon" />
                <span>Pan-India mandi price transparency without hidden charges</span>
              </div>
            </div>

            <button 
              type="button" 
              className="btn-primary-explore"
              onClick={() => onNavigate('explore')}
            >
              <span>Start Exploring Products</span>
              <ArrowRightIcon size={18} />
            </button>
          </div>

          <div className="trust-card-visual">
            <div className="testimonial-card">
              <div className="stars-row">
                {[...Array(5)].map((_, i) => (
                  <StarIcon key={i} size={18} />
                ))}
              </div>
              <p className="testimonial-quote">
                "CropKart has transformed how I source onions and potatoes for my trading agency in Mumbai. I compare 3-4 farmers in Nashik and Agra within seconds and lock in the best wholesale rates."
              </p>
              <div className="testimonial-author">
                <div className="author-avatar">VA</div>
                <div>
                  <strong>Vikas Agarwal</strong>
                  <span>Wholesale Trader, APMC Vashi</span>
                </div>
              </div>
            </div>

            <div className="testimonial-card secondary-card">
              <div className="stars-row">
                {[...Array(5)].map((_, i) => (
                  <StarIcon key={i} size={18} />
                ))}
              </div>
              <p className="testimonial-quote">
                "We get paid directly without commission agents cutting our margins. It is fair, transparent, and direct."
              </p>
              <div className="testimonial-author">
                <div className="author-avatar">RP</div>
                <div>
                  <strong>Ramesh Patel</strong>
                  <span>Organic Farmer, Nashik (14 Years)</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Bottom Call to Action Banner */}
      <section className="cta-banner-section">
        <div className="cta-banner-inner">
          <div>
            <h2 className="cta-title">Ready to Procure Wholesale Farm Produce?</h2>
            <p className="cta-subtitle">Browse all 11+ fresh harvest categories, compare verified farmers, and place orders directly.</p>
          </div>
          <button 
            type="button" 
            className="btn-cta-light"
            onClick={() => onNavigate('explore')}
          >
            <span>Explore All Crops Now</span>
            <ArrowRightIcon size={20} />
          </button>
        </div>
      </section>
    </div>
  );
};
