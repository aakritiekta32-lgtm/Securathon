import { Router } from 'express';
import { getListings, getListingById, createListing } from '../controllers/listingController.js';
import { verifyFirebaseToken } from '../middleware/verifyFirebaseToken.js';

const router = Router();

// Public consumer marketplace queries
router.get('/', getListings);
router.get('/:id', getListingById);

// Protected direct creation endpoint (Farmers authenticated via portal)
router.post('/', verifyFirebaseToken, createListing);

export default router;
