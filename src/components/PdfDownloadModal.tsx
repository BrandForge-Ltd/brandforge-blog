import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';

interface PdfDownloadModalProps {
  postTitle: string;
  postUrl?: string;
  buttonClass?: string;
  layout?: 'default' | 'icon-only' | 'vertical' | 'inline-meta';
}

export default function PdfDownloadModal({ postTitle, postUrl, buttonClass = '', layout = 'default' }: PdfDownloadModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [company, setCompany] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAlreadyLead, setIsAlreadyLead] = useState(false);

  useEffect(() => {
    setMounted(true);
    const savedLead = localStorage.getItem('brandforge_lead');
    if (savedLead) {
      try {
        const lead = JSON.parse(savedLead);
        if (lead.name && lead.email) {
          setName(lead.name);
          setEmail(lead.email);
          setCompany(lead.company || '');
          setIsAlreadyLead(true);
        }
      } catch (e) {}
    }
  }, []);

  const triggerPdfPrint = () => {
    const originalTitle = document.title;
    document.title = `${postTitle} - BrandForge Report`;
    setTimeout(() => {
      window.print();
      document.title = originalTitle;
    }, 150);
  };

  const handleButtonClick = () => {
    // If we already captured their lead details on this device, download directly!
    if (isAlreadyLead && email) {
      triggerPdfPrint();
    } else {
      setIsOpen(true);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) return;

    setIsSubmitting(true);

    const leadData = {
      name,
      email,
      company,
      source: `PDF Download: ${postTitle}`,
      url: postUrl || window.location.href,
      downloadedAt: new Date().toISOString(),
    };

    // Save locally so returning sessions get 1-click download
    localStorage.setItem('brandforge_lead', JSON.stringify(leadData));
    setIsAlreadyLead(true);

    // Send payload to ForgeHub CRM window object / event if available
    try {
      if ((window as any).ForgeHub && typeof (window as any).ForgeHub.capture === 'function') {
        (window as any).ForgeHub.capture(leadData);
      } else {
        const event = new CustomEvent('forgehub:capture', { detail: leadData });
        window.dispatchEvent(event);
      }
    } catch (err) {
      console.warn('ForgeHub capture trigger:', err);
    }

    setTimeout(() => {
      setIsSubmitting(false);
      setIsOpen(false);
      triggerPdfPrint();
    }, 300);
  };

  const modalJSX = isOpen ? (
    <div
      className="pdf-modal-overlay"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 999999,
        backgroundColor: 'rgba(0, 0, 0, 0.82)',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1.5rem',
      }}
      onClick={() => setIsOpen(false)}
    >
      <div
        className="pdf-modal-card"
        style={{
          backgroundColor: '#0a0a0c',
          border: '1px solid rgba(255, 255, 255, 0.15)',
          borderRadius: '1.5rem',
          padding: '2.5rem',
          maxWidth: '460px',
          width: '100%',
          color: '#ffffff',
          boxShadow: '0 30px 60px -12px rgba(0, 0, 0, 0.95)',
          position: 'relative',
          zIndex: 1000000,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={() => setIsOpen(false)}
          style={{
            position: 'absolute',
            top: '1.25rem',
            right: '1.25rem',
            background: 'rgba(255, 255, 255, 0.08)',
            border: 'none',
            borderRadius: '50%',
            width: '36px',
            height: '36px',
            color: 'rgba(255, 255, 255, 0.7)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.2s ease',
          }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        <div style={{ marginBottom: '1.5rem' }}>
          <span
            style={{
              fontFamily: 'var(--font-mono, monospace)',
              fontSize: '0.75rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.15em',
              color: 'var(--orange, #ff6b00)',
            }}
          >
            PDF Edition
          </span>
          <h3
            style={{
              fontFamily: 'var(--font-serif, serif)',
              fontSize: '1.5rem',
              fontWeight: 700,
              margin: '0.5rem 0 0.75rem 0',
              lineHeight: 1.25,
            }}
          >
            Download PDF Executive Report
          </h3>
          <p
            style={{
              margin: 0,
              color: 'rgba(255, 255, 255, 0.7)',
              fontSize: '0.875rem',
              lineHeight: 1.5,
            }}
          >
            Enter your details to receive the publication-grade PDF edition of <strong>"{postTitle}"</strong>.
          </p>
        </div>

        {/* Form synced with ForgeHub capture */}
        <form
          id="forgehub-pdf-lead-form"
          onSubmit={handleSubmit}
          style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}
        >
          <input type="hidden" name="site_key" value="blog_brandforgeinc_com" />
          <input type="hidden" name="source" value={`Blog PDF: ${postTitle}`} />

          <div>
            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: 'rgba(255, 255, 255, 0.8)', marginBottom: '0.375rem' }}>
              Full Name *
            </label>
            <input
              type="text"
              name="name"
              required
              placeholder="e.g. Sarah Jenkins"
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={{
                width: '100%',
                padding: '0.75rem 1rem',
                borderRadius: '0.75rem',
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                color: '#ffffff',
                fontSize: '0.875rem',
                outline: 'none',
              }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: 'rgba(255, 255, 255, 0.8)', marginBottom: '0.375rem' }}>
              Business Email *
            </label>
            <input
              type="email"
              name="email"
              required
              placeholder="e.g. sarah@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{
                width: '100%',
                padding: '0.75rem 1rem',
                borderRadius: '0.75rem',
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                color: '#ffffff',
                fontSize: '0.875rem',
                outline: 'none',
              }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: 'rgba(255, 255, 255, 0.8)', marginBottom: '0.375rem' }}>
              Company / Organization <span style={{ color: 'rgba(255,255,255,0.4)', fontWeight: 400 }}>(Optional)</span>
            </label>
            <input
              type="text"
              name="company"
              placeholder="e.g. BrandForge Ltd"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              style={{
                width: '100%',
                padding: '0.75rem 1rem',
                borderRadius: '0.75rem',
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                color: '#ffffff',
                fontSize: '0.875rem',
                outline: 'none',
              }}
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            style={{
              marginTop: '0.5rem',
              padding: '0.875rem 1.5rem',
              borderRadius: '2rem',
              backgroundColor: 'var(--orange, #ff6b00)',
              color: '#ffffff',
              fontWeight: 600,
              fontSize: '0.875rem',
              border: 'none',
              cursor: isSubmitting ? 'not-allowed' : 'pointer',
              opacity: isSubmitting ? 0.7 : 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              transition: 'all 0.2s ease',
            }}
          >
            {isSubmitting ? (
              <span>Generating PDF...</span>
            ) : (
              <>
                <span>Download PDF Report</span>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  ) : null;

  return (
    <>
      {/* Action Button */}
      {layout === 'inline-meta' ? (
        <button
          type="button"
          onClick={handleButtonClick}
          className="inline-pdf-link"
          title="Download PDF Executive Report"
          style={{
            background: 'none',
            border: 'none',
            padding: 0,
            color: 'var(--orange, #ff6b00)',
            fontSize: 'var(--text-small, 0.875rem)',
            fontWeight: 600,
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.35rem',
            fontFamily: 'inherit',
          }}
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="7 10 12 15 17 10" />
            <line x1="12" y1="15" x2="12" y2="3" />
          </svg>
          <span>PDF Edition</span>
        </button>
      ) : layout === 'vertical' ? (
        <button
          type="button"
          onClick={handleButtonClick}
          className="share-btn pdf-btn"
          title="Download PDF Edition"
          aria-label="Download PDF Edition"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            backgroundColor: '#0a0a0c',
            color: '#ffffff',
            border: '1px solid rgba(255,255,255,0.15)',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
          }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="7 10 12 15 17 10" />
            <line x1="12" y1="15" x2="12" y2="3" />
          </svg>
        </button>
      ) : (
        <button
          type="button"
          onClick={handleButtonClick}
          className={`pdf-download-btn ${buttonClass}`}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.5rem 1rem',
            borderRadius: '2rem',
            backgroundColor: '#0a0a0c',
            color: '#ffffff',
            fontSize: '0.8125rem',
            fontWeight: 600,
            border: '1px solid rgba(255, 255, 255, 0.12)',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
          }}
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="7 10 12 15 17 10" />
            <line x1="12" y1="15" x2="12" y2="3" />
          </svg>
          <span>Download PDF</span>
        </button>
      )}

      {/* Render modal directly into document.body via Portal to escape all stacking contexts */}
      {mounted && modalJSX ? createPortal(modalJSX, document.body) : null}
    </>
  );
}
