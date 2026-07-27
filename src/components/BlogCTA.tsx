import React from 'react';

export default function BlogCTA() {
  return (
    <div 
      className="inline-blog-cta" 
      style={{
        margin: '3.5rem 0',
        padding: '2.25rem 2.5rem',
        backgroundColor: '#0a0a0c',
        borderRadius: '1.25rem',
        color: '#ffffff',
        display: 'flex',
        flexDirection: 'column',
        gap: '1.25rem',
        position: 'relative',
        overflow: 'hidden',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        boxShadow: '0 20px 40px -15px rgba(0, 0, 0, 0.5)',
      }}
    >
      {/* Subtle background glow */}
      <div 
        style={{
          position: 'absolute',
          top: '-40px',
          right: '-40px',
          width: '180px',
          height: '180px',
          background: 'radial-gradient(circle, rgba(255, 107, 0, 0.15) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />

      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <span 
          style={{
            display: 'inline-block',
            width: '6px',
            height: '6px',
            borderRadius: '50%',
            backgroundColor: 'var(--orange, #ff6b00)',
          }}
        />
        <span 
          style={{
            fontFamily: 'var(--font-mono, monospace)',
            fontSize: '0.75rem',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.15em',
            color: 'rgba(255, 255, 255, 0.6)',
          }}
        >
          BrandForge Strategy
        </span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        <h4 
          style={{
            fontFamily: 'var(--font-serif, serif)',
            fontSize: '1.5rem',
            fontWeight: 700,
            color: '#ffffff',
            margin: 0,
            lineHeight: 1.3,
            letterSpacing: '-0.01em',
          }}
        >
          Ready to build an irresistible brand?
        </h4>
        <p 
          style={{
            margin: 0,
            color: 'rgba(255, 255, 255, 0.7)',
            fontSize: '1rem',
            lineHeight: 1.6,
            maxWidth: '560px',
          }}
        >
          We partner with ambitious companies to craft positioning, identity, and digital experiences that drive growth.
        </p>
      </div>

      <div>
        <a 
          href="https://brandforgeinc.com/services" 
          target="_blank"
          rel="noopener noreferrer"
          className="cta-minimal-btn"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.625rem',
            padding: '0.75rem 1.5rem',
            borderRadius: '2rem',
            backgroundColor: '#ffffff',
            color: '#0a0a0c',
            fontWeight: 600,
            fontSize: '0.875rem',
            textDecoration: 'none',
            transition: 'all 0.2s ease',
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.backgroundColor = 'var(--orange, #ff6b00)';
            e.currentTarget.style.color = '#ffffff';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.backgroundColor = '#ffffff';
            e.currentTarget.style.color = '#0a0a0c';
          }}
        >
          Explore Our Services
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="5" y1="12" x2="19" y2="12" />
            <polyline points="12 5 19 12 12 19" />
          </svg>
        </a>
      </div>
    </div>
  );
}
