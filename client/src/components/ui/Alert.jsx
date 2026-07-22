import React from 'react';

const ICONS = {
  success: 'fa-solid fa-circle-check',
  error:   'fa-solid fa-circle-exclamation',
  warning: 'fa-solid fa-triangle-exclamation',
  info:    'fa-solid fa-circle-info',
};

const STYLES = {
  success: { bg: 'var(--success-bg)',  border: 'rgba(16,185,129,0.25)', color: 'var(--secondary-dark)' },
  error:   { bg: 'var(--danger-bg)',   border: 'rgba(239,68,68,0.25)',  color: 'var(--danger)' },
  warning: { bg: 'var(--warning-bg)', border: 'rgba(245,158,11,0.25)', color: '#92400E' },
  info:    { bg: 'var(--info-bg)',     border: 'rgba(59,130,246,0.25)', color: 'var(--info)' },
};

export function Alert({ type = 'info', children, onDismiss, className = '', style = {} }) {
  const s = STYLES[type] || STYLES.info;
  return (
    <div
      role="alert"
      className={`alert alert-${type} ${className}`}
      style={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: '10px',
        padding: '12px 16px',
        borderRadius: 'var(--radius)',
        background: s.bg,
        border: `1px solid ${s.border}`,
        color: s.color,
        fontSize: '0.875rem',
        fontWeight: 500,
        lineHeight: 1.5,
        ...style,
      }}
    >
      <i className={ICONS[type] || ICONS.info} style={{ flexShrink: 0, marginTop: '2px' }} aria-hidden="true" />
      <span style={{ flex: 1 }}>{children}</span>
      {onDismiss && (
        <button
          onClick={onDismiss}
          aria-label="Dismiss alert"
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: 'inherit',
            opacity: 0.6,
            padding: '0 4px',
            fontSize: '0.85rem',
            flexShrink: 0,
          }}
        >
          <i className="fa-solid fa-xmark" aria-hidden="true" />
        </button>
      )}
    </div>
  );
}

export default Alert;
