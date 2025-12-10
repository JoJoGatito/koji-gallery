# Sanity Project Configuration Guide: Dataset Visibility & CORS Setup

## Overview

This guide provides detailed instructions for configuring your Sanity project settings to allow your website at `https://jojogatito.github.io` to properly access the Sanity API. You need to configure two main areas:

1. **Dataset Visibility**: Set the production dataset to Public visibility
2. **CORS Configuration**: Allow specific origins and disable credentials

## Prerequisites

- You must be the project owner or have admin access to the Sanity project
- Project ID: `emdgbbhp` (already configured in your `sanityClient.js`)

## Step 1: Configure Production Dataset Visibility

**Navigation Path**: Sanity Manage → Project → Settings → API → Datasets

### Detailed Steps:

1. **Access Sanity Management Console**
   - Go to [https://sanity.io/manage](https://sanity.io/manage)
   - Log in with your Sanity account credentials

2. **Select Your Project**
- Find and click on your project (Project ID: `emdgbbhp`)
   - The project should be visible in your project list

3. **Navigate to API Settings**
   - Click on the **"API"** tab in the left sidebar
   - This will show you the API configuration options

4. **Access Dataset Settings**
   - In the API section, click on **"Datasets"** in the left sidebar
   - You'll see a list of your datasets (likely just "production")

5. **Set Dataset Visibility**
   - Find the **"production"** dataset in the list
   - Look for the visibility setting (usually a dropdown or toggle)
   - Change the visibility from **"Private"** to **"Public"**

   **⚠️ Important Notes:**
   - Public visibility allows CDN access for better performance
   - This setting enables your website to fetch content via the Sanity CDN
   - The change takes effect immediately

## Step 2: Configure CORS Settings

**Navigation Path**: Sanity Manage → Project → Settings → API → CORS

### Detailed Steps:

1. **Access CORS Configuration**
   - From the API section, click on **"CORS"** in the left sidebar
   - This will show the CORS (Cross-Origin Resource Sharing) settings

2. **Add Production Origin**
   - In the **"Origins"** section, click **"Add origin"**
   - Enter: `https://jojogatito.github.io`
   - **Important**: Do not include any path (like `/your-repo-name/`), only the exact origin

3. **Add Development Origins**
   - Click **"Add origin"** again
   - Enter: `http://localhost:5500`
   - Click **"Add origin"** once more
   - Enter: `http://127.0.0.1:5500`

4. **Configure Additional Settings**
   - **Allowed Headers**: Keep the default headers (typically includes `Authorization`, `Content-Type`)
   - **Allowed Methods**: Ensure `GET` is included (this is usually sufficient for read-only access)

5. **Set Credentials Setting**
   - Locate the **"Allow credentials"** setting
   - **Toggle this OFF** (set to disabled/not checked)
   - This is crucial for your GitHub Pages setup to work properly

## Step 3: Verify Configuration

1. **Save Changes**
   - Click **"Save"** or **"Apply"** to save all CORS settings
   - Sanity will validate your configuration

2. **Test the Configuration**
   - Open your website at `https://jojogatito.github.io`
   - Open browser developer tools (F12)
   - Check the Console tab for any CORS-related errors
   - The site should load content from Sanity without errors

## Troubleshooting

### Common Issues:

**1. CORS Errors Persist**
```
Access-Control-Allow-Origin error
```
- Verify all origins are added exactly as specified
- Ensure credentials are set to "Off"
- Check that changes were saved

**2. Dataset Not Visible**
- Confirm you're looking at the correct project (ID: `emdgbbhp`)
- Ensure you have admin access to the project
- Try refreshing the management interface

**3. Content Not Loading**
- Verify the dataset visibility is set to "Public"
- Check that your `sanityClient.js` has the correct project ID
- Confirm CORS origins match your testing environment

### Quick Verification Checklist:

- [ ] Production dataset visibility set to "Public"
- [ ] CORS origins include:
  - [ ] `https://jojogatito.github.io`
  - [ ] `http://localhost:5500`
  - [ ] `http://127.0.0.1:5500`
- [ ] Credentials setting is "Off"
- [ ] Changes have been saved
- [ ] Website loads without CORS errors

## Security Considerations

- **Public Dataset**: Allows CDN access for better performance but content is publicly accessible
- **No Credentials**: Disables credential-based requests, which is appropriate for public websites
- **Specific Origins**: Limits access to only your specified domains for security

## Support

If you encounter issues:

1. **Double-check** all steps in this guide
2. **Verify** your project ID (`emdgbbhp`) in the Sanity management console
3. **Test** with different browsers if issues persist
4. **Contact** Sanity support if configuration options are not available

## Next Steps

After completing this configuration:

1. Your website should load Sanity content without CORS errors
2. Consider setting up Sanity webhooks for content updates (see `SANITY_WEBHOOK_SETUP.md`)
3. Test content creation and updates through Sanity Studio
4. Monitor your website for any loading issues

---

**Project Details:**
- Project ID: `emdgbbhp`
- Primary Domain: `https://jojogatito.github.io`
- Dataset: `production`
- Last Updated: October 2025