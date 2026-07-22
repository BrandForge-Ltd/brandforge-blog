import React, { useState, useEffect } from 'react';
import { urlFor } from '../lib/sanity';

interface Post {
  _id: string;
  title: string;
  slug: { current: string };
  publishedAt: string;
  excerpt: string;
  coverImage: any;
  category?: { title: string };
  authorName?: string;
}

export default function HeroSlider({ posts }: { posts: Post[] }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Early return if no posts
  if (!posts || posts.length === 0) return null;

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev === posts.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev === 0 ? posts.length - 1 : prev - 1));
  };

  // Auto-play the slider every 5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      nextSlide();
    }, 5000);
    return () => clearInterval(timer);
  }, [posts.length]);

  const currentPost = posts[currentIndex];
  
  const formattedDate = currentPost.publishedAt 
    ? new Date(currentPost.publishedAt).toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric'
      })
    : '';

  // 16:9 aspect ratio for social media optimization
  const imageUrl = currentPost.coverImage 
    ? urlFor(currentPost.coverImage).width(1200).height(675).url() 
    : '';

  return (
    <div className="hero-slider-container">
      <div className="hero-slider">
        {imageUrl ? (
          <img src={imageUrl} alt={currentPost.title} className="hero-bg-image" />
        ) : (
          <div className="hero-bg-placeholder" />
        )}
        
        <div className="hero-overlay"></div>
        
        <div className="hero-content">
          {currentPost.category && (
            <span className="hero-category">{currentPost.category.title}</span>
          )}
          <a href={`/blog/${currentPost.slug.current}`}>
            <h1 className="hero-title">{currentPost.title}</h1>
          </a>
          {currentPost.excerpt && (
            <p className="hero-excerpt">{currentPost.excerpt}</p>
          )}
          
          <div className="hero-meta">
            <div className="hero-author-date">
              {currentPost.authorName && <span className="hero-author">{currentPost.authorName}</span>}
              <span className="hero-date">{formattedDate}</span>
            </div>
            
            <div className="hero-controls">
              <button onClick={prevSlide} className="hero-control-btn" aria-label="Previous post">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="15 18 9 12 15 6"></polyline>
                </svg>
              </button>
              <button onClick={nextSlide} className="hero-control-btn" aria-label="Next post">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="9 18 15 12 9 6"></polyline>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <style>{`
        .hero-slider-container {
          width: 100%;
          margin-bottom: 3rem;
        }
        
        .hero-slider {
          position: relative;
          width: 100%;
          min-height: 500px;
          aspect-ratio: 4/5;
          border-radius: 1.5rem;
          overflow: hidden;
          background-color: var(--zinc-800);
        }
        
        @media (min-width: 768px) {
          .hero-slider {
            aspect-ratio: 16/9;
            min-height: auto;
          }
        }
        
        @media (min-width: 1024px) {
          .hero-slider {
            aspect-ratio: 21/9;
          }
        }
        
        .hero-bg-image {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        
        .hero-bg-placeholder {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(to right, var(--ink), var(--charcoal));
        }
        
        .hero-overlay {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(to right, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.4) 60%, transparent 100%);
        }
        
        .hero-content {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          padding: 2rem;
          display: flex;
          flex-direction: column;
          justify-content: flex-end;
          color: var(--white);
          z-index: 10;
        }
        
        @media (min-width: 768px) {
          .hero-content {
            padding: 4rem;
            width: 70%;
          }
        }
        
        .hero-category {
          font-family: var(--font-mono);
          font-size: 0.75rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.15em;
          margin-bottom: 1rem;
          display: inline-block;
          color: var(--orange);
        }
        
        .hero-title {
          font-family: var(--font-serif);
          font-size: clamp(1.75rem, 6vw, 3.5rem);
          font-weight: 700;
          line-height: 1.15;
          margin-bottom: 1rem;
          color: var(--white);
          transition: color 0.2s ease;
          display: -webkit-box;
          -webkit-line-clamp: 4;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        
        .hero-title:hover {
          color: var(--gray-light);
        }
        
        .hero-excerpt {
          font-family: var(--font-sans);
          font-size: 1rem;
          line-height: 1.5;
          margin-bottom: 1.5rem;
          color: var(--gray-light);
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
          max-width: 600px;
        }
        
        @media (min-width: 768px) {
          .hero-excerpt {
            font-size: 1.125rem;
            line-height: 1.6;
            margin-bottom: 2rem;
            -webkit-line-clamp: 3;
          }
        }
        
        .hero-meta {
          display: flex;
          justify-content: space-between;
          align-items: center;
          width: 100%;
          padding-top: 1.5rem;
          border-top: 1px solid rgba(255,255,255,0.2);
        }
        
        .hero-author-date {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }
        
        .hero-author {
          font-weight: 600;
          font-size: 0.875rem;
        }
        
        .hero-date {
          font-size: 0.875rem;
          color: var(--gray-light);
        }
        
        .hero-controls {
          display: flex;
          gap: 0.5rem;
        }
        
        .hero-control-btn {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background-color: rgba(255,255,255,0.2);
          color: var(--white);
          border: none;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s ease;
          backdrop-filter: blur(4px);
        }
        
        .hero-control-btn:hover {
          background-color: var(--orange);
          transform: scale(1.05);
        }
      `}</style>
    </div>
  );
}
