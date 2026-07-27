import React from 'react';

export default function BlogCTA() {
  return (
    <div className="inline-blog-cta" style={{
      margin: '3rem 0',
      padding: '2rem',
      backgroundColor: 'var(--off-white)',
      border: '1px solid var(--border)',
      borderLeft: '4px solid var(--orange)',
      borderRadius: '0 1rem 1rem 0',
      display: 'flex',
      flexDirection: 'column',
      gap: '1rem',
    }}>
      <h4 style={{
        fontFamily: 'var(--font-sans)',
        fontSize: '1.25rem',
        fontWeight: 700,
        color: 'var(--ink)',
        margin: 0
      }}>Ready to elevate your brand?</h4>
      <p style={{
        margin: 0,
        color: 'var(--charcoal)',
        fontSize: '1rem',
        lineHeight: 1.6
      }}>Join hundreds of forward-thinking companies building their identity with BrandForge.</p>
      <a 
        href="https://brandforgeinc.com/contact" 
        target="_blank"
        rel="noopener noreferrer"
        style={{
          display: 'inline-block',
          marginTop: '0.5rem',
          color: 'var(--orange)',
          fontWeight: 600,
          textDecoration: 'none',
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
          fontSize: '0.875rem'
        }}
        onMouseOver={(e) => (e.currentTarget.style.color = 'var(--ink)')}
        onMouseOut={(e) => (e.currentTarget.style.color = 'var(--orange)')}
      >
        Get Started &rarr;
      </a>
    </div>
  );
}
