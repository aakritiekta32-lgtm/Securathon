import React from 'react';
import { TruckIcon, CheckCircleIcon, ArrowRightIcon } from '../components/Icons';
import { CropIllustration } from '../components/CropIllustrations';

export const Orders = ({ orders = [], onNavigate, onSelectOrder }) => {
  return (
    <div className="orders-page-container">
      <div className="orders-header">
        <div className="page-breadcrumb">
          <span>Marketplace</span>
          <span className="crumb-sep">/</span>
          <span className="current-crumb">My Procurement Orders</span>
        </div>
        <h1 className="page-title">Wholesale Procurement Orders</h1>
        <p className="page-subtitle">Track farm-gate fulfillment requests, dispatch status, and supplier details.</p>
      </div>

      {orders.length > 0 ? (
        <div className="orders-list">
          {orders.map((order) => (
            <div key={order.id} className="order-item-card">
              <div className="order-card-header">
                <div className="order-id-group">
                  <span className="order-id-tag">Order #{order.id}</span>
                  <span className="order-date-text">{order.formattedDate}</span>
                </div>
                <div className="order-status-badge">
                  <span className="status-dot pulse" />
                  <span>{order.status || 'Request Dispatched'}</span>
                </div>
              </div>

              <div className="order-card-body">
                <div className="order-crop-preview">
                  <CropIllustration type={order.cropType} size={48} />
                </div>
                <div className="order-details-col">
                  <h3 className="order-crop-title">{order.cropName}</h3>
                  <span className="order-farmer-meta">Supplier: {order.vendorName} • {order.vendorLocation}</span>
                  <p className="order-address-snippet">
                    <strong>Destination:</strong> {order.deliveryAddress}
                  </p>
                </div>
                <div className="order-pricing-col">
                  <span className="order-qty-label">{order.quantity.toLocaleString()} {order.unit || 'kg'} @ ₹{order.pricePerKg}/kg</span>
                  <span className="order-total-amount">₹{order.totalAmount.toLocaleString()}</span>
                  <span className="order-payment-status">Payment: On Farm Dispatch</span>
                </div>
              </div>

              <div className="order-card-footer">
                <div className="order-whatsapp-ready">
                  <CheckCircleIcon size={16} />
                  <span>Direct farmer dispatch scheduled • WhatsApp notification active</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="no-orders-box">
          <TruckIcon size={52} />
          <h3>No Orders Placed Yet</h3>
          <p>Explore farm produce and place your first wholesale procurement order directly from farmers.</p>
          <button 
            type="button" 
            className="btn-primary-explore"
            onClick={() => onNavigate('explore')}
          >
            <span>Explore Crops</span>
            <ArrowRightIcon size={18} />
          </button>
        </div>
      )}
    </div>
  );
};
