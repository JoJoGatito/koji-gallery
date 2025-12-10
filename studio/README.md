# Sanity Studio

This Studio is configured for projectId "emdgbbhp" and dataset "production". Schemas are re-exported from the repository-level ./schemas directory.

## Prerequisites
- Node.js 18+
- Sanity CLI (global): npm install -g @sanity/cli

## Setup
cd studio
npm install

## Development
npm run dev
# Opens http://localhost:3333

## Deploy (Sanity managed hosting)
npm run deploy
# Follow the prompt to choose a studio host (you can set one later in sanity.cli.js if desired)

## Notes
- Schema files are thin re-exports from ../schemas to avoid duplication.
- Frontend client config is in ../assets/js/sanityClient.js and already points to projectId "emdgbbhp" and dataset "production".
