# 8alls - Central Infrastructure for Personal Productivity Suite

A central connector monorepo providing shared infrastructure (design system, API client, MCP servers) that external application repositories consume.

> **📘 Building a new app?** See [EXTERNAL_APP_SETUP.md](EXTERNAL_APP_SETUP.md) for the complete setup guide.

## 🎱 Philosophy

8alls is built around the concept of precision and interconnectedness - like the perfect 8-ball break. This repository provides the **central connector** that all apps use:
- A centralized design system for consistent UX across all platforms
- A unified API client for data synchronization
- MCP servers for AI-powered automation via Claude Code
- A central API backend (coming soon) as single source of truth

## 📁 Architecture

### This Repository (8alls)

Provides shared infrastructure consumed by external app repos:

```
8alls/
├── packages/
│   ├── design-tokens/     # Central design system (colors, typography, spacing)
│   └── api-client/        # Shared API client for all apps
├── mcp-servers/
│   ├── mcp-tasks/         # MCP server for task management
│   └── mcp-calendar/      # MCP server for calendar (coming soon)
└── api/                   # Central API backend (coming soon)
```

### External Application Repositories

Individual apps live in separate repos for better separation of concerns:

```
8alls-task-web/          → Next.js task management app
8alls-calendar-web/      → Web calendar app
8alls-calendar-desktop/  → Electron/Tauri desktop calendar
8alls-health-mobile/     → React Native iOS/Android health app
8alls-budget-web/        → Budget tracking web app
8alls-music-web/         → Music player web app
```

**Benefits of separate repos:**
- Independent deployment pipelines
- Different tech stacks per platform (web/mobile/desktop)
- Cleaner CI/CD per app
- Better permission management
- Easier team collaboration

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or pnpm

### Installation

```bash
# Clone the repository
git clone https://github.com/eddiemachado/8alls.git
cd 8alls

# Install all dependencies
npm install

# Build all packages
npm run build
```

### Running MCP Servers

```bash
# Build and run the tasks MCP server
cd mcp-servers/mcp-tasks
npm run build
npm start
```

## 📦 Packages

### @8alls/design-tokens

The central design system providing consistent styling across all applications.

**Features:**
- Pure CSS variables (NO Tailwind or frameworks)
- Color palettes (primary, secondary, semantic colors)
- Typography system (Inter, Fira Code, Cal Sans)
- Spacing scale (4px base unit, 0-96 range)
- Animations and transitions
- Light and dark mode support
- Framework-agnostic (React, Vue, vanilla JS)

**Installation in External Apps:**

```bash
# Install via git dependency
npm install github:eddiemachado/8alls#main
```

**Usage in External Apps:**

```typescript
// In your app's layout.tsx or _app.tsx
import '@8alls/design-tokens/styles/global.css';

// Use CSS variables
// styles.css
.my-component {
  background-color: var(--color-primary-500);
  padding: var(--spacing-4);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-md);
}

// Or import tokens in TypeScript
import { colors, spacing, typography } from '@8alls/design-tokens';

const buttonStyle = {
  backgroundColor: colors.primary[500],
  padding: spacing[4],
  fontFamily: typography.fonts.sans,
};
```

### @8alls/api-client

Shared API client for communicating with the central 8alls API.

**Features:**
- Type-safe API methods
- Automatic error handling
- Support for tasks, calendar, health, and finance APIs
- Universal search

**Installation in External Apps:**

```bash
# Install via git dependency
npm install github:eddiemachado/8alls#main
```

**Usage in External Apps:**

```typescript
import { createApiClient } from '@8alls/api-client';

const api = createApiClient({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL, // https://8alls-api.fly.dev/api
});

// Fetch tasks
const tasks = await api.getTasks();

// Create a task
const newTask = await api.createTask({
  title: 'Build amazing app',
  priority: 'high',
  completed: false,
});
```

## 🔌 MCP Servers

MCP (Model Context Protocol) servers allow AI assistants like Claude to interact with your 8alls data.

### Available Servers

#### @8alls/mcp-tasks

Task management server with the following tools:
- `list_tasks` - Get all tasks
- `get_task` - Get a specific task
- `create_task` - Create a new task
- `update_task` - Update existing task
- `delete_task` - Remove a task
- `search_tasks` - Search through tasks

