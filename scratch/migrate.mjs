import { createClient } from '@sanity/client';
import { Schema } from '@sanity/schema';
import { htmlToBlocks } from '@portabletext/block-tools';
import { JSDOM } from 'jsdom';

const client = createClient({
  projectId: 'aejxymic',
  dataset: 'production',
  useCdn: false,
  apiVersion: '2023-05-03',
  token: 'skCU6UFZzRLuL4MOeJ5TVs65gQGJNxoWqz1tdeiP0bcF4CS6ApQ4pF2QxgMxLlMQEw5HcCrOaPH52RAUS',
});

const defaultSchema = Schema.compile({
  name: 'myBlog',
  types: [
    {
      type: 'object',
      name: 'blogPost',
      fields: [
        {
          title: 'Body',
          name: 'body',
          type: 'array',
          of: [{ type: 'block' }],
        },
      ],
    },
  ],
});
const blockContentType = defaultSchema.get('blogPost').fields.find((field) => field.name === 'body').type;

async function uploadImage(url) {
  if (!url) return null;
  console.log(`Uploading image from ${url}`);
  try {
    const res = await fetch(url);
    if (!res.ok) return null;
    const arrayBuffer = await res.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const asset = await client.assets.upload('image', buffer, { filename: url.split('/').pop() });
    return asset._id;
  } catch (err) {
    console.error(`Failed to upload image ${url}`, err);
    return null;
  }
}

async function run() {
  console.log('Fetching WP posts...');
  const wpRes = await fetch('https://brandforge.ng/wp-json/wp/v2/posts?per_page=100&_embed=true');
  const wpPosts = await wpRes.json();
  console.log(`Found ${wpPosts.length} posts in WP`);

  console.log('Fetching Sanity posts...');
  const sanityPosts = await client.fetch(`*[_type == "post"]{ _id, "slug": slug.current }`);
  console.log(`Found ${sanityPosts.length} posts in Sanity`);

  const sanityCategories = await client.fetch(`*[_type == "category"]{ _id, "slug": slug.current }`);

  let updated = 0;
  let created = 0;

  for (const wpPost of wpPosts) {
    const slug = wpPost.slug;
    
    // Some WP posts have weird entities in title
    let title = new JSDOM(wpPost.title.rendered).window.document.body.textContent || wpPost.title.rendered;
    
    // Create excerpt
    let excerpt = wpPost.excerpt.rendered;
    if (excerpt) {
      excerpt = new JSDOM(excerpt).window.document.body.textContent || '';
      excerpt = excerpt.trim().replace(/\n/g, ' ');
    }

    // Convert body
    const bodyHtml = wpPost.content.rendered;
    const blocks = htmlToBlocks(bodyHtml, blockContentType, {
      parseHtml: (html) => new JSDOM(html).window.document,
    });

    const existingPost = sanityPosts.find((p) => p.slug === slug);

    if (existingPost) {
      console.log(`Updating existing post: ${slug}`);
      await client
        .patch(existingPost._id)
        .set({
          body: blocks,
          seoDescription: excerpt,
        })
        .commit();
      updated++;
    } else {
      console.log(`Creating new post: ${slug}`);
      
      // Get image
      let imageId = null;
      if (wpPost._embedded && wpPost._embedded['wp:featuredmedia']) {
        const media = wpPost._embedded['wp:featuredmedia'][0];
        if (media && media.source_url) {
          imageId = await uploadImage(media.source_url);
        }
      }

      // Get categories
      let categoryRefs = [];
      if (wpPost._embedded && wpPost._embedded['wp:term']) {
        const wpTerms = wpPost._embedded['wp:term'][0] || [];
        for (const term of wpTerms) {
          const matchedCat = sanityCategories.find(c => c.slug === term.slug);
          if (matchedCat) {
            categoryRefs.push({
              _type: 'reference',
              _ref: matchedCat._id,
              _key: Math.random().toString(36).substring(7)
            });
          }
        }
      }

      const doc = {
        _type: 'post',
        title: title,
        slug: { _type: 'slug', current: slug },
        publishedAt: wpPost.date,
        seoDescription: excerpt,
        body: blocks,
      };

      if (imageId) {
        doc.mainImage = {
          _type: 'image',
          asset: { _type: 'reference', _ref: imageId }
        };
      }

      if (categoryRefs.length > 0) {
        doc.categories = categoryRefs;
      }

      await client.create(doc);
      created++;
    }
  }

  console.log(`Migration complete. Updated: ${updated}, Created: ${created}`);
}

run().catch(console.error);
