document.addEventListener('DOMContentLoaded', async () => {
  if (!window.sanityClient) {
    console.warn('Sanity client not available on homepage');
    return;
  }

  try {
    const data = await window.sanityClient.getHomePageData();
    if (!data) {
      console.warn('No home page data returned from Sanity');
      return;
    }

    const { ocArtworks = [], fanArtworks = [], latestBlogPost = null } = data;

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

    // Locate the three corkboard sections:
    // 1) Latest OC Art
    // 2) Latest Fan Art
    // 3) Latest Blog Post
    const corkSections = document.querySelectorAll('.latest-work .corkboard-section');

    const ocSection = corkSections[0];
    const fanSection = corkSections[1];
    const blogSection = corkSections[2];

    // Map OC artworks to first corkboard section thumbnails
    if (ocSection && ocArtworks.length) {
      const notes = ocSection.querySelectorAll('.corkboard-grid .pinned-note');
      ocArtworks.slice(0, notes.length).forEach((artwork, index) => {
        const note = notes[index];
        if (!note) return;
        const img = note.querySelector('img.artwork-thumb');
        setImageFromSanity(img, artwork.heroImage, artwork.title);
      });
    }

    // Map Fan Art artworks to second corkboard section thumbnails
    if (fanSection && fanArtworks.length) {
      const notes = fanSection.querySelectorAll('.corkboard-grid .pinned-note');
      fanArtworks.slice(0, notes.length).forEach((artwork, index) => {
        const note = notes[index];
        if (!note) return;
        const img = note.querySelector('img.artwork-thumb');
        setImageFromSanity(img, artwork.heroImage, artwork.title);
      });
    }

    // Latest blog post card thumbnail + link
    if (blogSection && latestBlogPost) {
      const note = blogSection.querySelector('.corkboard-grid .pinned-note');
      if (note) {
        const img = note.querySelector('img.artwork-thumb');
        setImageFromSanity(img, latestBlogPost.mainImage, latestBlogPost.title);

        const link = note.querySelector('a[href^="blog.html"]');
        if (link && latestBlogPost.slug && latestBlogPost.slug.current) {
          link.href = `blog.html?slug=${encodeURIComponent(latestBlogPost.slug.current)}`;
        }

        const titleEl = note.querySelector('h4');
        if (titleEl && latestBlogPost.title) {
          titleEl.textContent = latestBlogPost.title;
        }
      }
    }

    // Artist avatar image: use a featured OC artwork hero as a stand-in if available
    const avatarImg = document.querySelector('.artist-bio .bio-image img.avatar');
    if (avatarImg) {
      const avatarSource =
        (ocArtworks.find(a => a.heroImage) || fanArtworks.find(a => a.heroImage)) || null;
      if (avatarSource && avatarSource.heroImage) {
        setImageFromSanity(avatarImg, avatarSource.heroImage, "Koji's avatar");
      }
    }

    // Homepage OG/Twitter image: prefer first OC hero, fall back to latest blog main image
    let ogImageUrl = null;
    if (ocArtworks[0] && ocArtworks[0].heroImage) {
      ogImageUrl = window.sanityClient.getImageUrl(ocArtworks[0].heroImage, 1200, null);
    } else if (latestBlogPost && latestBlogPost.mainImage) {
      ogImageUrl = window.sanityClient.getImageUrl(latestBlogPost.mainImage, 1200, null);
    }

    if (ogImageUrl) {
      const ogMeta = document.querySelector('meta[property="og:image"]');
      const twitterMeta = document.querySelector('meta[name="twitter:image"]');
      if (ogMeta) ogMeta.setAttribute('content', ogImageUrl);
      if (twitterMeta) twitterMeta.setAttribute('content', ogImageUrl);
    }
  } catch (error) {
    console.error('Error initializing homepage from Sanity:', error);
  }
});