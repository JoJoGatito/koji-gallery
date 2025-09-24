// Sanity Client Configuration and Utilities
// Project ID: your-project-id (placeholder)
// Dataset: production
// API Version: 2023-05-03
// Using CDN: true

import { createClient } from 'https://cdn.skypack.dev/@sanity/client@6.7.0';
import imageUrlBuilder from 'https://cdn.skypack.dev/@sanity/image-url@1.0.2';
import { PortableText } from 'https://cdn.skypack.dev/@portabletext/javascript@2.0.1';

// Import sample data for development mode
import sampleData from './sampleData.json' with { type: 'json' };

// Sanity client configuration
const client = createClient({
  projectId: 'your-project-id', // Replace with your actual project ID
  dataset: 'production',
  useCdn: true,
  apiVersion: '2023-05-03'
});

// Image URL builder
const builder = imageUrlBuilder(client);

// GROQ Queries
const GROQ_QUERIES = {
  // Home page: Fetch latest 3 OC artworks, latest 3 Fan Art, and latest blog post
  HOME_PAGE: `
    {
      "ocArtworks": *[_type == "artwork" && category == "OC" && featured == true] | order(publishedAt desc)[0...3] {
        _id,
        title,
        slug,
        category,
        description,
        price,
        currency,
        availability,
        heroImage,
        images,
        tags,
        featured,
        publishedAt,
        stripePaymentLink
      },
      "fanArtworks": *[_type == "artwork" && category == "FanArt" && featured == true] | order(publishedAt desc)[0...3] {
        _id,
        title,
        slug,
        category,
        description,
        price,
        currency,
        availability,
        heroImage,
        images,
        tags,
        featured,
        publishedAt,
        stripePaymentLink
      },
      "latestBlogPost": *[_type == "blogPost"] | order(publishedAt desc)[0] {
        _id,
        title,
        slug,
        excerpt,
        mainImage,
        publishedAt
      }
    }
  `,

  // Gallery page: Fetch all artworks with filtering by category
  GALLERY_ALL: `
    *[_type == "artwork"] | order(publishedAt desc) {
      _id,
      title,
      slug,
      category,
      description,
      price,
      currency,
      availability,
      heroImage,
      images,
      tags,
      featured,
      publishedAt,
      stripePaymentLink
    }
  `,

  GALLERY_BY_CATEGORY: (category) => `
    *[_type == "artwork" && category == "${category}"] | order(publishedAt desc) {
      _id,
      title,
      slug,
      category,
      description,
      price,
      currency,
      availability,
      heroImage,
      images,
      tags,
      featured,
      publishedAt,
      stripePaymentLink
    }
  `,

  // Blog page: Fetch all blog posts
  ALL_BLOG_POSTS: `
    *[_type == "blogPost"] | order(publishedAt desc) {
      _id,
      title,
      slug,
      excerpt,
      mainImage,
      body,
      tags,
      publishedAt
    }
  `,

  // Individual blog post by slug
  BLOG_POST_BY_SLUG: (slug) => `
    *[_type == "blogPost" && slug.current == "${slug}"][0] {
      _id,
      title,
      slug,
      excerpt,
      mainImage,
      body,
      tags,
      publishedAt
    }
  `
};

// Sanity Client Class
class SanityClient {
  constructor() {
    this.client = client;
    this.builder = builder;
    this.developmentMode = this.checkDevelopmentMode();
    this.sampleData = sampleData;
  }

  // Check if development mode should be enabled
  checkDevelopmentMode() {
    // Enable dev mode if:
    // 1. No projectId is configured (still using placeholder)
    // 2. URL contains ?dev=true parameter
    // 3. Sanity API returns an error
    const urlParams = new URLSearchParams(window.location.search);
    const isDevParam = urlParams.get('dev') === 'true';
    const isPlaceholderProject = client.config().projectId === 'your-project-id';

    return isDevParam || isPlaceholderProject;
  }

  // Fetch data using GROQ queries
  async fetch(query) {
    // If development mode is enabled, try to get sample data first
    if (this.developmentMode) {
      console.log('🎨 Development mode enabled - using sample data');
      const sampleData = this.getSampleDataForQuery(query);
      if (sampleData) {
        return sampleData;
      }
    }

    try {
      const data = await this.client.fetch(query);
      return data;
    } catch (error) {
      console.error('Error fetching data from Sanity:', error);

      // If Sanity API fails and we have sample data, fall back to it
      if (this.developmentMode) {
        console.log('⚠️ Sanity API failed - falling back to sample data');
        return this.getSampleDataForQuery(query);
      }

      return null;
    }
  }

