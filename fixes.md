# Sanity integration fixes

This document consolidates all findings from the Sanity setup audit and lists exact, actionable fixes with file and line references. A verification checklist is provided at the end.

Key goals:
- Ensure frontend uses a reliable ESM source for the Sanity SDK and image URL builder
- Fix schema validation error(s)
- Correct GROQ queries and Portable Text rendering
- Load scripts in the correct order so globals are available
- Align CORS/visibility settings with your live domain
- Adopt safe query parameterization and stable API/versioning practices


## 1) Replace Skypack CDN with a supported ESM CDN

Skypack is deprecated/unreliable and may break production delivery.

Files:
- [assets/js/sanityClient.js](assets/js/sanityClient.js:7)
- [assets/js/sanityClient.js](assets/js/sanityClient.js:8)

Change:
```diff
- import { createClient } from 'https://cdn.skypack.dev/@sanity/client@6.7.0';
- import imageUrlBuilder from 'https://cdn.skypack.dev/@sanity/image-url@1.0.2';
+ import { createClient } from 'https://esm.sh/@sanity/client@7';
+ import imageUrlBuilder from 'https://esm.sh/@sanity/image-url@1';
```

Notes:
- esm.sh and jsDelivr are both reliable choices for browser ESM.
- Alternatively, bundle dependencies with a build tool to avoid runtime CDN dependencies.


## 2) Ensure the Sanity client is loaded before gallery.js

The Gallery page relies on globals (window.ArtworkDataManager) that are defined by the Sanity client module. Currently the page does not include the Sanity client script at all.

File:
- [gallery.html](gallery.html:185)

Action: Insert this line before gallery.js so the globals are available when gallery.js executes.
```html
<!-- Sanity client must load before gallery.js -->
<script type="module" src="assets/js/sanityClient.js"></script>
<script src="assets/js/cart.js" defer></script>
<script src="assets/js/gallery.js" defer></script>
```

Reference where globals are defined:
- [window.ArtworkDataManager = ArtworkDataManager](assets/js/sanityClient.js:504)
- [window.artworkData, window.sanityClient](assets/js/sanityClient.js:501)


## 3) Fix invalid schema validation for number fields

Sanity’s validation API does not provide Rule.positive(). Use min(0) for non-negative pricing.

File:
- [schemas/artwork.js](schemas/artwork.js:47)

Change:
```diff
- validation: Rule => Rule.required().positive()
+ validation: Rule => Rule.required().min(0)
```

This avoids Studio validation/runtime errors when editing documents.


## 4) Fix Portable Text link annotation rendering

Current logic checks the mark key for 'link', but annotations use markDefs keyed by _key with _type === 'link'. You already look up markDef; branch on its type instead of the mark key.

File:
- [renderMarks()](assets/js/sanityClient.js:285)

Existing link handling:
- [link branch uses markDef but checks against the mark key](assets/js/sanityClient.js:309)

Suggested fix (minimal change style):
```diff
- case 'link':
-   const href = markDef?.href || '#';
-   const target = markDef?.blank ? ' target="_blank" rel="noopener"' : '';
-   processedText = `<a href="${href}"${target}>${processedText}</a>`;
-   break;
+ default:
+   if (markDef && markDef._type === 'link') {
+     const href = markDef.href || '#';
+     const target = markDef.blank ? ' target="_blank" rel="noopener"' : '';
+     processedText = `<a href="${href}"${target}>${processedText}</a>`;
+     break;
+   }
+   switch (mark) {
+     case 'strong':
+       processedText = `<strong>${processedText}</strong>`;
+       break;
+     case 'em':
+       processedText = `<em>${processedText}</em>`;
+       break;
+     case 'code':
+       processedText = `<code>${processedText}</code>`;
+       break;
+     case 'underline':
+       processedText = `<u>${processedText}</u>`;
+       break;
+   }
+   break;
```

Alternatively, normalize marks by iterating marks as keys and switching only when markDef is absent, then handling link via markDef._type.


