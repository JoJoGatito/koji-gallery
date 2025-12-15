// Gallery functionality
document.addEventListener('DOMContentLoaded', function() {
    // Lightbox functionality
    const lightbox = document.getElementById('lightbox');
    const lightboxImage = document.getElementById('lightboxImage');
    const lightboxClose = document.getElementById('lightboxClose');
    const lightboxPrev = document.getElementById('lightboxPrev');
    const lightboxNext = document.getElementById('lightboxNext');
    
    let currentImageIndex = 0;
    const galleryImages = document.querySelectorAll('[data-lightbox]');
    
    // Filter functionality
    const filterTabs = document.querySelectorAll('.filter-tab');
    const artworkGrid = document.getElementById('artworkGrid');
    
    
    // Lightbox event listeners
    galleryImages.forEach((img, index) => {
        img.addEventListener('click', () => openLightbox(index));
    });
    
    lightboxClose.addEventListener('click', closeLightbox);
    lightboxPrev.addEventListener('click', showPrevImage);
    lightboxNext.addEventListener('click', showNextImage);
    
    // Filter event listeners
    filterTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const category = tab.dataset.category;
            filterArtwork(category);
            setActiveFilter(tab);
        });
    });
    
    
    // Keyboard navigation for lightbox
    document.addEventListener('keydown', (e) => {
        if (!lightbox.classList.contains('active')) return;
        
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowLeft') showPrevImage();
        if (e.key === 'ArrowRight') showNextImage();
    });
    
    // Lightbox functions
    function openLightbox(index) {
        currentImageIndex = index;
        const imageSrc = galleryImages[index].src;
        const imageAlt = galleryImages[index].alt;
        
        lightboxImage.src = imageSrc;
        lightboxImage.alt = imageAlt;
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
    
    function closeLightbox() {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
    }
    
    function showPrevImage() {
        currentImageIndex = currentImageIndex > 0 ? currentImageIndex - 1 : galleryImages.length - 1;
        updateLightboxImage();
    }
    
    function showNextImage() {
        currentImageIndex = currentImageIndex < galleryImages.length - 1 ? currentImageIndex + 1 : 0;
        updateLightboxImage();
    }
    
    function updateLightboxImage() {
        const imageSrc = galleryImages[currentImageIndex].src;
        const imageAlt = galleryImages[currentImageIndex].alt;
        
        lightboxImage.src = imageSrc;
        lightboxImage.alt = imageAlt;
    }
    
    // Filter functions
    function filterArtwork(category) {
        const artworkCards = document.querySelectorAll('.artwork-card');
        
        artworkCards.forEach(card => {
            if (category === 'all' || card.dataset.category === category) {
                card.style.display = 'block';
                card.style.animation = 'fadeIn 0.5s ease forwards';
            } else {
                card.style.display = 'none';
            }
        });
    }
    
    function setActiveFilter(activeTab) {
        filterTabs.forEach(tab => tab.classList.remove('active'));
        activeTab.classList.add('active');
    }
    
    
        // Initialize artwork data globally for access by other scripts
        window.artworkData = new ArtworkDataManager();
    
    
        // Replace hardcoded gallery images with Sanity-managed images when available
        async function initializeGalleryImagesFromSanity() {
            console.log('[Gallery] Initializing gallery images from Sanity', {
                hasSanityClient: !!window.sanityClient,
                hasArtworkData: !!window.artworkData,
                artworkDataLoaded: window.artworkData?.loaded
            });
    
            if (!window.artworkData || !window.sanityClient) {
                console.warn('Sanity artwork data not available; using static gallery images');
                return;
            }

        try {
            // Ensure Sanity artwork data is loaded
            if (!window.artworkData.loaded) {
                await window.artworkData.initialize();
            }

            const allArtworks = window.artworkData.getAllArtworks();
            console.log('[Gallery] Artworks loaded for gallery:', {
                count: allArtworks ? allArtworks.length : 0,
                slugs: allArtworks ? allArtworks.map(art => art.slug?.current) : []
            });
            if (!allArtworks || !allArtworks.length) {
                console.warn('No artworks returned from Sanity; using static gallery images');
                return;
            }

            const artworkCards = document.querySelectorAll('.artwork-card');
            console.log('[Gallery] Found artwork cards in DOM:', artworkCards.length);

            const normalizeTitle = (title) => {
                return (title || '')
                    .toString()
                    .trim()
                    .toLowerCase()
                    .replace(/\s+/g, ' ');
            };

            artworkCards.forEach(card => {
                const titleEl = card.querySelector('.artwork-title');
                const imgEl = card.querySelector('.artwork-image');

                if (!titleEl || !imgEl) {
                    console.warn('[Gallery] Missing title or image element on card; skipping.', card);
                    return;
                }

                const titleText = normalizeTitle(titleEl.textContent);
                if (!titleText) {
                    console.warn('[Gallery] Empty title text on card; skipping.', card);
                    return;
                }

                const matchingArtwork = allArtworks.find(art =>
                    normalizeTitle(art.title) === titleText
                );

                if (!matchingArtwork) {
                    console.warn('[Gallery] No matching artwork found in Sanity for title:', titleEl.textContent);
                    return;
                }
                if (!matchingArtwork.heroImage) {
                    console.warn('[Gallery] Matching artwork has no heroImage in Sanity for title:', matchingArtwork.title);
                    return;
                }

                const responsiveImage = window.sanityClient.processImageForResponsive(
                    matchingArtwork.heroImage,
                    imgEl.alt || matchingArtwork.title || ''
                );

                if (responsiveImage && responsiveImage.src) {
                    imgEl.src = responsiveImage.src;
                    if (responsiveImage.srcset) {
                        imgEl.srcset = responsiveImage.srcset;
                        imgEl.sizes = responsiveImage.sizes;
                    }
                }
            });
        } catch (error) {
            console.error('Error initializing gallery images from Sanity:', error);
        }
    }
    
    // Mobile menu functionality
    const hamburgerMenu = document.querySelector('.hamburger-menu');
    const mobileNav = document.querySelector('.mobile-nav');
    
    hamburgerMenu.addEventListener('click', () => {
        mobileNav.classList.toggle('active');
        hamburgerMenu.classList.toggle('active');
    });
    
        // Initialize Sanity-powered gallery images
    initializeGalleryImagesFromSanity();
});

// CSS animations for notifications
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeIn {
        from { opacity: 0; transform: translateY(20px); }
        to { opacity: 1; transform: translateY(0); }
    }
    
    @keyframes slideIn {
        from { opacity: 0; transform: translateX(100px); }
        to { opacity: 1; transform: translateX(0); }
    }
    
    @keyframes slideOut {
        from { opacity: 1; transform: translateX(0); }
        to { opacity: 0; transform: translateX(100px); }
    }
    
    .hamburger-menu.active .hamburger-line:nth-child(1) {
        transform: rotate(45deg) translate(5px, 5px);
    }
    
    .hamburger-menu.active .hamburger-line:nth-child(2) {
        opacity: 0;
    }
    
    .hamburger-menu.active .hamburger-line:nth-child(3) {
        transform: rotate(-45deg) translate(7px, -6px);
    }
`;
document.head.appendChild(style);