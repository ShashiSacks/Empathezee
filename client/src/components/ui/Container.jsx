import React from 'react';

export function Container({ children, size = 'xl', className = '', style = {}, ...props }) {
  const maxWidths = {
    sm: '640px',
    md: '860px',
    lg: '1000px',
    xl: '1200px',
    full: '100%',
  };

  const containerStyle = {
    width: '100%',
    maxWidth: maxWidths[size] || maxWidths.xl,
    margin: '0 auto',
    paddingLeft: 'var(--space-6)',
    paddingRight: 'var(--space-6)',
    paddingTop: 'var(--space-8)',
    paddingBottom: 'var(--space-10)',
    ...style,
  };

  return (
    <div className={`ds-container ${className}`} style={containerStyle} {...props}>
      {children}
    </div>
  );
}

export default Container;
