# GitHub Integration Setup Guide

## 🎉 Your GitHub App is Ready!

I can see you've already created your GitHub App at: https://github.com/settings/apps/pencil-ai-code-integration

## 📋 Complete Setup Checklist

### 1. Install Required Dependencies

```bash
cd /Users/rohan/pencil/pencil
pnpm add @octokit/rest @octokit/auth-app
```

### 2. Configure Your GitHub App

Go to your GitHub App settings: https://github.com/settings/apps/pencil-ai-code-integration

**Update these URLs with your production domain:**
- **Homepage URL:** `https://your-pencil-domain.com`
- **User authorization callback URL:** `https://your-pencil-domain.com/api/github/callback`
- **Webhook URL:** `https://your-pencil-domain.com/api/github/webhook`

### 3. Get Your GitHub App Credentials

From your GitHub App settings page, copy these values:

1. **App ID** (found in the "About" section)
2. **Client ID** (found in the "About" section)
3. **Client Secret** (click "Generate a new client secret")
4. **Private Key** (click "Generate a private key" and download the .pem file)
5. **Webhook Secret** (click "Generate a new webhook secret")

### 4. Add Environment Variables

Add these to your `.env.local` file:

```bash
# GitHub App Configuration
GITHUB_APP_ID=your_app_id_here
GITHUB_CLIENT_ID=your_client_id_here
GITHUB_CLIENT_SECRET=your_client_secret_here
GITHUB_PRIVATE_KEY="-----BEGIN RSA PRIVATE KEY-----\nYour private key content here\n-----END RSA PRIVATE KEY-----"
GITHUB_WEBHOOK_SECRET=your_webhook_secret_here
GITHUB_REDIRECT_URI=https://your-pencil-domain.com/api/github/callback
```

### 5. Set GitHub App Permissions

In your GitHub App settings, configure these permissions:

**Repository permissions:**
- Contents: `Read & write`
- Metadata: `Read`
- Pull requests: `Read & write`
- Issues: `Read & write`
- Actions: `Read`

**Account permissions:**
- Email addresses: `Read`
- Followers: `Read`
- Following: `Read`

**Subscribe to events:**
- Push
- Pull request
- Issues
- Repository

### 6. Deploy Your App

1. **Commit and push your changes:**
   ```bash
   git add .
   git commit -m "Add GitHub integration to Code Mode"
   git push
   ```

2. **Deploy to Vercel** (or your hosting platform)

3. **Update GitHub App URLs** with your production domain

### 7. Test the Integration

1. Go to your deployed Pencil app
2. Navigate to **Code Mode**
3. Click the **GitHub** tab in the sidebar
4. Connect your GitHub account using either:
   - Personal Access Token (recommended for testing)
   - OAuth flow (for production)

## 🚀 Features Available

### ✅ What's Working Now

- **GitHub Authentication** - Connect with personal access token or OAuth
- **Repository Management** - View and select your repositories
- **Create Repositories** - Create new repos directly from Pencil
- **Code Committing** - Commit your generated code to GitHub
- **Real-time Integration** - See connected repo status in the header

### 🔧 How to Use

1. **Connect to GitHub:**
   - Go to Code Mode → GitHub tab
   - Enter your personal access token or use OAuth
   - Your repositories will load automatically

2. **Create a New Repository:**
   - Click the "+" button next to repository selector
   - Enter repository name and description
   - Choose public or private
   - Repository will be created and selected automatically

3. **Commit Code:**
   - Generate code in Code Mode
   - Select a repository
   - Enter a commit message
   - Click "Commit to GitHub"
   - Your code will be pushed to the selected repository

## 🔐 Security Notes

- **Personal Access Tokens:** Store securely, never commit to code
- **Webhook Secrets:** Keep confidential, used to verify webhook authenticity
- **Private Keys:** Store securely, used for GitHub App authentication
- **HTTPS Required:** All GitHub communications must use HTTPS

## 🐛 Troubleshooting

### Common Issues

1. **"Access token required" error:**
   - Make sure you've entered a valid GitHub personal access token
   - Token must have `repo` scope for private repositories

2. **"Failed to create repository" error:**
   - Check your token has repository creation permissions
   - Ensure repository name is unique

3. **"Failed to commit" error:**
   - Verify repository exists and you have write access
   - Check that files array is not empty

4. **OAuth not working:**
   - Ensure callback URL matches exactly in GitHub App settings
   - Check that GITHUB_REDIRECT_URI environment variable is set correctly

### Getting Help

- Check the browser console for detailed error messages
- Verify all environment variables are set correctly
- Ensure your GitHub App permissions are configured properly

## 🎯 Next Steps

Once everything is working, you can:

1. **Customize the integration** - Modify the GitHub component to fit your needs
2. **Add more features** - Pull requests, issues, branch management
3. **Enhance security** - Add user session management, token refresh
4. **Add notifications** - Webhook handling for repository events

## 📚 API Endpoints Created

- `GET /api/github/auth` - Get GitHub OAuth URL
- `GET /api/github/callback` - Handle OAuth callback
- `GET /api/github/repos` - List user repositories
- `POST /api/github/repos` - Create new repository
- `POST /api/github/commit` - Commit files to repository
- `POST /api/github/webhook` - Handle GitHub webhooks

Your GitHub integration is now fully functional! 🎉
