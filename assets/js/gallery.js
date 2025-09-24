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
    
    // Cart integration with new cart system
    const cartCounter = document.querySelector('.cart-counter');
    const addToCartButtons = document.querySelectorAll('.btn-add-cart');
    const buyNowButtons = document.querySelectorAll('.btn-buy-now');

    // Cart button event listener
    const cartButton = document.querySelector('.cart-button');
    if (cartButton) {
        cartButton.addEventListener('click', () => {
            if (window.cartManager) {
                window.cartManager.openCartDrawer();
            }
        });
    }
    
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
    
    // Add to cart event listeners
    addToCartButtons.forEach(button => {
        if (!button.disabled) {
            button.addEventListener('click', () => handleAddToCart(button.dataset.artwork));
        }
    });

    // Buy now button event listeners
    buyNowButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            const artworkId = button.closest('.artwork-card')?.querySelector('.btn-add-cart')?.dataset.artwork;
            if (artworkId && window.artworkData) {
                const artwork = window.artworkData.getArtworkById(artworkId);
                if (artwork && artwork.stripePaymentLink) {
                    window.open(artwork.stripePaymentLink, '_blank');
                }
            }
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
    
    // Cart functions
    function handleAddToCart(artworkId) {
        if (window.artworkData && window.cartManager) {
            const artwork = window.artworkData.getArtworkById(artworkId);
            if (artwork) {
                window.cartManager.addToCart(artwork);
            }
        }
    }
    
    // Initialize artwork data globally for access by other scripts
    window.artworkData = new ArtworkDataManager();

    // Handle sold out items - disable buttons and update styling
    function handleSoldOutItems() {
        const artworkCards = document.querySelectorAll('.artwork-card');

        artworkCards.forEach(card => {
            const addToCartBtn = card.querySelector('.btn-add-cart');
            const buyNowBtn = card.querySelector('.btn-buy-now');
            const artworkId = addToCartBtn?.dataset.artwork;

            if (artworkId) {
                const artwork = window.artworkData.getArtworkById(artworkId);

                if (artwork && artwork.availability === 'SoldOut') {
                    // Disable buttons
                    if (addToCartBtn) {
                        addToCartBtn.disabled = true;
                        addToCartBtn.textContent = 'Sold Out';
                        addToCartBtn.style.background = 'var(--gray)';
                        addToCartBtn.style.borderColor = 'var(--gray)';
                        addToCartBtn.style.cursor = 'not-allowed';
                    }

                    if (buyNowBtn) {
                        buyNowBtn.disabled = true;
                        buyNowBtn.style.background = 'var(--gray)';
                        buyNowBtn.style.borderColor = 'var(--gray)';
                        buyNowBtn.style.cursor = 'not-allowed';
                        buyNowBtn.style.color = 'var(--white)';
                    }

                    // Update status styling if it's just "Sold" instead of proper "SoldOut"
                    const statusElement = card.querySelector('.artwork-status');
                    if (statusElement && statusElement.textContent.trim() === 'Sold') {
                        statusElement.className = 'artwork-status status-sold';
                    }
                }
            }
        });
    }

    // Handle sold out items after a brief delay to ensure DOM is ready
    setTimeout(handleSoldOutItems, 100);
    
    // Mobile menu functionality
    const hamburgerMenu = document.querySelector('.hamburger-menu');
    const mobileNav = document.querySelector('.mobile-nav');
    
    hamburgerMenu.addEventListener('click', () => {
        mobileNav.classList.toggle('active');
        hamburgerMenu.classList.toggle('active');
    });
    
    // Initialize cart counter
    updateCartCounter();
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