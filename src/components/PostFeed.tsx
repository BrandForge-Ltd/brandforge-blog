import React, { useState } from 'react';
import ReactBlogCard from './ReactBlogCard';
import { client } from '../lib/sanity';

interface PostFeedProps {
  initialPosts: any[];
  categorySlug?: string;
}

export default function PostFeed({ initialPosts, categorySlug }: PostFeedProps) {
  const [posts, setPosts] = useState(initialPosts);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(initialPosts.length === 12);

  const loadMore = async () => {
    setLoading(true);
    const start = posts.length;
    const end = start + 12;

    try {
      let query = '';
      if (categorySlug) {
        query = `*[_type == "post" && references(*[_type == "category" && slug.current == "${categorySlug}"]._id)] | order(publishedAt desc)[${start}...${end}] {
          _id,
          title,
          slug,
          publishedAt,
          "excerpt": seoDescription,
          "coverImage": mainImage,
          "category": categories[0]->{ title }
        }`;
      } else {
        query = `*[_type == "post"] | order(publishedAt desc)[${start}...${end}] {
          _id,
          title,
          slug,
          publishedAt,
          "excerpt": seoDescription,
          "coverImage": mainImage,
          "category": categories[0]->{ title }
        }`;
      }

      const newPosts = await client.fetch(query);
      setPosts([...posts, ...newPosts]);
      
      if (newPosts.length < 12) {
        setHasMore(false);
      }
    } catch (err) {
      console.error('Failed to load more posts', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="post-grid">
        {posts.map((post) => (
          <ReactBlogCard key={post._id} post={post} />
        ))}
      </div>
      
      {posts.length === 0 && (
        <div className="empty-state">
          <p>No posts found yet.</p>
        </div>
      )}

      {hasMore && (
        <div className="load-more-container" style={{ textAlign: 'center', marginTop: '4rem' }}>
          <button 
            onClick={loadMore} 
            disabled={loading}
            className="btn-primary"
            style={{ minWidth: '200px' }}
          >
            {loading ? 'Loading...' : 'Load More Posts'}
          </button>
        </div>
      )}
    </div>
  );
}
