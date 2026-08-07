// All published posts, newest first (falls back to _createdAt if publishedAt is empty)
export const postsQuery = `*[_type == "post" && defined(slug.current)] | order(coalesce(publishedAt, _createdAt) desc)[$start...$end] {
  _id,
  title,
  slug,
  "publishedAt": coalesce(publishedAt, _createdAt),
  "excerpt": seoDescription,
  featured,
  "mainImage": mainImage,
  "coverImage": mainImage,
  "category": categories[0]->{ _id, title, "slug": slug.current },
  "author": author->{ name, "slug": slug.current, image, bio },
  "authors": authors[]->{ name, "slug": slug.current, image, bio },
  "readingTime": round(length(pt::text(body)) / 5 / 180)
}`;

export const postsCountQuery = `count(*[_type == "post" && defined(slug.current)])`;

// Featured posts for the carousel
export const featuredPostsQuery = `*[_type == "post" && defined(slug.current)] | order(coalesce(publishedAt, _createdAt) desc)[0...5] {
  _id,
  title,
  slug,
  "publishedAt": coalesce(publishedAt, _createdAt),
  "excerpt": seoDescription,
  "mainImage": mainImage,
  "coverImage": mainImage,
  "category": categories[0]->{ _id, title, "slug": slug.current },
  "author": author->{ name, "slug": slug.current, image, bio },
  "authors": authors[]->{ name, "slug": slug.current, image, bio },
  "readingTime": round(length(pt::text(body)) / 5 / 180)
}`;

// Single post by slug
export const postBySlugQuery = `*[_type == "post" && slug.current == $slug][0] {
  _id,
  title,
  slug,
  "publishedAt": coalesce(publishedAt, _createdAt),
  "excerpt": seoDescription,
  seoKeywords,
  "audioUrl": audioFile.asset->url,
  "mainImage": mainImage,
  "coverImage": mainImage,
  body,
  "author": author->{ name, "slug": slug.current, image, bio },
  "authors": authors[]->{ name, "slug": slug.current, image, bio },
  "category": categories[0]->{ _id, title, "slug": slug.current },
  "readingTime": round(length(pt::text(body)) / 5 / 180)
}`;

// Latest 3 posts for homepage / sidebar
export const latestPostsQuery = `*[_type == "post" && defined(slug.current)] | order(coalesce(publishedAt, _createdAt) desc)[0...3] {
  _id,
  title,
  slug,
  "publishedAt": coalesce(publishedAt, _createdAt),
  "excerpt": seoDescription,
  "mainImage": mainImage,
  "coverImage": mainImage,
  "category": categories[0]->{ _id, title, "slug": slug.current },
  "readingTime": round(length(pt::text(body)) / 5 / 180)
}`;

// Posts by category slug
export const postsByCategoryQuery = `*[_type == "post" && $categorySlug in categories[]->slug.current && defined(slug.current)] | order(coalesce(publishedAt, _createdAt) desc)[$start...$end] {
  _id,
  title,
  slug,
  "publishedAt": coalesce(publishedAt, _createdAt),
  "excerpt": seoDescription,
  "mainImage": mainImage,
  "coverImage": mainImage,
  "category": categories[0]->{ _id, title, "slug": slug.current },
  "author": author->{ name, "slug": slug.current, image, bio },
  "authors": authors[]->{ name, "slug": slug.current, image, bio },
  "readingTime": round(length(pt::text(body)) / 5 / 180)
}`;

export const postsByCategoryCountQuery = `count(*[_type == "post" && $categorySlug in categories[]->slug.current && defined(slug.current)])`;

// All categories
export const categoriesQuery = `*[_type == "category" && defined(slug.current)] | order(title asc) {
  _id,
  title,
  "slug": slug.current
}`;

// Single category by slug
export const categoryBySlugQuery = `*[_type == "category" && slug.current == $slug][0] {
  _id,
  title,
  "slug": slug.current
}`;

// Related posts (same category, exclude current)
export const relatedPostsQuery = `*[_type == "post" && $categoryId in categories[]._ref && _id != $postId && defined(slug.current)] | order(coalesce(publishedAt, _createdAt) desc)[0...3] {
  _id,
  title,
  slug,
  "publishedAt": coalesce(publishedAt, _createdAt),
  "excerpt": seoDescription,
  "mainImage": mainImage,
  "coverImage": mainImage,
  "category": categories[0]->{ _id, title, "slug": slug.current },
  "readingTime": round(length(pt::text(body)) / 5 / 180)
}`;
