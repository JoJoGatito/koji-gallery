// Sanity Studio configuration
import { defineConfig } from 'sanity'
import { deskTool } from 'sanity/desk'

import artwork from './schemas/artwork.js'
import blogPost from './schemas/blogPost.js'
import artistProfile from './schemas/artistProfile.js'

export default defineConfig({
  name: 'default',
  title: 'Art Website CMS',
  projectId: 't0ligyjl',
  dataset: 'production',
  basePath: '/',
  plugins: [
    deskTool(),
  ],
  schema: {
    types: [artwork, blogPost, artistProfile],
  },
})