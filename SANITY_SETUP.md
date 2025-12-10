# Sanity Integration Setup Guide

This guide will help you set up Sanity as the content management system for your art website.

## Table of Contents

1. [Creating a Sanity Project](#creating-a-sanity-project)
2. [Project Configuration](#project-configuration)
3. [CORS Configuration](#cors-configuration)
4. [Installing Schemas](#installing-schemas)
5. [Stripe Payment Links Setup](#stripe-payment-links-setup)
6. [Using the Sanity Client](#using-the-sanity-client)
7. [Troubleshooting](#troubleshooting)

## Creating a Sanity Project

### Step 1: Install Sanity CLI

```bash
npm install -g @sanity/cli
```

### Step 2: Create a New Project

```bash
sanity init
```

Follow the prompts:
- **Template**: Select "Clean project with no predefined schemas"
- **Project name**: Enter your project name (e.g., "art-website")
- **Dataset name**: Use "production" for live site
- **Visibility**: Choose "Public" for CDN access
- **Project output path**: Press Enter for current directory

### Step 3: Get Your Project ID

After project creation, Sanity will provide you with:
- **Project ID**: A unique identifier (e.g., `abc123`)
- **Dataset**: `production` (default)
- **API version**: Use the latest version

Update your `assets/js/sanityClient.js` file with your actual project ID:

```javascript
const client = createClient({
  projectId: 'emdgbbhp',
  dataset: 'production',
  useCdn: true,
  apiVersion: '2023-05-03'
});
```

## Project Configuration

### Sanity Configuration Files

1. **sanity.config.js** - Main configuration file
2. **schemas/** - Directory containing your schema definitions

### Basic Sanity Configuration

```javascript
// sanity.config.js
import {defineConfig} from 'sanity'
import {deskTool} from 'sanity/desk'
import {schemaTypes} from './schemas'

export default defineConfig({
  name: 'default',
  title: 'Art Website CMS',

  projectId: 'emdgbbhp',
  dataset: 'production',

  plugins: [deskTool()],

  schema: {
    types: schemaTypes,
  },
})
```

## CORS Configuration

For your GitHub Pages domain to access Sanity's API, you need to configure CORS settings.

### Step 1: Access Sanity Management Console

1. Go to [sanity.io/manage](https://sanity.io/manage)
2. Select your project
3. Go to **API** tab
4. Click **CORS** in the left sidebar

### Step 2: Add Your Domain

Add the following origins:
- `https://jojogatito.github.io`
- `http://localhost:5500`
- `http://127.0.0.1:5500`

**Operational Notes**:
- The `localhost` and `127.0.0.1` origins are for local development, allowing the frontend to connect to the Sanity API when running on a local server.
- The `jojogatito.github.io` origin is for the production deployment on GitHub Pages.
- If the deployment domain changes in the future, this list of CORS origins must be updated in the Sanity project settings to ensure the frontend can continue to fetch data.

### Step 3: Allowed Headers and Methods

Ensure these settings are configured:
- **Allowed Headers**: `Authorization, Content-Type`
- **Allowed Methods**: `GET, POST, PUT, DELETE` (if you plan to edit content)
- **Allow credentials**: ✅ Enabled

## Installing Schemas

### Step 1: Copy Schema Files

Copy the schema files from this project to your Sanity project:

```bash
# From your art website project directory
cp schemas/* your-sanity-project/schemas/
```

### Step 2: Update Schema Imports

In your Sanity project's `sanity.config.js`:

```javascript
// sanity.config.js
import {defineConfig} from 'sanity'
import {deskTool} from 'sanity/desk'
import artwork from './schemas/artwork'
import blogPost from './schemas/blogPost'
import artistProfile from './schemas/artistProfile'

export default defineConfig({
  name: 'default',
  title: 'Art Website CMS',

  projectId: 'emdgbbhp',
  dataset: 'production',

  plugins: [deskTool()],

  schema: {
    types: [artwork, blogPost, artistProfile],
  },
})
```

### Step 3: Deploy Schemas

```bash
# In your Sanity project directory
sanity deploy
```

## Stripe Payment Links Setup

### Step 1: Create Stripe Account

1. Go to [stripe.com](https://stripe.com)
2. Sign up for an account
3. Complete the onboarding process

### Step 2: Create Products

For each artwork:

1. Go to your Stripe Dashboard
2. Navigate to **Products**
3. Click **Add product**
4. Fill in:
   - **Name**: Artwork title
   - **Price**: Set the price
   - **Currency**: USD, EUR, or GBP
   - **Images**: Upload artwork images
   - **Description**: Artwork description

### Step 3: Generate Payment Links

1. In the product, click **Create payment link**
2. Configure:
   - **Success URL**: `https://yourusername.github.io/success`
   - **Cancel URL**: `https://yourusername.github.io/cancel`
   - **Allow promotion codes**: Optional
   - **Customer email**: Required for receipts
3. Click **Create link**
4. Copy the payment link URL

### Step 4: Add Payment Links to Sanity

1. Open Sanity Studio
2. Navigate to an artwork document
3. Scroll to **Stripe Payment Link** field
4. Paste the payment link URL
5. Save the document

## Using the Sanity Client

### Basic Usage

```javascript
import sanityClient from './assets/js/sanityClient.js';

// Get home page data
const homeData = await sanityClient.getHomePageData();
console.log(homeData);

// Get gallery data
const artworks = await sanityClient.getGalleryData();
console.log(artworks);

// Get blog posts
const blogPosts = await sanityClient.getAllBlogPosts();
console.log(blogPosts);
```

### Image Optimization

```javascript
// Get optimized image URL
const imageUrl = sanityClient.getImageUrl(imageAsset, 800, 600, 'webp', 80);

// Get responsive image data
const responsiveImage = sanityClient.processImageForResponsive(imageAsset, 'Alt text');
console.log(responsiveImage.srcset); // For srcset attribute
console.log(responsiveImage.sizes);  // For sizes attribute
```

### Portable Text Rendering

```javascript
// Render blog content
const htmlContent = sanityClient.renderPortableText(blogPost.body);
document.querySelector('.blog-content').innerHTML = htmlContent;
```

## Troubleshooting

### Common Issues

#### 1. CORS Errors

**Error**: `Access-Control-Allow-Origin` error

**Solution**:
- Verify CORS settings in Sanity Management Console
- Ensure your domain is added to allowed origins
- Check that credentials are allowed

#### 2. Project ID Not Found

**Error**: `Project "your-project-id" not found`

**Solution**:
- Verify your project ID in Sanity Management Console
- Update `assets/js/sanityClient.js` with correct project ID
- Check that the project is not deleted

#### 3. Images Not Loading

**Error**: Images return 403 or 404

**Solution**:
- Check image asset references in Sanity documents
- Verify image upload completed successfully
- Ensure images are published (not in draft state)

#### 4. API Rate Limiting

**Error**: `Rate limit exceeded`

**Solution**:
- Reduce number of concurrent requests
- Implement caching for frequently accessed data
- Consider using Sanity's CDN more effectively

### Performance Optimization

1. **Enable CDN**: Set `useCdn: true` in client configuration
2. **Cache responses**: Implement client-side caching for static data
3. **Optimize images**: Use appropriate image sizes and formats
4. **Batch requests**: Combine multiple queries when possible

### Development Workflow

1. **Local Development**: Use `sanity dev` for local Sanity Studio
2. **Content Updates**: Edit content in Sanity Studio, deploy changes
3. **Image Management**: Upload and manage images through Sanity Studio
4. **Preview**: Use Sanity's preview feature to test content before publishing

## Support

For additional help:
- [Sanity Documentation](https://www.sanity.io/docs)
- [Sanity Community](https://sanity-io-land.slack.com/)
- [Stripe Documentation](https://stripe.com/docs)

## Next Steps

1. Set up your Sanity project following this guide
2. Create sample artwork and blog post documents
3. Test the integration with your website
4. Configure Stripe payment links for your artworks
5. Deploy your updated website to GitHub Pages

---

*This setup guide is specifically tailored for your art website project. Make sure to replace placeholder values with your actual project details.*