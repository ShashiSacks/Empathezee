import React from 'react';

export function PageHeader({
  badge,
  title,
  highlight,
  subtitle,
  children,
  gradient = 'primary',
  className = '',
  style = {},
}) {
  const getGradient = () => {
    switch (gradient) {
      case 'accent':
      case 'teal':
        return 'linear-gradient(135deg, var(--accent), var(--primary))';
      case 'secondary':
        return 'linear-gradient(135deg, var(--secondary), var(--primary))';
      case 'warm':
        return 'var(--grad-warm)';
      case 'primary':
      default:
        return 'var(--grad-primary)';
    }
  };

  return (
    <div
      className={`page-header-banner ${className}`}
      style={{
        background: 'linear-gradient(145deg, var(--primary-50) 0%, var(--bg) 100%)',
        padding: 'var(--space-12) var(--space-6) var(--space-10)',
        textAlign: 'center',
        borderBottom: '1px solid var(--border)',
        position: 'relative',
        overflow: 'hidden',
        ...style,
      }}
    >
      <div style={{ position: 'relative', zIndex: 2, maxWidth: '680px', margin: '0 auto' }}>
        {badge && (
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 'var(--space-2)',
              padding: 'var(--space-1) var(--space-4)',
              background: 'rgba(79, 70, 229, 0.08)',
              border: '1px solid rgba(79, 70, 229, 0.16)',
              borderRadius: 'var(--radius-full)',
              fontSize: '0.8rem',
              fontWeight: 600,
              color: 'var(--primary)',
              marginBottom: 'var(--space-4)',
            }}
          >
            {badge}
          </div>
        )}
        <h1 className="title" style={{ fontSize: 'clamp(1.85rem, 4vw, 2.75rem)', marginBottom: 'var(--space-3)', lineHeight: 1.2 }}>
          {title}{' '}
          {highlight && (
            <span
              style={{
                background: getGradient(),
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              {highlight}
            </span>
          )}
        </h1>
        {subtitle && (
          <p
            style={{
              color: 'var(--text-secondary)',
              fontSize: '1rem',
              lineHeight: 1.65,
              margin: '0 auto',
            }}
          >
            {subtitle}
          </p>
        )}
        {children}
      </div>
    </div>
  );
}

export default PageHeader;
