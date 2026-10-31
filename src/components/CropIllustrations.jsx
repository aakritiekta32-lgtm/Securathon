import React from 'react';

export const CropIllustration = ({ type, size = 64 }) => {
  switch (type) {
    case 'tomato':
      return (
        <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
          <circle cx="32" cy="36" r="22" fill="#ef4444" />
          <ellipse cx="26" cy="30" rx="4" ry="7" fill="#f87171" opacity="0.6" />
          <path d="M32 14c-1 3-3 7-7 8 4-1 7 1 7 1s3-2 7-1c-4-1-6-5-7-8z" fill="#15803d" />
          <path d="M32 8c1 3 0 6 0 6" stroke="#166534" strokeWidth="3" strokeLinecap="round" />
        </svg>
      );
    case 'potato':
      return (
        <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
          <ellipse cx="32" cy="34" rx="24" ry="18" fill="#d97706" />
          <circle cx="24" cy="30" r="1.5" fill="#92400e" />
          <circle cx="38" cy="28" r="1.5" fill="#92400e" />
          <circle cx="34" cy="40" r="1.5" fill="#92400e" />
          <circle cx="44" cy="36" r="1.5" fill="#92400e" />
          <ellipse cx="26" cy="27" rx="8" ry="4" fill="#f59e0b" opacity="0.4" />
        </svg>
      );
    case 'onion':
      return (
        <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
          <path d="M32 14c-12 12-16 22-16 28 0 10 7 14 16 14s16-4 16-14c0-6-4-16-16-28z" fill="#9333ea" />
          <path d="M32 14c-6 12-8 22-8 28 0 8 3 14 8 14s8-6 8-14c0-6-2-16-8-28z" fill="#a855f7" />
          <path d="M32 10v4" stroke="#15803d" strokeWidth="3" strokeLinecap="round" />
          <path d="M30 8l4 6" stroke="#16a34a" strokeWidth="2" strokeLinecap="round" />
        </svg>
      );
    case 'wheat':
      return (
        <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
          <path d="M32 54V14" stroke="#ca8a04" strokeWidth="3" strokeLinecap="round" />
          <ellipse cx="27" cy="22" rx="4" ry="7" transform="rotate(-30 27 22)" fill="#eab308" />
          <ellipse cx="37" cy="22" rx="4" ry="7" transform="rotate(30 37 22)" fill="#eab308" />
          <ellipse cx="27" cy="32" rx="4" ry="7" transform="rotate(-30 27 32)" fill="#eab308" />
          <ellipse cx="37" cy="32" rx="4" ry="7" transform="rotate(30 37 32)" fill="#eab308" />
          <ellipse cx="27" cy="42" rx="4" ry="7" transform="rotate(-30 27 42)" fill="#eab308" />
          <ellipse cx="37" cy="42" rx="4" ry="7" transform="rotate(30 37 42)" fill="#eab308" />
          <ellipse cx="32" cy="14" rx="3.5" ry="6" fill="#facc15" />
        </svg>
      );
    case 'rice':
      return (
        <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
          <path d="M16 48c12-4 22-16 28-32" stroke="#65a30d" strokeWidth="3" strokeLinecap="round" />
          <ellipse cx="38" cy="22" rx="3.5" ry="7" transform="rotate(40 38 22)" fill="#fef08a" stroke="#ca8a04" strokeWidth="1" />
          <ellipse cx="44" cy="28" rx="3.5" ry="7" transform="rotate(45 44 28)" fill="#fef08a" stroke="#ca8a04" strokeWidth="1" />
          <ellipse cx="32" cy="30" rx="3.5" ry="7" transform="rotate(35 32 30)" fill="#fef08a" stroke="#ca8a04" strokeWidth="1" />
          <ellipse cx="26" cy="38" rx="3.5" ry="7" transform="rotate(30 26 38)" fill="#fef08a" stroke="#ca8a04" strokeWidth="1" />
        </svg>
      );
    case 'cauliflower':
      return (
        <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
          <ellipse cx="32" cy="34" rx="18" ry="15" fill="#f8fafc" stroke="#e2e8f0" strokeWidth="2" />
          <circle cx="26" cy="30" r="7" fill="#f1f5f9" />
          <circle cx="38" cy="30" r="7" fill="#f1f5f9" />
          <circle cx="32" cy="24" r="7" fill="#ffffff" />
          <path d="M14 42c6-2 12 6 18 6 6 0 12-8 18-6-4 8-12 12-18 12s-14-4-18-12z" fill="#22c55e" />
          <path d="M12 36c4 4 10 2 12-2-4-2-8 0-12 2z" fill="#16a34a" />
          <path d="M52 36c-4 4-10 2-12-2 4-2 8 0 12 2z" fill="#16a34a" />
        </svg>
      );
    case 'cabbage':
      return (
        <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
          <circle cx="32" cy="34" r="20" fill="#4ade80" />
          <path d="M22 22c8 4 12 14 10 24" stroke="#16a34a" strokeWidth="3" strokeLinecap="round" />
          <path d="M42 22c-8 4-12 14-10 24" stroke="#16a34a" strokeWidth="3" strokeLinecap="round" />
          <path d="M32 18v32" stroke="#15803d" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
      );
    case 'apple':
      return (
        <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
          <path d="M32 20c-4-4-14-4-18 3s-2 19 6 25c6 5 10 2 12 0 2 2 6 5 12 0 8-6 10-18 6-25s-14-7-18-3z" fill="#dc2626" />
          <path d="M32 12c1 4-1 8-1 8" stroke="#78350f" strokeWidth="3" strokeLinecap="round" />
          <path d="M32 14c4-3 9-2 11 1-3 3-8 1-11-1z" fill="#22c55e" />
          <ellipse cx="24" cy="28" rx="3" ry="6" fill="#f87171" opacity="0.6" />
        </svg>
      );
    case 'banana':
      return (
        <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
          <path d="M18 46c10 8 26 4 34-16 2-5 3-12 2-16-4 2-8 7-10 11-6 10-14 15-26 21z" fill="#facc15" />
          <path d="M52 14c2-2 4-2 4-2l-2 4" stroke="#854d0e" strokeWidth="3" strokeLinecap="round" />
          <path d="M18 46c-2 2-4 3-4 3" stroke="#854d0e" strokeWidth="3" strokeLinecap="round" />
        </svg>
      );
    case 'chilli':
      return (
        <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
          <path d="M48 16c-10 6-22 18-26 32-1 4-3 6-4 6 0-3 2-8 5-14 6-12 16-22 25-24z" fill="#16a34a" />
          <path d="M48 16c2-4 5-6 7-6-1 3-3 5-7 6z" fill="#15803d" />
        </svg>
      );
    case 'mango':
      return (
        <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
          <path d="M32 14c-12 4-18 16-16 26 2 12 14 18 24 12 8-5 12-16 6-26-4-7-10-12-14-12z" fill="#f59e0b" />
          <ellipse cx="26" cy="24" rx="8" ry="12" fill="#ef4444" opacity="0.4" />
          <path d="M32 10c0 4-1 6-1 6" stroke="#78350f" strokeWidth="3" strokeLinecap="round" />
          <path d="M32 12c5-2 9 0 10 3-4 1-8-1-10-3z" fill="#16a34a" />
        </svg>
      );
    default:
      return (
        <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
          <circle cx="32" cy="32" r="22" fill="#10b981" />
          <path d="M32 20c-8 8-4 18 4 22 8-4 12-14 4-22z" fill="#ffffff" />
        </svg>
      );
  }
};
