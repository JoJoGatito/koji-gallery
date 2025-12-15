document.addEventListener('DOMContentLoaded', async () => {
  if (!window.sanityClient) {
    console.warn('Sanity client not available on blog page');
    return;
  }

  const setImageFromSanity = (imgEl, sanityImage, altFallback) => {
    if (!imgEl || !sanityImage) return;

    const responsive = window.sanityClient.processImageForResponsive(
      sanityImage,
      altFallback || imgEl.alt || ''
    );

    if (!responsive || !responsive.src) return;

    imgEl.src = responsive.src;
    if (responsive.srcset) {
      imgEl.srcset = responsive.srcset;
      imgEl.sizes = responsive.sizes;
    }
    if (responsive.alt) {
      imgEl.alt = responsive.alt;
    } else if (altFallback) {
      imgEl.alt = altFallback;
    }
  };

  try {
    const allPosts = await window.sanityClient.getAllBlogPosts();
    if (!Array.isArray(allPosts) || !allPosts.length) {
      console.warn('No blog posts returned from Sanity');
      return;
    }

    const postsBySlug = new Map(
      allPosts
        .filter(post => post.slug && post.slug.current)
        .map(post => [post.slug.current, post])
    );

    // Update OG/Twitter image meta tags:
    const urlParams = new URLSearchParams(window.location.search);
    const currentSlug = urlParams.get('slug');

    let selectedPost = null;
    if (currentSlug && postsBySlug.has(currentSlug)) {
      selectedPost = postsBySlug.get(currentSlug);
    } else {
      selectedPost = allPosts[0];
    }

    if (selectedPost && selectedPost.mainImage) {
      const ogUrl = window.sanityClient.getImageUrl(selectedPost.mainImage, 1200, null);
      if (ogUrl) {
        const ogMeta = document.querySelector('meta[property="og:image"]');
        const twitterMeta = document.querySelector('meta[name="twitter:image"]');
        if (ogMeta) ogMeta.setAttribute('content', ogUrl);
        if (twitterMeta) twitterMeta.setAttribute('content', ogUrl);
      }
    }

    // Update each visible blog card with Sanity data
    const articles = document.querySelectorAll('.blog-post');
    articles.forEach(article => {
      const slug = article.dataset.slug;
      if (!slug || !postsBySlug.has(slug)) return;

      const post = postsBySlug.get(slug);

      // Hero image for the card
      const imgEl = article.querySelector('.blog-post-image');
      setImageFromSanity(imgEl, post.mainImage, post.title);

      // Title
      const titleEl = article.querySelector('.blog-post-title');
      if (titleEl && post.title) {
        titleEl.textContent = post.title;
      }

      // Date meta (keep category/read-time text from static HTML)
      const dateEl = article.querySelector('.blog-post-meta .meta-date');
      if (dateEl && post.publishedAt) {
        const date = new Date(post.publishedAt);
        if (!isNaN(date.getTime())) {
          dateEl.textContent = date.toLocaleDateString(undefined, {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          });
        }
      }

      // Excerpt
      const excerptEl = article.querySelector('.blog-post-excerpt');
      if (excerptEl && post.excerpt) {
        excerptEl.textContent = post.excerpt;
      }

      // Remove any placeholder inline images in the full content to avoid broken icons
      const fullEl = article.querySelector('.blog-post-full');
      if (fullEl) {
        const placeholderImages = fullEl.querySelectorAll('img.blog-image');
        placeholderImages.forEach(img => img.remove());
      }
    });
  } catch (error) {
    console.error('Error initializing blog page from Sanity:', error);
  }
});