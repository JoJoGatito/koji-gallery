# Deployment & QA Guidelines

Comprehensive guide for launching and maintaining Koji's Art Studio on GitHub Pages, including quality assurance testing, troubleshooting, and post-launch procedures.

## 📋 Pre-Launch Checklist

### Content Verification

- [ ] **Homepage Content**
  - Artist bio and profile information
  - Latest OC artworks display correctly
  - Latest fan art showcases properly
  - Latest blog post preview shows
  - All placeholder images replaced with real artwork

- [ ] **Gallery Page**
  - All artworks have proper titles and descriptions
  - Images load correctly and are optimized
  - Filtering and sorting functionality works
  - Lightbox/modal displays properly
  - Stripe payment links are configured

- [ ] **Blog System**
  - Blog posts have featured images
  - Content renders correctly (rich text)
  - URLs and slugs are SEO-friendly
  - Categories and tags are properly assigned

- [ ] **SEO Elements**
  - Meta descriptions are compelling and under 160 characters
  - Title tags are optimized (under 60 characters)
  - Open Graph tags include proper image and description
  - Twitter Card tags are configured
  - Structured data (JSON-LD) is valid

### Technical Requirements

- [ ] **Performance**
  - All images optimized (under 2MB)
  - CSS and JS files are minified
  - No console errors in browser dev tools
  - Page load time under 3 seconds

- [ ] **Security**
  - No sensitive information in code
  - Stripe keys are properly configured
  - Sanity project ID is set correctly
  - CORS settings configured for your domain

- [ ] **Accessibility**
  - All images have alt text
  - Color contrast meets WCAG AA standards
  - Keyboard navigation works on all interactive elements
  - Screen reader compatibility verified

### Asset Validation

- [ ] **Images**
  - Hero images: 1200x800px, optimized
  - Thumbnail images: 400x300px, optimized
  - All placeholder images replaced
  - Favicon package complete and up-to-date

- [ ] **Background Assets**
  - Metallic textures load correctly
  - Corkboard texture displays properly
  - Thumbtack SVGs render correctly
  - No broken image links

## 🧪 QA Testing Guidelines

### Browser Compatibility Testing

#### Desktop Browsers

- [ ] **Chrome** (latest 2 versions)
  - Layout renders correctly
  - JavaScript functionality works
  - CSS animations smooth
  - Images load properly

- [ ] **Firefox** (latest 2 versions)
  - Layout consistency
  - Form functionality
  - CSS Grid/Flexbox support
  - Image loading

- [ ] **Safari** (latest 2 versions)
  - Layout and styling
  - JavaScript compatibility
  - Image rendering
  - Font loading

- [ ] **Edge** (latest 2 versions)
  - Full functionality test
  - Layout rendering
  - Performance check

#### Mobile Browsers

- [ ] **Chrome Mobile** (Android)
- [ ] **Safari Mobile** (iOS)
- [ ] **Firefox Mobile** (Android)
- [ ] **Samsung Internet** (Android)

### Responsive Design Verification

#### Breakpoints Testing

- [ ] **Mobile (320px - 767px)**
  - Navigation collapses to hamburger menu
  - Images scale appropriately
  - Text remains readable
  - Touch targets are adequate size (44px+)

- [ ] **Tablet (768px - 1023px)**
  - Layout adapts to medium screens
  - Grid layouts adjust properly
  - Navigation remains accessible

- [ ] **Desktop (1024px+)**
  - Full layout displays correctly
  - Multi-column layouts work
  - Hover effects function properly

#### Orientation Testing

- [ ] **Portrait mode** on mobile devices
- [ ] **Landscape mode** on mobile devices
- [ ] **Responsive images** adapt to different screen densities

### Accessibility Testing

#### Keyboard Navigation

- [ ] **Tab Order**
  - Logical tab sequence through page
  - All interactive elements reachable
  - Skip links function correctly

- [ ] **Focus Management**
  - Visible focus indicators
  - Focus trap in modals (if applicable)
  - Focus returns to trigger element after modal close

- [ ] **Keyboard Shortcuts**
  - Enter/Space activate buttons
  - Escape closes modals
  - Arrow keys navigate (if applicable)

#### Screen Reader Compatibility

- [ ] **Semantic HTML**
  - Proper heading hierarchy (h1, h2, h3)
  - Landmark regions (header, nav, main, footer)
  - Form labels associated correctly

- [ ] **ARIA Labels**
  - Descriptive alt text for images
  - ARIA labels for interactive elements
  - Live regions for dynamic content

