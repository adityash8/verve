# Verve - AI-Powered Marketing IDE

Verve is an integrated development environment (IDE) tailored for digital marketers, transforming scattered marketing workflows into a unified, code-like workspace.

## 🚀 Features

- **Campaign Repository Management**: Store ads, SEO hubs, and content specs as version-controlled files
- **AI Copilot**: Get intelligent suggestions for campaign optimization and debugging
- **Platform Connectors**: Integrate with Google Ads, Analytics, Facebook Ads, and Webflow
- **Code-like Editor**: Edit marketing assets with syntax highlighting and validation
- **Real-time Deployment**: Push campaigns directly to advertising platforms

## 🛠️ Tech Stack

- **Frontend**: React + TypeScript + Vite
- **Styling**: Tailwind CSS with glassmorphism design
- **Authentication**: Supabase Auth
- **Database**: Supabase PostgreSQL
- **AI**: Anthropic Claude API
- **Editor**: Monaco Editor
- **State Management**: Zustand

## 📋 Prerequisites

- Node.js 18+
- Supabase account
- Anthropic API key

## 🚀 Getting Started

1. **Clone and install dependencies**
   \`\`\`bash
   git clone <repository-url>
   cd verve
   npm install
   \`\`\`

2. **Set up environment variables**
   \`\`\`bash
   cp .env.example .env
   \`\`\`

   Fill in your Supabase and Anthropic API credentials in `.env`

3. **Set up Supabase database**

   Run these SQL commands in your Supabase SQL editor:

   \`\`\`sql
   -- Create campaign_repos table
   CREATE TABLE campaign_repos (
     id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
     name TEXT NOT NULL,
     description TEXT,
     user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
     created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
     updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
   );

   -- Create campaign_files table
   CREATE TABLE campaign_files (
     id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
     repo_id UUID REFERENCES campaign_repos(id) ON DELETE CASCADE,
     name TEXT NOT NULL,
     path TEXT NOT NULL,
     content TEXT NOT NULL DEFAULT '',
     type TEXT NOT NULL CHECK (type IN ('ad-campaign', 'seo-hub', 'content-spec', 'automation', 'config')),
     created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
     updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
   );

   -- Enable RLS
   ALTER TABLE campaign_repos ENABLE ROW LEVEL SECURITY;
   ALTER TABLE campaign_files ENABLE ROW LEVEL SECURITY;

   -- Create policies
   CREATE POLICY "Users can view their own repos" ON campaign_repos FOR SELECT USING (auth.uid() = user_id);
   CREATE POLICY "Users can create their own repos" ON campaign_repos FOR INSERT WITH CHECK (auth.uid() = user_id);
   CREATE POLICY "Users can update their own repos" ON campaign_repos FOR UPDATE USING (auth.uid() = user_id);
   CREATE POLICY "Users can delete their own repos" ON campaign_repos FOR DELETE USING (auth.uid() = user_id);

   CREATE POLICY "Users can view files in their repos" ON campaign_files FOR SELECT USING (
     EXISTS (SELECT 1 FROM campaign_repos WHERE campaign_repos.id = campaign_files.repo_id AND campaign_repos.user_id = auth.uid())
   );
   CREATE POLICY "Users can create files in their repos" ON campaign_files FOR INSERT WITH CHECK (
     EXISTS (SELECT 1 FROM campaign_repos WHERE campaign_repos.id = campaign_files.repo_id AND campaign_repos.user_id = auth.uid())
   );
   CREATE POLICY "Users can update files in their repos" ON campaign_files FOR UPDATE USING (
     EXISTS (SELECT 1 FROM campaign_repos WHERE campaign_repos.id = campaign_files.repo_id AND campaign_repos.user_id = auth.uid())
   );
   CREATE POLICY "Users can delete files in their repos" ON campaign_files FOR DELETE USING (
     EXISTS (SELECT 1 FROM campaign_repos WHERE campaign_repos.id = campaign_files.repo_id AND campaign_repos.user_id = auth.uid())
   );
   \`\`\`

4. **Start the development server**
   \`\`\`bash
   npm run dev
   \`\`\`

5. **Open your browser**

   Navigate to \`http://localhost:3000\`

## 🎯 Usage

1. **Sign up/Login** with email or Google OAuth
2. **Create a repository** for your marketing campaigns
3. **Add campaign files** (YAML/JSON format) for ads, SEO, content
4. **Use AI copilot** to get optimization suggestions
5. **Deploy campaigns** to connected platforms

## 📁 Project Structure

\`\`\`
src/
├── components/          # React components
│   ├── AuthForm.tsx     # Authentication form
│   ├── Layout.tsx       # App layout with sidebar
│   ├── Editor.tsx       # Monaco code editor
│   ├── FileExplorer.tsx # File tree navigation
│   └── AiCopilot.tsx    # AI suggestions panel
├── lib/                 # Core services
│   ├── supabase.ts      # Database client
│   ├── ai.ts           # AI service integration
│   └── connectors.ts    # API connectors
├── store/              # State management
│   ├── auth.ts         # Authentication state
│   └── repo.ts         # Repository state
├── types/              # TypeScript definitions
└── pages/              # Route components
\`\`\`

## 🔧 Available Scripts

- \`npm run dev\` - Start development server
- \`npm run build\` - Build for production
- \`npm run preview\` - Preview production build
- \`npm run lint\` - Run ESLint
- \`npm run typecheck\` - Run TypeScript type checking

## 🎨 Design System

Verve uses a glassmorphism design with:
- **Primary Color**: Blue (#3b82f6)
- **Typography**: Inter + Fira Code
- **Components**: Tailwind CSS utilities
- **Layout**: Sidebar + Main + AI Panel

## 🔌 Connectors

Current connector support:
- ✅ Google Ads (OAuth)
- ✅ Google Analytics (OAuth)
- ✅ Facebook Ads (OAuth)
- ✅ Webflow (API Key)

## 🤖 AI Features

- Campaign optimization suggestions
- Copy variant generation with cognitive biases
- Performance debugging and analysis
- Automated A/B test recommendations

## 📚 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details

## 🆘 Support

For support, email support@verve.dev or create an issue on GitHub.