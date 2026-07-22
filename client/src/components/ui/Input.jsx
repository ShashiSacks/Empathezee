import React from 'react';

export function Input({
  type = 'text',
  error = false,
  className = '',
  style = {},
  ...props
}) {
  const inputStyle = {
    width: '100%',
    height: 'var(--h-md)',
    padding: '0 var(--space-4)',
    background: 'var(--surface)',
    border: error ? '1.5px solid var(--danger)' : '1.5px solid var(--border)',
    borderRadius: 'var(--radius)',
    fontFamily: 'inherit',
    fontSize: '0.92rem',
    color: 'var(--text)',
    transition: 'all var(--duration) var(--ease)',
    outline: 'none',
    ...style,
  };

  return (
    <input
      type={type}
      className={`ds-input ${className}`}
      style={inputStyle}
      {...props}
    />
  );
}

export default Input;