- [ ] **Screen Reader Testing**
  - Test with NVDA (Windows)
  - Test with VoiceOver (Mac)
  - Test with TalkBack (Android)

### Performance Testing

#### Lighthouse Audit

Run Lighthouse in Chrome DevTools or online:

- [ ] **Performance Score**: 90+
- [ ] **Accessibility Score**: 95+
- [ ] **Best Practices Score**: 95+
- [ ] **SEO Score**: 95+

#### Core Web Vitals

- [ ] **Largest Contentful Paint (LCP)**: < 2.5s
- [ ] **First Input Delay (FID)**: < 100ms
- [ ] **Cumulative Layout Shift (CLS)**: < 0.1

#### Manual Performance Checks

- [ ] **Image Loading**: Lazy loading works
- [ ] **Font Loading**: Fonts display without layout shift
- [ ] **JavaScript**: No blocking scripts
- [ ] **Caching**: Static assets cache properly

### Cross-Device Testing

#### Device Categories

- [ ] **Smartphones**
  - iPhone SE (375x667)
  - iPhone 12 (390x844)
  - Samsung Galaxy S21 (360x800)

- [ ] **Tablets**
  - iPad (768x1024)
  - iPad Pro (1024x1366)
  - Android tablets (800x1280)

- [ ] **Desktop**
  - 1920x1080 (Full HD)
  - 1366x768 (Laptop)
  - 2560x1440 (2K)

#### Testing Tools

- **BrowserStack**: Real device testing
- **Device Mode**: Chrome DevTools device simulation
- **Responsive Design Mode**: Firefox developer tools

## 🔧 Common Issues & Troubleshooting

### GitHub Pages Issues

#### Issue: Site Not Loading

**Symptoms**: 404 error or blank page

**Solutions**:
1. **Check Repository Settings**
   - Verify Pages is enabled
   - Confirm source branch is correct
   - Check build status in Pages settings

2. **File Structure**
   - Ensure `index.html` is in root directory
   - Check for case sensitivity issues
   - Verify all file paths are correct

3. **Cache Issues**
   ```bash
   # Hard refresh browser
   Ctrl+F5 (Windows/Linux) or Cmd+Shift+R (Mac)

   # Clear browser cache completely
   ```

#### Issue: Styles/Images Not Loading

**Symptoms**: Unstyled content, broken images

**Solutions**:
1. **File Paths**
   - Use relative paths in HTML/CSS
   - Check for typos in file names
   - Verify file extensions

2. **Case Sensitivity**
   - GitHub Pages is case-sensitive
   - Ensure `assets/css/style.css` matches actual path

3. **CORS Issues**
   - Check Sanity CORS settings
   - Verify custom domain configuration

### Content Issues

#### Issue: Sanity Content Not Displaying

**Symptoms**: Empty sections, missing artwork

**Solutions**:
1. **CORS Configuration**
   - Add your GitHub Pages URL to Sanity CORS
   - Include both HTTP and HTTPS versions
   - Enable credentials

2. **Project ID**
   - Verify project ID in `sanityClient.js`
   - Check API version compatibility
   - Test with `useCdn: false` temporarily

3. **Content Publishing**
   - Ensure content is published (not draft)
   - Check publish dates are in the past
   - Verify content hasn't been deleted

#### Issue: Images Not Loading from Sanity

**Symptoms**: Broken image icons, 403/404 errors

**Solutions**:
1. **Image Assets**
   - Check image upload completion
   - Verify image references in Sanity documents
   - Ensure images are published

2. **CDN Issues**
   - Try with `useCdn: false` in client config
   - Check Sanity project status
   - Verify CORS allows image domains

### Performance Issues

#### Issue: Slow Page Load Times

**Solutions**:
1. **Image Optimization**
   - Compress images under 500KB
   - Use appropriate formats (WebP, JPEG)
   - Implement responsive images

2. **Code Optimization**
   - Minify CSS and JavaScript
   - Remove unused code
   - Optimize font loading

3. **Caching**
   - Add cache headers to static assets
   - Implement service worker (if needed)
   - Use CDN for external resources

#### Issue: Layout Shift During Load

**Solutions**:
1. **Font Loading**
   - Use `font-display: swap`
   - Preload critical fonts
   - Consider system fonts as fallbacks

2. **Image Dimensions**
   - Set width/height attributes on images
   - Use aspect-ratio CSS property
   - Implement skeleton loading states

### JavaScript Errors

#### Issue: JavaScript Console Errors

**Solutions**:
1. **CORS Errors**
   - Check Sanity CORS configuration
   - Verify API endpoints are accessible
   - Check browser network tab

