import React from 'react';

const COLORS = {
  primary:   { bg: 'var(--primary-50)',   color: 'var(--primary)',      shadow: 'rgba(37,99,235,0.12)' },
  secondary: { bg: 'var(--secondary-50)', color: 'var(--secondary)',    shadow: 'rgba(13,148,136,0.12)' },
  accent:    { bg: 'var(--accent-50)',    color: 'var(--accent)',       shadow: 'rgba(2,132,199,0.12)' },
  success:   { bg: 'var(--success-bg)',   color: 'var(--secondary)',    shadow: 'rgba(16,185,129,0.12)' },
  warning:   { bg: 'var(--warning-bg)',  color: 'var(--warning)',      shadow: 'rgba(245,158,11,0.12)' },
  danger:    { bg: 'var(--danger-bg)',    color: 'var(--danger)',       shadow: 'rgba(239,68,68,0.12)' },
  neutral:   { bg: 'var(--bg-warm)',      color: 'var(--text-muted)',   shadow: 'rgba(15,23,42,0.06)' },
};

const SIZES = {
  sm: { width: '36px', height: '36px', fontSize: '0.9rem', radius: '10px' },
  md: { width: '48px', height: '48px', fontSize: '1.1rem', radius: '12px' },
  lg: { width: '64px', height: '64px', fontSize: '1.5rem', radius: '16px' },
  xl: { width: '80px', height: '80px', fontSize: '2rem',   radius: '20px' },
};

export function IconBox({
  icon,
  color = 'primary',
  size = 'md',
  solid = false,
  className = '',
  style = {},
  children,
}) {
  const c = COLORS[color] || COLORS.primary;
  const s = SIZES[size]   || SIZES.md;

  const boxStyle = solid
    ? { background: c.color, color: '#ffffff', boxShadow: `0 4px 14px ${c.shadow}` }
    : { background: c.bg,    color: c.color,   border: `1px solid ${c.shadow}` };

  return (
    <div
      className={`icon-box ${className}`}
      aria-hidden="true"
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: s.width,
        height: s.height,
        borderRadius: s.radius,
        fontSize: s.fontSize,
        flexShrink: 0,
        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
        ...boxStyle,
        ...style,
      }}
    >
      {icon ? <i className={icon} /> : children}
    </div>
  );
}

export default IconBox;
