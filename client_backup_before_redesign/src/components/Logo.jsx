import React from 'react';

export default function Logo({ size = '28', className = '', ...props }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 40 40"
      width={size}
      height={size}
      className={className}
      style={{ flexShrink: 0, display: 'inline-block', verticalAlign: 'middle' }}
      {...props}
    >
      <defs>
        <linearGradient id="empathezeeLogoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#5B5BD6" />
          <stop offset="100%" stopColor="#3B82F6" />
        </linearGradient>
      </defs>

      {/* Outer rounded container tile */}
      <rect width="40" height="40" rx="10" fill="url(#empathezeeLogoGrad)" fillOpacity="0.12" />

      {/* Dual Speech-Bubble Heart Emblem */}
      <g transform="translate(2, 1)">
        {/* Left Speech Bubble Lobe */}
        <path
          d="M 18.5 7.5 C 13.2 7.5 9 11.7 9 17 C 9 20.8 11.2 24.1 14.4 25.6 C 14 27.5 12.8 29.1 11 30.2 C 14 30.2 16.6 28.8 18.2 26.7 C 18.3 26.7 18.4 26.7 18.5 26.7 C 23.8 26.7 28 22.5 28 17 C 28 11.7 23.8 7.5 18.5 7.5 Z"
          fill="url(#empathezeeLogoGrad)"
          opacity="0.9"
        />

        {/* Right Speech Bubble Lobe forming Heart Silhouette */}
        <path
          d="M 18.5 7.5 C 23.8 7.5 28 11.7 28 17 C 28 23.6 20.3 29.6 18.5 31.5 C 16.7 29.6 9 23.6 9 17 C 9 11.7 13.2 7.5 18.5 7.5 Z"
          fill="url(#empathezeeLogoGrad)"
        />

        {/* Stylized Negative Space 'E' Bars */}
        <path
          d="M 15 13.5 H 22 M 15 17 H 20.5 M 15 20.5 H 22"
          stroke="#FFFFFF"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </g>
    </svg>
  );
}
