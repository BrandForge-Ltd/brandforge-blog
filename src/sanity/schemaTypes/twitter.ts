import { defineType, defineField } from 'sanity';

export const twitter = defineType({
  name: 'twitter',
  title: 'Twitter / X Tweet Embed',
  type: 'object',
  fields: [
    defineField({
      name: 'url',
      title: 'Tweet / Post URL',
      type: 'url',
      description: 'Link to tweet on x.com or twitter.com (e.g. https://x.com/username/status/1234567890)',
      validation: (Rule) => Rule.required(),
    }),
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
});
