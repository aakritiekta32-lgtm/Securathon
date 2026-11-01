# CropKart Backend Service 🌾

Production-ready Node.js & Express backend for **CropKart** – a direct farmer-to-consumer agricultural marketplace featuring **Firebase Authentication**, **Cloud Firestore**, and **Meta WhatsApp Cloud API** farmer onboarding.

---

## 1. Architecture & Folder Structure

```text
Securathon/
│
├── cropkart/                 # Existing React/Vite Frontend
│
└── backend/                  # Complete Backend Service
    ├── .env                  # Live environment variables (Ignored in Git)
    ├── .env.example          # Environment variables blueprint
    ├── .gitignore            # Git ignore rules (protects credentials & secrets)
    ├── package.json          # Node.js dependencies and scripts (ES Modules)
    ├── README.md             # Complete developer guide & API documentation
    ├── server.js             # Root entrypoint redirecting to src/server.js
    │
    ├── src/
    │   ├── app.js            # Express application setup, CORS, JSON, & routing
    │   ├── server.js         # HTTP server lifecycle & Firebase Admin initializer
    │   │
    │   ├── config/
    │   │   └── firebaseAdmin.js       # Firebase Admin SDK & Firestore initializer
    │   │
    │   ├── middleware/
    │   │   └── verifyFirebaseToken.js # Firebase ID token verification middleware
    │   │
    │   ├── controllers/
    │   │   ├── authController.js      # Authenticated user profiles (users/ collection)
    │   │   ├── listingController.js   # Consumer marketplace queries (cropListings/ collection)
    │   │   └── whatsappController.js  # Meta Webhook verification & incoming message handler
    │   │
    │   ├── routes/
    │   │   ├── authRoutes.js          # /api/auth routes
    │   │   ├── listingRoutes.js       # /api/listings routes
    │   │   └── whatsappRoutes.js      # /api/whatsapp routes
    │   │
    │   ├── services/
    │   │   ├── whatsappService.js     # Meta Graph API HTTP dispatch & HMAC-SHA256 verification
    │   │   └── whatsappFlowService.js # Conversational state machine & duplicate event ledger
    │   │
    │   └── utils/
    │       └── validators.js          # Multi-line message parser, units & price validators
    │
    └── docs/
        └── firestore-structure.md     # Firestore collections, indexes, and schemas
```

---

## 2. Required Software & Dependencies

- **Node.js**: v18.0.0 or higher (v20+ recommended).
- **npm**: v9.0.0 or higher.
- **Dependencies Installed**:
  - `express`: Robust web application framework.
  - `firebase-admin`: Official Firebase Admin SDK for Cloud Firestore and Firebase Auth.
  - `dotenv`: Environment variable loader.
  - `cors`: Cross-Origin Resource Sharing middleware for frontend integration.

---

## 3. Installation

Navigate to the `backend` directory and install dependencies:

```bash
cd backend
npm install
```

---

## 4. Configuring Firebase Admin Credentials

The backend connects to the existing Firebase project:
**Project ID:** `securathon-d8800`

