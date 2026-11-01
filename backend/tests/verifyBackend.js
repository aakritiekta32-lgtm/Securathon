import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../.env') });

import assert from 'assert';
import http from 'http';
import app from '../src/app.js';
import {
  normalizePhoneNumber,
  parseFarmerCropMessage,
  validateCropDetails,
  detectCropCategory
} from '../src/utils/validators.js';
import {
  processFarmerIncomingMessage,
  getConversationState,
  isDuplicateWebhookEvent
} from '../src/services/whatsappFlowService.js';
import { getInMemoryStore } from '../src/config/firebaseAdmin.js';

async function runTests() {
  console.log('--- STARTING CROPKART BACKEND AUTOMATED TEST SUITE ---\n');

  // TEST 1: Phone Normalization
  console.log('1. Testing Phone Normalization...');
  assert.strictEqual(normalizePhoneNumber('9821055432'), '919821055432');
  assert.strictEqual(normalizePhoneNumber('+91 98210 55432'), '919821055432');
  assert.strictEqual(normalizePhoneNumber('09821055432'), '919821055432');
  console.log('✔ Phone normalization passed.');

  // TEST 2: Multi-line Message Parser & Validation
  console.log('\n2. Testing Message Parser & Validation...');
  const sampleMessage = `
NAME: Ramesh Kumar
CROP: Wheat
QUANTITY: 50
UNIT: kg
PRICE: 25
LOCATION: Sabour, Bhagalpur
  `;
  const parsed = parseFarmerCropMessage(sampleMessage);
  assert.strictEqual(parsed.isValid, true, 'Valid message should parse successfully');
  assert.strictEqual(parsed.data.name, 'Ramesh Kumar');
  assert.strictEqual(parsed.data.crop, 'Wheat');
  assert.strictEqual(parsed.data.quantity, 50);
  assert.strictEqual(parsed.data.unit, 'kg');
  assert.strictEqual(parsed.data.price, 25);
  assert.strictEqual(parsed.data.location, 'Sabour, Bhagalpur');
  console.log('✔ Valid message parsing passed.');

  // TEST 3: Invalid details (negative price, unsupported unit)
  console.log('\n3. Testing Validation with Invalid Inputs...');
  const invalidMessage = `
NAME: Ramesh Kumar
CROP: Wheat
QUANTITY: -10
UNIT: bottles
PRICE: -5
LOCATION: Sabour
  `;
  const invalidResult = parseFarmerCropMessage(invalidMessage);
  assert.strictEqual(invalidResult.isValid, false);
  assert.ok(invalidResult.errors.some(e => e.includes('QUANTITY')));
  assert.ok(invalidResult.errors.some(e => e.includes('PRICE')));
  assert.ok(invalidResult.errors.some(e => e.includes('UNIT')));
  console.log('✔ Invalid inputs correctly caught and rejected.');

  // TEST 4: Category Detection
  console.log('\n4. Testing Category Detection...');
  assert.strictEqual(detectCropCategory('Wheat'), 'Grains');
  assert.strictEqual(detectCropCategory('Tomato'), 'Vegetables');
  assert.strictEqual(detectCropCategory('Mango'), 'Fruits');
  console.log('✔ Category detection passed.');

  // TEST 5: WhatsApp Bot Conversation Flow (HI -> Details -> YES)
  console.log('\n5. Testing Complete WhatsApp Registration State Machine...');
  const testPhone = '919999988888';

  // Step 5a: Farmer sends HI
  const step1 = await processFarmerIncomingMessage(testPhone, 'HI', 'msg-1');
  assert.strictEqual(step1.status, 'welcomed');
  let state = await getConversationState(testPhone);
  assert.strictEqual(state.state, 'AWAITING_DETAILS');

  // Step 5b: Farmer sends crop details
  const step2 = await processFarmerIncomingMessage(testPhone, sampleMessage, 'msg-2');
  assert.strictEqual(step2.status, 'awaiting_confirmation');
  state = await getConversationState(testPhone);
  assert.strictEqual(state.state, 'AWAITING_CONFIRMATION');
  assert.strictEqual(state.pendingListing.crop, 'Wheat');

  // Step 5c: Farmer confirms with YES
  const step3 = await processFarmerIncomingMessage(testPhone, 'YES', 'msg-3');
  assert.strictEqual(step3.status, 'listing_published');
  state = await getConversationState(testPhone);
  assert.strictEqual(state.state, 'IDLE');
  assert.strictEqual(state.pendingListing, null);

  const store = getInMemoryStore();
  const publishedListing = Array.from(store.cropListings.values()).find(l => l.farmerPhone === testPhone);
  assert.ok(publishedListing, 'Listing must be stored upon YES');
  assert.strictEqual(publishedListing.status, 'available');
  assert.strictEqual(publishedListing.crop, 'Wheat');
  console.log('✔ End-to-end conversation flow (HI -> Details -> YES) successfully published listing!');

  // TEST 6: WhatsApp Flow Cancellation with NO
  console.log('\n6. Testing Cancellation with NO...');
  const testPhone2 = '919999977777';
  await processFarmerIncomingMessage(testPhone2, 'HI', 'msg-4');
  await processFarmerIncomingMessage(testPhone2, sampleMessage, 'msg-5');
  const cancelStep = await processFarmerIncomingMessage(testPhone2, 'NO', 'msg-6');
  assert.strictEqual(cancelStep.status, 'listing_cancelled');
  const state2 = await getConversationState(testPhone2);
  assert.strictEqual(state2.state, 'IDLE');
  console.log('✔ Cancellation flow passed.');

  // TEST 7: Duplicate Webhook Event Protection
  console.log('\n7. Testing Duplicate Webhook Handling...');
  const isFirst = await isDuplicateWebhookEvent('unique-meta-id-123');
  assert.strictEqual(isFirst, false, 'First occurrence should not be duplicate');
  const isSecond = await isDuplicateWebhookEvent('unique-meta-id-123');
  assert.strictEqual(isSecond, true, 'Second occurrence must be detected as duplicate');
  console.log('✔ Duplicate webhook deduplication passed.');

  // TEST 8: HTTP Server Endpoints
  console.log('\n8. Testing HTTP API Endpoints...');
  const server = http.createServer(app);
  await new Promise((resolve) => server.listen(5099, resolve));

  try {
    // 8a: Health endpoint
    const healthRes = await fetch('http://localhost:5099/health');
    const healthJson = await healthRes.json();
    assert.strictEqual(healthRes.status, 200);
    assert.strictEqual(healthJson.status, 'success');
    assert.strictEqual(healthJson.message, 'CropKart backend is running');
    console.log('✔ Health endpoint /health verified.');

    // 8b: Listings endpoint
    const listingsRes = await fetch('http://localhost:5099/api/listings');
    const listingsJson = await listingsRes.json();
    assert.strictEqual(listingsRes.status, 200);
    assert.strictEqual(listingsJson.success, true);
    assert.ok(listingsJson.data.length > 0);
    console.log(`✔ Listings endpoint /api/listings verified (Count: ${listingsJson.count}).`);

    // 8c: Filter listings by crop
    const filterRes = await fetch('http://localhost:5099/api/listings?crop=wheat');
    const filterJson = await filterRes.json();
    assert.strictEqual(filterRes.status, 200);
    assert.ok(filterJson.data.every(l => l.crop.toLowerCase().includes('wheat') || l.name.toLowerCase().includes('wheat')));
    console.log('✔ Crop filtering /api/listings?crop=wheat verified.');

    // 8d: Meta Webhook GET Verification
    const expectedVerifyToken = process.env.META_VERIFY_TOKEN || 'cropkart_securathon_verify_token_2026';
    const webhookVerifyRes = await fetch(`http://localhost:5099/api/whatsapp/webhook?hub.mode=subscribe&hub.verify_token=${expectedVerifyToken}&hub.challenge=CHALLENGE_ACCEPTED_999`);
    const challengeText = await webhookVerifyRes.text();
    assert.strictEqual(webhookVerifyRes.status, 200);
    assert.strictEqual(challengeText, 'CHALLENGE_ACCEPTED_999');
    console.log('✔ Meta Webhook GET challenge verification verified.');

    // 8e: Test Simulator Endpoint
    const simRes = await fetch('http://localhost:5099/api/whatsapp/test-simulate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ from: '919876543210', text: 'HI' })
    });
    const simJson = await simRes.json();
    assert.strictEqual(simRes.status, 200);
    assert.strictEqual(simJson.success, true);
    console.log('✔ WhatsApp Simulator /api/whatsapp/test-simulate verified.');

  } finally {
    await new Promise((resolve) => server.close(resolve));
  }

  console.log('\n======================================================');
  console.log('🎉 ALL 8 TEST SUITES COMPLETED WITH 100% PASS RATE!');
  console.log('======================================================\n');
}

runTests().catch(err => {
  console.error('❌ Test failed:', err);
  process.exit(1);
});
