import express from 'express';
import cors from 'cors';
import authRoutes from './routes/authRoutes.js';
import listingRoutes from './routes/listingRoutes.js';
import whatsappRoutes from './routes/whatsappRoutes.js';

const app = express();

// 1. CORS Configuration
const allowedOrigins = [
  process.env.FRONTEND_URL || 'http://localhost:5173',
  'http://localhost:3000',
  'http://127.0.0.1:5173'
];

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps, curl, postman)
    if (!origin || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    // In development mode, allow localhost variants
    if (process.env.NODE_ENV === 'development') {
      return callback(null, true);
    }
    return callback(new Error(`Origin ${origin} not allowed by CORS`));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'x-dev-uid']
}));

// 2. Request Parsers (Preserving req.rawBody for WhatsApp HMAC verification)
app.use(express.json({
  verify: (req, res, buf) => {
    req.rawBody = buf;
  }
}));
app.use(express.urlencoded({ extended: true }));

// 3. Health-Check Endpoints
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'CropKart backend is running'
  });
});

// Also support /api/health
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'CropKart backend is running',
    timestamp: new Date().toISOString()
  });
});

// 4. API Routes
app.use('/api/auth', authRoutes);
app.use('/api/listings', listingRoutes);
app.use('/api/whatsapp', whatsappRoutes);

// Root Index Route
app.get('/', (req, res) => {
  res.status(200).json({
    name: 'CropKart Agricultural Marketplace API',
    version: '1.0.0',
    documentation: '/docs',
    endpoints: {
      health: 'GET /health',
      listings: 'GET /api/listings',
      singleListing: 'GET /api/listings/:id',
      authMe: 'GET /api/auth/me (Protected)',
      authProfile: 'POST /api/auth/profile (Protected)',
      whatsappWebhookGet: 'GET /api/whatsapp/webhook (Meta verification)',
      whatsappWebhookPost: 'POST /api/whatsapp/webhook (Meta events)',
      whatsappSimulate: 'POST /api/whatsapp/test-simulate (Local testing)'
    }
  });
});

// 5. 404 Route Handler
app.use((req, res) => {
  res.status(404).json({
    error: 'Not Found',
    message: `Cannot ${req.method} ${req.originalUrl}`
  });
});

// 6. Centralized Error Handling Middleware
app.use((err, req, res, next) => {
  console.error('[App Error Handler]:', err.stack || err.message);
  res.status(err.status || 500).json({
    error: err.name || 'InternalServerError',
    message: err.message || 'An unexpected server error occurred.'
  });
});

export default app;
