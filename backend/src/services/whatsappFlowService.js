import { getDb, isFirebaseInitialized, getInMemoryStore } from '../config/firebaseAdmin.js';
import {
  normalizePhoneNumber,
  parseFarmerCropMessage,
  detectCropCategory,
  formatWelcomeMessage,
  formatConfirmationMessage,
  formatSuccessMessage,
  formatCancellationMessage,
  formatEditPromptMessage,
  formatErrorMessage
} from '../utils/validators.js';
import { sendWhatsAppMessage } from './whatsappService.js';

/**
 * Checks and records webhook message ID to prevent duplicate event processing.
 * 
 * @param {string} messageId 
 * @returns {Promise<boolean>} True if duplicate, false if new
 */
export async function isDuplicateWebhookEvent(messageId) {
  if (!messageId) return false;

  const db = getDb();
  if (isFirebaseInitialized() && db) {
    try {
      const eventDoc = await db.collection('webhookEvents').doc(messageId).get();
      if (eventDoc.exists) {
        return true;
      }
      // Record event
      await db.collection('webhookEvents').doc(messageId).set({
        processedAt: new Date().toISOString(),
        messageId
      });
      return false;
    } catch (err) {
      console.error('[WhatsApp Flow] Firestore error checking duplicate webhook:', err.message);
    }
  }

  // Fallback to in-memory store
  const store = getInMemoryStore();
  if (store.webhookEvents.has(messageId)) {
    return true;
  }
  store.webhookEvents.add(messageId);
  return false;
}

/**
 * Retrieves the current conversation state for a farmer phone number.
 */
export async function getConversationState(phoneNumber) {
  const db = getDb();
  if (isFirebaseInitialized() && db) {
    try {
      const doc = await db.collection('conversations').doc(phoneNumber).get();
      if (doc.exists) {
        return doc.data();
      }
    } catch (err) {
      console.error('[WhatsApp Flow] Error reading conversation state from Firestore:', err.message);
    }
  }

  const store = getInMemoryStore();
  return store.conversations.get(phoneNumber) || {
    phoneNumber,
    state: 'IDLE',
    pendingListing: null,
    updatedAt: new Date().toISOString()
  };
}

/**
 * Persists the updated conversation state.
 */
export async function saveConversationState(phoneNumber, conversationData) {
  const updatedData = {
    ...conversationData,
    phoneNumber,
    updatedAt: new Date().toISOString()
  };

  const db = getDb();
  if (isFirebaseInitialized() && db) {
    try {
      await db.collection('conversations').doc(phoneNumber).set(updatedData, { merge: true });
    } catch (err) {
      console.error('[WhatsApp Flow] Error saving conversation state to Firestore:', err.message);
    }
  }

  const store = getInMemoryStore();
  store.conversations.set(phoneNumber, updatedData);
  return updatedData;
}

/**
 * Saves a confirmed crop listing to Firestore.
 */
export async function saveConfirmedListing(phoneNumber, pendingListing) {
  const listingId = `crop-wa-${Date.now()}`;
  const category = detectCropCategory(pendingListing.crop);
  const now = new Date().toISOString();

  const listingDocument = {
    id: listingId,
    farmerName: pendingListing.name,
    farmerPhone: phoneNumber,
    crop: pendingListing.crop,
    category,
    quantity: pendingListing.quantity,
    unit: pendingListing.unit,
    price: pendingListing.price,
    // Fields matching CropKart frontend specifications
    name: pendingListing.crop,
    basePrice: pendingListing.price,
    totalStock: pendingListing.quantity,
    location: pendingListing.location,
    status: 'available',
    source: 'whatsapp',
    createdAt: now,
    updatedAt: now
  };

  const db = getDb();
  if (isFirebaseInitialized() && db) {
    try {
      await db.collection('cropListings').doc(listingId).set(listingDocument);

      // Upsert farmer profile in farmers/ collection
      await db.collection('farmers').doc(phoneNumber).set({
        phone: phoneNumber,
        name: pendingListing.name,
        location: pendingListing.location,
        lastActive: now
      }, { merge: true });

      console.log(`[WhatsApp Flow] Successfully saved listing ${listingId} to Firestore.`);
    } catch (err) {
      console.error('[WhatsApp Flow] Error writing listing to Firestore:', err.message);
    }
  }

  // Also save to in-memory store so it is immediately visible via marketplace API
  const store = getInMemoryStore();
  store.cropListings.set(listingId, listingDocument);
  store.farmers.set(phoneNumber, {
    phone: phoneNumber,
    name: pendingListing.name,
    location: pendingListing.location,
    lastActive: now
  });

  return listingDocument;
}

/**
 * Core WhatsApp Farmer Registration State Machine.
 * Handles the complete conversation workflow:
 * 1. HI -> Welcome & instructions
 * 2. Send details -> Parse, validate, and ask for confirmation
 * 3. YES -> Publish to Firestore, send congratulations
 * 4. NO -> Cancel listing
 * 5. EDIT -> Ask to resend
 */
