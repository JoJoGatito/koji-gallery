// Schema Configuration for Sanity Studio
// This file exports all your schema types for Sanity Studio

import artwork from './artwork.js';
import blogPost from './blogPost.js';
import artistProfile from './artistProfile.js';

// Export all schemas
export const schemaTypes = [artwork, blogPost, artistProfile];

// Default export for Sanity configuration
export default {
  name: 'default',
  types: schemaTypes
};