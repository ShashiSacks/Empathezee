import React from 'react';

export function Card({
  children,
  accentBorder = 'none',
  padding = 'md',
  hover = false,
  className = '',
  style = {},
  ...props
}) {
  const getAccentColor = () => {
    switch (accentBorder) {
      case 'primary':
        return 'var(--primary)';
      case 'accent':
      case 'teal':
        return 'var(--accent)';
      case 'secondary':
        return 'var(--secondary)';
      case 'warning':
        return 'var(--warning)';
      case 'danger':
        return 'var(--danger)';
      case 'purple':
        return '#8B5CF6';
      default:
        return null;
    }
  };

  const getPadding = () => {
    switch (padding) {
      case 'sm':
        return 'var(--space-4)';
      case 'lg':
        return 'var(--space-8)';
      case 'md':
      default:
        return 'var(--space-6)';
    }
  };

  const accentColor = getAccentColor();

  const cardStyle = {
    background: 'var(--surface)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius-xl)',
    boxShadow: 'var(--shadow-sm)',
    padding: getPadding(),
    transition: hover ? 'all var(--duration) var(--ease)' : undefined,
    ...style,
  };

  return (
    <div
      className={`card ${hover ? 'card-hover' : ''} ${className}`}
      style={cardStyle}
      {...props}
    >
      {children}
    </div>
  );
}

export default Card;
