import React, { useEffect } from 'react';
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

// Default Fast Official Twitter / X Embed Component
function TwitterEmbed({ url }: { url: string }) {
  useEffect(() => {
    const trigger = () => {
      if ((window as any).twttr && (window as any).twttr.widgets) {
        (window as any).twttr.widgets.load();
      }
    };
    trigger();
    // Run after a micro-tick in case Twitter SDK was parsing
    const timer = setTimeout(trigger, 100);
    return () => clearTimeout(timer);
  }, [url]);

  if (!url) return null;

  return (
    <div style={{ margin: '2rem 0', display: 'flex', justifyContent: 'center', width: '100%', minHeight: '150px' }}>
      <blockquote className="twitter-tweet" data-dnt="true" style={{ margin: '0 auto' }}>
        <a href={url}>Loading post from X...</a>
      </blockquote>
    </div>
  );
}

export default function PortableTextWithTOC({ value, currentUrl }: { value: any, currentUrl?: string }) {
  useEffect(() => {
    // Immediate trigger for all Twitter widgets on the page
    if ((window as any).twttr && (window as any).twttr.widgets) {
      (window as any).twttr.widgets.load();
    }
  }, []);

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
              style={{ width: '100%', height: 'auto', borderRadius: '1rem', display: 'block', boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.08)' }} 
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
        return <TwitterEmbed url={value?.url || ''} />;
      },
      callout: ({ value }: any) => {
        if (!value?.text) return null;
        return (
          <blockquote style={{
            margin: '2.5rem auto',
            padding: '1.25rem 1.5rem',
            border: 'none',
            fontFamily: 'var(--font-serif, Georgia, serif)',
            fontSize: '1.35rem',
            lineHeight: 1.65,
            fontStyle: 'italic',
            color: 'var(--ink, #0a0a0c)',
            textAlign: 'center',
            maxWidth: '90%',
          }}>
            <p style={{ margin: 0 }}>“{value.text}”</p>
            {value.attribution && (
              <cite style={{
                display: 'block',
                marginTop: '0.75rem',
                fontSize: '0.875rem',
                fontWeight: 600,
                fontStyle: 'normal',
                color: 'var(--gray, #71717a)',
                fontFamily: 'var(--font-sans, sans-serif)',
              }}>
                — {value.attribution}
              </cite>
            )}
          </blockquote>
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
            margin: '2.5rem auto',
            padding: '1.25rem 1.5rem',
            border: 'none',
            fontFamily: 'var(--font-serif, Georgia, serif)',
            fontSize: '1.35rem',
            lineHeight: 1.65,
            fontStyle: 'italic',
            color: 'var(--ink, #0a0a0c)',
            textAlign: 'center',
            maxWidth: '90%',
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
