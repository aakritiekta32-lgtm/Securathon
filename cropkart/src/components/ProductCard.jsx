import React from 'react';
import { CropIllustration } from './CropIllustrations';
import { StarIcon, MapPinIcon, ShieldCheckIcon } from './Icons';

export const ProductCard = ({ product, onSelectCrop, onBuyNow }) => {
  return (
    <div className="product-card">
      <div className="product-card-top" style={{ backgroundColor: product.badgeColor || '#ecfdf5' }}>
        <div className="product-category-chip">{product.category}</div>
        <div className="product-quality-badge">
          <ShieldCheckIcon size={14} />
          <span>{product.qualityGrade}</span>
        </div>
        <div className="product-art-center">
          <CropIllustration type={product.cropType} size={84} />
        </div>
      </div>

      <div className="product-card-body">
        <div className="product-title-row">
          <div>
            <h3 className="product-name">{product.name}</h3>
            <span className="product-scientific">{product.scientificName}</span>
          </div>
          <div className="product-rating-box">
            <StarIcon size={14} />
            <span className="rating-num">{product.rating}</span>
            <span className="rating-count">({product.reviewsCount})</span>
          </div>
        </div>

        <div className="product-location">
          <MapPinIcon size={14} />
          <span>{product.location}</span>
        </div>

        <p className="product-desc">{product.description}</p>

        <div className="product-metrics">
          <div className="metric-box">
            <span className="metric-label">Wholesale Price</span>
            <span className="metric-value price-val">₹{product.basePrice}<small>/{product.unit}</small></span>
          </div>
          <div className="metric-box">
            <span className="metric-label">Available Stock</span>
            <span className="metric-value">{product.totalStock.toLocaleString()} {product.unit}</span>
          </div>
          <div className="metric-box">
            <span className="metric-label">Min. Order (MOQ)</span>
            <span className="metric-value">{product.minOrder} {product.unit}</span>
          </div>
        </div>

        <div className="product-card-actions">
          <button 
            type="button" 
            className="btn-secondary-compare"
            onClick={() => onSelectCrop(product)}
          >
            Compare Farmers
          </button>
          <button 
            type="button" 
            className="btn-primary-buy"
            onClick={() => onBuyNow(product)}
          >
            Buy Now
          </button>
        </div>
      </div>
    </div>
  );
};
