// Blog functionality
document.addEventListener('DOMContentLoaded', function() {
    // DOM elements
    const blogPosts = document.querySelectorAll('.blog-post');
    const prevPageButton = document.getElementById('prevPage');
    const nextPageButton = document.getElementById('nextPage');
    
    // State
    let currentPage = 1;
    const postsPerPage = 6;
    let cartItems = JSON.parse(localStorage.getItem('cart')) || [];
    const cartCounter = document.querySelector('.cart-counter');
    
    // Initialize
    initializeBlog();
    
    // Event listeners
    document.addEventListener('click', handleBlogClick);
    
    function initializeBlog() {
        // Check for URL parameters to expand specific post
        const urlParams = new URLSearchParams(window.location.search);
        const postSlug = urlParams.get('slug');
        
        if (postSlug) {
            const targetPost = document.querySelector(`[data-slug="${postSlug}"]`);
            if (targetPost) {
                expandPost(targetPost, postSlug);
            }
        }
        
        // Initialize cart counter
        updateCartCounter();
        
        // Initial render
        renderPosts();
    }
    
    function handleBlogClick(event) {
        const target = event.target;
        
        // Handle read more/collapse buttons
        if (target.classList.contains('btn-read-more') || target.classList.contains('btn-collapse')) {
            const postSlug = target.dataset.post;
            const blogPost = target.closest('.blog-post');
            const isExpanded = blogPost.classList.contains('expanded');
            
            if (isExpanded) {
                collapsePost(blogPost);
            } else {
                expandPost(blogPost, postSlug);
            }
        }
        
        // Handle share buttons
        if (target.classList.contains('share-button')) {
            const postSlug = target.dataset.share;
            sharePost(postSlug);
        }
        
        // Handle mobile menu
        if (target.closest('.hamburger-menu')) {
            toggleMobileMenu();
        }
    }
    
    function expandPost(blogPost, postSlug) {
        // Collapse all other posts first
        blogPosts.forEach(post => {
            if (post !== blogPost) {
                collapsePost(post);
            }
        });
        
        // Expand the target post
        blogPost.classList.add('expanded');
        blogPost.querySelector('.blog-post-content').classList.add('expanded');
        
        // Update URL without page reload
        const newUrl = postSlug ? `${window.location.pathname}?slug=${postSlug}` : window.location.pathname;
        window.history.pushState({ slug: postSlug }, '', newUrl);
        
        // Smooth scroll to expanded post
        blogPost.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    
    function collapsePost(blogPost) {
        blogPost.classList.remove('expanded');
        blogPost.querySelector('.blog-post-content').classList.remove('expanded');
        
        // Remove slug from URL if collapsing
        if (window.location.search) {
            window.history.pushState({}, '', window.location.pathname);
        }
    }
    
    
    
    function renderPosts() {
        const blogGrid = document.getElementById('blogGrid');
        const startIndex = (currentPage - 1) * postsPerPage;
        const endIndex = startIndex + postsPerPage;
        const postsToShow = Array.from(blogPosts).slice(startIndex, endIndex);

        // Hide all posts first
        blogPosts.forEach(post => post.style.display = 'none');

        // Show posts for current page
        postsToShow.forEach(post => post.style.display = 'block');

        // Update navigation buttons
        prevPageButton.disabled = currentPage === 1;
        nextPageButton.disabled = endIndex >= blogPosts.length;

        // Update page info
        const totalPages = Math.ceil(blogPosts.length / postsPerPage);
        const blogNavInfo = document.querySelector('.blog-nav-info');
        blogNavInfo.textContent = `Page ${currentPage} of ${totalPages}`;
    }
    
    function sharePost(postSlug) {
        const post = document.querySelector(`[data-slug="${postSlug}"]`);
        const title = post.querySelector('.blog-post-title').textContent;
        const url = `${window.location.origin}${window.location.pathname}?slug=${postSlug}`;
        
        if (navigator.share) {
            navigator.share({
                title: title,
                text: `Check out this blog post: ${title}`,
                url: url
            });
        } else {
            // Fallback: copy URL to clipboard
            navigator.clipboard.writeText(url).then(() => {
                showNotification('Link copied to clipboard!');
            });
        }
    }
    
    function showNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'blog-notification';
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: var(--pink);
            color: var(--white);
            padding: var(--space-md);
            border-radius: var(--radius-md);
            box-shadow: var(--shadow-lg);
            z-index: 1001;
            animation: slideIn 0.3s ease;
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease forwards';
            setTimeout(() => notification.remove(), 300);
        }, 2000);
    }
    
    function toggleMobileMenu() {
        const mobileNav = document.querySelector('.mobile-nav');
        const hamburgerMenu = document.querySelector('.hamburger-menu');
        
        mobileNav.classList.toggle('active');
        hamburgerMenu.classList.toggle('active');
    }
    
    function updateCartCounter() {
        cartCounter.textContent = cartItems.length;
    }
    
    // Pagination event listeners
    prevPageButton.addEventListener('click', () => {
        if (currentPage > 1) {
            currentPage--;
            renderPosts();
        }
    });
    
    nextPageButton.addEventListener('click', () => {
        const totalPages = Math.ceil(blogPosts.length / postsPerPage);
        if (currentPage < totalPages) {
            currentPage++;
            renderPosts();
        }
    });
});

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { opacity: 0; transform: translateX(100px); }
        to { opacity: 1; transform: translateX(0); }
    }
    
    @keyframes slideOut {
        from { opacity: 1; transform: translateX(0); }
        to { opacity: 0; transform: translateX(100px); }
    }
    
    .blog-post {
        animation: fadeInUp 0.3s ease forwards;
    }
    
    @keyframes fadeInUp {
        from { opacity: 0; transform: translateY(20px); }
        to { opacity: 1; transform: translateY(0); }
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