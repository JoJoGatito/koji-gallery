/**
 * Shopping Cart System
 * Handles localStorage persistence, cart operations, and UI interactions
 */

// Cart state management
class CartManager {
    constructor() {
        this.cartItems = JSON.parse(localStorage.getItem('cart')) || [];
        this.notificationQueue = [];
        this.init();
    }

    init() {
        this.updateCartCounter();
        this.setupEventListeners();
    }

    setupEventListeners() {
        // Listen for cart updates from other parts of the app
        document.addEventListener('cartUpdated', () => {
            this.updateCartCounter();
        });

        // Listen for storage changes (multi-tab sync)
        window.addEventListener('storage', (e) => {
            if (e.key === 'cart') {
                this.cartItems = JSON.parse(e.newValue) || [];
                this.updateCartCounter();
                this.dispatchCartUpdate();
            }
        });
    }

    /**
     * Add item to cart
     * @param {Object} artwork - Artwork object with all required fields
     * @param {string} artwork._id - Unique artwork ID
     * @param {string} artwork.title - Artwork title
     * @param {number} artwork.price - Price in cents
     * @param {string} artwork.currency - Currency code
     * @param {string} artwork.availability - "Available" or "SoldOut"
     * @param {string} artwork.stripePaymentLink - Stripe Payment Link URL
     * @param {string} artwork.heroImage.asset._ref - Image reference
     * @param {string} artwork.slug - URL slug
     */
    addToCart(artwork) {
        // Check if item is available
        if (artwork.availability === 'SoldOut') {
            this.showNotification(`${artwork.title} is sold out and cannot be added to cart.`, 'error');
            return false;
        }

        // Check if item already exists in cart
        const existingItem = this.cartItems.find(item => item._id === artwork._id);

        if (existingItem) {
            // Item already in cart - show message
            this.showNotification(`${artwork.title} is already in your cart!`, 'info');
            this.openCartDrawer();
            return false;
        }

        // Add item to cart
        const cartItem = {
            ...artwork,
            quantity: 1,
            addedAt: new Date().toISOString()
        };

        this.cartItems.push(cartItem);
        this.saveCart();
        this.showNotification(`${artwork.title} added to cart!`, 'success');
        this.openCartDrawer();
        return true;
    }

    /**
     * Remove item from cart
     * @param {string} artworkId - Artwork ID to remove
     */
    removeFromCart(artworkId) {
        const itemIndex = this.cartItems.findIndex(item => item._id === artworkId);

        if (itemIndex > -1) {
            const removedItem = this.cartItems[itemIndex];
            this.cartItems.splice(itemIndex, 1);
            this.saveCart();
            this.showNotification(`${removedItem.title} removed from cart.`, 'info');
            return true;
        }

        return false;
    }

    /**
     * Update item quantity
     * @param {string} artworkId - Artwork ID
     * @param {number} quantity - New quantity
     */
    updateQuantity(artworkId, quantity) {
        const item = this.cartItems.find(item => item._id === artworkId);

        if (item && quantity > 0) {
            item.quantity = quantity;
            this.saveCart();
            this.showNotification(`Updated ${item.title} quantity to ${quantity}.`, 'info');
            return true;
        } else if (item && quantity <= 0) {
            return this.removeFromCart(artworkId);
        }

        return false;
    }

    /**
     * Clear entire cart
     */
    clearCart() {
        const itemCount = this.cartItems.length;
        this.cartItems = [];
        this.saveCart();
        this.showNotification(`Cleared ${itemCount} item${itemCount !== 1 ? 's' : ''} from cart.`, 'info');
        this.closeCartDrawer();
        return true;
    }

    /**
     * Get cart item count
     * @returns {number} Total number of items in cart
     */
    getItemCount() {
        return this.cartItems.reduce((total, item) => total + item.quantity, 0);
    }

    /**
     * Get cart total
     * @returns {number} Total price in cents
     */
    getCartTotal() {
        return this.cartItems.reduce((total, item) => {
            return total + (item.price * item.quantity);
        }, 0);
    }

