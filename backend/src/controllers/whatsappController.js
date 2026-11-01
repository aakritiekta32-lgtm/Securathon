import { verifyWebhookSignature } from '../services/whatsappService.js';
import { processFarmerIncomingMessage } from '../services/whatsappFlowService.js';

/**
 * GET /api/whatsapp/webhook
 * Meta Webhook verification handshake.
 * Meta calls this endpoint with hub.mode, hub.verify_token, hub.challenge.
 */
export function verifyWebhook(req, res) {
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];

  const expectedToken = process.env.META_VERIFY_TOKEN;

  if (mode && token) {
    if (mode === 'subscribe' && token === expectedToken) {
      console.log('[WhatsApp Webhook] Meta Webhook verified successfully!');
      return res.status(200).send(challenge);
    } else {
      console.warn('[WhatsApp Webhook] Verification token mismatch. Received:', token);
      return res.status(403).json({ error: 'Forbidden', message: 'Verification token mismatch' });
    }
  }

  return res.status(400).json({ error: 'Bad Request', message: 'Missing hub verification parameters' });
}

/**
 * POST /api/whatsapp/webhook
 * Handles incoming messages, delivery statuses, and events from Meta WhatsApp Cloud API.
 */
export async function handleIncomingMessage(req, res) {
  // 1. Immediately acknowledge event with 200 OK to prevent Meta retry loops
  res.status(200).send('EVENT_RECEIVED');

  // 2. Verify webhook signature if META_APP_SECRET is set
  const isSignatureValid = verifyWebhookSignature(req);
  if (!isSignatureValid) {
    console.error('[WhatsApp Webhook] Invalid signature from Meta. Discarding message.');
    return;
  }

  try {
    const body = req.body;

    if (body.object !== 'whatsapp_business_account') {
      return;
    }

    const entries = body.entry || [];
    for (const entry of entries) {
      const changes = entry.changes || [];
      for (const change of changes) {
        const value = change.value;
        if (!value) continue;

        // Process incoming user messages
        if (value.messages && value.messages.length > 0) {
          for (const message of value.messages) {
            const from = message.from;
            const messageId = message.id;

            if (message.type === 'text') {
              const text = message.text?.body;
              await processFarmerIncomingMessage(from, text, messageId);
            } else {
              console.log(`[WhatsApp Webhook] Received non-text message (${message.type}) from ${from}.`);
              await processFarmerIncomingMessage(from, 'HI', messageId);
            }
          }
        }

        // Process message delivery statuses (sent, delivered, read)
        if (value.statuses && value.statuses.length > 0) {
          for (const status of value.statuses) {
            // Status tracking (optional logging)
            // console.log(`[WhatsApp Webhook] Status update for ${status.id}: ${status.status}`);
          }
        }
      }
    }
  } catch (err) {
    console.error('[WhatsApp Webhook] Error processing incoming webhook payload:', err.message);
  }
}

/**
 * POST /api/whatsapp/test-simulate
 * Helper endpoint for local testing and debugging of the WhatsApp farmer flow
 * without needing an active Meta Cloud API or ngrok tunnel.
 */
export async function testSimulateMessage(req, res) {
  try {
    const { from = '919821055432', text = 'HI' } = req.body;
    const testId = `test-msg-${Date.now()}`;

    const result = await processFarmerIncomingMessage(from, text, testId);

    return res.status(200).json({
      success: true,
      message: 'Simulated WhatsApp message processed',
      input: { from, text, messageId: testId },
      result
    });
  } catch (err) {
    console.error('[WhatsApp Controller] testSimulateMessage error:', err.message);
    return res.status(500).json({ error: 'Internal Server Error', message: err.message });
  }
}
