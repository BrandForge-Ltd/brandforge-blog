import React from 'react';
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
          <figure style={{ margin: '2.5rem 0', width: '100%' }}>
            <img 
              src={imageUrl} 
              alt={value?.alt || value?.caption || ''} 
              style={{ width: '100%', height: 'auto', borderRadius: '1rem', display: 'block', boxShadow: '0 10px 20px -5px rgba(0, 0, 0, 0.08)' }} 
            />
            {(value?.caption || value?.alt) && (
              <figcaption style={{ textAlign: 'center', fontSize: '0.875rem', color: 'var(--gray)', marginTop: '0.75rem' }}>
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
          <figure style={{ margin: '2.5rem 0', width: '100%' }}>
            <div style={{
              position: 'relative',
              paddingBottom: '56.25%', // 16:9 Aspect Ratio
              height: 0,
              overflow: 'hidden',
              borderRadius: '1rem',
              boxShadow: '0 12px 24px -6px rgba(0,0,0,0.12)',
              backgroundColor: '#0a0a0c',
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
              <figcaption style={{ textAlign: 'center', fontSize: '0.875rem', color: 'var(--gray)', marginTop: '0.75rem' }}>
                {value.caption}
              </figcaption>
            )}
          </figure>
        );
      },
      twitter: ({ value }: any) => {
        if (!value?.url) return null;
        return (
          <div style={{
            margin: '2.5rem 0',
            display: 'flex',
            justifyContent: 'center',
            width: '100%',
          }}>
            <div style={{
              border: '1px solid rgba(255, 255, 255, 0.12)',
              backgroundColor: '#0e0e11',
              borderRadius: '1rem',
              padding: '1.5rem',
              maxWidth: '550px',
              width: '100%',
              boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--white)' }}>Post on X (Twitter)</span>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" style={{ color: 'var(--orange, #ff6b00)' }}>
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </div>
              <a
                href={value.url}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  color: 'var(--orange, #ff6b00)',
                  fontWeight: 600,
                  fontSize: '0.9375rem',
                  textDecoration: 'none',
                }}
              >
                <span>View original post on X</span>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M7 17L17 7M17 7H7M17 7V17"/>
                </svg>
              </a>
            </div>
          </div>
        );
      },
      callout: ({ value }: any) => {
        if (!value?.text) return null;
        return (
          <aside style={{
            margin: '2.5rem 0',
            padding: '1.75rem 2rem',
            backgroundColor: 'rgba(255, 107, 0, 0.05)',
            borderLeft: '4px solid var(--orange, #ff6b00)',
            borderRadius: '0 1rem 1rem 0',
          }}>
            <p style={{
              margin: 0,
              fontSize: '1.25rem',
              lineHeight: 1.6,
              color: 'var(--ink, #0a0a0c)',
              fontStyle: 'italic',
              fontFamily: 'var(--font-serif, serif)',
            }}>
              "{value.text}"
            </p>
            {value.attribution && (
              <span style={{
                display: 'block',
                marginTop: '0.75rem',
                fontSize: '0.875rem',
                fontWeight: 700,
                color: 'var(--orange, #ff6b00)',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
              }}>
                — {value.attribution}
              </span>
            )}
          </aside>
        );
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
      blockquote: ({children}: any) => {
        return (
          <blockquote style={{
            margin: '2.5rem 0',
            padding: '1.75rem 2rem',
            backgroundColor: 'var(--off-white, #f9f9fb)',
            borderLeft: '4px solid var(--orange, #ff6b00)',
            borderRadius: '0 1rem 1rem 0',
            fontFamily: 'var(--font-serif, serif)',
            fontSize: '1.25rem',
            lineHeight: 1.6,
            color: 'var(--ink, #0a0a0c)',
            fontStyle: 'italic',
          }}>
            {children}
          </blockquote>
        );
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