**Configuration for Claude Desktop:**

```json
{
  "mcpServers": {
    "8alls-tasks": {
      "command": "node",
      "args": ["/path/to/8alls/mcp-servers/mcp-tasks/dist/index.js"],
      "env": {
        "API_BASE_URL": "https://8alls-api.fly.dev/api"
      }
    }
  }
}
```

Note: Update the MCP server code to use the production URL before configuring Claude Desktop.

## 🎨 Design System

The 8alls design system is built on these principles:

### No CSS Frameworks

**Important:** This design system uses **pure CSS variables** - NO Tailwind, Bootstrap, or other frameworks.

**Why?**
- Full control over styling
- Smaller bundle sizes
- Framework-agnostic
- Better for learning CSS fundamentals

### Color Palette

**Primary (Indigo/Blue)**
- Professional and trustworthy
- Used for primary actions and focus states

**Secondary (Purple/Magenta)**
- Vibrant and modern
- Used for accents and highlights

**Semantic Colors**
- Success (Green)
- Error (Red)
- Warning (Orange)
- Info (Blue)

### Typography

**Fonts:**
- Sans: Inter (primary UI font)
- Mono: Fira Code (code and data)
- Display: Cal Sans (headings and hero text)

**Scale:**
- Based on modular scale
- Ranges from xs (12px) to 7xl (72px)

### Spacing

**Base Unit:** 4px
- Creates harmonious layouts
- Ensures consistent spacing

**Scale:** 0-96 (0px to 384px)

## 🏗️ Architecture

### Data Flow

```
┌─────────────────────────────────────────────────┐
│    Central API Server ✅ DEPLOYED                │
│    FastAPI (Python)                              │
│    https://8alls-api.fly.dev                     │
│    Database: Supabase PostgreSQL                 │
└──────────────────┬──────────────────────────────┘
                   │
      ┌────────────┼────────────┬─────────────┐
      │            │            │             │
   [MCP]       [REST API]   [WebSockets]     │
      │            │            │             │
  Claude Code  Web Apps    Real-time      Mobile Apps
  Claude AI   (Separate    Updates       (Separate
               repos)      (Future)        repos)

┌─────────────────────────────────────────────────┐
│    Landing Page ✅ DEPLOYED                      │
│    https://8alls.com                             │
│    GitHub Pages                                  │
└─────────────────────────────────────────────────┘
```

### Package Distribution

```
8alls/ (This Repo)
├── @8alls/design-tokens  → Published to npm or git dependency
├── @8alls/api-client     → Published to npm or git dependency
├── mcp-servers/          → Run locally
└── api/                  → Central backend (to build)

External App Repos:
├── 8alls-task-web/
│   └── npm install github:eddiemachado/8alls#main
├── 8alls-calendar-desktop/
│   └── npm install github:eddiemachado/8alls#main
└── 8alls-health-mobile/
    └── npm install github:eddiemachado/8alls#main
```

## 🛠️ Development

### Creating a New External App

**📖 See [EXTERNAL_APP_SETUP.md](EXTERNAL_APP_SETUP.md) for the complete guide.**

**Quick template:**

1. **Create new repo**
   ```bash
   mkdir 8alls-myapp-web
   cd 8alls-myapp-web
   npx create-next-app@latest . --typescript --tailwind=false
   ```

2. **Install 8alls packages**
   ```bash
   npm install github:eddiemachado/8alls#main
   ```

3. **Set environment variables**
   ```bash
   # .env.local
   NEXT_PUBLIC_API_BASE_URL=https://8alls-api.fly.dev/api
   ```

4. **Import design tokens**
   ```typescript
   // In app/layout.tsx
   import '@8alls/design-tokens/styles/global.css';
   ```

5. **Initialize API client**
   ```typescript
   // In lib/api.ts
   import { createApiClient } from '@8alls/api-client';

   export const api = createApiClient({
     baseURL: process.env.NEXT_PUBLIC_API_BASE_URL!,
   });
   ```

6. **Start building!**

For detailed instructions, troubleshooting, and examples, see [EXTERNAL_APP_SETUP.md](EXTERNAL_APP_SETUP.md).

### Local Development with Linked Packages

During development, you can link packages locally:

