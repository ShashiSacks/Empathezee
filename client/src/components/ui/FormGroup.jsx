import React from 'react';

export function FormGroup({
  label,
  htmlFor,
  required = false,
  optional = false,
  error,
  helperText,
  icon,
  children,
  className = '',
  style = {},
}) {
  return (
    <div className={`form-group ${className}`} style={{ marginBottom: 'var(--space-4)', display: 'flex', flexDirection: 'column', gap: 'var(--space-2)', ...style }}>
      {label && (
        <label htmlFor={htmlFor} style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', fontSize: 'var(--font-size-sm)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--text)' }}>
          {icon && <span style={{ color: 'var(--primary)', display: 'inline-flex' }}>{icon}</span>}
          <span>{label}</span>
          {required && <span style={{ color: 'var(--danger)', marginLeft: '2px' }}>*</span>}
          {optional && <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-muted)', fontWeight: 400 }}>(optional)</span>}
        </label>
      )}
      {children}
      {error && (
        <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--danger)', marginTop: '2px', fontWeight: 500 }}>
          {error}
        </span>
      )}
      {!error && helperText && (
        <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-secondary)', marginTop: '2px' }}>
          {helperText}
        </span>
      )}
    </div>
  );
}

export default FormGroup;
