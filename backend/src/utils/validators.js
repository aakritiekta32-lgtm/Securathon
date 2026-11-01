/**
 * CropKart Validation & Formatting Utilities
 */

export const SUPPORTED_UNITS = [
  'kg',
  'quintal',
  'ton',
  'tonne',
  'litre',
  'liter',
  'piece',
  'pieces',
  'bag',
  'bags'
];

/**
 * Normalizes phone numbers to standard international format (E.164 without plus, or with country code).
 * Example: '98210 55432' -> '919821055432'
 */
export function normalizePhoneNumber(rawPhone) {
  if (!rawPhone) return '';
  const cleaned = String(rawPhone).replace(/\D/g, '');
  
  // If 10 digits (Standard Indian mobile), prepend 91
  if (cleaned.length === 10) {
    return `91${cleaned}`;
  }
  // If 11 digits starting with 0, replace leading 0 with 91
  if (cleaned.length === 11 && cleaned.startsWith('0')) {
    return `91${cleaned.slice(1)}`;
  }
  
  return cleaned;
}

/**
 * Masks phone numbers to protect farmer/user privacy on public APIs.
 * Example: '919821055432' -> '+91 98*** **432'
 */
export function maskPhoneNumber(phone) {
  if (!phone) return 'Confidential';
  const digits = String(phone).replace(/\D/g, '');
  if (digits.length >= 10) {
    const start = digits.slice(0, 4);
    const end = digits.slice(-3);
    return `+${start}*** **${end}`;
  }
  return 'Confidential';
}

/**
 * Parses a single multi-line WhatsApp message sent by a farmer.
 * Format:
 * NAME: Ramesh Kumar
 * CROP: Wheat
 * QUANTITY: 50
 * UNIT: kg
 * PRICE: 25
 * LOCATION: Sabour, Bhagalpur
 */
export function parseFarmerCropMessage(text) {
  if (!text || typeof text !== 'string') {
    return {
      isValid: false,
      data: null,
      errors: ['No message content received']
    };
  }

  const nameMatch = text.match(/(?:NAME|Name|name)\s*[:=-]\s*([^\r\n]+)/i);
  const cropMatch = text.match(/(?:CROP|Crop|crop)\s*[:=-]\s*([^\r\n]+)/i);
  const quantityMatch = text.match(/(?:QUANTITY|Quantity|quantity|QTY|Qty|qty)\s*[:=-]\s*([^\r\n]+)/i);
  const unitMatch = text.match(/(?:UNIT|Unit|unit)\s*[:=-]\s*([^\r\n]+)/i);
  const priceMatch = text.match(/(?:PRICE|Price|price|RATE|Rate|rate)\s*[:=-]\s*([^\r\n]+)/i);
  const locationMatch = text.match(/(?:LOCATION|Location|location|PLACE|Place|place)\s*[:=-]\s*([^\r\n]+)/i);

  const rawData = {
    name: nameMatch ? nameMatch[1].trim() : null,
    crop: cropMatch ? cropMatch[1].trim() : null,
    quantity: quantityMatch ? quantityMatch[1].trim() : null,
    unit: unitMatch ? unitMatch[1].trim() : null,
    price: priceMatch ? priceMatch[1].trim() : null,
    location: locationMatch ? locationMatch[1].trim() : null
  };

  return validateCropDetails(rawData);
}

/**
 * Validates parsed crop details.
 */
export function validateCropDetails(data) {
  const errors = [];

  if (!data) {
    return { isValid: false, data: null, errors: ['Missing crop details data'] };
  }

  // 1. Name validation
  if (!data.name || data.name.trim().length < 2) {
    errors.push('NAME is missing or too short. Please provide your full name.');
  }

  // 2. Crop validation
  if (!data.crop || data.crop.trim().length < 2) {
    errors.push('CROP name is missing or too short.');
  }

  // 3. Quantity validation
  let parsedQuantity = null;
  if (!data.quantity) {
    errors.push('QUANTITY is missing.');
  } else {
    const rawQty = String(data.quantity).trim();
    if (rawQty.includes('-')) {
      errors.push('QUANTITY must be a valid positive number greater than 0.');
    } else {
      const cleanedQty = rawQty.replace(/[^\d.]/g, '');
      parsedQuantity = parseFloat(cleanedQty);
      if (isNaN(parsedQuantity) || parsedQuantity <= 0) {
        errors.push('QUANTITY must be a valid positive number greater than 0.');
      }
    }
  }

  // 4. Unit validation
  let normalizedUnit = null;
  if (!data.unit) {
    errors.push(`UNIT is missing. Supported units: kg, quintal, ton, litre, piece, bag.`);
  } else {
    const rawUnit = data.unit.toLowerCase().trim();
    if (!SUPPORTED_UNITS.includes(rawUnit)) {
      errors.push(`UNIT '${data.unit}' is not supported. Please use one of: kg, quintal, ton, litre, piece, bag.`);
    } else {
      // Normalize synonyms
      if (rawUnit === 'tonne') normalizedUnit = 'ton';
      else if (rawUnit === 'liter') normalizedUnit = 'litre';
      else if (rawUnit === 'pieces') normalizedUnit = 'piece';
      else if (rawUnit === 'bags') normalizedUnit = 'bag';
      else normalizedUnit = rawUnit;
    }
  }

  // 5. Price validation
  let parsedPrice = null;
  if (!data.price) {
    errors.push('PRICE is missing.');
  } else {
    const rawPrice = String(data.price).trim();
    if (rawPrice.includes('-')) {
      errors.push('PRICE must be a valid positive number greater than 0.');
    } else {
      const cleanedPrice = rawPrice.replace(/[^\d.]/g, '');
      parsedPrice = parseFloat(cleanedPrice);
      if (isNaN(parsedPrice) || parsedPrice <= 0) {
        errors.push('PRICE must be a valid positive number greater than 0.');
      }
    }
  }

  // 6. Location validation
  if (!data.location || data.location.trim().length < 2) {
    errors.push('LOCATION is missing. Please provide village, district or city.');
  }

  const isValid = errors.length === 0;

  return {
    isValid,
    errors,
    data: isValid
      ? {
          name: data.name.trim(),
          crop: data.crop.trim(),
          quantity: parsedQuantity,
          unit: normalizedUnit,
          price: parsedPrice,
          location: data.location.trim()
        }
      : null
  };
}

