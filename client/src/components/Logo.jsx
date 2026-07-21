import React from 'react';

const Logo = ({ size = '24' }) => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40" width={size} height={size} style={{ flexShrink: 0 }}>
      <defs>
        <linearGradient id="empathezeeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#4F46E5" />
          <stop offset="100%" stopColor="#06B6D4" />
        </linearGradient>
      </defs>
      <rect width="40" height="40" rx="12" fill="url(#empathezeeGrad)" fillOpacity="0.1" />
      <path d="M20 12 C14 12, 10 16, 10 22 C10 29, 20 34, 20 34 C20 34, 30 29, 30 22 C30 16, 26 12, 20 12 Z" fill="url(#empathezeeGrad)" />
      <circle cx="20" cy="20" r="4" fill="#ffffff" />
    </svg>
  );
};

export default Logo;
