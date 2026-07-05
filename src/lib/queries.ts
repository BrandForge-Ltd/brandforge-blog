// All published posts, newest first
export const postsQuery = `*[_type == "post" && defined(publishedAt)] | order(publishedAt desc)[$start...$end] {
  _id,
  title,
  slug,
  publishedAt,
  "excerpt": seoDescription,
  featured,
  "coverImage": mainImage,
  "category": categories[0]->{ _id, title, "slug": slug.current },
  author,
  "readingTime": round(length(pt::text(body)) / 5 / 180)
}`;

export const postsCountQuery = `count(*[_type == "post" && defined(publishedAt)])`;

// Featured posts for the carousel
export const featuredPostsQuery = `*[_type == "post" && defined(publishedAt)] | order(publishedAt desc)[0...5] {
  _id,
  title,
  slug,
  publishedAt,
  "excerpt": seoDescription,
  "coverImage": mainImage,
  "category": categories[0]->{ _id, title, "slug": slug.current },
  author,
  "readingTime": round(length(pt::text(body)) / 5 / 180)
}`;

// Single post by slug
export const postBySlugQuery = `*[_type == "post" && slug.current == $slug][0] {
  _id,
  title,
  slug,
  publishedAt,
  "excerpt": seoDescription,
  "coverImage": mainImage,
  body,
  author,
  "category": categories[0]->{ _id, title, "slug": slug.current },
  "readingTime": round(length(pt::text(body)) / 5 / 180)
}`;

// Latest 3 posts for homepage
export const latestPostsQuery = `*[_type == "post" && defined(publishedAt)] | order(publishedAt desc)[0...3] {
  _id,
  title,
  slug,
  publishedAt,
  "excerpt": seoDescription,
  "coverImage": mainImage,
  "category": categories[0]->{ _id, title, "slug": slug.current },
  "readingTime": round(length(pt::text(body)) / 5 / 180)
}`;

// Posts by category slug
export const postsByCategoryQuery = `*[_type == "post" && $categorySlug in categories[]->slug.current && defined(publishedAt)] | order(publishedAt desc)[$start...$end] {
  _id,
  title,
  slug,
  publishedAt,
  "excerpt": seoDescription,
  "coverImage": mainImage,
  "category": categories[0]->{ _id, title, "slug": slug.current },
  author,
  "readingTime": round(length(pt::text(body)) / 5 / 180)
}`;

export const postsByCategoryCountQuery = `count(*[_type == "post" && $categorySlug in categories[]->slug.current && defined(publishedAt)])`;

// All categories
export const categoriesQuery = `*[_type == "category"] | order(title asc) {
  _id,
  title,
  "slug": slug.current
}`;

// Related posts (same category, exclude current)
export const relatedPostsQuery = `*[_type == "post" && $categoryId in categories[]._ref && _id != $postId && defined(publishedAt)] | order(publishedAt desc)[0...3] {
  _id,
  title,
  slug,
  publishedAt,
  "excerpt": seoDescription,
  "coverImage": mainImage,
  "category": categories[0]->{ _id, title, "slug": slug.current },
  "readingTime": round(length(pt::text(body)) / 5 / 180)
}`;
