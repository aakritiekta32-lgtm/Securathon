import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeftIcon, ChevronRightIcon, ArrowRightIcon, SproutIcon, ShieldCheckIcon, TruckIcon } from './Icons';

const slidesData = [
  {
    id: 1,
    tag: "Direct Farm Sourcing",
    heading: "Farming Smarter Together",
    description: "Connecting farmers directly with wholesalers.",
    subtext: "Eliminate middlemen margins. Empower local growers while securing fair wholesale pricing.",
    bgTheme: "slide-theme-emerald",
    statBadge: "100% Direct Farmer Trade",
    feature: "Zero Commission on Farm Produce"
  },
  {
    id: 2,
    tag: "Quality & Freshness Assured",
    heading: "Fresh Produce, Better Prices",
    description: "Discover quality agricultural products directly from farmers.",
    subtext: "From harvest fields straight to mandi and wholesaler docks with transparent grading.",
    bgTheme: "slide-theme-forest",
    statBadge: "Over 50,000+ Metric Tonnes Traded",
    feature: "Lab-Tested Grade A Standards"
  },
  {
    id: 3,
    tag: "Next-Gen Agri Commerce",
    heading: "Grow. Connect. Prosper.",
    description: "Making agricultural trade simpler, smarter and more accessible.",
    subtext: "Fast digital discovery, transparent quantities, verified farmers, and guaranteed fulfillment.",
    bgTheme: "slide-theme-amber",
    statBadge: "2,500+ Active Wholesalers",
    feature: "Verified Farm Gate Delivery"
  }
];

export const Carousel = ({ onGetStarted }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const slideTimerRef = useRef(null);

  // Automatic slide transitions every 5 seconds (5000 ms)
  useEffect(() => {
    if (isPaused) return;

    slideTimerRef.current = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slidesData.length);
    }, 5000);

    return () => {
      if (slideTimerRef.current) {
        clearInterval(slideTimerRef.current);
      }
    };
  }, [isPaused]);

  const handlePrev = () => {
    setCurrentSlide((prev) => (prev === 0 ? slidesData.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentSlide((prev) => (prev + 1) % slidesData.length);
  };

  const goToSlide = (idx) => {
    setCurrentSlide(idx);
  };

  return (
    <section 
      className="carousel-wrapper"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      aria-label="CropKart Highlights Carousel"
    >
      <div className="carousel-slides-container">
        {slidesData.map((slide, index) => {
          const isActive = index === currentSlide;
          const isPrev = index === (currentSlide - 1 + slidesData.length) % slidesData.length;

          let slideClass = "carousel-slide";
          if (isActive) slideClass += " active";
          else if (isPrev) slideClass += " prev";
          else slideClass += " next";

          return (
            <div 
              key={slide.id} 
              className={`${slideClass} ${slide.bgTheme}`}
              style={{ display: isActive ? 'flex' : 'none' }}
            >
              {/* Decorative scenic agricultural vector background */}
              <div className="slide-background-art">
                <div className="glow-sphere sphere-1" />
                <div className="glow-sphere sphere-2" />
                
                {/* SVG Farm Contour Waves */}
                <svg className="farm-contour-svg" viewBox="0 0 1440 400" fill="none" preserveAspectRatio="none">
                  <path d="M0 240C240 180 480 300 720 220C960 140 1200 260 1440 200V400H0V240Z" fill="rgba(16, 185, 129, 0.12)" />
                  <path d="M0 280C280 220 540 330 820 270C1100 210 1320 310 1440 260V400H0V280Z" fill="rgba(5, 150, 105, 0.2)" />
                  <path d="M0 330C320 270 600 370 900 320C1200 270 1350 350 1440 320V400H0V330Z" fill="rgba(4, 120, 87, 0.35)" />
                </svg>
              </div>

              {/* Slide Content */}
              <div className="slide-content-container">
                <div className="slide-badge-row">
                  <span className="slide-tag">
                    <SproutIcon size={16} />
                    {slide.tag}
                  </span>
                  <span className="slide-feature-tag">
                    <ShieldCheckIcon size={16} />
                    {slide.feature}
                  </span>
                </div>

                <h1 className="slide-heading">{slide.heading}</h1>
                <p className="slide-description">{slide.description}</p>
                <p className="slide-subtext">{slide.subtext}</p>

                <div className="slide-cta-row">
                  <button 
                    type="button" 
                    className="slide-get-started-btn"
                    onClick={onGetStarted}
                  >
                    <span>Get Started</span>
                    <ArrowRightIcon size={20} />
                  </button>

                  <div className="slide-stat-pill">
                    <TruckIcon size={18} />
                    <span>{slide.statBadge}</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Circular Left Navigation Arrow */}
      <button 
        type="button" 
        className="carousel-arrow carousel-arrow-left" 
        onClick={handlePrev}
        aria-label="Previous Slide"
      >
        <ChevronLeftIcon size={26} />
      </button>

      {/* Circular Right Navigation Arrow */}
      <button 
        type="button" 
        className="carousel-arrow carousel-arrow-right" 
        onClick={handleNext}
        aria-label="Next Slide"
      >
        <ChevronRightIcon size={26} />
      </button>

      {/* Three Slide Indicators (Dots) */}
      <div className="carousel-indicators">
        {slidesData.map((slide, idx) => (
          <button
            key={slide.id}
            type="button"
            className={`indicator-dot ${idx === currentSlide ? 'active' : ''}`}
            onClick={() => goToSlide(idx)}
            aria-label={`Go to slide ${idx + 1}`}
          >
            <span className="dot-progress-bar" />
          </button>
        ))}
      </div>
    </section>
  );
};
