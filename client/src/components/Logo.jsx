import React from 'react';

/**
 * Empathezee Premium Brand Logo Component
 * Abstract emblem representing interlocking nodes of empathy, care, and human connection.
 */
export default function Logo({ size = 32, className = '', variant = 'default', ...props }) {
  const numericSize = typeof size === 'number' ? size : parseInt(size, 10) || 32;

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 48 48"
      width={numericSize}
      height={numericSize}
      className={`empathezee-logo ${className}`}
      style={{ flexShrink: 0, display: 'inline-block', verticalAlign: 'middle' }}
      aria-label="Empathezee Logo"
      {...props}
    >
      <defs>
        {/* Primary Sapphire & Indigo Gradient */}
        <linearGradient id="ezPrimaryGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#4F46E5" />
          <stop offset="50%" stopColor="#3B82F6" />
          <stop offset="100%" stopColor="#06B6D4" />
        </linearGradient>

        {/* Secondary Warm Teal Accent Gradient */}
        <linearGradient id="ezAccentGrad" x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#0D9488" />
          <stop offset="100%" stopColor="#10B981" />
        </linearGradient>

        {/* Subtle Background Surface Tile */}
        <linearGradient id="ezTileGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#EEF2FF" />
          <stop offset="100%" stopColor="#E0E7FF" />
        </linearGradient>

        {/* Soft Drop Shadow for Depth */}
        <filter id="ezShadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#312E81" floodOpacity="0.15" />
        </filter>
      </defs>

      {/* Rounded Background Tile (Rendered in mark/tile mode or default) */}
      <rect
        x="2"
        y="2"
        width="44"
        height="44"
        rx="12"
        fill="url(#ezTileGrad)"
        className="logo-tile-bg"
      />

      {/* Abstract Interlocking Nodes Emblem */}
      <g transform="translate(4, 4)" filter="url(#ezShadow)">
        {/* Left Node - Empathy Loop */}
        <path
          d="M 14 10 C 8.477 10 4 14.477 4 20 C 4 25.523 8.477 30 14 30 C 18.2 30 21.8 27.4 23.2 23.7 C 21.5 23.9 19.8 23.4 18.5 22.3 C 16.5 20.6 15.8 17.8 16.6 15.3 C 15.8 15 14.9 14.8 14 14.8 C 11.128 14.8 8.8 17.128 8.8 20 C 8.8 22.872 11.128 25.2 14 25.2 C 16.1 25.2 17.9 23.9 18.7 22"
          fill="none"
          stroke="url(#ezPrimaryGrad)"
          strokeWidth="3.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Right Node - Care & Connection Loop */}
        <path
          d="M 26 30 C 31.523 30 36 25.523 36 20 C 36 14.477 31.523 10 26 10 C 21.8 10 18.2 12.6 16.8 16.3 C 18.5 16.1 20.2 16.6 21.5 17.7 C 23.5 19.4 24.2 22.2 23.4 24.7 C 24.2 25 25.1 25.2 26 25.2 C 28.872 25.2 31.2 22.872 31.2 20 C 31.2 17.128 28.872 14.8 26 14.8 C 23.9 14.8 22.1 16.1 21.3 18"
          fill="none"
          stroke="url(#ezAccentGrad)"
          strokeWidth="3.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Central Intersecting Sparkle / Heart Pulse Point */}
        <circle cx="20" cy="20" r="3" fill="url(#ezPrimaryGrad)" />
      </g>
    </svg>
  );
}
