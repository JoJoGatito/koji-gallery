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
          {title: 'Original Character (OC)', value: 'OC'},
          {title: 'Fan Art', value: 'FanArt'}
        ]
      },
      validation: Rule => Rule.required()
    },
    {
      name: 'description',
      title: 'Description',
      type: 'array',
      of: [{type: 'block'}],
      validation: Rule => Rule.required()
    },
    {
      name: 'price',
      title: 'Price',
      type: 'number',
      validation: Rule => Rule.required().min(0)
    },
    {
      name: 'currency',
      title: 'Currency',
      type: 'string',
      options: {
        list: [
          {title: 'USD ($)', value: 'USD'},
          {title: 'EUR (€)', value: 'EUR'},
          {title: 'GBP (£)', value: 'GBP'}
        ]
      },
      validation: Rule => Rule.required()
    },
    {
      name: 'availability',
      title: 'Availability',
      type: 'string',
      options: {
        list: [
          {title: 'Available', value: 'Available'},
          {title: 'Sold Out', value: 'SoldOut'}
        ]
      },
      validation: Rule => Rule.required(),
      initialValue: 'Available'
    },
    {
      name: 'heroImage',
      title: 'Hero Image',
      type: 'image',
      options: {
        hotspot: true
      },
      validation: Rule => Rule.required()
    },
    {
      name: 'images',
      title: 'Additional Images',
      type: 'array',
      of: [
        {
          type: 'image',
          options: {
            hotspot: true
          }
        }
      ],
      validation: Rule => Rule.max(10)
    },
    {
      name: 'tags',
      title: 'Tags',
      type: 'array',
      of: [{type: 'string'}],
      options: {
        layout: 'tags'
      },
      validation: Rule => Rule.max(10)
    },
    {
      name: 'featured',
      title: 'Featured',
      type: 'boolean',
      description: 'Display this artwork prominently on the home page',
      initialValue: false
    },
    {
      name: 'publishedAt',
      title: 'Published At',
      type: 'datetime',
      validation: Rule => Rule.required(),
      initialValue: () => new Date().toISOString()
    },
  ],
  preview: {
    select: {
      title: 'title',
      category: 'category',
      price: 'price',
      currency: 'currency',
      image: 'heroImage',
      availability: 'availability'
    },
    prepare(selection) {
      const {title, category, price, currency, image, availability} = selection;
      return {
        title: title,
        subtitle: `${category} - ${currency} ${price} ${availability === 'SoldOut' ? '(Sold Out)' : ''}`,
        media: image
      };
    }
  },
  orderings: [
    {
      title: 'Publish Date, New',
      name: 'publishedAtDesc',
      by: [
        {field: 'publishedAt', direction: 'desc'}
      ]
    },
    {
      title: 'Publish Date, Old',
      name: 'publishedAtAsc',
      by: [
        {field: 'publishedAt', direction: 'asc'}
      ]
    },
    {
      title: 'Title A-Z',
      name: 'titleAsc',
      by: [
        {field: 'title', direction: 'asc'}
      ]
    },
    {
      title: 'Price Low-High',
      name: 'priceAsc',
      by: [
        {field: 'price', direction: 'asc'}
      ]
    },
    {
      title: 'Price High-Low',
      name: 'priceDesc',
      by: [
        {field: 'price', direction: 'desc'}
      ]
    }
  ]
};