/**
 * Detects the agricultural category of a crop for marketplace filtering.
 */
export function detectCropCategory(cropName) {
  if (!cropName) return 'Vegetables';
  const name = cropName.toLowerCase();

  const vegetables = [
    'tomato', 'potato', 'onion', 'cabbage', 'cauliflower', 'carrot', 
    'garlic', 'ginger', 'spinach', 'peas', 'pea', 'capsicum', 'pepper', 
    'chilli', 'chili', 'brinjal', 'eggplant', 'okra', 'ladyfinger', 
    'cucumber', 'pumpkin', 'gourd', 'radish', 'beetroot'
  ];

  const grains = [
    'wheat', 'rice', 'paddy', 'corn', 'maize', 'barley', 'millet', 
    'bajra', 'jowar', 'ragi', 'oats', 'gram', 'chana', 'dal', 
    'pulses', 'pulse', 'lentil', 'soybean', 'mustard'
  ];

  const fruits = [
    'apple', 'mango', 'banana', 'orange', 'grape', 'grapes', 'papaya', 
    'guava', 'pomegranate', 'watermelon', 'melon', 'pineapple', 
    'strawberry', 'coconut', 'lemon', 'lime', 'sweet lime'
  ];

  if (vegetables.some((v) => name.includes(v))) return 'Vegetables';
  if (grains.some((g) => name.includes(g))) return 'Grains';
  if (fruits.some((f) => name.includes(f))) return 'Fruits';

  return 'Vegetables';
}

/**
 * Pre-formatted response templates for WhatsApp Bot
 */
export function formatWelcomeMessage() {
  return `Welcome to CropKart! 🌾

We help farmers list their agricultural products
so customers can discover and purchase them.

To add your crop listing, please send your details
in the following format:

NAME: Your full name
CROP: Crop name
QUANTITY: Quantity
UNIT: kg / quintal / ton / litre / piece / bag
PRICE: Price per unit in rupees
LOCATION: Village, district

Example:

NAME: Ramesh Kumar
CROP: Wheat
QUANTITY: 50
UNIT: kg
PRICE: 25
LOCATION: Sabour, Bhagalpur

Please send all details in ONE message.`;
}

export function formatConfirmationMessage(data) {
  return `Please confirm your crop listing:

Name: ${data.name}
Crop: ${data.crop}
Quantity: ${data.quantity} ${data.unit}
Price: ₹${data.price} per ${data.unit}
Location: ${data.location}

Reply:

YES – Confirm and publish listing
NO – Cancel listing
EDIT – Send details again`;
}

export function formatSuccessMessage(cropName) {
  return `Your crop listing has been successfully published! 🎉

Your ${cropName} listing is now available on CropKart.

Thank you for using CropKart! 🌾`;
}

export function formatCancellationMessage() {
  return `Your crop listing has been cancelled. ❌

Whenever you are ready to add a new listing, just reply with HI. 🌾`;
}

export function formatEditPromptMessage() {
  return `No problem! Please send your updated crop details in the same format:

NAME: Your full name
CROP: Crop name
QUANTITY: Quantity
UNIT: kg / quintal / ton / litre / piece / bag
PRICE: Price per unit in rupees
LOCATION: Village, district`;
}

export function formatErrorMessage(errors) {
  return `⚠️ We could not process your listing due to the following issue(s):

• ${errors.join('\n• ')}

Please send all details again in ONE message:

NAME: Your full name
CROP: Crop name
QUANTITY: Quantity
UNIT: kg / quintal / ton / litre / piece / bag
PRICE: Price per unit in rupees
LOCATION: Village, district`;
}