    /**
     * Get formatted cart total
     * @returns {string} Formatted total with currency
     */
    getFormattedTotal() {
        const total = this.getCartTotal();
        const currency = this.cartItems[0]?.currency || 'USD';

        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: currency
        }).format(total / 100);
    }

    /**
     * Get all cart items
     * @returns {Array} Array of cart items
     */
    getCartItems() {
        return [...this.cartItems];
    }

    /**
     * Check if cart is empty
     * @returns {boolean} True if cart is empty
     */
    isEmpty() {
        return this.cartItems.length === 0;
    }

    /**
     * Save cart to localStorage
     */
    saveCart() {
        localStorage.setItem('cart', JSON.stringify(this.cartItems));
        this.updateCartCounter();
        this.dispatchCartUpdate();
    }

    /**
     * Update cart counter in UI
     */
    updateCartCounter() {
        const itemCount = this.getItemCount();
        const cartCounters = document.querySelectorAll('.cart-counter');

        cartCounters.forEach(counter => {
            counter.textContent = itemCount;
            counter.style.display = itemCount > 0 ? 'flex' : 'none';
        });
    }

    /**
     * Show notification
     * @param {string} message - Notification message
     * @param {string} type - Notification type (success, error, info)
     */
    showNotification(message, type = 'info') {
        // Use existing notification system from main.js if available
        if (window.showNotification) {
            window.showNotification(message, type);
        } else {
            this.createNotification(message, type);
        }
    }

    /**
     * Create notification element
     * @param {string} message - Notification message
     * @param {string} type - Notification type
     */
    createNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `cart-notification notification-${type}`;
        notification.textContent = message;

        const colors = {
            success: 'var(--pink)',
            error: '#ff6b6b',
            info: 'var(--purple)'
        };

        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${colors[type] || colors.info};
            color: var(--white);
            padding: var(--space-md);
            border-radius: var(--radius-md);
            box-shadow: var(--shadow-lg);
            z-index: 1001;
            animation: slideInFromRight 0.3s ease;
            max-width: 300px;
            word-wrap: break-word;
        `;

        document.body.appendChild(notification);

        // Add to queue to prevent overlapping
        this.notificationQueue.push(notification);

        // Remove after delay
        setTimeout(() => {
            notification.style.animation = 'slideOutToRight 0.3s ease forwards';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.remove();
                }
                this.notificationQueue = this.notificationQueue.filter(n => n !== notification);
            }, 300);
        }, 3000);
    }

    /**
     * Dispatch cart update event
     */
    dispatchCartUpdate() {
        document.dispatchEvent(new CustomEvent('cartUpdated', {
            detail: {
                items: this.getCartItems(),
                itemCount: this.getItemCount(),
                total: this.getCartTotal()
            }
        }));
    }

    /**
     * Open cart drawer
     */
    openCartDrawer() {
        const cartDrawer = document.getElementById('cartDrawer');
        if (cartDrawer) {
            this.renderCartDrawer();
            cartDrawer.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    }

    /**
     * Close cart drawer
     */
    closeCartDrawer() {
        const cartDrawer = document.getElementById('cartDrawer');
        if (cartDrawer) {
            cartDrawer.classList.remove('active');
            document.body.style.overflow = '';
        }
    }

    /**
     * Render cart drawer content
     */
    renderCartDrawer() {
        const cartDrawer = document.getElementById('cartDrawer');
        if (!cartDrawer) return;

        const cartContent = cartDrawer.querySelector('.cart-content');
        const cartSummary = cartDrawer.querySelector('.cart-summary');

        if (cartContent) {
            this.renderCartItems(cartContent);
        }

        if (cartSummary) {
            this.renderCartSummary(cartSummary);
        }
    }

    /**
     * Render cart items in drawer
     * @param {Element} container - Container element
     */
    renderCartItems(container) {
        if (this.isEmpty()) {
            container.innerHTML = `
                <div class="empty-cart">
                    <p>Your cart is empty</p>
                    <button class="btn-small" onclick="cartManager.closeCartDrawer()">Continue Shopping</button>
                </div>
            `;
            return;
        }

        container.innerHTML = this.cartItems.map(item => `
            <div class="cart-item" data-item-id="${item._id}">
                <div class="cart-item-image">
                    <img src="${item.heroImage?.asset?._ref ? `https://cdn.sanity.io/images/${item.heroImage.asset._ref}` : 'assets/images/placeholder.jpg'}" alt="${item.title}">
                </div>
                <div class="cart-item-info">
                    <h4 class="cart-item-title">${item.title}</h4>
                    <div class="cart-item-price">${this.formatPrice(item.price * item.quantity)}</div>
                    <div class="cart-item-actions">
                        <div class="quantity-controls">
                            <button class="quantity-btn" onclick="cartManager.updateQuantity('${item._id}', ${item.quantity - 1})">-</button>
                            <span class="quantity">${item.quantity}</span>
                            <button class="quantity-btn" onclick="cartManager.updateQuantity('${item._id}', ${item.quantity + 1})">+</button>
                        </div>
                        <button class="remove-btn" onclick="cartManager.removeFromCart('${item._id}')">Remove</button>
                    </div>
                </div>
                <div class="cart-item-checkout">
                    <button class="btn-buy-now" onclick="window.open('${item.stripePaymentLink}', '_blank')">Checkout</button>
                </div>
            </div>
        `).join('');
    }

    /**
     * Render cart summary
     * @param {Element} container - Container element
     */
    renderCartSummary(container) {
        if (this.isEmpty()) {
            container.innerHTML = '';
            return;
        }

        const itemCount = this.getItemCount();
        const total = this.getFormattedTotal();

        container.innerHTML = `
            <div class="cart-summary-content">
                <div class="cart-summary-row">
                    <span>Total (${itemCount} item${itemCount !== 1 ? 's' : ''}):</span>
                    <span class="cart-total">${total}</span>
                </div>
                <div class="cart-summary-actions">
                    <button class="btn-clear-cart" onclick="cartManager.clearCart()">Clear Cart</button>
                    <p class="cart-note">Each item has its own checkout process</p>
                </div>
            </div>
        `;
    }

    /**
     * Format price from cents to currency string
     * @param {number} priceInCents - Price in cents
     * @returns {string} Formatted price
     */
    formatPrice(priceInCents) {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(priceInCents / 100);
    }
}

// Cart Drawer/Modal UI
class CartDrawer {
    constructor() {
        this.createCartDrawer();
        this.bindEvents();
    }

    createCartDrawer() {
        if (document.getElementById('cartDrawer')) return;

        const cartDrawer = document.createElement('div');
        cartDrawer.id = 'cartDrawer';
        cartDrawer.className = 'cart-drawer';
        cartDrawer.innerHTML = `
            <div class="cart-overlay" onclick="cartManager.closeCartDrawer()"></div>
            <div class="cart-sidebar">
                <div class="cart-header">
                    <h3>Shopping Cart</h3>
                    <button class="cart-close" onclick="cartManager.closeCartDrawer()">&times;</button>
                </div>
                <div class="cart-body">
                    <div class="cart-content"></div>
                    <div class="cart-summary"></div>
                </div>
            </div>
        `;

        document.body.appendChild(cartDrawer);
        this.addCartDrawerStyles();
    }

    addCartDrawerStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .cart-drawer {
                position: fixed;
                top: 0;
                right: 0;
                width: 100%;
                height: 100%;
                z-index: 2000;
                pointer-events: none;
                opacity: 0;
                transition: opacity 0.3s ease;
            }

            .cart-drawer.active {
                opacity: 1;
                pointer-events: auto;
            }

            .cart-overlay {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.5);
                backdrop-filter: blur(5px);
            }

            .cart-sidebar {
                position: absolute;
                top: 0;
                right: 0;
                width: 400px;
                max-width: 90vw;
                height: 100%;
                background: var(--white);
                box-shadow: var(--shadow-lg);
                display: flex;
                flex-direction: column;
                transform: translateX(100%);
                transition: transform 0.3s ease;
            }

            .cart-drawer.active .cart-sidebar {
                transform: translateX(0);
            }

            .cart-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: var(--space-lg);
                border-bottom: 2px solid var(--light-pink);
                background: var(--lighter-pink);
            }

            .cart-header h3 {
                margin: 0;
                font-family: var(--font-mono);
                color: var(--black);
            }

            .cart-close {
                background: none;
                border: none;
                font-size: var(--font-size-2xl);
                color: var(--gray);
                cursor: pointer;
                padding: 0;
                width: 30px;
                height: 30px;
                display: flex;
                align-items: center;
                justify-content: center;
            }

            .cart-close:hover {
                color: var(--black);
            }

            .cart-body {
                flex: 1;
                overflow-y: auto;
                display: flex;
                flex-direction: column;
            }

            .cart-content {
                flex: 1;
                padding: var(--space-lg);
            }

            .cart-summary {
                padding: var(--space-lg);
                border-top: 2px solid var(--light-pink);
                background: var(--lighter-pink);
            }

            .empty-cart {
                text-align: center;
                padding: var(--space-2xl);
                color: var(--gray);
            }

            .empty-cart p {
                margin-bottom: var(--space-lg);
                font-size: var(--font-size-lg);
            }

            .cart-item {
                display: flex;
                gap: var(--space-md);
                padding: var(--space-md);
                border: 2px solid var(--light-pink);
                border-radius: var(--radius-md);
                margin-bottom: var(--space-md);
                background: var(--white);
            }

            .cart-item-image {
                width: 60px;
                height: 60px;
                border-radius: var(--radius-sm);
                overflow: hidden;
                flex-shrink: 0;
            }

            .cart-item-image img {
                width: 100%;
                height: 100%;
                object-fit: cover;
            }

            .cart-item-info {
                flex: 1;
                min-width: 0;
            }

            .cart-item-title {
                margin: 0 0 var(--space-xs) 0;
                font-size: var(--font-size-sm);
                font-family: var(--font-mono);
                color: var(--black);
            }

            .cart-item-price {
                font-weight: bold;
                color: var(--purple);
                margin-bottom: var(--space-sm);
            }

            .cart-item-actions {
                display: flex;
                justify-content: space-between;
                align-items: center;
            }

            .quantity-controls {
                display: flex;
                align-items: center;
                gap: var(--space-sm);
            }

            .quantity-btn {
                width: 24px;
                height: 24px;
                border: 2px solid var(--pink);
                background: var(--white);
                color: var(--pink);
                border-radius: var(--radius-sm);
                font-weight: bold;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: var(--font-size-sm);
            }

            .quantity-btn:hover {
                background: var(--pink);
                color: var(--white);
            }

            .quantity {
                min-width: 20px;
                text-align: center;
                font-weight: bold;
            }

            .remove-btn {
                background: none;
                border: 2px solid #ff6b6b;
                color: #ff6b6b;
                border-radius: var(--radius-sm);
                padding: var(--space-xs) var(--space-sm);
                font-size: var(--font-size-xs);
                cursor: pointer;
            }

            .remove-btn:hover {
                background: #ff6b6b;
                color: var(--white);
            }

            .cart-item-checkout {
                flex-shrink: 0;
            }

            .cart-summary-content {
                text-align: center;
            }

            .cart-summary-row {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: var(--space-md);
                font-size: var(--font-size-lg);
                font-weight: bold;
            }

            .cart-total {
                color: var(--purple);
                font-size: var(--font-size-xl);
            }

            .cart-summary-actions {
                display: flex;
                flex-direction: column;
                gap: var(--space-sm);
            }

            .btn-clear-cart {
                background: #ff6b6b;
                color: var(--white);
                border: 2px solid #ff6b6b;
                border-radius: var(--radius-md);
                padding: var(--space-sm) var(--space-md);
                font-weight: bold;
                cursor: pointer;
                transition: all 0.2s ease;
            }

            .btn-clear-cart:hover {
                background: #ff5252;
                border-color: #ff5252;
                transform: translateY(-2px);
            }

            .cart-note {
                margin: 0;
                font-size: var(--font-size-xs);
                color: var(--gray);
                font-style: italic;
            }

            @keyframes slideInFromRight {
                from {
                    opacity: 0;
                    transform: translateX(100px);
                }
                to {
                    opacity: 1;
                    transform: translateX(0);
                }
            }

            @keyframes slideOutToRight {
                from {
                    opacity: 1;
                    transform: translateX(0);
                }
                to {
                    opacity: 0;
                    transform: translateX(100px);
                }
            }

            @media (max-width: 768px) {
                .cart-sidebar {
                    width: 100%;
                    max-width: none;
                }
            }
        `;

        // Add styles only if not already added
        if (!document.querySelector('#cart-drawer-styles')) {
            style.id = 'cart-drawer-styles';
            document.head.appendChild(style);
        }
    }

    bindEvents() {
        // Close drawer when clicking outside
        document.addEventListener('click', (e) => {
            const cartDrawer = document.getElementById('cartDrawer');
            if (cartDrawer && cartDrawer.classList.contains('active')) {
                if (e.target.classList.contains('cart-overlay')) {
                    cartManager.closeCartDrawer();
                }
            }
        });

        // Close drawer on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                cartManager.closeCartDrawer();
            }
        });
    }
}

