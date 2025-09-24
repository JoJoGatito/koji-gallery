// Artist Profile Schema for Sanity Studio (Optional)
// This file defines the structure for artist profile documents in your Sanity dataset

export default {
  name: 'artistProfile',
  title: 'Artist Profile',
  type: 'document',
  fields: [
    {
      name: 'name',
      title: 'Artist Name',
      type: 'string',
      validation: Rule => Rule.required().min(1).max(100)
    },
    {
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'name',
        maxLength: 96
      },
      validation: Rule => Rule.required()
    },
    {
      name: 'bio',
      title: 'Biography',
      type: 'array',
      of: [{type: 'block'}],
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
    },
    {
      name: 'socialLinks',
      title: 'Social Media Links',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'socialLink',
          title: 'Social Link',
          fields: [
            {
              name: 'platform',
              title: 'Platform',
              type: 'string',
              options: {
                list: [
                  {title: 'Instagram', value: 'instagram'},
                  {title: 'Twitter', value: 'twitter'},
                  {title: 'TikTok', value: 'tiktok'},
                  {title: 'YouTube', value: 'youtube'},
                  {title: 'DeviantArt', value: 'deviantart'},
                  {title: 'ArtStation', value: 'artstation'},
                  {title: 'Tumblr', value: 'tumblr'},
                  {title: 'Website', value: 'website'}
                ]
              },
              validation: Rule => Rule.required()
            },
            {
              name: 'url',
              title: 'URL',
              type: 'url',
              validation: Rule => Rule.required().uri({
                scheme: ['https', 'http']
              })
            }
          ],
          preview: {
            select: {
              title: 'platform',
              subtitle: 'url'
            }
          }
        }
      ],
      validation: Rule => Rule.max(10)
    },
    {
      name: 'featured',
      title: 'Featured Artist',
      type: 'boolean',
      description: 'Display this artist prominently on the site',
      initialValue: false
    },
    {
      name: 'skills',
      title: 'Skills & Specialties',
      type: 'array',
      of: [{type: 'string'}],
      description: 'List of artistic skills or specialties',
      options: {
        layout: 'tags'
      },
      validation: Rule => Rule.max(15)
    },
    {
      name: 'createdAt',
      title: 'Created At',
      type: 'datetime',
      validation: Rule => Rule.required(),
      initialValue: () => new Date().toISOString()
    }
  ],
  preview: {
    select: {
      title: 'name',
      subtitle: 'bio',
      image: 'profileImage'
    },
    prepare(selection) {
      const {title, subtitle, image} = selection;
      return {
        title: title,
        subtitle: subtitle ? subtitle[0].children[0].text.slice(0, 50) + '...' : 'No bio',
        media: image
      };
    }
  },
  orderings: [
    {
      title: 'Name A-Z',
      name: 'nameAsc',
      by: [
        {field: 'name', direction: 'asc'}
      ]
    },
    {
      title: 'Featured First',
      name: 'featuredDesc',
      by: [
        {field: 'featured', direction: 'desc'},
        {field: 'name', direction: 'asc'}
      ]
    }
  ]
};