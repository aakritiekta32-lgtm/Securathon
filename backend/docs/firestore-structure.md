# Cloud Firestore Data Architecture & Schema – CropKart

This document defines the schema, indexing strategy, and data flow for the **CropKart** agricultural marketplace on Google Cloud Firestore (Project ID: `securathon-d8800`).

---

## 1. Collections Overview

| Collection Name | Document ID Pattern | Purpose |
|-----------------|---------------------|---------|
| `users` | `{firebaseUid}` | Stores user accounts (wholesalers, buyers, farmers) authenticated via Firebase Auth |
| `farmers` | `{normalizedPhoneNumber}` | Farmer registry keyed by E.164 phone number |
| `cropListings` | `crop-wa-{timestamp}` or `{uuid}` | Agricultural crop listings available for wholesale procurement |
| `conversations` | `{normalizedPhoneNumber}` | Active state machine sessions for the WhatsApp registration bot |
| `webhookEvents` | `{metaMessageId}` | Deduplication ledger to prevent processing duplicate Meta webhook deliveries |

---

## 2. Collection Details & Schemas

### 2.1 `users` Collection
Stores registered portal users. Documents are keyed by the user's verified Firebase Authentication UID.

```json
{
  "uid": "tQ98dfg3489jfwef98",
  "name": "Vikas Agarwal",
  "email": "vikas@agrotraders.in",
  "phone": "919821055432",
  "role": "wholesaler", // "wholesaler" | "farmer" | "consumer"
  "company": "Agarwal Agro Traders",
  "location": "APMC Market, Mumbai",
  "isVerified": true,
  "createdAt": "2026-11-01T04:30:00.000Z",
  "updatedAt": "2026-11-01T05:00:00.000Z"
}
```

### 2.2 `farmers` Collection
Stores farmer profiles compiled from WhatsApp registration and portal onboarding. Keyed by normalized international phone number (e.g., `919821055432`).

```json
{
  "phone": "919821055432",
  "name": "Ramesh Kumar",
  "location": "Sabour, Bhagalpur",
  "state": "Bihar",
  "lastActive": "2026-11-01T05:15:00.000Z",
  "totalListings": 4,
  "rating": 4.9,
  "createdAt": "2026-11-01T02:00:00.000Z"
}
```

### 2.3 `cropListings` Collection
Stores active wholesale crop offerings posted either by farmers via WhatsApp bot or web portal.

```json
{
  "id": "crop-wa-1730420000000",
  "farmerName": "Ramesh Kumar",
  "farmerPhone": "919821055432",
  "crop": "Wheat",
  "name": "Wheat",
  "category": "Grains", // "Vegetables" | "Grains" | "Fruits"
  "quantity": 50,
  "unit": "kg", // "kg" | "quintal" | "ton" | "litre" | "piece" | "bag"
  "price": 25,
  "basePrice": 25,
  "totalStock": 50,
  "location": "Sabour, Bhagalpur",
  "status": "available", // "available" | "reserved" | "sold" | "cancelled"
  "source": "whatsapp", // "whatsapp" | "web_portal"
  "qualityGrade": "Grade A",
  "createdAt": "2026-11-01T05:15:00.000Z",
  "updatedAt": "2026-11-01T05:15:00.000Z"
}
```

> **Privacy Note:** When serving `cropListings` through the public consumer API (`GET /api/listings`), `farmerPhone` is automatically masked (e.g. `+91 98*** **432`) to protect farmer privacy from scrapers.

### 2.4 `conversations` Collection
Tracks the live conversational state machine for farmers interacting with the Meta WhatsApp Cloud API bot.

```json
{
  "phoneNumber": "919821055432",
  "state": "AWAITING_CONFIRMATION", // "IDLE" | "AWAITING_DETAILS" | "AWAITING_CONFIRMATION"
  "pendingListing": {
    "name": "Ramesh Kumar",
    "crop": "Wheat",
    "quantity": 50,
    "unit": "kg",
    "price": 25,
    "location": "Sabour, Bhagalpur"
  },
  "updatedAt": "2026-11-01T05:14:30.000Z"
}
```

### 2.5 `webhookEvents` Collection
Deduplication ledger. When Meta retries or sends duplicate webhook payloads, the incoming message ID is verified against this collection.

```json
{
  "messageId": "wamid.HBgMOTE5ODIxMDU1NDMyFQIAEhgWM0VCMDM5Mjc0OEY0MTM1RkI0AA==",
  "processedAt": "2026-11-01T05:14:28.000Z"
}
```

---

## 3. Recommended Firestore Composite Indexes

For optimal query performance across high-volume marketplace filters, configure the following composite indexes in Firebase Console:

| Collection | Fields Indexed | Query Supported |
|------------|----------------|-----------------|
| `cropListings` | `status` (ASC), `category` (ASC), `createdAt` (DESC) | Filter by category with live sorting |
| `cropListings` | `status` (ASC), `createdAt` (DESC) | Recent available crops feed |
| `cropListings` | `farmerPhone` (ASC), `status` (ASC) | Farmer dashboard listings |
