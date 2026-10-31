import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { Home } from './pages/Home';
import { Products } from './pages/Products';
import { Orders } from './pages/Orders';
import { VendorModal } from './components/VendorModal';
import { OrderFormModal } from './components/OrderFormModal';
import { OrderConfirmationModal } from './components/OrderConfirmationModal';
import { LoginModal } from './components/LoginModal';
import { getProducts, getVendorsByCropId, submitOrder } from './services/api';
import './App.css';

function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [products, setProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  // User auth state
  const [user, setUser] = useState({
    id: 'usr-1',
    name: 'Vikas Agarwal',
    company: 'Agarwal Agro Traders',
    role: 'Wholesaler',
    location: 'APMC Market, Mumbai',
    phone: '98210 55432'
  });
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  // Placed orders list
  const [orders, setOrders] = useState([]);

  // Modals state
  const [vendorModalCrop, setVendorModalCrop] = useState(null);
  const [vendorsForCrop, setVendorsForCrop] = useState([]);
  const [orderModalCrop, setOrderModalCrop] = useState(null);
  const [orderModalVendor, setOrderModalVendor] = useState(null);
  const [confirmedOrder, setConfirmedOrder] = useState(null);

  // Load initial product data
  useEffect(() => {
    const fetchCrops = async () => {
      try {
        const data = await getProducts();
        setProducts(data);
      } catch (err) {
        console.error('Failed to load products:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchCrops();
  }, []);

  // Navigation handler
  const handleNavigate = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Open Vendor comparison modal
  const handleSelectCrop = async (crop) => {
    try {
      const vendors = await getVendorsByCropId(crop.id);
      setVendorsForCrop(vendors);
      setVendorModalCrop(crop);
    } catch (err) {
      console.error('Error fetching vendors:', err);
    }
  };

  // Buy Now button clicked on a product card
  const handleBuyNowDirect = async (crop) => {
    try {
      const vendors = await getVendorsByCropId(crop.id);
      // Select lowest price or highest rated vendor by default
      const defaultVendor = vendors.length > 0 ? vendors[0] : null;
      setOrderModalCrop(crop);
      setOrderModalVendor(defaultVendor);
    } catch (err) {
      console.error('Error preparing order:', err);
    }
  };

  // Buy button clicked from inside Vendor comparison modal
  const handleSelectVendorFromModal = (crop, vendor) => {
    setVendorModalCrop(null);
    setOrderModalCrop(crop);
    setOrderModalVendor(vendor);
  };

  // Form submission handler
  const handleOrderSubmit = async (orderPayload) => {
    try {
      const res = await submitOrder(orderPayload);
      if (res.success) {
        setOrders((prev) => [res.order, ...prev]);
        setOrderModalCrop(null);
        setOrderModalVendor(null);
        setConfirmedOrder(res.order);
      }
    } catch (err) {
      console.error('Error submitting order:', err);
      alert('Could not place order. Please try again.');
    }
  };

  return (
    <div className="cropkart-app">
      {/* 1. CropKart Sticky Header Navigation */}
      <Navbar 
        currentPage={currentPage}
        onNavigate={handleNavigate}
        onOpenLogin={() => setIsLoginOpen(true)}
        user={user}
        ordersCount={orders.length}
      />

      {/* 2. Main Page View Content */}
      <main className="main-content">
        {currentPage === 'home' && (
          <Home 
            onNavigate={handleNavigate}
            featuredProducts={products}
            onSelectCrop={handleSelectCrop}
            onBuyNow={handleBuyNowDirect}
          />
        )}

        {currentPage === 'explore' && (
          <Products 
            products={products}
            onSelectCrop={handleSelectCrop}
            onBuyNow={handleBuyNowDirect}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
          />
        )}

        {currentPage === 'orders' && (
          <Orders 
            orders={orders}
            onNavigate={handleNavigate}
          />
        )}
      </main>

      {/* 3. CropKart Professional Footer */}
      <Footer onNavigate={handleNavigate} />

      {/* --- MODALS --- */}

      {/* A. Farmer/Vendor Details Comparison Modal */}
      {vendorModalCrop && (
        <VendorModal 
          crop={vendorModalCrop}
          vendors={vendorsForCrop}
          onClose={() => setVendorModalCrop(null)}
          onSelectVendor={handleSelectVendorFromModal}
        />
      )}

      {/* B. Delivery Details Buy Now Form Modal */}
      {orderModalCrop && (
        <OrderFormModal 
          crop={orderModalCrop}
          vendor={orderModalVendor}
          onClose={() => {
            setOrderModalCrop(null);
            setOrderModalVendor(null);
          }}
          onSubmitOrder={handleOrderSubmit}
        />
      )}

      {/* C. Order Placed Confirmation Screen/Modal */}
      {confirmedOrder && (
        <OrderConfirmationModal 
          order={confirmedOrder}
          onClose={() => setConfirmedOrder(null)}
          onViewOrders={() => {
            setConfirmedOrder(null);
            handleNavigate('orders');
          }}
        />
      )}

      {/* D. Login / Account Profile Modal */}
      {isLoginOpen && (
        <LoginModal 
          user={user}
          onClose={() => setIsLoginOpen(false)}
          onLogin={(u) => setUser(u)}
          onLogout={() => setUser(null)}
        />
      )}
    </div>
  );
}

export default App;
