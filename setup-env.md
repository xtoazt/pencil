# Environment Setup for Pencil AI

To fix the signup internal server error and enable AI functionality, you need to set up the following environment variables:

## Required Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```bash
# Database Configuration
DATABASE_URL=your_neon_database_url_here

# JWT Secret for authentication
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# LLM7 AI API Key
LLM7_API_KEY=ZaJ9R/8kJvNBebSNCBLOuE3Z2PzgFQHtngi+nKTJioErxAJvk7atA677L/7QUb+OZPwRzQkqglBTSYvBXL207hrUum8EEI1XW0BmCzX7IfQ1avVWSFH8xB3bon21XDLyGTLFPu7umEJwVS5lTto=

# Node Environment
NODE_ENV=development
```

## AI Functionality

**Advanced AI Integration!** 🚀

Pencil AI uses [LLM7](https://llm7.io/) with your personal API token to provide access to multiple AI models including:
- **GPT Models:** GPT-4.1-nano, GPT-4o-mini, GPT-o4-mini
- **Mistral Models:** Mistral-Large, Mistral-Medium, Codestral, Ministral
- **Specialized Models:** DeepSeek-R1, Gemini, Qwen2.5-Coder
- **Multimodal Models:** Bidara, Mirexa, RTIST, Pixtral

The application intelligently selects the best model for each task:
- **Code Generation:** Codestral (specialized coding model)
- **General Chat:** GPT-4.1-nano (fast and efficient)
- **Image Creation:** RTIST (multimodal image generation)
- **Super Mode:** Multi-model approach with Mistral-Large for analysis

## API Token Setup

Your LLM7 API token is already configured: `ZaJ9R/8kJvNBebSNCBLOuE3Z2PzgFQHtngi+nKTJioErxAJvk7atA677L/7QUb+OZPwRzQkqglBTSYvBXL207hrUum8EEI1XW0BmCzX7IfQ1avVWSFH8xB3bon21XDLyGTLFPu7umEJwVS5lTto=`

**Security Notes:**
- ✅ Keep your token secure and never share it publicly
- ✅ Don't commit tokens to Git/GitHub repositories
- ✅ Use .env files to store tokens safely
- ✅ The token is already set up in the code as a fallback

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
