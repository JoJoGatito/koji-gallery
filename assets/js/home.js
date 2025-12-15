document.addEventListener('DOMContentLoaded', async () => {
  if (!window.sanityClient) {
    console.warn('Sanity client not available on homepage');
    return;
  }

  try {
    const data = await window.sanityClient.getHomePageData();
    const artistProfile = await window.sanityClient.getArtistProfile();
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

    const featuredArtworks = [];

    // Map OC artworks to first corkboard section thumbnails
    if (ocSection && ocArtworks.length) {
      const notes = ocSection.querySelectorAll('.corkboard-grid .pinned-note');
      ocArtworks.slice(0, notes.length).forEach((artwork, index) => {
        const note = notes[index];
        if (!note) return;

        const globalIndex = featuredArtworks.length;
        featuredArtworks.push(artwork);

        const img = note.querySelector('img.artwork-thumb');
        setImageFromSanity(img, artwork.heroImage, artwork.title);

        const titleEl = note.querySelector('h4');
        if (titleEl && artwork.title) {
          titleEl.textContent = artwork.title;
        }

        const descEl = note.querySelector('p');
        if (descEl && artwork.description) {
          const text = artwork.description;
          descEl.textContent = text.length > 140 ? `${text.slice(0, 137)}...` : text;
        }

        const button = note.querySelector('.btn-small');
        if (button) {
          button.dataset.featureIndex = String(globalIndex);
        }
      });
    }

    // Map Fan Art artworks to second corkboard section thumbnails
    if (fanSection && fanArtworks.length) {
      const notes = fanSection.querySelectorAll('.corkboard-grid .pinned-note');
      fanArtworks.slice(0, notes.length).forEach((artwork, index) => {
        const note = notes[index];
        if (!note) return;

        const globalIndex = featuredArtworks.length;
        featuredArtworks.push(artwork);

        const img = note.querySelector('img.artwork-thumb');
        setImageFromSanity(img, artwork.heroImage, artwork.title);

        const titleEl = note.querySelector('h4');
        if (titleEl && artwork.title) {
          titleEl.textContent = artwork.title;
        }

        const descEl = note.querySelector('p');
        if (descEl && artwork.description) {
          const text = artwork.description;
          descEl.textContent = text.length > 140 ? `${text.slice(0, 137)}...` : text;
        }

        const button = note.querySelector('.btn-small');
        if (button) {
          button.dataset.featureIndex = String(globalIndex);
        }
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

        // Artist avatar and bio from Sanity artistProfile, with fallback to artwork-based avatar
        const avatarImg = document.querySelector('.artist-bio .bio-image img.avatar');
        const bioContainer = document.querySelector('.artist-bio .bio-text');
    
        if (typeof artistProfile !== 'undefined' && artistProfile) {
          if (avatarImg && artistProfile.profileImage) {
            setImageFromSanity(
              avatarImg,
              artistProfile.profileImage,
              "Koji's avatar"
            );
          }
    
          if (bioContainer && Array.isArray(artistProfile.bio) && artistProfile.bio.length) {
            const bioHtml = window.sanityClient.renderPortableText(artistProfile.bio);
            if (bioHtml) {
              bioContainer.innerHTML = bioHtml;
            }
          }
        } else if (avatarImg) {
          // Fallback: use a featured OC or fan artwork hero image as avatar
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

    // Homepage lightbox wiring for featured artworks
    const lightbox = document.getElementById('lightbox');
    const lightboxImage = document.getElementById('lightboxImage');
    const lightboxClose = document.getElementById('lightboxClose');
    const lightboxPrev = document.getElementById('lightboxPrev');
    const lightboxNext = document.getElementById('lightboxNext');

    if (
      lightbox &&
      lightboxImage &&
      lightboxClose &&
      lightboxPrev &&
      lightboxNext &&
      featuredArtworks.length
    ) {
      let currentIndex = 0;

      const openLightboxAtIndex = (index) => {
        if (!featuredArtworks.length) return;
        const safeIndex = index >= 0 && index < featuredArtworks.length ? index : 0;
        currentIndex = safeIndex;

        const artwork = featuredArtworks[safeIndex];
        if (!artwork || !artwork.heroImage) return;

        const imageUrl = window.sanityClient.getImageUrl(artwork.heroImage, 1200, null);
        lightboxImage.src = imageUrl || '';
        lightboxImage.alt = artwork.title || '';
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';

        console.log('[Home] Opened homepage lightbox for artwork:', artwork.title || artwork._id);
      };

      const closeLightbox = () => {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
      };

      const showPrevImage = () => {
        if (!featuredArtworks.length) return;
        currentIndex = currentIndex > 0 ? currentIndex - 1 : featuredArtworks.length - 1;
        openLightboxAtIndex(currentIndex);
      };

      const showNextImage = () => {
        if (!featuredArtworks.length) return;
        currentIndex = currentIndex < featuredArtworks.length - 1 ? currentIndex + 1 : 0;
        openLightboxAtIndex(currentIndex);
      };

      lightboxClose.addEventListener('click', (event) => {
        event.stopPropagation();
        closeLightbox();
      });

      lightboxPrev.addEventListener('click', (event) => {
        event.stopPropagation();
        showPrevImage();
      });

      lightboxNext.addEventListener('click', (event) => {
        event.stopPropagation();
        showNextImage();
      });

      lightbox.addEventListener('click', (event) => {
        if (event.target === lightbox) {
          closeLightbox();
        }
      });

      document.addEventListener('keydown', (event) => {
        if (!lightbox.classList.contains('active')) return;
        if (event.key === 'Escape') {
          closeLightbox();
        } else if (event.key === 'ArrowLeft') {
          showPrevImage();
        } else if (event.key === 'ArrowRight') {
          showNextImage();
        }
      });

      const detailButtons = document.querySelectorAll('.latest-work .btn-small');
      detailButtons.forEach((button) => {
        const indexStr = button.dataset.featureIndex;
        const index = indexStr ? parseInt(indexStr, 10) : NaN;
        if (Number.isNaN(index)) return;

        button.addEventListener('click', () => {
          console.log('[Home] View Details clicked, feature index:', index);
          openLightboxAtIndex(index);
        });
      });

      console.log(
        '[Home] Homepage lightbox initialized with featured artworks:',
        featuredArtworks.length
      );
    } else {
      console.warn(
        '[Home] Homepage lightbox not initialized: missing DOM elements or featured artworks'
      );
    }
  } catch (error) {
    console.error('Error initializing homepage from Sanity:', error);
  }
});