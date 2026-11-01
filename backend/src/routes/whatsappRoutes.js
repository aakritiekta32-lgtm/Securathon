import { Router } from 'express';
import {
  verifyWebhook,
  handleIncomingMessage,
  testSimulateMessage
} from '../controllers/whatsappController.js';

const router = Router();

// Meta WhatsApp Cloud API Webhook endpoints
router.get('/webhook', verifyWebhook);
router.post('/webhook', handleIncomingMessage);

// Local testing helper endpoint
router.post('/test-simulate', testSimulateMessage);

export default router;
