import React from 'react';
import { urlFor } from '../lib/sanity';

interface Post {
  _id: string;
  title: string;
  slug: { current: string };
  publishedAt: string;
  excerpt: string;
  coverImage: any;
  category?: { title: string };
  readingTime?: number;
}

export default function ReactBlogCard({ post }: { post: Post }) {
  const formattedDate = new Date(post.publishedAt).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });
  
  const readingTime = post.readingTime ? Math.max(1, post.readingTime) : 1;

  return (
    <a href={`/blog/${post.slug.current}`} className="blog-card group">
      <div className="image-wrapper">
        {post.coverImage ? (
          <img 
            src={urlFor(post.coverImage).width(800).height(600).url()} 
            alt={post.title}
            className="cover-image"
          />
        ) : (
          <div className="image-placeholder"></div>
        )}
        {post.category && (
          <div className="category-badge">
            {post.category.title}
          </div>
        )}
      </div>
      
      <div className="content">
        <div className="meta-info" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <p className="date">{formattedDate}</p>
          <span className="reading-time" style={{ fontSize: '0.75rem', color: 'var(--gray)', fontWeight: 500 }}>{readingTime} min read</span>
        </div>
        <h3 className="title">{post.title}</h3>
        <div className="read-more">
          Read Article 
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="5" y1="12" x2="19" y2="12"></line>
            <polyline points="12 5 19 12 12 19"></polyline>
          </svg>
        </div>
      </div>
    </a>
  );
}