```bash
# In this repo (8alls)
cd packages/design-tokens
npm link

cd ../api-client
npm link

# In your external app repo
cd /path/to/8alls-task-web
npm link @8alls/design-tokens
npm link @8alls/api-client
```

When you make changes to design tokens or API client, rebuild them and your external app will pick up the changes.

### Adding a New MCP Server

1. Create MCP server directory:
```bash
mkdir -p mcp-servers/mcp-my-feature
```

2. Follow the pattern from `mcp-tasks`

3. Register tools and implement handlers

### Modifying the Design System

1. Edit tokens in `packages/design-tokens/src/tokens/`
2. Rebuild: `npm run build`
3. Push to GitHub
4. In external apps: `npm update @8alls/design-tokens`

## 📝 Scripts

From the root directory:

```bash
# Install all dependencies
npm install

# Build all packages
npm run build

# Clean all build artifacts
npm run clean
```

From specific package:

```bash
cd packages/design-tokens
npm run build      # Build package
npm run dev        # Watch mode
```

MCP Server:

```bash
cd mcp-servers/mcp-tasks
npm run build      # Compile TypeScript
npm start          # Run server
```

## 🚢 Deployment Strategy

**This Repo (8alls):**
- **Landing Page**: ✅ GitHub Pages (https://8alls.com)
- **API**: ✅ Fly.io (https://8alls-api.fly.dev)
- **Database**: ✅ Supabase PostgreSQL (free tier)
- **Packages**: Consumed via git dependencies or published to npm
- **MCP Servers**: Run locally (no deployment needed)

**External App Repos:**
- **Web Apps**: Vercel, Netlify, or Cloudflare Pages
- **Desktop Apps**: GitHub Releases with auto-update
- **Mobile Apps**: App Store, Play Store

## 🌐 Production URLs

- **Landing Page:** https://8alls.com (GitHub Pages)
- **API Backend:** https://8alls-api.fly.dev (Fly.io)
- **API Docs:** https://8alls-api.fly.dev/docs
- **Health Check:** https://8alls-api.fly.dev/health
- **Cost:** $0/month (all free tiers)

## 🎯 Roadmap

### Phase 1: Foundation ✅ COMPLETE
- [x] Design system with tokens
- [x] API client package
- [x] MCP server for tasks
- [x] Documentation
- [x] Restructured for connector approach
- [x] Landing page deployed to GitHub Pages

### Phase 2: Central API ✅ COMPLETE
- [x] Build central API (FastAPI)
- [x] Set up PostgreSQL database (Supabase)
- [x] Implement task endpoints
- [x] Implement search endpoint
- [x] Deploy to production (Fly.io)
- [x] API documentation (Swagger UI)
- [ ] Implement calendar endpoints
- [ ] Implement health endpoints
- [ ] Implement budget endpoints

### Phase 3: External Apps (CURRENT)
- [ ] 8alls-task-web (Next.js)
- [ ] 8alls-calendar-web (Next.js)
- [ ] 8alls-calendar-desktop (Electron/Tauri)
- [ ] 8alls-health-mobile (React Native)
- [ ] 8alls-budget-web (Next.js)
- [ ] 8alls-music-web (Next.js)

### Phase 4: Integrations
- [ ] Obsidian integration
- [ ] Telegram bot
- [ ] GitHub integration
- [ ] Slack integration

### Phase 5: Advanced Features
- [ ] Real-time synchronization (WebSockets)
- [ ] Offline support
- [ ] Data export/import
- [ ] Analytics dashboard

## 📚 Documentation

- [QUICKSTART.md](QUICKSTART.md) - Quick setup guide for this repo
- [EXTERNAL_APP_SETUP.md](EXTERNAL_APP_SETUP.md) - **Guide for building external apps** (START HERE for new apps)
- [GITHUB_SETUP.md](GITHUB_SETUP.md) - GitHub deployment
- [PROJECT_CONTEXT.md](PROJECT_CONTEXT.md) - Full project context and planning
- [api/README.md](api/README.md) - API documentation
- [api/DEPLOYMENT.md](api/DEPLOYMENT.md) - API deployment guide

## 🤝 Contributing

This is a personal project, but feel free to fork and adapt for your own use!

## 📄 License

MIT

---

Built with ❤️ using pure CSS (no frameworks!)
