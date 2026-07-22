import React from 'react';

const VARIANTS = {
  primary: {
    bg: 'var(--primary-50)',
    color: 'var(--primary)',
    border: 'var(--primary-100)',
  },
  secondary: {
    bg: 'var(--secondary-50)',
    color: 'var(--secondary-dark)',
    border: 'rgba(16,185,129,0.15)',
  },
  accent: {
    bg: 'var(--accent-50)',
    color: 'var(--accent-dark)',
    border: 'rgba(2,132,199,0.15)',
  },
  success: {
    bg: 'var(--success-bg)',
    color: 'var(--secondary-dark)',
    border: 'rgba(16,185,129,0.2)',
  },
  warning: {
    bg: 'var(--warning-bg)',
    color: 'var(--warning)',
    border: 'rgba(245,158,11,0.2)',
  },
  danger: {
    bg: 'var(--danger-bg)',
    color: 'var(--danger)',
    border: 'rgba(239,68,68,0.15)',
  },
  neutral: {
    bg: 'var(--bg-warm)',
    color: 'var(--text-secondary)',
    border: 'var(--border)',
  },
};

export function Badge({
  children,
  variant = 'primary',
  size = 'md',
  dot = false,
  icon = null,
  className = '',
  style = {},
}) {
  const v = VARIANTS[variant] || VARIANTS.primary;
  const fontSize = size === 'sm' ? '0.68rem' : size === 'lg' ? '0.82rem' : '0.73rem';
  const padding  = size === 'sm' ? '2px 7px'  : size === 'lg' ? '5px 13px' : '3px 9px';

  return (
    <span
      className={`badge ${className}`}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '4px',
        padding,
        fontSize,
        fontWeight: 700,
        borderRadius: 'var(--radius-full)',
        background: v.bg,
        color: v.color,
        border: `1px solid ${v.border}`,
        letterSpacing: '0.3px',
        whiteSpace: 'nowrap',
        ...style,
      }}
    >
      {dot && (
        <span
          aria-hidden="true"
          style={{
            width: '6px',
            height: '6px',
            borderRadius: '50%',
            background: 'currentColor',
            display: 'inline-block',
            flexShrink: 0,
          }}
        />
      )}
      {icon && <i className={icon} aria-hidden="true" style={{ fontSize: '0.7em' }} />}
      {children}
    </span>
  );
}

export default Badge;
