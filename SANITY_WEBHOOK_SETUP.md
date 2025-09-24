# Sanity Webhook Setup Guide

This guide explains how to set up automatic rebuilds of your GitHub Pages site when content changes in Sanity CMS.

## Overview

The webhook integration allows your GitHub Pages site to automatically rebuild whenever you publish new content in Sanity Studio. This ensures your website always displays the latest artwork, blog posts, and updates without manual intervention.

## Prerequisites

- Sanity project set up and configured
- GitHub repository with Pages enabled
- Basic understanding of webhooks
- GitHub Personal Access Token (optional, for enhanced security)

## Step 1: Create GitHub Personal Access Token

1. **Go to GitHub Settings**
   - Click your profile picture (top right)
   - Select "Settings"
   - Scroll to "Developer settings"
   - Click "Personal access tokens" → "Tokens (classic)"

2. **Generate New Token**
   - Click "Generate new token (classic)"
   - Give it a descriptive name: `Sanity Webhook Trigger`
   - Select scopes:
     - `repo` (Full control of private repositories)
     - `public_repo` (if repository is public)
   - Click "Generate token"

3. **Save the Token**
   - Copy the generated token immediately
   - Store it securely (you won't see it again)
   - **Important**: Keep this token safe and never commit it to version control

## Step 2: Set Up GitHub Repository Secret

1. **Go to Repository Settings**
   - Navigate to your GitHub repository
   - Click "Settings" tab
   - Click "Secrets and variables" → "Actions"

2. **Add New Secret**
   - Click "New repository secret"
   - Name: `SANITY_WEBHOOK_TOKEN`
   - Value: Paste your personal access token
   - Click "Add secret"

## Step 3: Configure Sanity Webhook

1. **Access Sanity Management Console**
   - Go to [sanity.io/manage](https://sanity.io/manage)
   - Select your project
   - Go to **API** tab
   - Click **Webhooks** in the left sidebar

2. **Create New Webhook**
   - Click "Add webhook"
   - Fill in the details:

     **Webhook Details:**
     - **Name**: `GitHub Pages Rebuild`
     - **URL**: `https://api.github.com/repos/YOUR_USERNAME/YOUR_REPOSITORY/dispatches`
     - **HTTP method**: `POST`
     - **Trigger on**: `Create`, `Update`, `Delete` (for all content types)

     **Headers:**
     - Click "Add header"
     - Name: `Authorization`
     - Value: `token YOUR_PERSONAL_ACCESS_TOKEN`
     - Name: `Accept`
     - Value: `application/vnd.github.v3+json`
     - Name: `Content-Type`
     - Value: `application/json`

     **Body (JSON):**
     ```json
     {
       "event_type": "sanity_webhook",
       "client_payload": {
         "action": "content_updated",
         "timestamp": "{{createdAt}}"
       }
     }
     ```

3. **Test the Webhook**
   - Click "Save webhook"
   - Sanity will test the webhook automatically
   - Check the webhook logs to ensure it works

## Step 4: Update GitHub Actions Workflow

Update your `.github/workflows/sanity-rebuild.yml` file to include the webhook token verification:

```yaml
name: Rebuild on Sanity Changes

on:
  repository_dispatch:
    types: [sanity_webhook]

jobs:
  rebuild:
    runs-on: ubuntu-latest

    steps:
    - name: Checkout repository
      uses: actions/checkout@v4
      with:
        token: ${{ secrets.SANITY_WEBHOOK_TOKEN }}
        fetch-depth: 0

    - name: Verify webhook authenticity (Optional)
      run: |
        # Add webhook signature verification here if needed
        echo "Webhook received from Sanity"

    - name: Trigger rebuild
      run: |
        echo "Content updated in Sanity - triggering rebuild"
        # Add any build steps here if needed
        # npm run build

    - name: Commit any generated changes
      run: |
        git config --global user.name 'Sanity Webhook Bot'
        git config --global user.email 'webhook@sanity.io'

        if [ -n "$(git status --porcelain)" ]; then
          git add .
          git commit -m "chore: auto-rebuild after Sanity content update"
          git push
        fi
```

## Alternative: Using GitHub App (Enhanced Security)

For better security, you can use a GitHub App instead of a personal access token:

### Step 1: Create GitHub App

1. **Go to GitHub Settings**
   - Settings → Developer settings → GitHub Apps
   - Click "New GitHub App"

2. **Configure App**
   - Name: `Sanity Webhook App`
   - Homepage URL: Your website URL
   - Webhook URL: Leave blank
   - Repository permissions:
     - Contents: Read & write
     - Metadata: Read
     - Pages: Read & write
   - Subscribe to events:
     - Repository content

3. **Generate Private Key**
   - Download the private key file
   - Store it securely

### Step 2: Install App on Repository

1. **Install App**
   - In your GitHub App settings
   - Go to "Install App" tab
   - Install on your repository

2. **Generate Installation Token**
   - Use the installation token instead of personal access token
   - Update webhook headers with installation token

## Testing the Integration

### Manual Testing

1. **Make a Content Change**
   - Open Sanity Studio
   - Edit any piece of content
   - Publish the changes

2. **Monitor GitHub Actions**
   - Go to your repository
   - Click "Actions" tab
   - Watch for new workflow runs

3. **Check Site Updates**
   - Wait for the workflow to complete
   - Verify your site reflects the changes
   - Check the commit history for auto-generated commits

### Webhook Testing

1. **Use Sanity's Test Feature**
   - In Sanity Management Console
   - Go to your webhook
   - Click "Test webhook"
   - Verify it triggers the GitHub Actions workflow

2. **Monitor Logs**
   - Check webhook delivery logs in Sanity
   - Review GitHub Actions run logs
   - Verify successful rebuilds

## Troubleshooting

### Webhook Not Triggering

**Check:**
- Webhook URL is correct
- Authorization headers are properly formatted
- GitHub repository permissions are correct
- Personal access token has necessary scopes

### Workflow Not Running

**Check:**
- Repository secrets are configured
- Workflow file syntax is correct
- GitHub Actions is enabled on repository
- Branch protection rules aren't blocking

### Permission Errors

**Solutions:**
- Regenerate personal access token
- Check repository permissions
- Verify webhook has correct authorization
- Ensure token has `repo` or `public_repo` scope

### Build Failures

**Check:**
- Workflow syntax errors
- Missing dependencies
- File permission issues
- Branch protection settings

## Security Best Practices

1. **Token Management**
   - Use GitHub App instead of personal access token when possible
   - Rotate tokens regularly
   - Use minimal required permissions

2. **Webhook Security**
   - Verify webhook signatures
   - Use HTTPS for all endpoints
   - Implement rate limiting if needed

3. **Repository Security**
   - Enable branch protection rules
   - Require status checks before merging
   - Limit write access to necessary users

## Monitoring & Maintenance

### Regular Checks

- [ ] **Webhook Status**: Verify webhook is active and delivering
- [ ] **Token Validity**: Check personal access token hasn't expired
- [ ] **Build Success**: Monitor GitHub Actions for failures
- [ ] **Content Sync**: Ensure Sanity changes appear on site

### Log Monitoring

- **Sanity Webhook Logs**: Check delivery success/failure
- **GitHub Actions Logs**: Monitor workflow execution
- **Site Performance**: Verify rebuilds don't break functionality

### Backup Procedures

- **Content Export**: Regular Sanity content exports
- **Repository Backup**: GitHub repository backups
- **Token Backup**: Secure backup of access tokens

## Support Resources

- [Sanity Webhooks Documentation](https://www.sanity.io/docs/webhooks)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [GitHub Apps Documentation](https://docs.github.com/en/developers/apps)
- [Sanity Community](https://sanity-io-land.slack.com/)

---

**Note**: This webhook setup ensures your GitHub Pages site stays synchronized with your Sanity content. Test thoroughly before deploying to production.

*Last updated: $(date)*