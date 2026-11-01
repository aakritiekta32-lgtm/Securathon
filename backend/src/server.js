import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Explicitly load .env from backend root regardless of working directory
dotenv.config({ path: path.resolve(__dirname, '../.env') });

import app from './app.js';
import { initFirebaseAdmin } from './config/firebaseAdmin.js';

const PORT = process.env.PORT || 5000;
const NODE_ENV = process.env.NODE_ENV || 'development';

// Initialize Firebase Admin SDK
initFirebaseAdmin();

const server = app.listen(PORT, () => {
  console.log('\n======================================================');
  console.log(`🌾 CropKart Backend Server active`);
  console.log(`📡 Environment:  ${NODE_ENV}`);
  console.log(`🌐 Base URL:     http://localhost:${PORT}`);
  console.log(`🏥 Health Check: http://localhost:${PORT}/health`);
  console.log(`📦 Listings API: http://localhost:${PORT}/api/listings`);
  console.log(`💬 Meta Webhook: http://localhost:${PORT}/api/whatsapp/webhook`);
  console.log('======================================================\n');
});

// Graceful shutdown handling
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  server.close(() => {
    console.log('HTTP server closed');
  });
});

export default server;
