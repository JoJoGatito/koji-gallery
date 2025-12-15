// Artwork Schema for Sanity Studio
// This file defines the structure for artwork documents in your Sanity dataset

export default {
  name: 'artwork',
  title: 'Artwork',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: Rule => Rule.required().min(1).max(100)
    },
    {
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96
      },
      validation: Rule => Rule.required()
    },
    {
      name: 'category',
      title: 'Category',
      type: 'string',
      options: {
        list: [
          { title: 'Original Character (OC)', value: 'OC' },
          { title: 'Fan Art', value: 'FanArt' }
        ]
      },
      validation: Rule => Rule.required()
    },
    {
      name: 'description',
      title: 'Description',
      type: 'array',
      of: [{ type: 'block' }],
      validation: Rule => Rule.required()
    },
    {
      name: 'heroImage',
      title: 'Image',
      type: 'image',
      options: {
        hotspot: true
      },
      validation: Rule => Rule.required()
    },
    {
      name: 'aspectRatio',
      title: 'Aspect Ratio (for lightbox)',
      type: 'string',
      options: {
        list: [
          { title: 'Auto (use original image)', value: 'auto' },
          { title: 'Square 1:1', value: '1:1' },
          { title: 'Portrait 3:4', value: '3:4' },
          { title: 'Portrait 2:3', value: '2:3' },
          { title: 'Landscape 4:3', value: '4:3' },
          { title: 'Landscape 16:9', value: '16:9' }
        ],
        layout: 'dropdown'
      },
      initialValue: 'auto',
      description: 'Controls how this artwork is framed in the gallery lightbox.'
    },
    {
      name: 'publishedAt',
      title: 'Published At',
      type: 'datetime',
      validation: Rule => Rule.required(),
      initialValue: () => new Date().toISOString()
    }
  ],
  preview: {
    select: {
      title: 'title',
      category: 'category',
      image: 'heroImage'
    },
    prepare(selection) {
      const { title, category, image } = selection;
      return {
        title,
        subtitle: category || 'Uncategorized',
        media: image
      };
    }
  },
  orderings: [
    {
      title: 'Publish Date, New',
      name: 'publishedAtDesc',
      by: [
        { field: 'publishedAt', direction: 'desc' }
      ]
    },
    {
      title: 'Publish Date, Old',
      name: 'publishedAtAsc',
      by: [
        { field: 'publishedAt', direction: 'asc' }
      ]
    },
    {
      title: 'Title A-Z',
      name: 'titleAsc',
      by: [
        { field: 'title', direction: 'asc' }
      ]
    }
  ]
};