# Sanity CMS Integration Validation Checklist

This document provides a checklist for the frontend team to verify that each page properly fetches and displays data from the Sanity CMS after configuration updates.

## index.html Validation

### 1. Sanity Data to Display

*   **Latest OC Art:** A list of the most recent three original character artworks.
*   **Latest Fan Art:** A list of the most recent three fan artworks.
*   **Latest Blog Post:** The single most recent blog post.

### 2. Elements to Check

*   **Latest OC Art Section:**
    *   Check the `div` with the class `corkboard-section` containing the `h3` with the text "Latest OC Art".
    *   Inside this section, there should be a `div` with the class `corkboard-grid`.
    *   Verify that there are three `div` elements with the class `pinned-note`.
*   **Latest Fan Art Section:**
    *   Check the `div` with the class `corkboard-section` containing the `h3` with the text "Latest Fan Art".
    *   Inside this section, there should be a `div` with the class `corkboard-grid`.
    *   Verify that there are three `div` elements with the class `pinned-note`.
*   **Latest Blog Post Section:**
    *   Check the `div` with the class `corkboard-section` containing the `h3` with the text "Latest Blog Post".
    *   Inside this section, there should be a `div` with the class `corkboard-grid`.
    *   Verify that there is one `div` element with the class `pinned-note`.

### 3. How to Validate

*   **Latest OC Art & Fan Art:**
    *   **Image:** The `img` tag inside each `pinned-note` should have a `src` attribute pointing to a Sanity CDN URL.
    *   **Title:** The `h4` tag inside each `pinned-note` should display the artwork's title from Sanity.
    *   **Description:** The `p` tag inside each `pinned-note` should display the artwork's description from Sanity.
    *   **"View Details" Button:** The button should be present.
*   **Latest Blog Post:**
    *   **Image:** The `img` tag inside the `pinned-note` should have a `src` attribute pointing to a Sanity CDN URL.
    *   **Title:** The `h4` tag inside the `pinned-note` should display the blog post's title from Sanity.
    *   **Excerpt:** The `p` tag inside the `pinned-note` should display the blog post's excerpt from Sanity.
    *   **"Read More" Link:** The `a` tag should have an `href` attribute that correctly links to the full blog post (e.g., `blog.html?slug=...`).

## gallery.html Validation

### 1. Sanity Data to Display

*   **All Artworks:** A grid of all artworks, filterable by category (e.g., "Original Character," "Fan Art").

### 2. Elements to Check

*   **Filter Tabs:**
    *   Verify that the `div` with the class `filter-tabs` is present.
    *   Check for `button` elements with the class `filter-tab` for each artwork category.
*   **Artwork Grid:**
    *   Check the `div` with the id `artworkGrid`.
    *   Verify that it is populated with `div` elements with the class `artwork-card`.

### 3. How to Validate

*   **Artwork Card:**
    *   **Image:** The `img` tag with the class `artwork-image` should have a `src` attribute pointing to a Sanity CDN URL.
    *   **Title:** The `h3` tag with the class `artwork-title` should display the artwork's title from Sanity.
    *   **Price:** The `p` tag with the class `artwork-price` should display the correct price from Sanity.
    *   **Status:** The `span` tag with the class `artwork-status` should display the correct availability status from Sanity (e.g., "Available," "Sold Out").
    *   **Buttons:** The "Add to Cart" and "Buy Now" buttons should be present and functional.
*   **Filtering:**
    *   Clicking on a filter tab (e.g., "Fan Art") should update the `artwork-grid` to only show artworks of that category.
    *   The "All" filter should display all artworks.
*   **Lightbox:**
    *   Clicking on an artwork image should open a lightbox view (`div` with id `lightbox`).
    *   The lightbox should display a larger version of the artwork image from Sanity.

## blog.html Validation

### 1. Sanity Data to Display

*   **All Blog Posts:** A list of all blog posts, typically paginated.
*   **Expanded Blog Post:** The full content of a single blog post when selected.

### 2. Elements to Check

*   **Blog Grid:**
    *   Check the `div` with the id `blogGrid`.
    *   Verify that it is populated with `article` elements with the class `blog-post`.
*   **Expanded Post View:**
    *   When a "Read More" button is clicked, the corresponding `article` should expand to show the full content.
    *   Check for a `div` with the class `blog-post-full` inside the expanded article.

### 3. How to Validate

*   **Blog Post Card:**
    *   **Image:** The `img` tag with the class `blog-post-image` should have a `src` attribute pointing to a Sanity CDN URL.
    *   **Title:** The `h3` tag with the class `blog-post-title` should display the post's title from Sanity.
    *   **Metadata:** The `div` with the class `blog-post-meta` should show the correct author and publication date.
    *   **Excerpt:** The `p` tag with the class `blog-post-excerpt` should display the post's excerpt.
*   **Expanded Blog Post:**
    *   The `blog-post-full` `div` should render the complete blog post content from Sanity, including formatted text, images, and other embedded content.
    *   The "Collapse" button should be visible and functional.

## Troubleshooting Common Issues

### 1. No Data is Displayed

*   **Check Sanity Client Configuration:**
    *   Verify that the `projectId` and `dataset` in `assets/js/sanityClient.js` are correct.
    *   Ensure that the Sanity project has the correct CORS origins configured to allow requests from the website's domain. Refer to the `SANITY_CORS_DATASET_GUIDE.md` for instructions.
*   **Check Network Requests:**
    *   Open the browser's developer tools (F12) and go to the "Network" tab.
    *   Look for requests to the Sanity API (e.g., `https://<projectId>.api.sanity.io/...`).
    *   Check the status code of these requests. A `404` or `401` error indicates a problem with the project ID or authentication. A CORS error indicates a misconfiguration in the Sanity project settings.
*   **Check GROQ Queries:**
    *   Review the GROQ queries in the JavaScript files (`assets/js/gallery.js`, `assets/js/blog.js`, etc.).
    *   Ensure that the query correctly references the document types and fields in your Sanity schema.

### 2. Images are Not Loading

*   **Check Image URLs:**
    *   Inspect the `src` attribute of the `img` tags.
    *   Verify that the URL is a valid Sanity CDN URL.
    *   If the URL is incorrect, check the part of the JavaScript code that constructs the image URL (e.g., using `urlFor()` from the Sanity client).
*   **Check for Broken Image Icons:**
    *   A broken image icon means the URL is incorrect or the image does not exist in the Sanity dataset.

### 3. Data is Outdated or Incorrect

*   **Check Sanity Studio:**
    *   Log in to your Sanity Studio and verify that the content has been published. Drafts will not be visible on the live site unless the client is configured to use the preview API.
*   **Check for Caching:**
    *   Clear your browser cache to ensure you are not viewing a cached version of the page.
    *   If you are using a CDN or hosting service with caching, you may need to purge the cache there as well.
