# Environment Setup for Pencil AI

To fix the signup internal server error and enable AI functionality, you need to set up the following environment variables:

## Required Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```bash
# Database Configuration
DATABASE_URL=your_neon_database_url_here

# JWT Secret for authentication
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# Node Environment
NODE_ENV=development
```

## AI Functionality

**No API Keys Required!** 🎉

Pencil AI uses [Pollinations](https://pollinations.ai/) which provides access to multiple AI models including:
- **OpenAI Models:** GPT-4, GPT-3.5-turbo
- **Anthropic Models:** Claude-3-Opus, Claude-3-Sonnet, Claude-3-Haiku
- **Google Models:** Gemini-Pro
- **Open Source Models:** Llama-2-70b, Mixtral-8x7b
- **Image Generation:** FLUX

The application intelligently selects the best model for each task:
- **Code Generation:** Claude-3-Sonnet (with GPT-4 fallback)
- **General Chat:** GPT-4
- **Image Creation:** FLUX
- **Super Mode:** Multi-model approach for enhanced responses

## Database Setup

1. **Set up a Neon Database:**
   - Go to [Neon Console](https://console.neon.tech/)
   - Create a new project
   - Copy the connection string and use it as your `DATABASE_URL`

2. **Run the database schema:**
   ```bash
   # Connect to your Neon database and run the SQL from scripts/01-setup-pencil-schema.sql
   ```

3. **Install dependencies:**
   ```bash
   npm install
   ```

4. **Start the development server:**
   ```bash
   npm run dev
   ```

## What was fixed:

1. **Database Schema:** Updated the schema to use a standard `users` table instead of the non-existent `neon_auth.users_sync` table
2. **Authentication Routes:** Updated signup, login, and me routes to work with the new users table structure
3. **Environment Variables:** Added proper environment variable handling

The signup should now work properly once you have the database set up and environment variables configured.
