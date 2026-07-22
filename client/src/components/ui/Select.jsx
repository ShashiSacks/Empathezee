import React from 'react';

export function Select({
  children,
  error = false,
  className = '',
  style = {},
  ...props
}) {
  const selectStyle = {
    width: '100%',
    height: 'var(--h-md)',
    padding: '0 var(--space-8) 0 var(--space-4)',
    background: 'var(--surface)',
    border: error ? '1.5px solid var(--danger)' : '1.5px solid var(--border)',
    borderRadius: 'var(--radius)',
    fontFamily: 'inherit',
    fontSize: '0.92rem',
    color: 'var(--text)',
    transition: 'all var(--duration) var(--ease)',
    outline: 'none',
    cursor: 'pointer',
    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath d='M2 4l4 4 4-4' fill='none' stroke='%2364748b' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E")`,
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'right 16px center',
    backgroundSize: '12px',
    appearance: 'none',
    WebkitAppearance: 'none',
    ...style,
  };

  return (
    <select className={`ds-select ${className}`} style={selectStyle} {...props}>
      {children}
    </select>
  );
}

export default Select;
