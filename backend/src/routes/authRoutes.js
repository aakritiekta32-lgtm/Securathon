import { Router } from 'express';
import { getMe, updateProfile } from '../controllers/authController.js';
import { verifyFirebaseToken } from '../middleware/verifyFirebaseToken.js';

const router = Router();

// Protected user profile routes
router.get('/me', verifyFirebaseToken, getMe);
router.post('/profile', verifyFirebaseToken, updateProfile);

export default router;
