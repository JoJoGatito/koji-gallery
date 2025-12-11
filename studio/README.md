# Sanity Studio

This Studio is configured for projectId "t0ligyjl" (Org ID "oUM5kIc1e") and dataset "production". Schemas are re-exported from the repository-level ./schemas directory.

## Prerequisites
- Node.js 18+
- Sanity CLI (global): npm install -g @sanity/cli

## Setup
cd studio
npm install

## Development
npm run dev
# Opens http://localhost:3333/studio

## Deploy Options

### 1. Sanity-managed hosting
npm run deploy
# Deploys to https://t0ligyjl.sanity.studio

### 2. Netlify-integrated hosting
# When deployed to Netlify, the Studio will be available at:
# https://koji-gallery.netlify.app/studio

### 1. Sanity-managed hosting
npm run deploy
# Deploys to https://t0ligyjl.sanity.studio

### 2. Netlify-integrated hosting
# When deployed to Netlify, the Studio will be available at:
# https://koji-gallery.netlify.app/studio

## Notes
- Schema files are thin re-exports from ../schemas to avoid duplication.
- Frontend client config is in ../assets/js/sanityClient.js and already points to projectId "t0ligyjl" and dataset "production".
