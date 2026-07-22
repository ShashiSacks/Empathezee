import React from 'react';

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  loading = false,
  disabled = false,
  icon = null,
  className = '',
  style = {},
  type = 'button',
  ...props
}) {
  const getVariantClass = () => {
    switch (variant) {
      case 'secondary':
        return 'btn-secondary';
      case 'outline':
        return 'btn-outline';
      case 'accent':
      case 'teal':
        return 'btn-teal';
      case 'warning':
        return 'btn-warning';
      case 'danger':
        return 'btn-danger';
      case 'ghost':
        return 'btn-ghost';
      case 'primary':
      default:
        return 'btn-primary';
    }
  };

  const getSizeClass = () => {
    switch (size) {
      case 'sm':
        return 'btn-sm';
      case 'lg':
        return 'btn-lg';
      case 'md':
      default:
        return '';
    }
  };

  const buttonStyle = {
    width: fullWidth ? '100%' : undefined,
    borderRadius: 'var(--radius-full)',
    opacity: disabled || loading ? 0.65 : 1,
    pointerEvents: disabled || loading ? 'none' : 'auto',
    cursor: disabled || loading ? 'not-allowed' : 'pointer',
    ...style,
  };

  return (
    <button
      type={type}
      disabled={disabled || loading}
      className={`btn ${getVariantClass()} ${getSizeClass()} ${fullWidth ? 'btn-block' : ''} ${className}`}
      style={buttonStyle}
      {...props}
    >
      {loading ? (
        <>
          <span className="spinner" style={{ width: '16px', height: '16px', borderWidth: '2px', marginRight: '6px' }}></span>
          <span>Loading...</span>
        </>
      ) : (
        <>
          {icon && <span className="btn-icon" style={{ display: 'inline-flex', alignItems: 'center' }}>{icon}</span>}
          {children}
        </>
      )}
    </button>
  );
}

export default Button;
