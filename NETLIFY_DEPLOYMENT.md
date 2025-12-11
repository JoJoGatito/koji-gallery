# Netlify Deployment Guide

This document describes how to deploy the static Koji’s Art Studio website to Netlify, including prerequisites, required configuration, step‑by‑step setup, Sanity integration with build hooks, CORS settings, and troubleshooting. It complements the broader QA and launch guidance in [DEPLOYMENT.md](DEPLOYMENT.md) and focuses specifically on Netlify.

## 1) Introduction

This guide covers:
- How to deploy this static site to Netlify (no framework build required)
- How to configure [netlify.toml](netlify.toml) for publishing and 404 behavior
- How to connect Netlify Build Hooks to Sanity webhooks so content changes auto‑trigger a redeploy
- How to configure Sanity CORS for Netlify domains
- Common deployment issues and fixes

If you are looking for comprehensive pre‑launch QA, performance, and accessibility checks, see [DEPLOYMENT.md](DEPLOYMENT.md).

## 2) Prerequisites

Before starting, ensure you have:
- A Netlify account with access to create sites
- The site code in a Git repository (GitHub recommended)
- Project files at the repository root (static HTML/CSS/JS), including:
  - [index.html](index.html)
  - [gallery.html](gallery.html)
  - [blog.html](blog.html)
  - [404.html](404.html)
  - Assets under [assets/](assets)
  - Sanity client configuration in [assets/js/sanityClient.js](assets/js/sanityClient.js:14)
- Sanity project configured for public, read‑only access:
  - Project ID: `emdgbbhp` (see [assets/js/sanityClient.js](assets/js/sanityClient.js:15))
  - Dataset: `production` (see [assets/js/sanityClient.js](assets/js/sanityClient.js:16))
  - API Version: `2024-10-01` (see [assets/js/sanityClient.js](assets/js/sanityClient.js:18))
  - useCdn: `true` (see [assets/js/sanityClient.js](assets/js/sanityClient.js:17))
- Sanity CORS configured (see [SANITY_CORS_DATASET_GUIDE.md](SANITY_CORS_DATASET_GUIDE.md)):
  - Add your Netlify site origin(s), e.g. `https://<your-site>.netlify.app`
  - Add your custom domain origin (if using), e.g. `https://example.com`
  - Keep localhost dev origins as needed (`http://localhost:5500`, `http://127.0.0.1:5500`)
  - Credentials OFF

## 3) Netlify Configuration

The repository includes a minimal [netlify.toml](netlify.toml) with:
```toml
# Netlify configuration for a minimal static site

[build]
  # Publish the root of the repository (all site files are in the repo root)
  publish = "."

# 404 handling
# Netlify will automatically serve /404.html for missing pages.
# The redirect below makes this behavior explicit (no SPA redirects involved).
[[redirects]]
  from = "/*"
  to = "/404.html"
  status = 404
```

Key points:
- Publish directory: The site is a plain static site located at the repository root. `publish = "."` (see [netlify.toml](netlify.toml:5)).
- No build command: There is no bundler or framework build step required. Netlify should be configured with “No build command”.
- 404 behavior: Explicit redirect ensures missing routes render [404.html](404.html). See [netlify.toml](netlify.toml:10)–[netlify.toml](netlify.toml:13).
- SPA note: This site is not a single‑page app that needs `200` fallback routing. Do not set SPA catch‑all redirects.

Optional enhancements (add to [netlify.toml](netlify.toml) if desired):
- Static asset caching:
  ```toml
  [[headers]]
    for = "/assets/*"
    [headers.values]
      Cache-Control = "public, max-age=31536000, immutable"
  ```
- Basic security headers:
  ```toml
  [[headers]]
    for = "/*"
    [headers.values]
      X-Content-Type-Options = "nosniff"
      Referrer-Policy = "strict-origin-when-cross-origin"
      X-Frame-Options = "DENY"
      X-XSS-Protection = "0"
  ```

## 4) Setting Up Netlify

Follow these steps to create and connect your Netlify site to the Git repo:

1) Create a new site from Git
- Log in to Netlify
- New site from Git → Choose provider (e.g., GitHub)
- Select your repository

2) Basic build settings
- Base directory: leave empty (root)
- Build command: None (do not set any build command)
- Publish directory: `.` (a single dot)

3) Advanced settings (optional)
- Environment variables: Not required for public, read‑only Sanity access since [assets/js/sanityClient.js](assets/js/sanityClient.js:14) is configured with public dataset and CDN. No token needed.
- Node version: Not required (no build)

4) Deploy
- Click “Deploy site”
- Once deployed, Netlify assigns a default URL: `https://<your-site>.netlify.app`

5) Custom domain (optional)
- Add a custom domain in Netlify → Domains
- Update DNS with your provider per Netlify instructions
- Ensure Sanity CORS includes the custom origin (see [SANITY_CORS_DATASET_GUIDE.md](SANITY_CORS_DATASET_GUIDE.md))

6) Post‑deploy verification
- Open the deployed site
- Open dev tools → Console: ensure there are no CORS or runtime errors
- Verify key pages load and populate content from Sanity:
  - [index.html](index.html)
  - [gallery.html](gallery.html)
  - [blog.html](blog.html)

## 5) Sanity Integration (Build Hooks + CORS)

For a static site, content changes in Sanity will not appear until Netlify re‑deploys. Use a Netlify Build Hook and a Sanity webhook to trigger redeploys automatically.

