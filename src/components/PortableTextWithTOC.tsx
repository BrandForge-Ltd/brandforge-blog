import React, { useEffect, useState } from 'react';
import { PortableText } from '@portabletext/react';
import BlogCTA from './BlogCTA';
import { urlFor } from '../lib/sanity';

// Helper to extract plain text from portable text
function extractText(blocks: any[]): string {
  if (!blocks) return '';
  return blocks
    .filter(val => val && val._type === 'block')
    .map(block => {
      return block.children?.map((child: any) => child.text).join('') || '';
    })
    .join('\n\n');
}

// Helper to extract YouTube or Vimeo embed URL
function getEmbedUrl(url: string): string | null {
  if (!url) return null;
  // YouTube watch, short, or embed URLs
  const ytMatch = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
  if (ytMatch && ytMatch[1]) {
    return `https://www.youtube-nocookie.com/embed/${ytMatch[1]}`;
  }
  // Vimeo URLs
  const vimeoMatch = url.match(/vimeo\.com\/(\d+)/);
  if (vimeoMatch && vimeoMatch[1]) {
    return `https://player.vimeo.com/video/${vimeoMatch[1]}`;
  }
  return null;
}

// Interactive Live Twitter / X Embed Component
function TwitterEmbed({ url }: { url: string }) {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (!url) return;

    const loadTwitterScript = () => {
      if ((window as any).twttr && (window as any).twttr.widgets) {
        (window as any).twttr.widgets.load();
        setLoaded(true);
      } else {
        const existingScript = document.getElementById('twitter-wjs');
        if (!existingScript) {
          const script = document.createElement('script');
          script.id = 'twitter-wjs';
          script.src = 'https://platform.twitter.com/widgets.js';
          script.async = true;
          script.charset = 'utf-8';
          script.onload = () => {
            if ((window as any).twttr && (window as any).twttr.widgets) {
              (window as any).twttr.widgets.load();
            }
            setLoaded(true);
          };
          document.body.appendChild(script);
        } else {
          setTimeout(() => {
            if ((window as any).twttr && (window as any).twttr.widgets) {
              (window as any).twttr.widgets.load();
              setLoaded(true);
            }
          }, 300);
        }
      }
    };

    loadTwitterScript();
  }, [url]);

  if (!url) return null;

  return (
    <figure style={{
      margin: '3rem 0',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      width: '100%',
    }}>
      <div
        className="twitter-embed-wrapper"
        style={{
          width: '100%',
          maxWidth: '550px',
          minHeight: '200px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <blockquote
          className="twitter-tweet"
          data-dnt="true"
          data-theme="dark"
          data-align="center"
          style={{ width: '100%', margin: '0 auto' }}
        >
          <a href={url}>Loading post from X...</a>
        </blockquote>
      </div>
    </figure>
  );
}

// Bespoke Editorial Classy Quote Component
function EditorialQuote({ text, children, attribution, currentUrl }: { text?: string; children?: any; attribution?: string; currentUrl?: string }) {
  const quoteText = text || (typeof children === 'string' ? children : '');
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (quoteText) {
      navigator.clipboard.writeText(`"${quoteText}" ${attribution ? `— ${attribution}` : ''}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const tweetIntent = `https://twitter.com/intent/tweet?text=${encodeURIComponent(`"${quoteText || 'Quote'}"`)}${currentUrl ? `&url=${encodeURIComponent(currentUrl)}` : ''}`;

  return (
    <div
      className="editorial-quote-card"
      style={{
        margin: '3.5rem 0',
        padding: '2.5rem 3rem',
        backgroundColor: '#0a0a0c',
        backgroundImage: 'radial-gradient(ellipse at top left, rgba(255, 107, 0, 0.08), transparent 70%), linear-gradient(180deg, #111115 0%, #0a0a0c 100%)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        borderRadius: '1.5rem',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Decorative Giant Typographic Quote Accent */}
      <span
        aria-hidden="true"
        style={{
          position: 'absolute',
          top: '-0.75rem',
          left: '1.5rem',
          fontSize: '6rem',
          fontFamily: 'var(--font-serif, Georgia, serif)',
          color: 'var(--orange, #ff6b00)',
          opacity: 0.25,
          lineHeight: 1,
          pointerEvents: 'none',
          userSelect: 'none',
        }}
      >
        “
      </span>

      {/* Quote Body */}
      <div style={{ position: 'relative', zIndex: 1 }}>
        <blockquote
          style={{
            margin: 0,
            padding: 0,
            border: 'none',
            background: 'none',
            fontFamily: 'var(--font-serif, Georgia, serif)',
            fontSize: '1.35rem',
            lineHeight: 1.65,
            color: '#f4f4f7',
            fontStyle: 'italic',
            letterSpacing: '-0.01em',
          }}
        >
          {children || `"${text}"`}
        </blockquote>

        {/* Footer Meta & Actions */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginTop: '1.75rem',
            paddingTop: '1.25rem',
            borderTop: '1px solid rgba(255, 255, 255, 0.08)',
            flexWrap: 'wrap',
            gap: '1rem',
          }}
        >
          {attribution ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div
                style={{
                  width: '6px',
                  height: '6px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--orange, #ff6b00)',
                }}
              />
              <span
                style={{
                  fontSize: '0.8125rem',
                  fontWeight: 700,
                  color: 'var(--orange, #ff6b00)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.12em',
                  fontFamily: 'var(--font-mono, monospace)',
                }}
              >
                {attribution}
              </span>
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span
                style={{
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  color: 'rgba(255, 255, 255, 0.4)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.15em',
                  fontFamily: 'var(--font-mono, monospace)',
                }}
              >
                Key Insight
              </span>
            </div>
          )}

          {/* Micro Action Buttons */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <button
              type="button"
              onClick={handleCopy}
              title="Copy quote to clipboard"
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                color: 'rgba(255, 255, 255, 0.8)',
                padding: '0.35rem 0.75rem',
                borderRadius: '2rem',
                fontSize: '0.75rem',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem',
                transition: 'all 0.2s ease',
              }}
            >
              {copied ? (
                <>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                    <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                  </svg>
                  <span>Copy</span>
                </>
              )}
            </button>

            <a
              href={tweetIntent}
              target="_blank"
              rel="noopener noreferrer"
              title="Share quote on X"
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                color: 'rgba(255, 255, 255, 0.8)',
                padding: '0.35rem 0.75rem',
                borderRadius: '2rem',
                fontSize: '0.75rem',
                fontWeight: 600,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem',
                textDecoration: 'none',
                transition: 'all 0.2s ease',
              }}
            >
              <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
              <span>Quote</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function PortableTextWithTOC({ value, currentUrl }: { value: any, currentUrl?: string }) {
  let blocks = Array.isArray(value) ? [...value] : [];
  
  if (blocks.length > 4) {
    const totalParas = blocks.filter(
      b => b._type === 'block' && (!b.style || b.style === 'normal')
    ).length;

    // Place it roughly halfway through the post (at least after the 5th paragraph)
    const targetPara = Math.max(5, Math.floor(totalParas / 2));

    let paraCount = 0;
    let insertIndex = -1;
    for (let i = 0; i < blocks.length; i++) {
      if (blocks[i]._type === 'block' && (!blocks[i].style || blocks[i].style === 'normal')) {
        paraCount++;
        if (paraCount === targetPara) {
          insertIndex = i + 1;
          break;
        }
      }
    }
    if (insertIndex > -1) {
      blocks.splice(insertIndex, 0, { _type: 'inlineCTA', _key: 'auto-inline-cta' });
    }
  }

  const portableTextComponents = {
    types: {
      inlineCTA: BlogCTA,
      image: ({ value }: any) => {
        if (!value) return null;
        let imageUrl = value?.asset?.url || '';
        if (!imageUrl && value?.asset) {
          try {
            imageUrl = urlFor(value).width(1200).auto('format').url();
          } catch (e) {
            imageUrl = '';
          }
        }
        if (!imageUrl) return null;
        return (
          <figure style={{ margin: '3rem 0', width: '100%' }}>
            <img 
              src={imageUrl} 
              alt={value?.alt || value?.caption || ''} 
              style={{ width: '100%', height: 'auto', borderRadius: '1.25rem', display: 'block', boxShadow: '0 20px 40px -10px rgba(0, 0, 0, 0.12)' }} 
            />
            {(value?.caption || value?.alt) && (
              <figcaption style={{ textAlign: 'center', fontSize: '0.875rem', color: 'var(--gray)', marginTop: '0.875rem', fontStyle: 'italic' }}>
                {value.caption || value.alt}
              </figcaption>
            )}
          </figure>
        );
      },
      youtube: ({ value }: any) => {
        const embedUrl = getEmbedUrl(value?.url || '');
        if (!embedUrl) return null;
        return (
          <figure style={{ margin: '3.5rem 0', width: '100%' }}>
            <div style={{
              position: 'relative',
              paddingBottom: '56.25%', // 16:9 Aspect Ratio
              height: 0,
              overflow: 'hidden',
              borderRadius: '1.25rem',
              boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)',
              backgroundColor: '#0a0a0c',
              border: '1px solid rgba(255,255,255,0.1)',
            }}>
              <iframe
                src={embedUrl}
                title={value?.caption || 'Embedded Video'}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  border: 'none',
                }}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
            {value?.caption && (
              <figcaption style={{ textAlign: 'center', fontSize: '0.875rem', color: 'var(--gray)', marginTop: '0.875rem', fontStyle: 'italic' }}>
                {value.caption}
              </figcaption>
            )}
          </figure>
        );
      },
      twitter: ({ value }: any) => {
        return <TwitterEmbed url={value?.url || ''} />;
      },
      callout: ({ value }: any) => {
        return <EditorialQuote text={value?.text} attribution={value?.attribution} currentUrl={currentUrl} />;
      },
    },
    block: {
      h2: ({children, value}: any) => {
        const id = extractText([value]).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
        return <h2 id={id}>{children}</h2>;
      },
      h3: ({children, value}: any) => {
        const id = extractText([value]).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
        return <h3 id={id}>{children}</h3>;
      },
      blockquote: ({children, value}: any) => {
        const text = extractText([value]);
        return <EditorialQuote text={text} currentUrl={currentUrl}>{children}</EditorialQuote>;
      }
    },
    marks: {
      link: ({children, value}: any) => {
        const rel = !value.href.startsWith('/') ? 'noreferrer noopener' : undefined;
        const target = !value.href.startsWith('/') ? '_blank' : undefined;
        return (
          <a href={value.href} rel={rel} target={target} style={{
            color: 'var(--orange, #ff6b00)',
            textDecoration: 'underline',
            textUnderlineOffset: '3px',
            fontWeight: 500,
          }}>
            {children}
          </a>
        );
      },
      code: ({children}: any) => {
        return (
          <code style={{
            backgroundColor: 'rgba(0,0,0,0.06)',
            padding: '0.2rem 0.4rem',
            borderRadius: '4px',
            fontFamily: 'var(--font-mono, monospace)',
            fontSize: '0.9em',
          }}>
            {children}
          </code>
        );
      }
    }
  };

  return <PortableText value={blocks} components={portableTextComponents} />;
}
