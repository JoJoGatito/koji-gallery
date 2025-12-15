export default {
  name: 'artistProfile',
  title: 'Artist Profile',
  type: 'document',
  fields: [
    {
      name: 'bio',
      title: 'Biography',
      type: 'array',
      of: [{ type: 'block' }],
      validation: Rule => Rule.required()
    },
    {
      name: 'profileImage',
      title: 'Profile Image',
      type: 'image',
      options: {
        hotspot: true
      },
      validation: Rule => Rule.required()
    }
  ],
  preview: {
    select: {
      media: 'profileImage'
    },
    prepare(selection) {
      const { media } = selection;
      return {
        title: 'Artist Profile',
        subtitle: 'Homepage avatar & bio',
        media
      };
    }
  }
};