// Artwork data manager for demo purposes
class ArtworkDataManager {
    constructor() {
        this.artworks = this.getSampleArtworkData();
    }

    getSampleArtworkData() {
        return [
            {
                _id: "mystical-forest-guardian",
                title: "Mystical Forest Guardian",
                slug: "mystical-forest-guardian",
                price: 4500, // $45.00 in cents
                currency: "USD",
                availability: "Available",
                stripePaymentLink: "https://buy.stripe.com/test_aEUg2p3Xs5Vj1O03gg",
                heroImage: { asset: { _ref: "image-placeholder-oc1" } },
                description: "A mystical guardian spirit from an enchanted forest",
                category: "oc"
            },
            {
                _id: "cyberpunk-samurai",
                title: "Cyberpunk Samurai",
                slug: "cyberpunk-samurai",
                price: 6000, // $60.00 in cents
                currency: "USD",
                availability: "Available",
                stripePaymentLink: "https://buy.stripe.com/test_bEUg2p3Xs5Vj1O03gg",
                heroImage: { asset: { _ref: "image-placeholder-oc2" } },
                description: "A cyberpunk warrior with traditional samurai aesthetics",
                category: "oc"
            },
            {
                _id: "starlight-dancer",
                title: "Starlight Dancer",
                slug: "starlight-dancer",
                price: 3800, // $38.00 in cents
                currency: "USD",
                availability: "Available",
                stripePaymentLink: "https://buy.stripe.com/test_cEUg2p3Xs5Vj1O03gg",
                heroImage: { asset: { _ref: "image-placeholder-oc3" } },
                description: "An ethereal dancer surrounded by starlight",
                category: "oc"
            },
            {
                _id: "ghibli-tribute",
                title: "Studio Ghibli Tribute",
                slug: "ghibli-tribute",
                price: 5000, // $50.00 in cents
                currency: "USD",
                availability: "Available",
                stripePaymentLink: "https://buy.stripe.com/test_dEUg2p3Xs5Vj1O03gg",
                heroImage: { asset: { _ref: "image-placeholder-fan1" } },
                description: "A beautiful tribute to Studio Ghibli's magical worlds",
                category: "fanart"
            },
            {
                _id: "final-fantasy-inspired",
                title: "Final Fantasy Inspired",
                slug: "final-fantasy-inspired",
                price: 5500, // $55.00 in cents
                currency: "USD",
                availability: "SoldOut",
                stripePaymentLink: "https://buy.stripe.com/test_eEUg2p3Xs5Vj1O03gg",
                heroImage: { asset: { _ref: "image-placeholder-fan2" } },
                description: "An original character inspired by Final Fantasy series",
                category: "fanart"
            },
            {
                _id: "anime-crossover",
                title: "Anime Crossover",
                slug: "anime-crossover",
                price: 4200, // $42.00 in cents
                currency: "USD",
                availability: "Available",
                stripePaymentLink: "https://buy.stripe.com/test_fEUg2p3Xs5Vj1O03gg",
                heroImage: { asset: { _ref: "image-placeholder-fan3" } },
                description: "A creative crossover featuring characters from different anime",
                category: "fanart"
            }
        ];
    }

    /**
     * Get artwork by ID
     * @param {string} id - Artwork ID
     * @returns {Object|null} Artwork object or null if not found
     */
    getArtworkById(id) {
        return this.artworks.find(artwork => artwork._id === id) || null;
    }

    /**
     * Get all artworks
     * @returns {Array} Array of all artworks
     */
    getAllArtworks() {
        return [...this.artworks];
    }

    /**
     * Get artworks by category
     * @param {string} category - Category filter
     * @returns {Array} Filtered artworks
     */
    getArtworksByCategory(category) {
        if (category === 'all') return this.getAllArtworks();
        return this.artworks.filter(artwork => artwork.category === category);
    }
}

// Initialize cart system
let cartManager;
let cartDrawer;
let artworkData;

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    cartManager = new CartManager();
    cartDrawer = new CartDrawer();
    artworkData = new ArtworkDataManager();

    // Make cart manager globally available for HTML onclick handlers
    window.cartManager = cartManager;
});

// Export for module use if needed
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { CartManager, CartDrawer, ArtworkDataManager };
}