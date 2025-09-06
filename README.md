# 🎨 Pencil AI

**The Ultimate AI Development Platform** - Combining intelligent chat, code generation, image creation, and revolutionary Super Mode with intelligent API rotation for maximum reliability.

![Pencil AI](https://img.shields.io/badge/Pencil%20AI-v1.0.0-blue?style=for-the-badge&logo=react)
![Next.js](https://img.shields.io/badge/Next.js-14.2.16-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0.2-blue?style=for-the-badge&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-4.1.9-38B2AC?style=for-the-badge&logo=tailwind-css)

## ✨ Features

### 🧠 **Smart Chat**
- **Multi-Model Support**: GPT-4, Claude, Gemini, Mistral, and more
- **Intelligent Conversations**: Advanced AI models for natural dialogue
- **Context Awareness**: Maintains conversation history and context
- **Real-time Responses**: Fast, streaming responses

### 💻 **Code Generation**
- **Multi-Language Support**: JavaScript, Python, TypeScript, Go, Rust, and more
- **Framework Integration**: React, Next.js, Vue, Svelte, and others
- **Best Practices**: Follows industry standards and conventions
- **Syntax Highlighting**: Beautiful code display with proper formatting

### 🎨 **Image Generation**
- **Dual-Engine System**: LLM7 RTIST + fal.ai FLUX.1 fallback
- **High-Quality Output**: Professional-grade image generation
- **Multiple Styles**: Realistic, artistic, abstract, and custom styles
- **Smart Fallback**: Automatic failover for maximum reliability

### ⚡ **Instant Mode**
- **Ultra-Fast Responses**: Sub-second AI responses using Gemini Flash
- **Clipboard Monitoring**: Automatic detection of copied content
- **Predictive Typing**: AI-powered text completion
- **Background Processing**: Non-intrusive, always-on AI assistance

### 🚀 **Super Mode**
- **Multi-Model Processing**: Combines multiple AI models for enhanced responses
- **Intelligent Analysis**: Advanced prompt analysis and optimization
- **Confidence Scoring**: Quality assessment of generated content
- **Alternative Perspectives**: Multiple viewpoints and approaches

### 🔄 **API Rotation System**
- **High Availability**: 99.9% uptime with intelligent failover
- **Multiple Providers**: 3+ API keys per service for redundancy
- **Automatic Switching**: Seamless failover on rate limits or errors
- **Performance Monitoring**: Real-time API health and performance tracking

## 🏗️ Architecture

### **Frontend**
- **Next.js 14**: App Router, Server Components, and modern React patterns
- **TypeScript**: Full type safety and enhanced developer experience
- **Tailwind CSS**: Utility-first styling with custom design system
- **Radix UI**: Accessible, unstyled UI components
- **Lucide React**: Beautiful, customizable icons

### **Backend**
- **API Routes**: Next.js API routes for serverless functions
- **Database**: Neon PostgreSQL with serverless connection pooling
- **Authentication**: JWT-based authentication with secure cookies
- **File Storage**: Integrated file handling and storage

### **AI Integration**
- **LLM7 API**: Primary AI service with multiple models
- **Gemini API**: Ultra-fast responses for Instant Mode
- **fal.ai**: Professional image generation with FLUX.1
- **Intelligent Fallback**: Automatic service switching for reliability

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- pnpm (recommended) or npm
- PostgreSQL database (Neon recommended)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/xtoazt/pencil.git
   cd pencil
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Configure the following variables:
   ```env
   # Database
   DATABASE_URL="your-postgresql-connection-string"
   
   # JWT Secret
   JWT_SECRET="your-super-secret-jwt-key"
   
   # Fal.ai API Key (for image generation)
   FAL_KEY="your-fal-ai-api-key"
   
   # Gemini API Keys (for Instant Mode)
   GEMINI_API_KEY_1="your-gemini-api-key-1"
   GEMINI_API_KEY_2="your-gemini-api-key-2"
   # ... add more keys for rotation
   ```

4. **Set up the database**
   ```bash
   # Run database migrations (if available)
   pnpm db:migrate
   ```

5. **Start the development server**
   ```bash
   pnpm dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
pencil/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   │   ├── auth/          # Authentication endpoints
│   │   ├── chat/          # Chat API
│   │   ├── gemini/        # Gemini API integration
│   │   └── ...
│   ├── chat/              # Chat interface
│   ├── code/              # Code generation
│   ├── image/             # Image generation
│   ├── instant/           # Instant Mode
│   ├── super/             # Super Mode
│   └── ...
├── components/            # React components
│   ├── ui/               # Base UI components
│   ├── auth-provider.tsx # Authentication context
│   └── ...
├── hooks/                # Custom React hooks
├── lib/                  # Utility libraries
│   ├── database.ts       # Database connection
│   ├── gemini.ts         # Gemini API service
│   ├── fal-ai.ts         # Fal.ai integration
│   ├── llm7.ts           # LLM7 API service
│   └── ...
├── public/               # Static assets
└── ...
```

## 🔧 Configuration

### **API Keys Setup**

#### LLM7 API
Configure your LLM7 API keys in `lib/llm7.ts`:
```typescript
const LLM7_API_KEYS = [
  "your-llm7-api-key-1",
  "your-llm7-api-key-2",
  // Add more keys for rotation
]
```

#### Gemini API
Configure your Gemini API keys in `lib/gemini.ts`:
```typescript
const GEMINI_API_KEYS = [
  "your-gemini-api-key-1",
  "your-gemini-api-key-2",
  // Add more keys for rotation
]
```

#### Fal.ai API
Set your Fal.ai API key in environment variables:
```env
FAL_KEY="your-fal-ai-api-key"
```

### **Database Schema**

The application uses the following main tables:
- `users` - User accounts and profiles
- `conversations` - Chat conversations
- `messages` - Individual messages
- `projects` - Code projects
- `user_preferences` - User settings

## 🎯 Usage

### **Chat Mode**
- Start conversations with AI models
- Switch between different models
- Maintain conversation history
- Export conversations

### **Code Generation**
- Specify programming language
- Choose framework or library
- Generate complete applications
- Get best practices and documentation

### **Image Generation**
- Describe your desired image
- Choose style and dimensions
- Generate with LLM7 or fal.ai
- Download and share images

### **Instant Mode**
- Enable clipboard monitoring
- Get instant AI responses
- Predictive text completion
- Background AI assistance

### **Super Mode**
- Advanced multi-model processing
- Enhanced response quality
- Confidence scoring
- Alternative perspectives

## 🔒 Security

- **JWT Authentication**: Secure token-based authentication
- **API Key Rotation**: Automatic key rotation for security
- **Rate Limiting**: Built-in rate limiting and abuse prevention
- **Input Validation**: Comprehensive input sanitization
- **HTTPS Only**: Secure communication in production

## 🚀 Deployment

### **Vercel (Recommended)**

1. **Connect your repository** to Vercel
2. **Set environment variables** in Vercel dashboard
3. **Deploy automatically** on every push to main

### **Docker**

```bash
# Build the Docker image
docker build -t pencil-ai .

# Run the container
docker run -p 3000:3000 pencil-ai
```

### **Manual Deployment**

```bash
# Build the application
pnpm build

# Start the production server
pnpm start
```

## 📊 Monitoring

### **API Health**
- Real-time API status monitoring
- Performance metrics and response times
- Error tracking and alerting
- Usage analytics

### **User Analytics**
- Conversation statistics
- Feature usage tracking
- Performance monitoring
- Error reporting

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### **Development Setup**

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

### **Code Style**

- Use TypeScript for all new code
- Follow the existing code style
- Add proper type annotations
- Include JSDoc comments for complex functions

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Next.js Team** for the amazing framework
- **Vercel** for hosting and deployment
- **OpenAI, Anthropic, Google** for AI models
- **fal.ai** for image generation
- **LLM7** for AI services
- **All Contributors** who help improve this project

## 📞 Support

- **Documentation**: [docs.pencil-ai.com](https://docs.pencil-ai.com)
- **Issues**: [GitHub Issues](https://github.com/xtoazt/pencil/issues)
- **Discussions**: [GitHub Discussions](https://github.com/xtoazt/pencil/discussions)
- **Email**: support@pencil-ai.com

## 🔮 Roadmap

### **Upcoming Features**
- [ ] **Voice Interface**: Speech-to-text and text-to-speech
- [ ] **Video Generation**: AI-powered video creation
- [ ] **3D Model Generation**: 3D asset creation
- [ ] **Collaborative Editing**: Real-time collaboration
- [ ] **Plugin System**: Extensible architecture
- [ ] **Mobile App**: Native iOS and Android apps
- [ ] **Enterprise Features**: Advanced admin controls
- [ ] **API Marketplace**: Third-party integrations

### **Performance Improvements**
- [ ] **Edge Computing**: Global edge deployment
- [ ] **Caching Layer**: Advanced caching strategies
- [ ] **CDN Integration**: Global content delivery
- [ ] **Database Optimization**: Query optimization
- [ ] **Real-time Updates**: WebSocket integration

---

**Built with ❤️ by the Pencil AI Team**

*Empowering developers with the future of AI-assisted development.*