A) Create a Netlify Build Hook
- Netlify → Site settings → Build & deploy → Build hooks
- Add build hook
- Name: “Sanity content change”
- Branch to build: production branch (e.g., main)
- Copy the generated Build Hook URL

B) Add a Sanity Webhook
- Go to https://sanity.io/manage → Select your project (`emdgbbhp`)
- Settings → API → Webhooks → “Add webhook”
- URL: Paste the Netlify Build Hook URL
- Method: POST
- Trigger on events: Create, Update, Delete
- Filter document types: `artwork`, `blogPost` (adjust as needed)
- Drafts: For public dataset + CDN, you typically want published content. Trigger on published changes.
- Save

C) Configure CORS for Netlify
Add the following origins in Sanity CORS (see [SANITY_CORS_DATASET_GUIDE.md](SANITY_CORS_DATASET_GUIDE.md)):
- Production:
  - `https://<your-site>.netlify.app`
  - `https://<your-custom-domain>` (if using)
- Development:
  - `http://localhost:5500`
  - `http://127.0.0.1:5500`
- Credentials: OFF

D) Verify data loading
- The client uses CDN, no token, read‑only, via:
  - Project ID and dataset in [assets/js/sanityClient.js](assets/js/sanityClient.js:15)–[assets/js/sanityClient.js](assets/js/sanityClient.js:16)
  - `useCdn: true` in [assets/js/sanityClient.js](assets/js/sanityClient.js:17)
  - `apiVersion: '2024-10-01'` in [assets/js/sanityClient.js](assets/js/sanityClient.js:18)

Notes on CDN freshness:
- Sanity CDN is fast and cache‑friendly. After a webhook‑triggered redeploy, content should update.
- If you still see stale content, hard‑refresh, or temporarily set `useCdn: false` in [assets/js/sanityClient.js](assets/js/sanityClient.js:17) to validate freshness, then revert.

## 6) Troubleshooting

General
- Site does not load / blank page
  - Ensure Publish directory = `.` and there is no build command
  - Confirm [index.html](index.html) is at repo root
  - Verify [netlify.toml](netlify.toml) exists at repo root

404 / routing
- Unexpected 404s for valid pages
  - Confirm files exist at expected paths and correct casing (Netlify hosting is case‑sensitive)
  - Ensure the explicit 404 redirect (see [netlify.toml](netlify.toml:10)–[netlify.toml](netlify.toml:13)) is present and there are no conflicting redirects

CORS / Sanity
- CORS errors in browser console
  - Confirm Netlify site origin and any custom domain are added to Sanity CORS
  - Ensure credentials are OFF
  - Keep localhost dev origins if testing locally
- Content not updating after changes
  - Check that the Netlify Build Hook is invoked from Sanity (see Netlify deploy logs)
  - Trigger a manual “Deploy” to confirm pipeline works
  - Check CDN freshness; toggling `useCdn` (see [assets/js/sanityClient.js](assets/js/sanityClient.js:17)) can help diagnose

Assets / paths
- Broken images or CSS/JS not loading
  - Verify relative paths and case sensitivity (e.g., `assets/css/theme.css` must match exactly)
  - Confirm files exist in the deployed artifact (Netlify deploy summary → “Browse deploy”)

Build hook / webhook issues
- Netlify deploy not triggered on content updates
  - Re‑check Sanity webhook URL (must be the Netlify Build Hook URL)
  - Ensure events (create/update/delete) and document types are correctly configured
  - Review Netlify “Deploys” → “Logs” for incoming hook events and build status

Caching / stale content
- Browser shows old content after successful deploy
  - Hard refresh (Cmd+Shift+R / Ctrl+F5)
  - If using custom caching headers, validate they’re not overly aggressive
  - Consider versioning asset URLs if you later introduce a build step

Mixed content / HTTPS
- Some assets blocked after adding a custom domain
  - Ensure all external resources use HTTPS
  - Update any `http://` references to `https://`

## 7) References

Project files
- Primary deployment config: [netlify.toml](netlify.toml)
- Sanity client configuration: [assets/js/sanityClient.js](assets/js/sanityClient.js:14)
- CORS and dataset setup: [SANITY_CORS_DATASET_GUIDE.md](SANITY_CORS_DATASET_GUIDE.md)
- General QA and launch: [DEPLOYMENT.md](DEPLOYMENT.md)

Netlify documentation
- Deploy from Git: https://docs.netlify.com/site-deploys/create-deploys/#deploy-with-git
- netlify.toml reference: https://docs.netlify.com/configure-builds/file-based-configuration/
- Redirects and rewrites: https://docs.netlify.com/routing/redirects/
- Build hooks: https://docs.netlify.com/configure-builds/build-hooks/

Sanity documentation
- CORS: https://www.sanity.io/docs/cors
- Webhooks: https://www.sanity.io/docs/webhooks
- CDN and API versions: https://www.sanity.io/docs/api-versioning

---

Post‑deployment checklist (quick)
- [ ] Netlify site deployed with Publish directory = `.`
- [ ] 404 behavior confirmed with [404.html](404.html)
- [ ] Sanity CORS includes Netlify and custom domain origins; Credentials OFF
- [ ] Netlify Build Hook created; Sanity webhook calls it on content changes
- [ ] Content updates redeploy successfully and appear on the site