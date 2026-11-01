import crypto from 'crypto';
import { normalizePhoneNumber } from '../utils/validators.js';

/**
 * Sends a plain text message to a user via Meta WhatsApp Cloud API.
 * 
 * @param {string} to - Recipient phone number (e.g. 919821055432)
 * @param {string} messageText - Body of the message
 */
export async function sendWhatsAppMessage(to, messageText) {
  const normalizedTo = normalizePhoneNumber(to);
  const accessToken = process.env.WHATSAPP_ACCESS_TOKEN;
  const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;
  const apiVersion = process.env.META_GRAPH_API_VERSION || 'v20.0';

  const isConfigured = 
    accessToken && 
    phoneNumberId && 
    !accessToken.includes('your_') && 
    !phoneNumberId.includes('your_');

  if (!isConfigured) {
    console.log(`\n================== [WHATSAPP OUTGOING (SIMULATION)] ==================`);
    console.log(`To: +${normalizedTo}`);
    console.log(`Content:\n${messageText}`);
    console.log(`[Status]: Real Meta API dispatch skipped because WHATSAPP_ACCESS_TOKEN and WHATSAPP_PHONE_NUMBER_ID are not yet set in .env.`);
    console.log(`=======================================================================\n`);
    
    return {
      success: false,
      reason: 'CREDENTIALS_NOT_CONFIGURED',
      mockSent: true,
      recipient: normalizedTo,
      text: messageText
    };
  }

  const endpoint = `https://graph.facebook.com/${apiVersion}/${phoneNumberId}/messages`;

  const payload = {
    messaging_product: 'whatsapp',
    recipient_type: 'individual',
    to: normalizedTo,
    type: 'text',
    text: {
      preview_url: false,
      body: messageText
    }
  };

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    const data = await response.json().catch(() => ({}));

    if (response.ok) {
      console.log(`[WhatsApp Service] Message successfully sent to +${normalizedTo}. Message ID:`, data.messages?.[0]?.id);
      return { success: true, data };
    } else {
      console.error(`[WhatsApp Service] Meta Cloud API Error (${response.status}):`, JSON.stringify(data, null, 2));
      return {
        success: false,
        status: response.status,
        error: data.error || data
      };
    }
  } catch (error) {
    console.error('[WhatsApp Service] Network/Fetch Error sending WhatsApp message:', error.message);
    return { success: false, error: error.message };
  }
}

/**
 * Verifies the X-Hub-Signature-256 header sent by Meta Webhook.
 * 
 * @param {import('express').Request} req - Express request with req.rawBody
 * @returns {boolean} - True if signature is valid or if verification is bypassed in development
 */
export function verifyWebhookSignature(req) {
  const secret = process.env.META_APP_SECRET;

  // In development without configured app secret, log and allow
  if (!secret || secret.includes('your_')) {
    if (process.env.NODE_ENV === 'development') {
      return true;
    }
    console.warn('[WhatsApp Service] META_APP_SECRET is not configured. Webhook signature check failed.');
    return false;
  }

  const signature = req.headers['x-hub-signature-256'];
  if (!signature) {
    console.warn('[WhatsApp Service] Missing X-Hub-Signature-256 header.');
    return false;
  }

  if (!req.rawBody) {
    console.warn('[WhatsApp Service] Raw request body not preserved for signature verification.');
    return false;
  }

  try {
    const hmac = crypto.createHmac('sha256', secret);
    const expectedSignature = `sha256=${hmac.update(req.rawBody).digest('hex')}`;
    
    const sigBuffer = Buffer.from(signature, 'utf8');
    const expectedBuffer = Buffer.from(expectedSignature, 'utf8');

    if (sigBuffer.length !== expectedBuffer.length) {
      return false;
    }

    return crypto.timingSafeEqual(sigBuffer, expectedBuffer);
  } catch (err) {
    console.error('[WhatsApp Service] Signature verification error:', err.message);
    return false;
  }
}