### Step-by-Step Instructions:
1. Open the [Firebase Console](https://console.firebase.google.com/).
2. Select your project: **`securathon-d8800`**.
3. Click the gear icon ⚙️ next to **Project Overview** and select **Project settings**.
4. Navigate to the **Service accounts** tab.
5. Click **Generate new private key**, then click **Generate key**.
6. A JSON file will download (e.g. `securathon-d8800-firebase-adminsdk-xxxxx.json`).
7. Rename this file to:
   ```text
   serviceAccountKey.json
   ```
8. Move `serviceAccountKey.json` into the `Securathon/backend/` directory.
9. Verify that `.env` contains:
   ```env
   FIREBASE_PROJECT_ID=securathon-d8800
   FIREBASE_SERVICE_ACCOUNT_PATH=./serviceAccountKey.json
   ```

*(Note: If `serviceAccountKey.json` is not yet placed, the backend will safely run in development in-memory mode without crashing.)*

---

## 5. Configuring Meta WhatsApp Cloud API Credentials

1. Go to the [Meta for Developers Portal](https://developers.facebook.com/).
2. Open your App (or create a **Business** App with WhatsApp product enabled).
3. Under **WhatsApp** > **API Setup**:
   - Copy the **Temporary access token** (or create a System User Permanent Access Token).
   - Copy the **Phone number ID**.
4. Update your `backend/.env` file:
   ```env
   META_VERIFY_TOKEN=cropkart_securathon_verify_token_2026
   META_APP_SECRET=your_meta_app_secret_from_app_settings
   WHATSAPP_ACCESS_TOKEN=your_token_from_meta_dashboard
   WHATSAPP_PHONE_NUMBER_ID=your_phone_number_id_from_meta
   META_GRAPH_API_VERSION=v20.0
   ```

---

## 6. Starting the Backend

### Production Mode:
```bash
npm start
```

### Development Mode (with hot-reload using Node watch):
```bash
npm run dev
```

The server will start on port `5000`:
- **Server URL**: `http://localhost:5000`
- **Health Check**: `http://localhost:5000/health`

---

## 7. Testing APIs with Postman or Curl

### 7.1 Health Check API
```bash
curl http://localhost:5000/health
```
**Response:**
```json
{
  "status": "success",
  "message": "CropKart backend is running"
}
```

### 7.2 Get All Active Marketplace Listings
```bash
curl http://localhost:5000/api/listings
```

### 7.3 Filter Listings by Crop and Location
```bash
curl "http://localhost:5000/api/listings?crop=wheat&location=Bhagalpur"
```

### 7.4 Get Single Listing by ID
```bash
curl http://localhost:5000/api/listings/crop-wa-seed-1
```

### 7.5 Authenticated User Profile (Requires Firebase ID Token)
```bash
curl http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer <FIREBASE_ID_TOKEN>"
```

### 7.6 Simulate WhatsApp Bot Flow Locally (No ngrok or Meta needed for testing!)
You can test the entire farmer conversation flow using the built-in simulator endpoint:

**Step 1 – Farmer sends HI:**
```bash
curl -X POST http://localhost:5000/api/whatsapp/test-simulate \
  -H "Content-Type: application/json" \
  -d '{"from": "919821055432", "text": "HI"}'
```

**Step 2 – Farmer sends crop details:**
```bash
curl -X POST http://localhost:5000/api/whatsapp/test-simulate \
  -H "Content-Type: application/json" \
  -d '{
    "from": "919821055432",
    "text": "NAME: Ramesh Kumar\nCROP: Wheat\nQUANTITY: 50\nUNIT: kg\nPRICE: 25\nLOCATION: Sabour, Bhagalpur"
  }'
```

**Step 3 – Farmer confirms with YES:**
```bash
curl -X POST http://localhost:5000/api/whatsapp/test-simulate \
  -H "Content-Type: application/json" \
  -d '{"from": "919821055432", "text": "YES"}'
```

Check `http://localhost:5000/api/listings` immediately after — the new listing will appear in the marketplace!

---

## 8. Meta Webhook Configuration with ngrok

Meta requires a publicly accessible **HTTPS** URL to deliver WhatsApp webhook events.

### Step 1: Start ngrok tunnel
Open a separate terminal and run:
```bash
npx ngrok http 5000
```
ngrok will provide a public HTTPS URL, for example:
`https://abc1-23-45-67.ngrok-free.app`

### Step 2: Configure Webhook in Meta Dashboard
1. Go to **Meta App Dashboard** > **WhatsApp** > **Configuration**.
2. Click **Edit** next to **Webhook**.
3. Set **Callback URL** to:
   ```text
   https://<your-ngrok-domain>.ngrok-free.app/api/whatsapp/webhook
   ```
4. Set **Verify token** to:
   ```text
   cropkart_securathon_verify_token_2026
   ```
   *(Must match `META_VERIFY_TOKEN` in your `.env`)*
5. Click **Verify and Save**.
6. Under **Webhook fields**, click **Manage** and subscribe to **`messages`**.

---

## 9. Frontend Integration Guide (`cropkart`)

The frontend in `cropkart/` connects to this backend effortlessly:

1. **API Base URL**: `http://localhost:5000/api`
2. **Updating `cropkart/src/services/api.js`**:
   Replace the static mock products with a live fetch:
   ```javascript
   const API_BASE = 'http://localhost:5000/api';

   export const getProducts = async (filters = {}) => {
     const params = new URLSearchParams();
     if (filters.search) params.append('crop', filters.search);
     if (filters.category && filters.category !== 'All') params.append('category', filters.category);

     const res = await fetch(`${API_BASE}/listings?${params.toString()}`);
     const json = await res.json();
     return json.data || [];
   };
   ```
3. **Displaying WhatsApp-submitted farmer listings**:
   Each listing returned from `GET /api/listings` has:
   - `id`: unique ID
   - `name` / `crop`: crop name
   - `basePrice`: price in ₹
   - `unit`: unit of measure (e.g. `kg`)
   - `totalStock`: available quantity
   - `location`: farmer village/district
   - `farmerName`: registered farmer name
   - `farmerPhone`: privacy-masked phone (`+91 98*** **432`)
   - `source`: `'whatsapp'`
   - `status`: `'available'`

4. **Sending Firebase Auth Token**:
   When making requests to `/api/auth/me` or `/api/auth/profile`, retrieve the Firebase ID token from the frontend client SDK:
   ```javascript
   import { auth } from './firebase';

   const token = await auth.currentUser?.getIdToken();
   const response = await fetch('http://localhost:5000/api/auth/me', {
     headers: {
       'Authorization': `Bearer ${token}`
     }
   });
   ```

---

## 10. Common Errors & Troubleshooting

| Error | Root Cause | Solution |
|-------|------------|----------|
| `Missing hub verification parameters` | Visiting `/api/whatsapp/webhook` directly via browser without Meta query parameters | This is normal; Meta sends `hub.mode`, `hub.verify_token`, and `hub.challenge` automatically. |
| `Verification token mismatch (403)` | `META_VERIFY_TOKEN` in `.env` does not match the token entered in Meta Dashboard | Ensure both match exactly (e.g. `cropkart_securathon_verify_token_2026`). |
| `Service account file not found` | `serviceAccountKey.json` is missing from `backend/` directory | Download the private key from Firebase Console (`securathon-d8800`) and save it as `backend/serviceAccountKey.json`. |
| `CORS Error in browser` | Frontend is running on an origin not recognized | Set `FRONTEND_URL=http://localhost:5173` in `.env`. Localhost is auto-allowed in development. |
| `Meta API Error 400/401` | `WHATSAPP_ACCESS_TOKEN` is expired or `WHATSAPP_PHONE_NUMBER_ID` is incorrect | Refresh your temporary token or generate a permanent System User Token in Meta Business Manager. |
