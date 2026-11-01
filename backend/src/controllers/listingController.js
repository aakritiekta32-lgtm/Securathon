import { getDb, isFirebaseInitialized, getInMemoryStore } from '../config/firebaseAdmin.js';
import { maskPhoneNumber, detectCropCategory } from '../utils/validators.js';

// Starter mock listings to populate initial marketplace if database has not been seeded yet
const DEFAULT_SEED_LISTINGS = [
  {
    id: "crop-wa-seed-1",
    crop: "Wheat",
    name: "Wheat",
    farmerName: "Ramesh Kumar",
    farmerPhone: "919821055432",
    category: "Grains",
    quantity: 50,
    unit: "kg",
    price: 25,
    basePrice: 25,
    totalStock: 50,
    location: "Sabour, Bhagalpur",
    status: "available",
    source: "whatsapp",
    qualityGrade: "Grade A (Sharbati)",
    createdAt: new Date().toISOString()
  },
  {
    id: "crop-wa-seed-2",
    crop: "Tomato",
    name: "Tomato",
    farmerName: "Suresh Patil",
    farmerPhone: "919823144521",
    category: "Vegetables",
    quantity: 120,
    unit: "kg",
    price: 28,
    basePrice: 28,
    totalStock: 120,
    location: "Nashik, Maharashtra",
    status: "available",
    source: "whatsapp",
    qualityGrade: "Grade A (Firm & Ripe)",
    createdAt: new Date().toISOString()
  },
  {
    id: "crop-wa-seed-3",
    crop: "Potato",
    name: "Potato",
    farmerName: "Manoj Verma",
    farmerPhone: "919811223344",
    category: "Vegetables",
    quantity: 300,
    unit: "kg",
    price: 18,
    basePrice: 18,
    totalStock: 300,
    location: "Agra, Uttar Pradesh",
    status: "available",
    source: "whatsapp",
    qualityGrade: "Grade A (Chipsona)",
    createdAt: new Date().toISOString()
  }
];

/**
 * Sanitizes listing for public consumer marketplace view.
 * Ensures farmer phone number is masked for privacy.
 */
function sanitizePublicListing(doc) {
  return {
    ...doc,
    farmerPhone: maskPhoneNumber(doc.farmerPhone)
  };
}

/**
 * GET /api/listings
 * Retrieves active crop listings from Firestore with optional filtering.
 * Query params: ?crop=wheat&location=Bhagalpur&category=Grains
 */
export async function getListings(req, res) {
  try {
    const { crop, location, category, status = 'available' } = req.query;
    let listings = [];

    const db = getDb();
    if (isFirebaseInitialized() && db) {
      try {
        let queryRef = db.collection('cropListings');

        if (status) {
          queryRef = queryRef.where('status', '==', status);
        }

        const snapshot = await queryRef.get();
        snapshot.forEach((doc) => {
          listings.push({ id: doc.id, ...doc.data() });
        });
      } catch (err) {
        console.error('[Listing Controller] Firestore read error:', err.message);
      }
    }

    // Merge in-memory listings (WhatsApp bot submissions)
    const store = getInMemoryStore();
    if (store.cropListings.size > 0) {
      store.cropListings.forEach((val) => {
        if (!listings.some((l) => l.id === val.id)) {
          if (!status || val.status === status) {
            listings.unshift(val);
          }
        }
      });
    }

    // If completely empty, provide seed listings so frontend demonstrates live cards
    if (listings.length === 0) {
      listings = [...DEFAULT_SEED_LISTINGS];
    }

    // Apply In-Memory Filtering for case-insensitive partial match
    if (crop) {
      const qCrop = crop.toLowerCase().trim();
      listings = listings.filter((l) => 
        (l.crop && l.crop.toLowerCase().includes(qCrop)) ||
        (l.name && l.name.toLowerCase().includes(qCrop))
      );
    }

    if (location) {
      const qLoc = location.toLowerCase().trim();
      listings = listings.filter((l) =>
        l.location && l.location.toLowerCase().includes(qLoc)
      );
    }

    if (category && category !== 'All') {
      const qCat = category.toLowerCase().trim();
      listings = listings.filter((l) =>
        l.category && l.category.toLowerCase() === qCat
      );
    }

    const publicListings = listings.map(sanitizePublicListing);

    return res.status(200).json({
      success: true,
      count: publicListings.length,
      data: publicListings
    });
  } catch (error) {
    console.error('[Listing Controller] getListings error:', error.message);
    return res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to retrieve listings'
    });
  }
}

/**
 * GET /api/listings/:id
 * Retrieves a single crop listing by ID.
 */
export async function getListingById(req, res) {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ error: 'Bad Request', message: 'Listing ID is required.' });
    }

    const db = getDb();
    if (isFirebaseInitialized() && db) {
      const doc = await db.collection('cropListings').doc(id).get();
      if (doc.exists) {
        return res.status(200).json({
          success: true,
          data: sanitizePublicListing({ id: doc.id, ...doc.data() })
        });
      }
    }

    // Check in-memory store
    const store = getInMemoryStore();
    const inMem = store.cropListings.get(id);
    if (inMem) {
      return res.status(200).json({
        success: true,
        data: sanitizePublicListing(inMem)
      });
    }

    // Check seed listings
    const seed = DEFAULT_SEED_LISTINGS.find((s) => s.id === id);
    if (seed) {
      return res.status(200).json({
        success: true,
        data: sanitizePublicListing(seed)
      });
    }

    return res.status(404).json({
      error: 'Not Found',
      message: `Crop listing with ID '${id}' was not found.`
    });
  } catch (error) {
    console.error('[Listing Controller] getListingById error:', error.message);
    return res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to retrieve listing details'
    });
  }
}

/**
 * POST /api/listings
 * Create a listing directly (Authenticated endpoint)
 */
export async function createListing(req, res) {
  try {
    const { crop, quantity, unit, price, location } = req.body;

    if (!crop || !quantity || !unit || !price || !location) {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'All fields (crop, quantity, unit, price, location) are required.'
      });
    }

    const listingId = `crop-${Date.now()}`;
    const category = detectCropCategory(crop);
    const now = new Date().toISOString();

    const newListing = {
      id: listingId,
      crop: crop.trim(),
      name: crop.trim(),
      category,
      quantity: Number(quantity),
      unit: unit.trim().toLowerCase(),
      price: Number(price),
      basePrice: Number(price),
      totalStock: Number(quantity),
      location: location.trim(),
      farmerName: req.user?.name || 'Verified Farmer',
      farmerPhone: req.user?.phone_number || '',
      status: 'available',
      source: 'web_portal',
      createdAt: now,
      updatedAt: now
    };

    const db = getDb();
    if (isFirebaseInitialized() && db) {
      await db.collection('cropListings').doc(listingId).set(newListing);
    }

    const store = getInMemoryStore();
    store.cropListings.set(listingId, newListing);

    return res.status(201).json({
      success: true,
      message: 'Crop listing created successfully',
      data: sanitizePublicListing(newListing)
    });
  } catch (error) {
    console.error('[Listing Controller] createListing error:', error.message);
    return res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to create listing'
    });
  }
}