2. **Missing Dependencies**
   - Ensure all files are uploaded
   - Check for typos in script tags
   - Verify JavaScript syntax

3. **Browser Compatibility**
   - Test in different browsers
   - Check for unsupported features
   - Add polyfills if necessary

### Mobile-Specific Issues

#### Issue: Touch Interactions Not Working

**Solutions**:
1. **Touch Target Size**
   - Ensure buttons are 44px minimum
   - Add adequate spacing between elements
   - Test with various finger sizes

2. **Viewport Settings**
   - Verify viewport meta tag
   - Check for zoom issues
   - Test orientation changes

#### Issue: Mobile Layout Problems

**Solutions**:
1. **CSS Media Queries**
   - Test all breakpoints
   - Check flexbox/grid layouts
   - Verify image scaling

2. **Mobile Navigation**
   - Test hamburger menu functionality
   - Check overlay positioning
   - Verify accessibility

## 🚀 Launch Preparation

### Final Testing

1. **End-to-End Testing**
   - Complete user journey testing
   - Test all forms and interactions
   - Verify payment flow (if applicable)

2. **Cross-Browser Testing**
   - Test in all target browsers
   - Verify functionality across devices
   - Check for visual differences

3. **Performance Validation**
   - Run final Lighthouse audit
   - Test on slow connections
   - Verify mobile performance

### Backup and Documentation

1. **Create Backup**
   - Export all Sanity content
   - Save all custom configurations
   - Document any customizations

2. **Update Documentation**
   - Ensure README.md is current
   - Document any custom setups
   - Include troubleshooting notes

### Pre-Launch Checklist

- [ ] **Final Content Review**
  - All placeholder content replaced
  - Spelling and grammar checked
  - Contact information verified

- [ ] **SEO Finalization**
  - Sitemap.xml updated
  - Robots.txt configured
  - Analytics installed (if applicable)

- [ ] **Legal Compliance**
  - Privacy policy linked
  - Terms of service available
  - Copyright notices in place

- [ ] **Social Media**
  - Update social links
  - Prepare launch announcements
  - Create shareable content

## ✅ Post-Launch Verification

### Immediate Post-Launch (First 24 Hours)

1. **Site Availability**
   - Confirm site loads correctly
   - Test from multiple locations
   - Verify SSL certificate (if applicable)

2. **Functionality Testing**
   - Test all user interactions
   - Verify form submissions
   - Check payment processing

3. **Performance Monitoring**
   - Monitor page load times
   - Check for 404 errors
   - Review browser console

### First Week Monitoring

1. **User Experience**
   - Monitor for user-reported issues
   - Check site analytics
   - Review search console for errors

2. **Content Updates**
   - Add new artwork regularly
   - Update blog content
   - Refresh featured content

3. **Performance Optimization**
   - Monitor Core Web Vitals
   - Optimize based on user behavior
   - Update images and assets as needed

### Ongoing Maintenance

1. **Weekly Tasks**
   - Review and add new content
   - Check for broken links
   - Update meta descriptions as needed

2. **Monthly Tasks**
   - Run full Lighthouse audit
   - Update dependencies
   - Review and optimize images

3. **Quarterly Tasks**
   - Major content updates
   - Performance review
   - Accessibility audit

### Emergency Procedures

#### Site Down Emergency

1. **Immediate Actions**
   - Check GitHub Pages status
   - Verify repository accessibility
   - Test from multiple devices/locations

2. **Troubleshooting Steps**
   - Review recent changes
   - Check browser console
   - Verify DNS configuration

3. **Rollback Plan**
   - Have backup of working version
   - Document rollback procedure
   - Test rollback process

#### Content Emergency

1. **Content Issues**
   - Identify affected content
   - Check Sanity Studio
   - Verify CORS settings

2. **Quick Fixes**
   - Temporary placeholder content
   - Disable problematic features
   - Add maintenance notice if needed

## 📊 Monitoring & Analytics

### Recommended Tools

- **Google Analytics 4**: User behavior tracking
- **Google Search Console**: SEO performance
- **Lighthouse**: Regular performance audits
- **GitHub Pages Analytics**: Built-in traffic stats

### Key Metrics to Monitor

- **Performance**: Page load times, Core Web Vitals
- **User Engagement**: Bounce rate, session duration
- **SEO**: Search rankings, click-through rates
- **Technical**: 404 errors, broken links

---

**Last Updated**: $(date)

*For technical support or questions, refer to the main README.md or contact your development team.*