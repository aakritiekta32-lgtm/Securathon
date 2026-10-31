import React from 'react';
import { XIcon, StarIcon, MapPinIcon, ShieldCheckIcon, PhoneIcon } from './Icons';
import { CropIllustration } from './CropIllustrations';

export const VendorModal = ({ crop, vendors, onClose, onSelectVendor }) => {
  if (!crop) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container vendor-modal" onClick={(e) => e.stopPropagation()}>
        {/* Modal Header */}
        <div className="modal-header">
          <div className="vendor-modal-title-row">
            <div className="vendor-crop-icon-thumb" style={{ backgroundColor: crop.badgeColor }}>
              <CropIllustration type={crop.cropType} size={42} />
            </div>
            <div>
              <span className="modal-category-tag">{crop.category} • Farmer Comparison</span>
              <h2 className="modal-title">{crop.name} Wholesale Suppliers</h2>
              <p className="modal-sub">Compare verified farmers offering {crop.name} with direct farm gate rates.</p>
            </div>
          </div>
          <button type="button" className="btn-close-modal" onClick={onClose} aria-label="Close modal">
            <XIcon size={20} />
          </button>
        </div>

        {/* Vendors List */}
        <div className="modal-body vendor-modal-body">
          {vendors && vendors.length > 0 ? (
            <div className="vendors-list">
              {vendors.map((vendor) => (
                <div key={vendor.id} className="vendor-card">
                  <div className="vendor-card-header">
                    <div className="vendor-farmer-info">
                      <div className="vendor-avatar">
                        {vendor.farmerName.charAt(0)}
                      </div>
                      <div>
                        <div className="farmer-name-row">
                          <h4 className="farmer-name">{vendor.farmerName}</h4>
                          {vendor.verified && (
                            <span className="verified-badge">
                              <ShieldCheckIcon size={14} />
                              Verified Farmer
                            </span>
                          )}
                        </div>
                        <span className="farm-name">{vendor.farmName}</span>
                        <div className="vendor-location-tag">
                          <MapPinIcon size={13} />
                          <span>{vendor.location}</span>
                          <span className="dot-sep">•</span>
                          <span className="vendor-exp">{vendor.experience}</span>
                        </div>
                      </div>
                    </div>

                    <div className="vendor-price-badge">
                      <span className="price-tag">₹{vendor.price}</span>
                      <span className="price-unit">per kg</span>
                    </div>
                  </div>

                  <div className="vendor-meta-grid">
                    <div className="vendor-meta-item">
                      <span className="meta-label">Available Stock</span>
                      <span className="meta-val font-semibold">{vendor.availableStock.toLocaleString()} kg</span>
                    </div>
                    <div className="vendor-meta-item">
                      <span className="meta-label">Minimum Order</span>
                      <span className="meta-val">{vendor.minOrder} kg</span>
                    </div>
                    <div className="vendor-meta-item">
                      <span className="meta-label">Rating & Reviews</span>
                      <span className="meta-val rating-val">
                        <StarIcon size={14} />
                        <strong>{vendor.rating}</strong> ({vendor.reviewsCount} reviews)
                      </span>
                    </div>
                    <div className="vendor-meta-item">
                      <span className="meta-label">Harvest Status</span>
                      <span className="meta-val text-green-700">{vendor.harvestTime}</span>
                    </div>
                  </div>

                  <div className="vendor-card-footer">
                    <div className="farmer-contact-hint">
                      <PhoneIcon size={14} />
                      <span>{vendor.phone}</span>
                    </div>
                    <button 
                      type="button" 
                      className="btn-select-vendor-buy"
                      onClick={() => onSelectVendor(crop, vendor)}
                    >
                      Buy From This Farmer
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-vendors">
              <p>No active farmer listings found for this crop currently.</p>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="modal-footer">
          <span className="footer-guarantee">
            <ShieldCheckIcon size={16} />
            CropKart 100% Quality & Payment Protection Guarantee
          </span>
          <button type="button" className="btn-secondary" onClick={onClose}>
            Back to Crops
          </button>
        </div>
      </div>
    </div>
  );
};