  // Get sample data that matches the query structure
  getSampleDataForQuery(query) {
    // Extract the main query type to determine what sample data to return
    if (query.includes('artwork')) {
      if (query.includes('category == "OC"')) {
        return this.sampleData.artworks.filter(art => art.category === 'OC').slice(0, 3);
      } else if (query.includes('category == "FanArt"')) {
        return this.sampleData.artworks.filter(art => art.category === 'FanArt').slice(0, 3);
      } else {
        return this.sampleData.artworks;
      }
    } else if (query.includes('blogPost')) {
      if (query.includes('slug.current')) {
        // Single blog post query - return first blog post as default
        return this.sampleData.blogPosts[0];
      } else {
        return this.sampleData.blogPosts;
      }
    } else if (query.includes('artistProfile')) {
      return this.sampleData.artistProfile;
    }

    return null;
  }

  // Optimized image URL with different sizes
  getImageUrl(source, width = 800, height = null, format = 'webp', quality = 80) {
    if (!source) return null;

    let urlBuilder = this.builder.image(source)
      .width(width)
      .format(format)
      .quality(quality);

    if (height) {
      urlBuilder = urlBuilder.height(height);
    }

    return urlBuilder.url();
  }

  // Generate srcset attribute for responsive images
  getImageSrcset(source, widths = [400, 800, 1200, 1600], format = 'webp', quality = 80) {
    if (!source) return '';

    return widths.map(width => {
      const url = this.getImageUrl(source, width, null, format, quality);
      return `${url} ${width}w`;
    }).join(', ');
  }

  // Get sizes attribute for responsive images
  getImageSizes(customSizes = null) {
    if (customSizes) return customSizes;

    // Default responsive sizes for artwork images
    return '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw';
  }

  // Process Sanity image object for responsive images
  processImageForResponsive(source, alt = '', customSizes = null) {
    if (!source) return null;

    const src = this.getImageUrl(source, 800);
    const srcset = this.getImageSrcset(source);
    const sizes = this.getImageSizes(customSizes);

    return {
      src,
      srcset,
      sizes,
      alt,
      original: source
    };
  }

  // Portable Text renderer for blog content
  renderPortableText(blocks) {
    if (!blocks || !Array.isArray(blocks)) return '';

    return blocks.map(block => {
      switch (block._type) {
        case 'block':
          const markTags = this.renderMarks(block);
          const blockTag = block.style === 'blockquote' ? 'blockquote' : 'p';
          return `<${blockTag}${block.style === 'h1' ? ' class="blog-h1"' : block.style === 'h2' ? ' class="blog-h2"' : block.style === 'blockquote' ? ' class="blog-blockquote"' : ''}>${markTags}</${blockTag}>`;

        case 'image':
          const imageUrl = this.getImageUrl(block.asset, 800);
          const imageAlt = block.alt || '';
          const caption = block.caption ? `<figcaption>${block.caption}</figcaption>` : '';
          return `<figure><img src="${imageUrl}" alt="${imageAlt}" class="blog-image"><figcaption>${caption}</figcaption></figure>`;

        default:
          return '';
      }
    }).join('');
  }

  // Render marks (bold, italic, links, etc.)
  renderMarks(block) {
    if (!block.marks || block.marks.length === 0) {
      return block.children.map(child => child.text).join('');
    }

    let text = block.children.map(child => {
      let processedText = child.text;

      if (child.marks) {
        child.marks.forEach(mark => {
          const markDef = block.markDefs?.find(def => def._key === mark);
          switch (mark) {
            case 'strong':
              processedText = `<strong>${processedText}</strong>`;
              break;
            case 'em':
              processedText = `<em>${processedText}</em>`;
              break;
            case 'code':
              processedText = `<code>${processedText}</code>`;
              break;
            case 'underline':
              processedText = `<u>${processedText}</u>`;
              break;
            case 'link':
              const href = markDef?.href || '#';
              const target = markDef?.blank ? ' target="_blank" rel="noopener"' : '';
              processedText = `<a href="${href}"${target}>${processedText}</a>`;
              break;
          }
        });
      }

      return processedText;
    }).join('');

    return text;
  }

  // Get home page data
  async getHomePageData() {
    if (this.developmentMode) {
      // Return structured sample data matching the home page query format
      return {
        ocArtworks: this.sampleData.artworks.filter(art => art.category === 'OC' && art.featured).slice(0, 3),
        fanArtworks: this.sampleData.artworks.filter(art => art.category === 'FanArt' && art.featured).slice(0, 3),
        latestBlogPost: this.sampleData.blogPosts[0]
      };
    }

    return await this.fetch(GROQ_QUERIES.HOME_PAGE);
  }

