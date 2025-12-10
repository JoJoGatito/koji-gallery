# Koji's Art Studio - Digital Art Portfolio

A beautiful, responsive digital art portfolio website featuring original characters, fan art, and blog content. Built with modern web technologies and powered by Sanity CMS for seamless content management.

![Koji's Art Studio](https://kojisartstudio.com/assets/images/og-image.jpg)

## 🎨 Project Overview

### Features

- **Digital Art Gallery**: Showcase original characters (OCs) and fan art with detailed descriptions and pricing
- **Blog System**: Share artistic journey, tutorials, and behind-the-scenes content
- **Shopping Cart**: Integrated Stripe payment processing for artwork sales
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **SEO Optimized**: Rich metadata, structured data, and search engine friendly
- **Accessibility**: WCAG compliant with keyboard navigation and screen reader support
- **Performance**: Optimized images, lazy loading, and efficient asset delivery

### Architecture

```
├── Static Files (HTML/CSS/JS)
├── Sanity CMS (Headless Content Management)
├── Stripe Integration (Payment Processing)
├── GitHub Pages (Hosting)
└── CDN Delivery (Optimized Assets)
```

### Tech Stack

- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **CMS**: Sanity Studio (Headless CMS)
- **Payments**: Stripe Payment Links
- **Hosting**: GitHub Pages
- **Images**: Responsive images with WebP support
- **Fonts**: Google Fonts (Comic Neue, VT323)
- **Icons**: Custom SVG icons and emoji

## 🚀 GitHub Pages Deployment

### Prerequisites

- GitHub account
- Basic command line knowledge
- Text editor (VS Code recommended)

### Step 1: Create a GitHub Repository

1. **Sign in to GitHub**
   - Go to [github.com](https://github.com)
   - Sign in with your GitHub credentials

2. **Create New Repository**
   - Click the "+" icon in the top right
   - Select "New repository"
   - Choose a repository name (e.g., `kojis-art-studio`)
   - Make it **Public** (required for GitHub Pages)
   - **Do not** initialize with README (we'll add our own)
   - Click "Create repository"

3. **Copy Repository URL**
   - On the repository page, click the green "Code" button
   - Copy the HTTPS URL (e.g., `https://github.com/yourusername/kojis-art-studio.git`)

### Step 2: Upload Your Files

#### Option A: Using Git Command Line (Recommended)

```bash
# Navigate to your project directory
cd /path/to/your/art-studio-project

# Initialize git repository (if not already done)
git init

# Add all files to staging
git add .

# Create initial commit
git commit -m "Initial commit: Koji's Art Studio portfolio"

# Add your GitHub repository as remote origin
git remote add origin https://github.com/yourusername/kojis-art-studio.git

# Push to GitHub
git push -u origin main
```

#### Option B: Using GitHub Desktop

1. **Install GitHub Desktop** from [desktop.github.com](https://desktop.github.com)
2. **Clone your repository** or create a new one
3. **Drag and drop your project files** into the GitHub Desktop window
4. **Commit and push** the changes

### Step 3: Enable GitHub Pages

1. **Go to Repository Settings**
   - In your GitHub repository, click "Settings" tab
   - Scroll down to "Pages" section

2. **Configure Source**
   - Under "Source", select "Deploy from a branch"
   - Choose "main" branch
   - Keep the folder as "/ (root)"
   - Click "Save"

3. **Wait for Deployment**
   - GitHub will begin deploying your site
   - This usually takes 1-2 minutes
   - You'll see a green checkmark when complete

4. **Access Your Site**
   - Your site will be available at: `https://yourusername.github.io/repository-name/`
   - GitHub will display the URL in the Pages settings

### Step 4: Configure Custom Domain (Optional)

If you have a custom domain:

1. **Purchase Domain** (e.g., from Namecheap, GoDaddy)
2. **Add DNS Records**:
   - Create CNAME record pointing to `yourusername.github.io`
   - Or A records pointing to GitHub's IP addresses
3. **Configure in GitHub**:
   - In Pages settings, click "Add custom domain"
   - Enter your domain name
   - Click "Save"
4. **Update Sanity CORS** settings with your custom domain

## 📝 Content Management Workflow

### Managing Content Through Sanity

#### Accessing Sanity Studio

1. **Local Development**:
   ```bash
   cd /path/to/your/sanity-project
   sanity dev
   ```
   - Opens at `http://localhost:3333`

2. **Production Studio**:
- Visit `https://emdgbbhp.sanity.studio`

#### Adding New Artwork

1. **Create Artwork Document**:
   - Go to "Artwork" in Sanity Studio
   - Click "Create new"
   - Fill in required fields:
     - Title (e.g., "Mystical Forest Guardian")
     - Category (OC or Fan Art)
     - Description (supports rich text)
     - Price and currency
     - Hero image (main artwork image)

2. **Upload Images**:
   - Drag and drop images into Sanity
   - Images automatically optimize and resize
   - Use "Hotspot" tool to set focus points

3. **Set Up Payment Link**:
   - In Stripe dashboard, create product
   - Generate payment link
   - Paste link into "Stripe Payment Link" field in Sanity

4. **Configure SEO**:
   - Title automatically generates slug
   - Add relevant tags for discoverability
   - Mark as "Featured" for homepage display

#### Managing Blog Posts

1. **Create Blog Post**:
   - Go to "Blog Post" section
   - Click "Create new"
   - Add title, slug, and body content
   - Upload featured image
   - Set publish date

2. **Rich Text Editor**:
   - Bold, italic, links
   - Headings and lists
   - Blockquotes and code blocks
   - Image embeds

#### Updating Artist Profile

1. **Edit Profile**:
   - Go to "Artist Profile" section
   - Update bio, avatar, and contact information
   - Modify social media links

### Content Publishing Workflow

1. **Draft**: Write and save content
2. **Review**: Preview changes in Sanity
3. **Publish**: Make content live
4. **Update**: Modify existing content
5. **Archive**: Hide old content (if needed)

### Content Best Practices

- **Image Optimization**: Use WebP format, appropriate sizes
- **SEO**: Include relevant keywords in titles and descriptions
- **Consistency**: Maintain consistent formatting and style
- **Accessibility**: Add alt text to all images
- **Performance**: Keep images under 2MB

### Sanity Configuration

- **Project ID**: `emdgbbhp`
- **Dataset**: `production`
- **CORS Origins**:
  - `https://jojogatito.github.io`
  - `http://localhost:5500`
  - `http://127.0.0.1:5500`
- **Notes**: This configuration ensures that the frontend can securely access the Sanity API. Future maintenance should involve updating the CORS origins if the deployment domain changes.

## 🎨 Asset Maintenance

### Metallic Background Images

**Location**: `assets/images/metal/`

**Files**:
- `8e31b1e60162077db8e6a8636a23127bac5786e50ade4f26e6ca3c2fbe515d67.gif`
- `55e2f5316c62543c26248cd9f52cc8b8cb24d3db4b6d3749374ad8c59f6a7afe.png`
- `79eef6bfc37e82169d2f4fa9ba3634121d65d2aa34536d22dead90178a7df76e.png`
- `3448b8010dbb3c315ba742ec150ecd9541b93c4a234fa13e21299dc6d0af3fbb.png`
- `deafc3503248c1bad2c6f4cdc67f6eaba7adbda65f745136f865fae901158fa8.png`

**Updating Backgrounds**:

1. **Prepare New Images**:
   - Create seamless metallic textures
   - Optimize for web (under 500KB)
   - Use similar color palette

2. **Generate Filename**:
   - Use SHA-256 hash of image content
   - Keep original file extension (.png, .gif)

3. **Replace Files**:
   ```bash
   # Remove old background
   rm assets/images/metal/old-filename.ext

   # Add new background
   cp /path/to/new-background.ext assets/images/metal/new-filename.ext
   ```

4. **Update CSS Reference**:
   - Edit `assets/css/background.css`
   - Update background image URLs

### Corkboard Texture

**Location**: `assets/images/cork-texture.jpg`

**Replacement**:
1. Find high-quality cork texture (seamless)
2. Optimize to ~100KB
3. Replace existing file
4. No code changes needed (CSS references by filename)

### Thumbtack Images

**Location**: `assets/images/thumbtack.svg`

**Customization**:
1. Edit SVG directly in text editor
2. Modify colors, shadows, or shape
3. Save changes (no rebuild required)

### Favicon Management

**Location**: `assets/images/favicons/`

**Files**:
- `favicon.svg` - Main SVG favicon
- `favicon.ico` - Legacy favicon
- `apple-touch-icon.png` - iOS home screen
- `site.webmanifest` - Web app manifest

**Updating Favicons**:
1. Use [favicon.io](https://favicon.io) or [realfavicongenerator.net](https://realfavicongenerator.net)
2. Upload your logo/image
3. Download generated favicon package
4. Replace files in `assets/images/favicons/`

### Image Optimization Best Practices

1. **Format Selection**:
   - Photos: JPEG (80% quality)
   - Graphics: PNG or WebP
   - Icons: SVG

2. **Size Guidelines**:
   - Hero images: 1200x800px
   - Thumbnails: 400x300px
   - Avatars: 200x200px

3. **Optimization Tools**:
   - [TinyPNG](https://tinypng.com) - PNG/JPEG compression
   - [Squoosh](https://squoosh.app) - Image optimization
   - [SVGOMG](https://jakearchibald.github.io/svgomg/) - SVG optimization

4. **Responsive Images**:
   - Use `srcset` attribute
   - Provide multiple sizes
   - Set appropriate `sizes` attribute

## 🔧 Development Workflow

### Local Development

1. **Clone Repository**:
   ```bash
   git clone https://github.com/yourusername/kojis-art-studio.git
   cd kojis-art-studio
   ```

2. **Serve Locally**:
   ```bash
   # Using Python (if installed)
   python -m http.server 8000

   # Using Node.js (if installed)
   npx serve .

   # Using PHP (if installed)
   php -S localhost:8000
   ```

3. **Open Browser**: Visit `http://localhost:8000`

### File Structure

```
kojis-art-studio/
├── index.html                 # Homepage
├── gallery.html              # Art gallery page
├── blog.html                 # Blog listing page
├── 404.html                  # Error page
├── robots.txt               # Search engine instructions
├── sitemap.xml              # Site structure for SEO
├── SANITY_SETUP.md          # CMS setup guide
├── README.md                # This file
├── schemas/                 # Sanity schema definitions
│   ├── artwork.js
│   ├── blogPost.js
│   └── artistProfile.js
├── assets/
│   ├── css/                 # Stylesheets
│   │   ├── theme.css
│   │   ├── background.css
│   │   └── corkboard.css
│   ├── js/                  # JavaScript files
│   │   ├── main.js
│   │   ├── sanityClient.js
│   │   ├── gallery.js
│   │   ├── blog.js
│   │   └── cart.js
│   └── images/              # Image assets
│       ├── favicons/
│       ├── metal/           # Background textures
│       ├── cork-texture.jpg
│       └── thumbtack.svg
```

## 📞 Support & Resources

### Documentation
- [Sanity CMS Documentation](https://www.sanity.io/docs)
- [Stripe Payment Links](https://stripe.com/docs/payment-links)
- [GitHub Pages Guide](https://docs.github.com/en/pages)

### Community
- [Sanity Community Slack](https://sanity-io-land.slack.com/)
- [GitHub Community](https://github.community/)
- [Web.dev](https://web.dev/) - Web performance and best practices

### Tools
- [Visual Studio Code](https://code.visualstudio.com/) - Code editor
- [GitHub Desktop](https://desktop.github.com/) - Git GUI
- [Netlify](https://www.netlify.com/) - Alternative hosting option

---

**Made with ❤️ by Koji**

*For questions or support, please contact: [your-email@example.com]*

*Last updated: $(date)*