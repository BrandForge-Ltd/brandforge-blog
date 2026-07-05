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

const portableTextComponents = {
  block: {
    h2: ({children, value}: any) => {
      const id = extractText([value]).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      return <h2 id={id}>{children}</h2>;
    },
    h3: ({children, value}: any) => {
      const id = extractText([value]).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      return <h3 id={id}>{children}</h3>;
    }
  }
};

export default function PortableTextWithTOC({ value }: { value: any }) {
  return <PortableText value={value} components={portableTextComponents} />;
}
