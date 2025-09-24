// Main shared functionality for all pages
document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu functionality
    const hamburgerMenu = document.querySelector('.hamburger-menu');
    const mobileNav = document.querySelector('.mobile-nav');
    
    if (hamburgerMenu && mobileNav) {
        hamburgerMenu.addEventListener('click', toggleMobileMenu);
    }
    
    // Newsletter form handling
    const newsletterForms = document.querySelectorAll('.newsletter-form');
    newsletterForms.forEach(form => {
        form.addEventListener('submit', handleNewsletterSubmit);
    });
    
    // Smooth scrolling for anchor links
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    anchorLinks.forEach(link => {
        link.addEventListener('click', smoothScroll);
    });
    
    // Initialize cart counter - this is now handled by cart.js when it's loaded
    // The cart system will automatically update counters when initialized
});

function toggleMobileMenu() {
    const mobileNav = document.querySelector('.mobile-nav');
    const hamburgerMenu = document.querySelector('.hamburger-menu');
    
    if (mobileNav && hamburgerMenu) {
        mobileNav.classList.toggle('active');
        hamburgerMenu.classList.toggle('active');
    }
}

function handleNewsletterSubmit(event) {
    event.preventDefault();
    const form = event.target;
    const email = form.querySelector('input[type="email"]').value;
    
    // In a real application, you'd send this to your backend
    console.log('Newsletter subscription:', email);
    
    // Show success message
    const button = form.querySelector('button');
    const originalText = button.textContent;
    button.textContent = 'Subscribed!';
    button.style.background = 'var(--purple)';
    
    setTimeout(() => {
        button.textContent = originalText;
        button.style.background = '';
        form.reset();
    }, 2000);
}

function smoothScroll(event) {
    const href = event.target.getAttribute('href');
    if (href.startsWith('#') && href.length > 1) {
        event.preventDefault();
        const target = document.querySelector(href);
        if (target) {
            target.scrollIntoView({ behavior: 'smooth' });
        }
    }
}

function updateCartCounter() {
    const cartItems = JSON.parse(localStorage.getItem('cart')) || [];
    const cartCounters = document.querySelectorAll('.cart-counter');
    
    cartCounters.forEach(counter => {
        counter.textContent = cartItems.length;
    });
}

// Utility function to show notifications
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    const style = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? 'var(--pink)' : 'var(--purple)'};
        color: var(--white);
        padding: var(--space-md);
        border-radius: var(--radius-md);
        box-shadow: var(--shadow-lg);
        z-index: 1001;
        animation: slideIn 0.3s ease;
    `;
    
    notification.style.cssText = style;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease forwards';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}