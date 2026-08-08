import { defineType, defineField } from 'sanity';

export const youtube = defineType({
  name: 'youtube',
  title: 'YouTube / Video Embed',
  type: 'object',
  fields: [
    defineField({
      name: 'url',
      title: 'Video URL',
      type: 'url',
      description: 'Paste a YouTube or Vimeo link (e.g. https://www.youtube.com/watch?v=... or https://youtu.be/...)',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'caption',
      title: 'Caption',
      type: 'string',
      description: 'Optional caption to display beneath the video',
    }),
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
});
