import React, { useState, useEffect } from 'react';
import { urlFor } from '../lib/sanity';

interface Post {
  _id: string;
  title: string;
  slug: { current: string };
  publishedAt: string;
  coverImage: any;
  category?: { title: string };
}

export default function RecommendedBriefs({ posts }: { posts: Post[] }) {
  const [briefs, setBriefs] = useState<Post[]>([]);

  useEffect(() => {
    if (!posts || posts.length === 0) return;
    
    // Create a copy and shuffle
    const shuffled = [...posts].sort(() => 0.5 - Math.random());
    // Take up to 3
    setBriefs(shuffled.slice(0, 3));
  }, [posts]);

  if (briefs.length === 0) return null;

  return (
    <div className="briefs-section">
      <div className="briefs-header">
        <h3 className="briefs-title">RECOMMENDED READS</h3>
      </div>
      
      <div className="briefs-grid">
        {briefs.map((post) => {
          const formattedDate = post.publishedAt 
            ? new Date(post.publishedAt).toLocaleDateString('en-US', {
                month: 'long',
                day: 'numeric',
                year: 'numeric'
              })
            : '';

          return (
            <a key={post._id} href={`/blog/${post.slug.current}`} className="brief-card">
              <div className="brief-image-wrapper">
                {post.coverImage ? (
                  <img 
                    src={urlFor(post.coverImage).width(150).height(150).url()} 
                    alt={post.title}
                    className="brief-image"
                  />
                ) : (
                  <div className="brief-image-placeholder" />
                )}
              </div>
              <div className="brief-content">
                <h4 className="brief-post-title">{post.title}</h4>
                <div className="brief-meta">
                  {post.category && <span className="brief-category">{post.category.title}</span>}
                  <span className="brief-divider">•</span>
                  <span className="brief-date">{formattedDate}</span>
                </div>
              </div>
            </a>
          );
        })}
      </div>

      <style>{`
        .briefs-section {
          margin-bottom: 4rem;
          padding-top: 2rem;
          border-top: 1px solid var(--border);
        }

        .briefs-header {
          margin-bottom: 1.5rem;
        }

        .briefs-title {
          font-family: var(--font-mono);
          font-size: 0.75rem;
          font-weight: 700;
          letter-spacing: 0.1em;
          color: var(--gray);
          text-transform: uppercase;
        }

        .briefs-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 1.5rem;
        }

        @media (min-width: 768px) {
          .briefs-grid {
            grid-template-columns: repeat(3, 1fr);
            gap: 2rem;
          }
        }

        .brief-card {
          display: flex;
          align-items: center;
          gap: 1rem;
          transition: transform 0.2s ease;
        }

        .brief-card:hover {
          transform: translateY(-2px);
        }

        .brief-card:hover .brief-post-title {
          color: var(--orange);
        }

        .brief-image-wrapper {
          flex-shrink: 0;
          width: 80px;
          height: 80px;
          border-radius: 0.5rem;
          overflow: hidden;
          background-color: var(--off-white);
        }

        .brief-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .brief-image-placeholder {
          width: 100%;
          height: 100%;
          background: linear-gradient(to bottom right, var(--gray-light), var(--off-white));
        }

        .brief-content {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .brief-post-title {
          font-family: var(--font-serif);
          font-size: 1rem;
          font-weight: 700;
          line-height: 1.3;
          color: var(--ink);
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
          transition: color 0.2s ease;
        }

        .brief-meta {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.75rem;
          color: var(--gray);
        }

        .brief-category {
          font-weight: 600;
          color: var(--charcoal);
        }
      `}</style>
    </div>
  );
}
