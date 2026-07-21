import React from 'react';
import { PortableText } from '@portabletext/react';

// Helper to extract text from portable text
function extractText(blocks: any[]): string {
  if (!blocks) return '';
  return blocks
    .filter(val => val._type === 'block')
    .map(block => {
      return block.children?.map((child: any) => child.text).join('') || '';
    })
    .join('\n\n');
}

export default function PortableTextWithTOC({ value, currentUrl }: { value: any, currentUrl?: string }) {
  const portableTextComponents = {
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
        const tweetIntent = `https://twitter.com/intent/tweet?text=${encodeURIComponent(`"${text}"`)}${currentUrl ? `&url=${encodeURIComponent(currentUrl)}` : ''}`;
        
        return (
          <blockquote className="click-to-tweet-block" style={{ position: 'relative' }}>
            <div className="quote-content">{children}</div>
            <a 
              href={tweetIntent}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                marginTop: '1rem',
                color: 'var(--orange)',
                fontWeight: 700,
                fontSize: '0.875rem',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                textDecoration: 'none',
              }}
              className="click-to-tweet-link"
              title="Click to Tweet"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
              Click to Tweet
            </a>
          </blockquote>
        );
      }
    }
  };

  return <PortableText value={value} components={portableTextComponents} />;
}