export async function processFarmerIncomingMessage(rawFrom, messageText, messageId) {
  const phoneNumber = normalizePhoneNumber(rawFrom);
  const text = (messageText || '').trim();
  const upperText = text.toUpperCase();

  console.log(`[WhatsApp Flow] Incoming message from +${phoneNumber} (ID: ${messageId || 'N/A'}): "${text}"`);

  // 1. Duplicate event protection
  if (messageId) {
    const isDuplicate = await isDuplicateWebhookEvent(messageId);
    if (isDuplicate) {
      console.log(`[WhatsApp Flow] Skipping duplicate webhook message: ${messageId}`);
      return { status: 'duplicate_ignored' };
    }
  }

  // 2. Fetch current conversation state
  const conversation = await getConversationState(phoneNumber);
  console.log(`[WhatsApp Flow] Current state for +${phoneNumber}: ${conversation.state}`);

  // 3. Check for Global Reset Commands (HI, HELLO, START, RESET)
  const isGreeting = ['HI', 'HELLO', 'START', 'NAMASTE', 'RESET', 'HEY'].includes(upperText);
  if (isGreeting) {
    await saveConversationState(phoneNumber, {
      state: 'AWAITING_DETAILS',
      pendingListing: null
    });
    await sendWhatsAppMessage(phoneNumber, formatWelcomeMessage());
    return { status: 'welcomed' };
  }

  // 4. Handle State: AWAITING_CONFIRMATION
  if (conversation.state === 'AWAITING_CONFIRMATION') {
    if (upperText === 'YES' || upperText === 'CONFIRM' || upperText === 'HAAN') {
      if (!conversation.pendingListing) {
        await saveConversationState(phoneNumber, { state: 'IDLE', pendingListing: null });
        await sendWhatsAppMessage(phoneNumber, 'No pending listing found. Please send HI to start fresh.');
        return { status: 'error_no_pending' };
      }

      // Publish the listing to Firestore!
      const saved = await saveConfirmedListing(phoneNumber, conversation.pendingListing);

      // Reset state to IDLE
      await saveConversationState(phoneNumber, { state: 'IDLE', pendingListing: null });

      // Send congratulations message
      await sendWhatsAppMessage(phoneNumber, formatSuccessMessage(saved.crop));
      return { status: 'listing_published', listingId: saved.id };
    }

    if (upperText === 'NO' || upperText === 'CANCEL' || upperText === 'NAHI') {
      await saveConversationState(phoneNumber, { state: 'IDLE', pendingListing: null });
      await sendWhatsAppMessage(phoneNumber, formatCancellationMessage());
      return { status: 'listing_cancelled' };
    }

    if (upperText === 'EDIT' || upperText === 'CHANGE') {
      await saveConversationState(phoneNumber, { state: 'AWAITING_DETAILS', pendingListing: null });
      await sendWhatsAppMessage(phoneNumber, formatEditPromptMessage());
      return { status: 'awaiting_edit' };
    }

    // Unexpected response while awaiting confirmation
    const reminderMsg = `Please reply with one of the following options:

YES – Confirm and publish listing
NO – Cancel listing
EDIT – Send details again

Or send HI to start from the beginning.`;
    await sendWhatsAppMessage(phoneNumber, reminderMsg);
    return { status: 'prompted_confirmation' };
  }

  // 5. Handle State: AWAITING_DETAILS or Direct Details Message
  // Check if message format contains key attributes (NAME: or CROP:)
  const containsDetailsPattern = /(?:NAME|CROP)\s*[:=-]/i.test(text);

  if (conversation.state === 'AWAITING_DETAILS' || containsDetailsPattern) {
    const parseResult = parseFarmerCropMessage(text);

    if (!parseResult.isValid) {
      console.log(`[WhatsApp Flow] Validation errors for +${phoneNumber}:`, parseResult.errors);
      await saveConversationState(phoneNumber, { state: 'AWAITING_DETAILS', pendingListing: null });
      await sendWhatsAppMessage(phoneNumber, formatErrorMessage(parseResult.errors));
      return { status: 'validation_failed', errors: parseResult.errors };
    }

    // Details are valid! Put into AWAITING_CONFIRMATION
    await saveConversationState(phoneNumber, {
      state: 'AWAITING_CONFIRMATION',
      pendingListing: parseResult.data
    });

    await sendWhatsAppMessage(phoneNumber, formatConfirmationMessage(parseResult.data));
    return { status: 'awaiting_confirmation', pendingListing: parseResult.data };
  }

  // 6. Default / Unknown message in IDLE state
  await saveConversationState(phoneNumber, { state: 'AWAITING_DETAILS', pendingListing: null });
  await sendWhatsAppMessage(phoneNumber, formatWelcomeMessage());
  return { status: 'welcomed' };
}
