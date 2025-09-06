# 🚀 Complete Setup Instructions for Pencil AI

## 📋 GitHub App Configuration

### Your GitHub App Details:
- **App ID:** 1909450
- **Client ID:** Iv23liXMEm06Gc4ndGdU
- **Domain:** https://pencilx.vercel.app
- **Public Link:** https://github.com/apps/pencil-ai-code-integration

### Step 1: Add Environment Variables

Add these to your `.env.local` file:

```bash
# GitHub App Configuration
GITHUB_APP_ID=1909450
GITHUB_CLIENT_ID=Iv23liXMEm06Gc4ndGdU
GITHUB_CLIENT_SECRET=your_client_secret_from_github_app_settings
GITHUB_PRIVATE_KEY="-----BEGIN RSA PRIVATE KEY-----\nYOUR_PRIVATE_KEY_CONTENT_HERE\n-----END RSA PRIVATE KEY-----"
GITHUB_WEBHOOK_SECRET=your_webhook_secret_from_github_app_settings
GITHUB_REDIRECT_URI=https://pencilx.vercel.app/api/github/callback
```

### Step 2: Get Missing Credentials

Go to: https://github.com/settings/apps/pencil-ai-code-integration

1. **Client Secret:** Click "Generate a new client secret"
2. **Webhook Secret:** Click "Generate a new webhook secret"
3. **Private Key:** Copy the content of your .pem file

### Step 3: Update GitHub App URLs

In your GitHub App settings, set these URLs:
- **Homepage URL:** https://pencilx.vercel.app
- **User authorization callback URL:** https://pencilx.vercel.app/api/github/callback
- **Webhook URL:** https://pencilx.vercel.app/api/github/webhook

### Step 4: Set Permissions

Configure these permissions:
- **Contents:** Read & write
- **Metadata:** Read
- **Pull requests:** Read & write
- **Issues:** Read & write
- **Actions:** Read

## 🎯 Next Steps

Once the GitHub integration is configured, I'll enhance each mode to be professional-grade:

1. **Instant Mode** → Professional AI Assistant Platform
2. **Code Mode** → Full-Featured IDE with GitHub Integration
3. **Image Mode** → Professional Image Generation Studio
4. **Super Mode** → AI Model Training & Management Platform
5. **OSS Mode** → Deployment & Hosting Platform
6. **Chat Mode** → Advanced Conversational AI Interface

Each mode will be feature-dense and could stand as its own professional website!
