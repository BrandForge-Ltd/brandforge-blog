import { defineType, defineField } from 'sanity';

export const post = defineType({
  name: 'post',
  title: 'Post',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
      },
    }),
    defineField({
      name: 'author',
      title: 'Primary Author (Legacy)',
      type: 'reference',
      to: { type: 'author' },
      description: 'Used for older posts. Prefer using the "Authors" list below for new posts.',
    }),
    defineField({
      name: 'authors',
      title: 'Authors',
      type: 'array',
      of: [{ type: 'reference', to: { type: 'author' } }],
      description: 'Add one or more authors for this post.',
    }),
    defineField({
      name: 'mainImage',
      title: 'Main image',
      type: 'image',
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: 'categories',
      title: 'Categories',
      type: 'array',
      of: [{ type: 'reference', to: { type: 'category' } }],
    }),
    defineField({
      name: 'publishedAt',
      title: 'Published at',
      type: 'datetime',
      initialValue: () => new Date().toISOString(),
    }),
    defineField({
      name: 'seoDescription',
      title: 'Excerpt / SEO Description',
      type: 'text',
      description: 'A short summary of the post for SEO and previews.',
    }),
    defineField({
      name: 'seoKeywords',
      title: 'SEO Keywords',
      type: 'string',
      description: 'Comma-separated keywords for SEO',
    }),
    defineField({
      name: 'audioFile',
      title: 'Audio Narration File (MP3)',
      type: 'file',
      options: {
        accept: 'audio/*',
      },
      description: 'Upload a pre-generated MP3 narration for this article.',
    }),
    defineField({
      name: 'body',
      title: 'Body',
      type: 'array',
      of: [
        {
          type: 'block',
        },
        {
          type: 'image',
          options: { hotspot: true },
          fields: [
            {
              name: 'alt',
              type: 'string',
              title: 'Alternative text',
            },
            {
              name: 'caption',
              type: 'string',
              title: 'Caption',
            },
          ],
        },
        {
          name: 'youtube',
          title: 'YouTube / Video Embed',
          type: 'object',
          fields: [
            {
              name: 'url',
              title: 'Video URL',
              type: 'url',
              description: 'YouTube or Vimeo URL (e.g. https://www.youtube.com/watch?v=... or https://youtu.be/...)',
            },
            {
              name: 'caption',
              title: 'Caption',
              type: 'string',
            },
          ],
          preview: {
            select: {
              title: 'caption',
              subtitle: 'url',
            },
            prepare(selection) {
              const { title, subtitle } = selection;
              return {
                title: title || 'YouTube / Video Embed',
                subtitle: subtitle || 'No URL specified',
              };
            },
          },
        },
        {
          name: 'twitter',
          title: 'Twitter / X Tweet Embed',
          type: 'object',
          fields: [
            {
              name: 'url',
              title: 'Tweet URL',
              type: 'url',
              description: 'Link to tweet on x.com or twitter.com',
            },
          ],
          preview: {
            select: {
              subtitle: 'url',
            },
            prepare(selection) {
              return {
                title: 'Post on X (Twitter)',
                subtitle: selection.subtitle || 'No URL specified',
              };
            },
          },
        },
        {
          name: 'callout',
          title: 'Callout / Quote Box',
          type: 'object',
          fields: [
            {
              name: 'text',
              title: 'Quote / Highlight Text',
              type: 'text',
            },
            {
              name: 'attribution',
              title: 'Author / Attribution',
              type: 'string',
            },
          ],
          preview: {
            select: {
              title: 'text',
              subtitle: 'attribution',
            },
            prepare(selection) {
              return {
                title: selection.title ? `"${selection.title.substring(0, 50)}..."` : 'Callout Box',
                subtitle: selection.subtitle ? `— ${selection.subtitle}` : '',
              };
            },
          },
        },
      ],
    }),
  ],

  preview: {
    select: {
      title: 'title',
      author: 'author.name',
      media: 'mainImage',
    },
    prepare(selection) {
      const { author } = selection;
      return { ...selection, subtitle: author && `by ${author}` };
    },
  },
});
