import React, { useState, useMemo } from 'react';
import { ProductCard } from '../components/ProductCard';
import { SearchIcon, XIcon, SproutIcon, FilterIcon } from '../components/Icons';

export const Products = ({ 
  products = [], 
  onSelectCrop, 
  onBuyNow, 
  searchQuery, 
  setSearchQuery 
}) => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState('recommended');

  const categories = ['All', 'Vegetables', 'Grains', 'Fruits'];

  const filteredProducts = useMemo(() => {
    let result = [...products];

    // Filter by search query (crop name, category, or location)
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.scientificName.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.location.toLowerCase().includes(q)
      );
    }

    // Filter by category
    if (selectedCategory !== 'All') {
      result = result.filter(
        (p) => p.category.toLowerCase() === selectedCategory.toLowerCase()
      );
    }

    // Sort products
    switch (sortBy) {
      case 'price-low':
        result.sort((a, b) => a.basePrice - b.basePrice);
        break;
      case 'price-high':
        result.sort((a, b) => b.basePrice - a.basePrice);
        break;
      case 'stock-high':
        result.sort((a, b) => b.totalStock - a.totalStock);
        break;
      case 'rating-high':
        result.sort((a, b) => b.rating - a.rating);
        break;
      default:
        break;
    }

    return result;
  }, [products, searchQuery, selectedCategory, sortBy]);

  return (
    <div className="products-page-container">
      {/* Exploration Header & Search Area */}
      <div className="exploration-hero-bar">
        <div className="exploration-header-content">
          <div className="page-breadcrumb">
            <span>Marketplace</span>
            <span className="crumb-sep">/</span>
            <span className="current-crumb">Explore Crops</span>
          </div>
          <h1 className="page-title">Wholesale Crop Exploration</h1>
          <p className="page-subtitle">
            Procure directly from verified Indian farmers with transparent farm-gate rates and live stock tracking.
          </p>
        </div>

        {/* Search Bar - Exactly matching prompt requirements */}
        <div className="search-control-container">
          <div className="search-input-wrapper">
            <SearchIcon size={20} className="search-box-icon" />
            <input
              type="text"
              className="search-input"
              placeholder="Search for crops..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              aria-label="Search crops"
            />
            {searchQuery && (
              <button 
                type="button" 
                className="btn-clear-search" 
                onClick={() => setSearchQuery('')}
                aria-label="Clear search"
              >
                <XIcon size={16} />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Filter and Sorting Toolbar */}
      <div className="products-toolbar">
        {/* Category Pills */}
        <div className="category-pills-row">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              className={`category-pill ${selectedCategory === cat ? 'active' : ''}`}
              onClick={() => setSelectedCategory(cat)}
            >
              {cat}
              <span className="pill-count">
                {cat === 'All' 
                  ? products.length 
                  : products.filter(p => p.category.toLowerCase() === cat.toLowerCase()).length
                }
              </span>
            </button>
          ))}
        </div>

        {/* Sort Dropdown */}
        <div className="sort-controls">
          <label htmlFor="sort-select" className="sort-label">Sort by:</label>
          <select 
            id="sort-select" 
            className="sort-dropdown"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="recommended">Recommended</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="stock-high">Highest Stock</option>
            <option value="rating-high">Highest Rating</option>
          </select>
        </div>
      </div>

      {/* Product Results Count or Search Indicator */}
      <div className="results-status-bar">
        <span className="results-count-text">
          Showing <strong>{filteredProducts.length}</strong> of {products.length} agricultural crops
          {searchQuery && ` matching "${searchQuery}"`}
          {selectedCategory !== 'All' && ` in ${selectedCategory}`}
        </span>
        {searchQuery && (
          <button 
            type="button" 
            className="btn-reset-filters"
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('All');
            }}
          >
            Reset Filters
          </button>
        )}
      </div>

      {/* Product Cards Grid */}
      {filteredProducts.length > 0 ? (
        <div className="products-grid">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onSelectCrop={onSelectCrop}
              onBuyNow={onBuyNow}
            />
          ))}
        </div>
      ) : (
        /* "No products found" state matching user requirement */
        <div className="no-products-found-card">
          <div className="no-products-icon">
            <SproutIcon size={48} />
          </div>
          <h3 className="no-products-title">No products found</h3>
          <p className="no-products-message">
            We couldn't find any crops matching "{searchQuery}". Try searching for popular crops like 
            Tomato, Potato, Onion, Wheat, Rice, or Cabbage.
          </p>
          <button 
            type="button" 
            className="btn-reset-search"
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('All');
            }}
          >
            Reset Search
          </button>
        </div>
      )}
    </div>
  );
};
