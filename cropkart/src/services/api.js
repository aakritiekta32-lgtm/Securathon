/**
 * CropKart API Service Layer
 * 
 * This service abstracts product queries, vendor lookups, and order placements.
 * Currently uses local structured mock data, designed to be swapped with:
 * - Firebase Firestore (collection('crops'), collection('vendors'), collection('orders'))
 * - WhatsApp Business Cloud API (triggering order confirmation messages to farmers & buyers)
 */

import { mockProducts } from '../data/products';
import { mockVendors } from '../data/vendors';

export const getProducts = async (filters = {}) => {
  // Simulate network latency for realistic frontend UX
  await new Promise((resolve) => setTimeout(resolve, 80));

  let results = [...mockProducts];

  if (filters.search) {
    const q = filters.search.toLowerCase().trim();
    results = results.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.location.toLowerCase().includes(q)
    );
  }

  if (filters.category && filters.category !== 'All') {
    results = results.filter((p) => p.category.toLowerCase() === filters.category.toLowerCase());
  }

  if (filters.sortBy) {
    switch (filters.sortBy) {
      case 'price-asc':
        results.sort((a, b) => a.basePrice - b.basePrice);
        break;
      case 'price-desc':
        results.sort((a, b) => b.basePrice - a.basePrice);
        break;
      case 'stock-desc':
        results.sort((a, b) => b.totalStock - a.totalStock);
        break;
      case 'rating-desc':
        results.sort((a, b) => b.rating - a.rating);
        break;
      default:
        break;
    }
  }

  return results;
};

export const getProductById = async (id) => {
  await new Promise((resolve) => setTimeout(resolve, 50));
  return mockProducts.find((p) => p.id === id) || null;
};

export const getVendorsByCropId = async (cropId) => {
  await new Promise((resolve) => setTimeout(resolve, 60));
  return mockVendors.filter((v) => v.cropId === cropId);
};

export const submitOrder = async (orderPayload) => {
  // Simulated delay for database creation
  await new Promise((resolve) => setTimeout(resolve, 200));

  const orderId = `CK-${Math.floor(100000 + Math.random() * 900000)}`;
  const orderRecord = {
    id: orderId,
    ...orderPayload,
    status: 'Pending Confirmation',
    createdAt: new Date().toISOString(),
    formattedDate: new Date().toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  };

  /**
   * FUTURE FIREBASE & WHATSAPP INTEGRATION HOOKS:
   * 
   * 1. Firebase Firestore:
   *    await addDoc(collection(db, "orders"), orderRecord);
   * 
   * 2. WhatsApp API Integration:
   *    await sendWhatsAppNotification({
   *      to: orderPayload.phone,
   *      template: "order_confirmation_buyer",
   *      params: [orderId, orderPayload.cropName, orderPayload.quantity]
   *    });
   *    await sendWhatsAppNotification({
   *      to: orderPayload.vendorPhone,
   *      template: "new_order_farmer",
   *      params: [orderId, orderPayload.customerName, orderPayload.quantity]
   *    });
   */

  return {
    success: true,
    order: orderRecord
  };
};
