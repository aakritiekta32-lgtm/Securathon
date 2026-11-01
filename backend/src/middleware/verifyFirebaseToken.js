import { getAuth, isFirebaseInitialized } from '../config/firebaseAdmin.js';

/**
 * Express middleware to verify Firebase Authentication ID tokens.
 * Extracts token from 'Authorization: Bearer <token>' header.
 * Attaches decoded token payload to req.user.
 */
export async function verifyFirebaseToken(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      error: 'Unauthorized',
      message: 'Authentication token missing. Please supply a valid Firebase ID token as: Authorization: Bearer <token>'
    });
  }

  const idToken = authHeader.split('Bearer ')[1].trim();

  if (!idToken) {
    return res.status(401).json({
      error: 'Unauthorized',
      message: 'Bearer token string is empty.'
    });
  }

  const auth = getAuth();

  // If Firebase Admin credentials are fully configured
  if (isFirebaseInitialized() && auth) {
    try {
      const decodedToken = await auth.verifyIdToken(idToken);
      req.user = decodedToken;
      return next();
    } catch (error) {
      console.error('[Auth Middleware] Firebase token verification failed:', error.message);
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'Invalid or expired Firebase ID token.',
        code: error.code || 'auth/argument-error'
      });
    }
  }

  // If running in development and Firebase Admin service account key is pending
  if (process.env.NODE_ENV === 'development') {
    // Check if test/demo token or test header
    if (idToken.startsWith('test-') || idToken.startsWith('usr-') || req.headers['x-dev-uid']) {
      req.user = {
        uid: req.headers['x-dev-uid'] || idToken,
        email: 'dev.user@cropkart.local',
        name: 'CropKart Developer'
      };
      return next();
    }
  }

  return res.status(503).json({
    error: 'Service Unavailable',
    message: 'Firebase Admin SDK is not initialized with a service account key. Place your serviceAccountKey.json in the backend directory to enable Firebase token verification.'
  });
}

export default verifyFirebaseToken;