  // Get gallery data (all artworks)
  async getGalleryData(category = null) {
    const query = category ? GROQ_QUERIES.GALLERY_BY_CATEGORY(category) : GROQ_QUERIES.GALLERY_ALL;
    return await this.fetch(query);
  }

  // Get all blog posts
  async getAllBlogPosts() {
    return await this.fetch(GROQ_QUERIES.ALL_BLOG_POSTS);
  }

  // Get blog post by slug
  async getBlogPostBySlug(slug) {
    if (this.developmentMode) {
      // Find blog post by slug in sample data
      const blogPost = this.sampleData.blogPosts.find(post =>
        post.slug.current === slug
      );
      return blogPost || this.sampleData.blogPosts[0]; // Fallback to first post
    }

    return await this.fetch(GROQ_QUERIES.BLOG_POST_BY_SLUG(slug));
  }

  // Search artworks by title or tags
  async searchArtworks(searchTerm) {
    const query = `
      *[_type == "artwork" && (title match "*${searchTerm}*" || string::join(tags, " ") match "*${searchTerm}*")] | order(publishedAt desc) {
        _id,
        title,
        slug,
        category,
        description,
        price,
        currency,
        availability,
        heroImage,
        images,
        tags,
        featured,
        publishedAt,
        stripePaymentLink
      }
    `;
    return await this.fetch(query);
  }

  // Get featured artworks
  async getFeaturedArtworks() {
    if (this.developmentMode) {
      return this.sampleData.artworks.filter(artwork => artwork.featured);
    }

    const query = `
      *[_type == "artwork" && featured == true] | order(publishedAt desc) {
        _id,
        title,
        slug,
        category,
        description,
        price,
        currency,
        availability,
        heroImage,
        images,
        tags,
        featured,
        publishedAt,
        stripePaymentLink
      }
    `;
    return await this.fetch(query);
  }

  // Get artist profile
  async getArtistProfile() {
    if (this.developmentMode) {
      return this.sampleData.artistProfile;
    }

    // In a real implementation, this would fetch from Sanity
    // For now, return null as artist profile is optional
    return null;
  }
}

// Artwork Data Manager for gallery functionality
class ArtworkDataManager {
  constructor() {
    this.sanityClient = new SanityClient();
    this.artworks = new Map();
    this.categories = new Set();
    this.loaded = false;
  }

  // Initialize artwork data
  async initialize() {
    if (this.loaded) return;

    try {
      const data = await this.sanityClient.getGalleryData();
      if (data && Array.isArray(data)) {
        data.forEach(artwork => {
          this.artworks.set(artwork._id, artwork);
          if (artwork.category) {
            this.categories.add(artwork.category);
          }
        });
      }
      this.loaded = true;
    } catch (error) {
      console.error('Error initializing artwork data:', error);
    }
  }

  // Get artwork by ID
  getArtworkById(id) {
    return this.artworks.get(id);
  }

  // Get all artworks
  getAllArtworks() {
    return Array.from(this.artworks.values());
  }

  // Get artworks by category
  getArtworksByCategory(category) {
    return Array.from(this.artworks.values()).filter(artwork => artwork.category === category);
  }

  // Get featured artworks
  getFeaturedArtworks() {
    return Array.from(this.artworks.values()).filter(artwork => artwork.featured);
  }

  // Get available artworks (not sold out)
  getAvailableArtworks() {
    return Array.from(this.artworks.values()).filter(artwork => artwork.availability !== 'SoldOut');
  }

  // Search artworks
  async searchArtworks(searchTerm) {
    if (!this.loaded) {
      await this.initialize();
    }

    // First try local search
    const localResults = Array.from(this.artworks.values()).filter(artwork =>
      artwork.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      artwork.tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    if (localResults.length > 0) {
      return localResults;
    }

    // Fallback to Sanity search
    return await this.sanityClient.searchArtworks(searchTerm);
  }
}

// Export singleton instances
const sanityClient = new SanityClient();
const artworkData = new ArtworkDataManager();

// Make available globally
window.sanityClient = sanityClient;
window.artworkData = artworkData;
window.ArtworkDataManager = ArtworkDataManager;

// Export for module usage
export { SanityClient, ArtworkDataManager, GROQ_QUERIES };
export default sanityClient;