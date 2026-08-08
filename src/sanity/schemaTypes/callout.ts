import { defineType, defineField } from 'sanity';

export const callout = defineType({
  name: 'callout',
  title: 'Callout / Quote Box',
  type: 'object',
  fields: [
    defineField({
      name: 'text',
      title: 'Quote / Highlight Text',
      type: 'text',
      description: 'The quote or highlight text to feature prominently',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'attribution',
      title: 'Author / Attribution',
      type: 'string',
      description: 'Optional person or source attributed (e.g. Steve Jobs)',
    }),
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
});