## 5) Fix GROQ search (use array::join or match on tags[])

The query in searchArtworks incorrectly uses string::join; in GROQ, join belongs to the array namespace. A simpler and safer approach is to match tags[] directly.

File:
- [searchArtworks()](assets/js/sanityClient.js:361)

Change approach (also parameterize the query; see next section):
```js
// Example rework: parameterized search
const query = `*[_type == "artwork" && (title match $term || tags[] match $term)] 
  | order(publishedAt desc) {
  _id, title, slug, category, description, price, currency, availability,
  heroImage, images, tags, featured, publishedAt, stripePaymentLink
}`;
return await this.client.fetch(query, { term: `*${searchTerm}*` });
```

If you prefer to keep join:
```js
// array::join version
const query = `*[_type == "artwork" && (
  title match $term || array::join(tags, " ") match $term
)] { ... }`;
return await this.client.fetch(query, { term: `*${searchTerm}*` });
```


## 6) Parameterize GROQ queries for category and slug

Avoid string interpolation in GROQ to reduce escaping/injection errors.

Files:
- [GALLERY_BY_CATEGORY(category)](assets/js/sanityClient.js:92)
- [BLOG_POST_BY_SLUG(slug)](assets/js/sanityClient.js:126)
- [fetch() usage](assets/js/sanityClient.js:170)

Changes:

A) Define parameterized queries:
```diff
- GALLERY_BY_CATEGORY: (category) => `
-   *[_type == "artwork" && category == "${category}"] | order(publishedAt desc) { ... }
- `,
+ GALLERY_BY_CATEGORY: `
+   *[_type == "artwork" && category == $category] | order(publishedAt desc) { ... }
+ `,

- BLOG_POST_BY_SLUG: (slug) => `
-   *[_type == "blogPost" && slug.current == "${slug}"][0] { ... }
- `
+ BLOG_POST_BY_SLUG: `
+   *[_type == "blogPost" && slug.current == $slug][0] { ... }
+ `
```

B) Pass params to fetch:

- [getGalleryData(category)](assets/js/sanityClient.js:336)
```diff
- const query = category ? GROQ_QUERIES.GALLERY_BY_CATEGORY(category) : GROQ_QUERIES.GALLERY_ALL;
- return await this.fetch(query);
+ if (!category) return await this.fetch(GROQ_QUERIES.GALLERY_ALL);
+ return await this.client.fetch(GROQ_QUERIES.GALLERY_BY_CATEGORY, { category });
```

- [getBlogPostBySlug(slug)](assets/js/sanityClient.js:347)
```diff
- return await this.fetch(GROQ_QUERIES.BLOG_POST_BY_SLUG(slug));
+ return await this.client.fetch(GROQ_QUERIES.BLOG_POST_BY_SLUG, { slug });
```

Note: You can keep `this.fetch(query)` for non-parameterized calls, but for parameterized queries, call `this.client.fetch(query, params)` directly.


## 7) CORS Allowed Origins and Dataset visibility

Your site canonical/meta references kojisartstudio.com, but the CORS list in docs references GitHub Pages. Add your live domain(s) in Sanity Manage.

Actions (Sanity project emdgbbhp):
- Add Allowed Origins: 
  - https://kojisartstudio.com
  - https://www.kojisartstudio.com
  - (Keep) https://jojogatito.github.io if still using GitHub Pages for testing/previews
- Set “Allow credentials” OFF for public read access.
- Dataset visibility:
  - If you are making browser-side requests with [createClient()](assets/js/sanityClient.js:14) and [useCdn: true](assets/js/sanityClient.js:17) (no token), set the dataset to Public.
  - If dataset is Private, do not put tokens in the frontend. Proxy via a server or make the dataset Public for read-only content.

References:
- CORS and dataset guide: [SANITY_CORS_DATASET_GUIDE.md](SANITY_CORS_DATASET_GUIDE.md:19)
- Repo README notes: [README.md](README.md:212)


## 8) Optional improvements

