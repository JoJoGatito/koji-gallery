// Gallery functionality
document.addEventListener('DOMContentLoaded', function() {
    // Lightbox functionality
    const lightbox = document.getElementById('lightbox');
    const lightboxImage = document.getElementById('lightboxImage');
    const lightboxClose = document.getElementById('lightboxClose');
    const lightboxPrev = document.getElementById('lightboxPrev');
    const lightboxNext = document.getElementById('lightboxNext');
    
    let currentImageIndex = 0;
    let galleryImages = [];
    
    // Filter functionality
    const filterTabs = document.querySelectorAll('.filter-tab');
    const artworkGrid = document.getElementById('artworkGrid');

    function refreshGalleryImages() {
        galleryImages = document.querySelectorAll('[data-lightbox]');
        galleryImages.forEach((img, index) => {
            img.addEventListener('click', () => openLightbox(index));
        });
    }
    
    
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
    
            const triggerImage = galleryImages[index];
            const imageSrc = triggerImage.src;
            const imageAlt = triggerImage.alt;
            const aspectRatio = triggerImage.dataset.aspectRatio || 'auto';
    
            lightboxImage.src = imageSrc;
            lightboxImage.alt = imageAlt;
    
            // Reset any previous aspect ratio overrides
            lightboxImage.style.removeProperty('aspect-ratio');
            lightbox.classList.remove(
                'lightbox-aspect-square',
                'lightbox-aspect-portrait',
                'lightbox-aspect-landscape',
                'lightbox-aspect-ultrawide'
            );
    
            // Apply aspect ratio metadata from Studio to help frame the artwork correctly
            if (aspectRatio && aspectRatio !== 'auto') {
                // CSS aspect-ratio uses "width / height" syntax
                lightboxImage.style.aspectRatio = aspectRatio.replace(':', ' / ');
    
                if (aspectRatio === '1:1') {
                    lightbox.classList.add('lightbox-aspect-square');
                } else if (aspectRatio === '3:4' || aspectRatio === '2:3') {
                    lightbox.classList.add('lightbox-aspect-portrait');
                } else if (aspectRatio === '4:3') {
                    lightbox.classList.add('lightbox-aspect-landscape');
                } else if (aspectRatio === '16:9') {
                    lightbox.classList.add('lightbox-aspect-ultrawide');
                }
            }
    
            lightbox.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
        
        function closeLightbox() {
            lightbox.classList.remove(
                'active',
                'lightbox-aspect-square',
                'lightbox-aspect-portrait',
                'lightbox-aspect-landscape',
                'lightbox-aspect-ultrawide'
            );
            lightboxImage.style.removeProperty('aspect-ratio');
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
        const triggerImage = galleryImages[currentImageIndex];
        const imageSrc = triggerImage.src;
        const imageAlt = triggerImage.alt;
        const aspectRatio = triggerImage.dataset.aspectRatio || 'auto';
        
        lightboxImage.src = imageSrc;
        lightboxImage.alt = imageAlt;

        // Reset any previous aspect ratio overrides
        lightboxImage.style.removeProperty('aspect-ratio');
        lightbox.classList.remove(
            'lightbox-aspect-square',
            'lightbox-aspect-portrait',
            'lightbox-aspect-landscape',
            'lightbox-aspect-ultrawide'
        );

        // Apply aspect ratio metadata from Studio
        if (aspectRatio && aspectRatio !== 'auto') {
            lightboxImage.style.aspectRatio = aspectRatio.replace(':', ' / ');

            if (aspectRatio === '1:1') {
                lightbox.classList.add('lightbox-aspect-square');
            } else if (aspectRatio === '3:4' || aspectRatio === '2:3') {
                lightbox.classList.add('lightbox-aspect-portrait');
            } else if (aspectRatio === '4:3') {
                lightbox.classList.add('lightbox-aspect-landscape');
            } else if (aspectRatio === '16:9') {
                lightbox.classList.add('lightbox-aspect-ultrawide');
            }
        }
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
                refreshGalleryImages();
                return;
            }

            // Clear any hardcoded placeholder cards
            if (artworkGrid) {
                artworkGrid.innerHTML = '';
            }

            allArtworks.forEach((artwork, index) => {
                if (!artwork || !artwork.heroImage) {
                    console.warn('[Gallery] Skipping artwork without heroImage:', artwork?.title || artwork?._id);
                    return;
                }

                const card = document.createElement('div');
                card.className = 'artwork-card';

                // Map Sanity category to DOM category (used by filter buttons)
                const rawCategory = (artwork.category || '').toLowerCase();
                let domCategory = 'oc';
                if (rawCategory === 'fanart') {
                    domCategory = 'fanart';
                }
                card.dataset.category = domCategory;

                const imgEl = document.createElement('img');
                imgEl.className = 'artwork-image';
                imgEl.alt = artwork.title || '';
                imgEl.dataset.lightbox = String(index);

                // Persist aspect ratio choice from Studio onto the thumbnail so the lightbox can read it
                if (artwork.aspectRatio) {
                    imgEl.dataset.aspectRatio = artwork.aspectRatio;

                    // Optionally hint the browser about the thumbnail aspect ratio to reduce layout shift
                    if (artwork.aspectRatio !== 'auto') {
                        imgEl.style.aspectRatio = artwork.aspectRatio.replace(':', ' / ');
                    }
                }

                const infoEl = document.createElement('div');
                infoEl.className = 'artwork-info';

                const titleEl = document.createElement('h3');
                titleEl.className = 'artwork-title';
                titleEl.textContent = artwork.title || '';

                const statusEl = document.createElement('span');
                statusEl.className = 'artwork-status';

                const availability = artwork.availability || 'Available';
                let statusClass = 'status-available';
                if (availability === 'SoldOut' || availability === 'Sold') {
                    statusClass = 'status-sold';
                } else if (availability === 'Commission') {
                    statusClass = 'status-commission';
                }
                statusEl.classList.add(statusClass);
                statusEl.textContent = availability === 'SoldOut' ? 'Sold' : availability;

                infoEl.appendChild(titleEl);
                infoEl.appendChild(statusEl);

                const responsiveImage = window.sanityClient.processImageForResponsive(
                    artwork.heroImage,
                    imgEl.alt || artwork.title || ''
                );

                if (responsiveImage && responsiveImage.src) {
                    imgEl.src = responsiveImage.src;
                    if (responsiveImage.srcset) {
                        imgEl.srcset = responsiveImage.srcset;
                        imgEl.sizes = responsiveImage.sizes;
                    }
                }

                card.appendChild(imgEl);
                card.appendChild(infoEl);

                if (artworkGrid) {
                    artworkGrid.appendChild(card);
                }
            });

            // After dynamically rendering cards, wire up lightbox handlers
            refreshGalleryImages();
        } catch (error) {
            console.error('Error initializing gallery images from Sanity:', error);
            // Fall back to whatever markup exists and ensure lightbox works
            refreshGalleryImages();
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