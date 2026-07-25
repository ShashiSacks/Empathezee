import React from 'react';

/**
 * Empathezee Brand Logo
 * Minimalist, high-trust vector mark symbolizing human embrace, care, and supportive community.
 */
export default function Logo({ size = 32, className = '', ...props }) {
  const pixelSize = typeof size === 'number' ? size : parseInt(size, 10) || 32;

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 40 40"
      width={pixelSize}
      height={pixelSize}
      className={className}
      style={{
        flexShrink: 0,
        display: 'inline-block',
        verticalAlign: 'middle',
        width: `${pixelSize}px`,
        height: `${pixelSize}px`,
      }}
      aria-hidden="true"
      {...props}
    >
      {/* Rounded squircle background container */}
      <rect width="40" height="40" rx="10" fill="#4F46E5" />

      {/* Interlocking care & connection curves */}
      <g fill="none" stroke="#FFFFFF" strokeWidth="2.75" strokeLinecap="round" strokeLinejoin="round">
        <path d="M 15 13 C 11 13 9 16 9 20 C 9 24 11 27 15 27 M 15 20 L 25 20" />
        <path d="M 25 13 C 29 13 31 16 31 20 C 31 24 29 27 25 27" />
        <path d="M 15 13 C 18 10 22 10 25 13" />
        <path d="M 15 27 C 18 30 22 30 25 27" />
      </g>

      {/* Central wellness node */}
      <circle cx="20" cy="20" r="2.25" fill="#FFFFFF" />
    </svg>
  );
}