A) Pin a newer API version
- File: [createClient()](assets/js/sanityClient.js:18)
```diff
- apiVersion: '2023-05-03'
+ apiVersion: '2024-10-01' // example stable date; pick a recent known-good for your feature set
```
Rationale: Keep behavior stable across SDK/GROQ changes.

B) Node 20 LTS for Studio development
- Some Sanity SDK packages in the dependency tree generally target Node 20+. Standardize on Node 20 LTS to avoid install/build issues.
- Studio scripts: [studio/package.json](studio/package.json:6)

C) Use “published” perspective when appropriate
If you want to enforce published-only reads from the browser:
```js
// Option: pass per-request
this.client.fetch(query, params, { perspective: 'published' });
```
Note: Don’t apply in drafts-required UIs or where previews are desired.

D) JSON module import compatibility
- File: [assets/js/sanityClient.js](assets/js/sanityClient.js:11)
Some browsers prefer `assert { type: 'json' }`:
```diff
- import sampleData from './sampleData.json' with { type: 'json' };
+ import sampleData from './sampleData.json' assert { type: 'json' };
```
Or load via fetch for maximal compatibility.


## 9) Confirm image URL builder usage for PT image blocks

In [renderPortableText()](assets/js/sanityClient.js:262), the image handling uses:
- [const imageUrl = this.getImageUrl(block.asset, 800)](assets/js/sanityClient.js:273)

Ensure your block schema shape matches (your schema includes a dedicated 'image' block type with fields). If needed, pass the entire image field object (with asset ref) to the builder:
```js
const imageUrl = this.getImageUrl(block, 800);
```
If you continue to pass `block.asset`, make sure it’s the correct reference object the builder expects.


---

## Verification checklist

Frontend
- Open [test-dev-mode.html](test-dev-mode.html:231) and click “Run All Tests”
  - Home data: [getHomePageData()](assets/js/sanityClient.js:323) returns ocArtworks/fanArtworks/latestBlogPost
  - Gallery data: [getGalleryData()](assets/js/sanityClient.js:336) returns an array
  - Blog posts: [getAllBlogPosts()](assets/js/sanityClient.js:343) returns an array
  - Featured artworks: [getFeaturedArtworks()](assets/js/sanityClient.js:384) returns an array
- Open [gallery.html](gallery.html:185) and confirm:
  - No ReferenceError for ArtworkDataManager
  - Sold out buttons are disabled/styled correctly and Stripe link opens (if present)

Studio
- Run `sanity dev`
- Create/edit an Artwork document; price validation should accept 0+ and not error on “positive()”
- Confirm types present (Artwork, Blog Post, Artist Profile)

Sanity project settings (Manage)
- Dataset "production" visibility: Public (if using browser read-only with no token)
- Allowed Origins include kojisartstudio.com (+ www) and any testing domains
- Credentials: OFF (for public reads via CDN)

Performance & stability
- CDN usage: [useCdn: true](assets/js/sanityClient.js:17) is fine for public content; temporarily set false if you need freshest content
- API version: updated to a recent stable date and pinned
- Node: Using Node 20 LTS for Studio development


## Appendix — References

- SDK init: [createClient()](assets/js/sanityClient.js:14)
- GROQ storage:
  - [GALLERY_BY_CATEGORY](assets/js/sanityClient.js:92)
  - [BLOG_POST_BY_SLUG](assets/js/sanityClient.js:126)
  - [searchArtworks](assets/js/sanityClient.js:361)
- PT rendering: [renderPortableText()](assets/js/sanityClient.js:262), [renderMarks()](assets/js/sanityClient.js:285)
- Schema files:
  - [artwork.js](schemas/artwork.js:1)
  - [blogPost.js](schemas/blogPost.js:1)
  - [artistProfile.js](schemas/artistProfile.js:1)

Docs (via Context7)
- Sanity Studio [/sanity-io/sanity]
- General Sanity [/websites/sanity_io]
- Validation API uses min/max/integer; no Rule.positive() (see Sanity schema references)
