import React, { useState } from 'react';
import { XIcon, ShieldCheckIcon, TruckIcon } from './Icons';
import { CropIllustration } from './CropIllustrations';

export const OrderFormModal = ({ crop, vendor, onClose, onSubmitOrder }) => {
  const effectivePrice = vendor ? vendor.price : (crop ? crop.basePrice : 0);
  const effectiveStock = vendor ? vendor.availableStock : (crop ? crop.totalStock : 0);
  const effectiveMinOrder = vendor ? vendor.minOrder : (crop ? crop.minOrder : 50);
  const vendorName = vendor ? vendor.farmerName : "Verified Regional Farmer Group";
  const vendorLocation = vendor?.location || crop?.location || 'Not specified';

  const [quantity, setQuantity] = useState(effectiveMinOrder);
  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const totalEstimatedAmount = quantity * effectivePrice;

  const validate = () => {
    const errs = {};

    if (!quantity || isNaN(quantity)) {
      errs.quantity = 'Please enter a valid quantity.';
    } else if (Number(quantity) < effectiveMinOrder) {
      errs.quantity = `Minimum order quantity is ${effectiveMinOrder} kg.`;
    } else if (Number(quantity) > effectiveStock) {
      errs.quantity = `Quantity cannot exceed available stock (${effectiveStock.toLocaleString()} kg).`;
    }

    if (!fullName.trim()) {
      errs.fullName = 'Full Name is required.';
    } else if (fullName.trim().length < 3) {
      errs.fullName = 'Name should be at least 3 characters.';
    }

    const cleanPhone = phoneNumber.replace(/[\s-]/g, '');
    if (!phoneNumber.trim()) {
      errs.phoneNumber = 'Phone Number is required.';
    } else if (!/^[6-9]\d{9}$/.test(cleanPhone)) {
      errs.phoneNumber = 'Enter a valid 10-digit Indian mobile number (e.g. 9876543210).';
    }

    if (!deliveryAddress.trim()) {
      errs.deliveryAddress = 'Delivery Address is required.';
    } else if (deliveryAddress.trim().length < 10) {
      errs.deliveryAddress = 'Please provide complete delivery address with landmark/city.';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      const orderData = {
        cropId: crop.id,
        cropName: crop.name,
        cropType: crop.cropType,
        vendorId: vendor?.id || 'direct-farm',
        vendorName,
        vendorLocation,
        vendorPhone: vendor?.phone || '+91 98765 00000',
        pricePerKg: effectivePrice,
        quantity: Number(quantity),
        unit: crop.unit || 'kg',
        totalAmount: totalEstimatedAmount,
        customerName: fullName.trim(),
        phone: phoneNumber.trim(),
        deliveryAddress: deliveryAddress.trim()
      };

      await onSubmitOrder(orderData);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container order-form-modal" onClick={(e) => e.stopPropagation()}>
        {/* Modal Header */}
        <div className="modal-header">
          <div className="order-modal-title-row">
            <div className="order-crop-thumb" style={{ backgroundColor: crop.badgeColor }}>
              <CropIllustration type={crop.cropType} size={36} />
            </div>
            <div>
              <h2 className="modal-title">Delivery Details</h2>
              <p className="modal-sub">Direct procurement order from {vendorName} ({vendorLocation})</p>
            </div>
          </div>
          <button type="button" className="btn-close-modal" onClick={onClose} aria-label="Close modal">
            <XIcon size={20} />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="order-form">
          <div className="modal-body order-modal-body">
            {/* Live Pricing & Stock Overview */}
            <div className="order-stock-card">
              <div className="stock-info-col">
                <span className="stock-label">Selected Crop</span>
                <span className="stock-highlight-text">{crop.name}</span>
                <span className="stock-subtext">Supplier: {vendorName}</span>
              </div>
              <div className="stock-info-col border-left">
                <span className="stock-label">Rate</span>
                <span className="stock-highlight-text text-green-700">₹{effectivePrice} / kg</span>
              </div>
              <div className="stock-info-col border-left">
                <span className="stock-label">Available Stock</span>
                <span className="stock-highlight-text">{effectiveStock.toLocaleString()} kg</span>
                <span className="moq-tag">Min MOQ: {effectiveMinOrder} kg</span>
              </div>
            </div>

            {/* Field 1: Quantity to Buy */}
            <div className="form-group">
              <label htmlFor="quantity" className="form-label">
                1. Quantity to Buy (in kg) <span className="req">*</span>
              </label>
              <div className="quantity-input-group">
                <button 
                  type="button" 
                  className="qty-btn"
                  onClick={() => setQuantity((q) => Math.max(effectiveMinOrder, Number(q || 0) - 50))}
                >
                  -50
                </button>
                <input
                  id="quantity"
                  type="number"
                  min={effectiveMinOrder}
                  max={effectiveStock}
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  className={`form-input qty-input ${errors.quantity ? 'input-error' : ''}`}
                  placeholder={`Min ${effectiveMinOrder}`}
                />
                <button 
                  type="button" 
                  className="qty-btn"
                  onClick={() => setQuantity((q) => Math.min(effectiveStock, Number(q || 0) + 50))}
                >
                  +50
                </button>
              </div>
              {errors.quantity && <p className="error-text">{errors.quantity}</p>}
              <span className="field-hint">Enter desired quantity between {effectiveMinOrder} kg and {effectiveStock.toLocaleString()} kg.</span>
            </div>

            {/* Field 2: Full Name */}
            <div className="form-group">
              <label htmlFor="fullName" className="form-label">
                2. Full Name <span className="req">*</span>
              </label>
              <input
                id="fullName"
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className={`form-input ${errors.fullName ? 'input-error' : ''}`}
                placeholder="e.g. Rajesh Khurana (Wholesale Trading Co.)"
              />
              {errors.fullName && <p className="error-text">{errors.fullName}</p>}
            </div>

            {/* Field 3: Phone Number */}
            <div className="form-group">
              <label htmlFor="phoneNumber" className="form-label">
                3. Phone Number <span className="req">*</span>
              </label>
              <div className="phone-input-wrapper">
                <span className="phone-prefix">+91</span>
                <input
                  id="phoneNumber"
                  type="tel"
                  maxLength={10}
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className={`form-input phone-input ${errors.phoneNumber ? 'input-error' : ''}`}
                  placeholder="9876543210"
                />
              </div>
              {errors.phoneNumber && <p className="error-text">{errors.phoneNumber}</p>}
              <span className="field-hint">Wholesaler contact number for logistics verification.</span>
            </div>

            {/* Field 4: Delivery Address */}
            <div className="form-group">
              <label htmlFor="deliveryAddress" className="form-label">
                4. Delivery Address <span className="req">*</span>
              </label>
              <textarea
                id="deliveryAddress"
                rows={3}
                value={deliveryAddress}
                onChange={(e) => setDeliveryAddress(e.target.value)}
                className={`form-input form-textarea ${errors.deliveryAddress ? 'input-error' : ''}`}
                placeholder="e.g. Godown #14, APMC Fruit & Veg Market Yard, Vashi, Navi Mumbai, 400703"
              />
              {errors.deliveryAddress && <p className="error-text">{errors.deliveryAddress}</p>}
            </div>

            {/* Estimated Total Calculation */}
            <div className="order-summary-box">
              <div className="summary-row">
                <span>Unit Rate:</span>
                <span>₹{effectivePrice} / kg</span>
              </div>
              <div className="summary-row">
                <span>Ordered Quantity:</span>
                <span>{quantity ? Number(quantity).toLocaleString() : 0} kg</span>
              </div>
              <div className="summary-row total-row">
                <span>Estimated Total:</span>
                <span className="total-amount">₹{isNaN(totalEstimatedAmount) ? 0 : totalEstimatedAmount.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Modal Actions */}
          <div className="modal-footer">
            <button 
              type="button" 
              className="btn-cancel" 
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="btn-confirm-order"
              disabled={isSubmitting}
            >
              <TruckIcon size={18} />
              <span>{isSubmitting ? 'Submitting...' : 'Submit Order'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
