import { getDb, isFirebaseInitialized, getInMemoryStore } from '../config/firebaseAdmin.js';

/**
 * GET /api/auth/me
 * Retrieves current authenticated user profile using verified Firebase UID.
 */
export async function getMe(req, res) {
  try {
    const uid = req.user?.uid;
    if (!uid) {
      return res.status(401).json({ error: 'Unauthorized', message: 'User identifier not found in token' });
    }

    const db = getDb();
    if (isFirebaseInitialized() && db) {
      const userDoc = await db.collection('users').doc(uid).get();
      if (userDoc.exists) {
        return res.status(200).json({
          success: true,
          user: userDoc.data()
        });
      }
    } else {
      const store = getInMemoryStore();
      const cached = store.users.get(uid);
      if (cached) {
        return res.status(200).json({ success: true, user: cached });
      }
    }

    // Default profile from Firebase Auth token metadata if Firestore record not yet created
    const fallbackProfile = {
      uid,
      name: req.user.name || 'CropKart User',
      email: req.user.email || null,
      phone: req.user.phone_number || null,
      role: 'wholesaler',
      location: 'India',
      isNew: true,
      createdAt: new Date().toISOString()
    };

    return res.status(200).json({
      success: true,
      user: fallbackProfile
    });
  } catch (error) {
    console.error('[Auth Controller] Error in getMe:', error.message);
    return res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to retrieve user profile'
    });
  }
}

/**
 * POST /api/auth/profile
 * Creates or updates user profile under users/{uid} in Firestore.
 */
export async function updateProfile(req, res) {
  try {
    const uid = req.user?.uid;
    if (!uid) {
      return res.status(401).json({ error: 'Unauthorized', message: 'Missing user UID' });
    }

    const { name, role, company, location, phone } = req.body;

    if (!name || name.trim().length < 2) {
      return res.status(400).json({ error: 'Bad Request', message: 'Full name is required (minimum 2 characters).' });
    }

    const validRoles = ['wholesaler', 'farmer', 'consumer'];
    const selectedRole = role && validRoles.includes(role.toLowerCase()) ? role.toLowerCase() : 'wholesaler';

    const profileData = {
      uid,
      name: name.trim(),
      role: selectedRole,
      company: company ? company.trim() : '',
      location: location ? location.trim() : 'India',
      phone: phone ? phone.trim() : req.user.phone_number || '',
      email: req.user.email || '',
      updatedAt: new Date().toISOString()
    };

    const db = getDb();
    if (isFirebaseInitialized() && db) {
      await db.collection('users').doc(uid).set(profileData, { merge: true });
    }

    const store = getInMemoryStore();
    store.users.set(uid, profileData);

    return res.status(200).json({
      success: true,
      message: 'User profile updated successfully',
      user: profileData
    });
  } catch (error) {
    console.error('[Auth Controller] Error updating profile:', error.message);
    return res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to save profile'
    });
  }
}
