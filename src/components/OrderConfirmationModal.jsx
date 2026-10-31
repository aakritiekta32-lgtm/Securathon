import React from 'react';
import { CheckCircleIcon, ShieldCheckIcon, TruckIcon } from './Icons';
import { CropIllustration } from './CropIllustrations';

export const OrderConfirmationModal = ({ order, onClose, onViewOrders }) => {
  if (!order) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container confirmation-modal" onClick={(e) => e.stopPropagation()}>
        <div className="confirmation-header">
          <div className="success-icon-badge">
            <CheckCircleIcon size={44} className="icon-success" />
          </div>
          <h2 className="confirmation-title">Order Placed Successfully!</h2>
          <p className="confirmation-msg">
            Thank you for choosing CropKart. Your order request has been received successfully.
          </p>
        </div>

        <div className="confirmation-body">
          {/* Order ID Banner */}
          <div className="order-id-banner">
            <div>
              <span className="order-id-label">Temporary Order ID</span>
              <h3 className="order-id-value">#{order.id}</h3>
            </div>
            <div className="order-status-chip">
              <span className="status-dot pulse" />
              <span>{order.status || 'Request Dispatched'}</span>
            </div>
          </div>

          {/* Item details */}
          <div className="receipt-card">
            <div className="receipt-item-row">
              <div className="receipt-crop-thumb">
                <CropIllustration type={order.cropType} size={40} />
              </div>
              <div className="receipt-item-info">
                <h4 className="receipt-crop-name">{order.cropName}</h4>
                <span className="receipt-vendor">Supplier: {order.vendorName} ({order.vendorLocation})</span>
              </div>
            </div>

            <div className="receipt-divider" />

            <div className="receipt-details-list">
              <div className="receipt-line">
                <span className="r-label">Quantity Ordered:</span>
                <span className="r-val font-semibold">{order.quantity.toLocaleString()} {order.unit || 'kg'}</span>
              </div>
              <div className="receipt-line">
                <span className="r-label">Unit Price:</span>
                <span className="r-val">₹{order.pricePerKg} / kg</span>
              </div>
              <div className="receipt-line highlight-line">
                <span className="r-label">Estimated Total Amount:</span>
                <span className="r-val total-price">₹{order.totalAmount.toLocaleString()}</span>
              </div>
              <div className="receipt-line">
                <span className="r-label">Customer Name:</span>
                <span className="r-val">{order.customerName}</span>
              </div>
              <div className="receipt-line">
                <span className="r-label">Contact Phone:</span>
                <span className="r-val">+91 {order.phone}</span>
              </div>
              <div className="receipt-line">
                <span className="r-label">Delivery Destination:</span>
                <span className="r-val address-text">{order.deliveryAddress}</span>
              </div>
              <div className="receipt-line">
                <span className="r-label">Order Date & Time:</span>
                <span className="r-val text-muted">{order.formattedDate}</span>
              </div>
            </div>
          </div>

          {/* Integration Note */}
          <div className="future-integration-pill">
            <ShieldCheckIcon size={18} />
            <div>
              <p className="int-title">Future Firebase & WhatsApp Integration Ready</p>
              <p className="int-desc">In live deployment, this step triggers an instant WhatsApp notification to both {order.vendorName} and +91 {order.phone}.</p>
            </div>
          </div>
        </div>

        <div className="confirmation-footer">
          <button 
            type="button" 
            className="btn-continue-shopping"
            onClick={onClose}
          >
            Continue Shopping
          </button>
          {onViewOrders && (
            <button 
              type="button" 
              className="btn-view-orders"
              onClick={onViewOrders}
            >
              <TruckIcon size={16} />
              <span>Track All Orders</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
