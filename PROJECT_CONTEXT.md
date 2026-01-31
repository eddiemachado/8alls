# 8alls Project Context & Game Plan

## Project Overview

**Project Name:** 8alls
**Type:** Central connector monorepo for productivity suite
**Goal:** Provide shared infrastructure (design system, API client, MCP servers) that external app repos consume

## What We've Built So Far

### ✅ Completed (Session 1-3)

1. **Monorepo Structure**
   - Set up with npm workspaces
   - Turborepo for build orchestration
   - Organized into packages/, mcp-servers/, and api/
   - Apps live in separate repos (external)
   - Restructured as central connector

2. **@8alls/design-tokens Package**
   - Complete design system WITHOUT Tailwind (user requirement)
   - Pure CSS variables + TypeScript tokens
   - Includes:
     - Color palette (primary indigo, secondary purple, semantic colors)
     - Typography system (Inter, Fira Code, Cal Sans fonts)
     - Spacing scale (4px base unit, 0-96 range)
     - Animation/transition tokens
     - Pre-built `global.css` for easy importing
     - Full light/dark mode support
   - Location: `/packages/design-tokens/`
   - **To use:** External apps install via npm or git dependency

3. **@8alls/api-client Package**
   - TypeScript API client for central API
   - Type-safe methods for:
     - Tasks (list, get, create, update, delete)
     - Calendar events
     - Health logs
     - Transactions (budget)
     - Universal search
   - Location: `/packages/api-client/`
   - **To use:** External apps install via npm or git dependency

4. **MCP Server for Tasks**
   - Model Context Protocol server for Claude integration
   - 6 tools: list_tasks, get_task, create_task, update_task, delete_task, search_tasks
   - Ready for Claude Code/Desktop
   - Location: `/mcp-servers/mcp-tasks/`

5. **FastAPI Backend** ✅ DEPLOYED
   - Complete REST API with task endpoints
   - SQLAlchemy ORM with Pydantic schemas
   - CORS middleware for external apps
   - Auto-generated API docs (Swagger UI)
   - Health check endpoint
   - Universal search endpoint
   - Location: `/api/`
   - **Live at:** https://8alls-api.fly.dev
   - **Docs:** https://8alls-api.fly.dev/docs

6. **Production Infrastructure** ✅ DEPLOYED
   - **Fly.io:** Hosting FastAPI backend (free tier, 256MB VM)
   - **Supabase:** PostgreSQL database (free tier, 500MB)
   - Auto-scaling and health checks configured
   - HTTPS enabled automatically
   - **Total cost:** $0/month

7. **Landing Page** ✅ LIVE
   - Simple index.html with 8-ball emoji (🎱)
   - Prevents code exposure on GitHub Pages
   - Deployed via GitHub Pages
   - **Live at:** https://8alls.com
   - Location: `/index.html`

8. **Documentation**
   - README.md - Full project documentation
   - QUICKSTART.md - Step-by-step getting started (this repo)
   - EXTERNAL_APP_SETUP.md - Complete guide for building external apps
   - GITHUB_SETUP.md - GitHub deployment guide
   - api/README.md - API documentation
   - api/DEPLOYMENT.md - Fly.io + Supabase deployment guide

9. **GitHub Pages** ✅ DEPLOYED
   - .gitignore configured (root + api/)
   - All code committed and pushed
   - GitHub Pages enabled on main branch
   - **Live at:** https://8alls.com

## Architecture Philosophy

### Central Connector Approach

**This repo (8alls) provides:**
- ✅ Shared design tokens (can be consumed by any app)
- ✅ Shared API client (connects apps to central backend)
- ✅ MCP servers (Claude Code integration)
- ✅ Central API backend (deployed to production!)
- 🔜 Shared utilities and helpers

**Individual apps live in separate repos:**
- ✅ Better separation of concerns
- ✅ Independent deployment pipelines
- ✅ Different tech stacks per app (web/mobile/desktop)
- ✅ Cleaner CI/CD per app
- ✅ Easier to manage permissions/teams

### Example App Repos

```
8alls-task-web/          → Next.js task management app
8alls-calendar-web/      → Web calendar app
8alls-calendar-desktop/  → Electron/Tauri desktop calendar
8alls-health-mobile/     → React Native iOS/Android app
8alls-budget-web/        → Budget tracking web app
8alls-music-web/         → Music player web app
```

Each app repo:
- Installs `@8alls/design-tokens` for consistent styling
- Installs `@8alls/api-client` to connect to central API
- Has its own deployment pipeline
- Can be in different tech stacks

## Design Philosophy

**Core Principles:**
- **No CSS frameworks** - Pure CSS variables and vanilla styling
- **Centralized design system** - All apps share same tokens
- **Type safety** - TypeScript throughout
- **Single source of truth** - Central API for all data
- **MCP integration** - AI-powered automation via Claude
- **Repo separation** - Shared infrastructure vs individual apps

**Design System Approach:**
- CSS custom properties (--color-primary-500, --spacing-4, etc.)
- TypeScript tokens for programmatic access
- Pre-built global.css that apps import
- Framework-agnostic (works with React, Vue, vanilla JS)

## Architecture Overview

```
Production Infrastructure:

┌─────────────────────────────┐     ┌─────────────────────────────┐
│   Supabase (FREE)           │     │   Fly.io (FREE)             │
│   PostgreSQL Database       │────▶│   FastAPI Backend           │
│   500MB storage             │     │   https://8alls-api.fly.dev │
│   Table Editor UI           │     │   256MB VM                  │
└─────────────────────────────┘     └──────────────┬──────────────┘
                                                   │
                      ┌────────────────────────────┼────────────┐
                      │                            │            │
                   [MCP]                      [REST API]    [Future: WebSockets]
                      │                            │            │
               Claude Code/AI              External Apps    Real-time
                (Local/Cloud)              (Separate repos)   Updates

┌─────────────────────────────────────────────────────────────────┐
│   GitHub Pages (FREE)                                           │
│   Landing Page: https://8alls.com                               │
│   Serves: index.html (8-ball emoji)                             │
└─────────────────────────────────────────────────────────────────┘
```

```
8alls/ (This Repo) - Central Connector
├── packages/
│   ├── design-tokens/    → Shared styling (pure CSS)
│   └── api-client/       → Shared API client (TypeScript)
├── mcp-servers/
│   └── mcp-tasks/        → Claude integration
├── api/                  → FastAPI backend ✅ DEPLOYED
│   ├── app/
│   │   ├── models/       → SQLAlchemy models
│   │   ├── routes/       → API endpoints
│   │   ├── schemas/      → Pydantic validation
│   │   └── core/         → Config & database
│   ├── Dockerfile        → Container config
│   ├── fly.toml          → Fly.io config
│   └── DEPLOYMENT.md     → Deployment guide
└── index.html            → Landing page (GitHub Pages)

External App Repos (TO BUILD):
├── 8alls-task-web/          → Next.js task app (Vercel)
├── 8alls-calendar-web/      → Next.js calendar (Vercel)
├── 8alls-calendar-desktop/  → Electron/Tauri (GitHub Releases)
└── 8alls-health-mobile/     → React Native (App stores)
    └── Each installs: @8alls/design-tokens + @8alls/api-client
```

## Current File Structure

```
8alls/
├── packages/
│   ├── design-tokens/
│   │   ├── src/
│   │   │   ├── tokens/
│   │   │   │   ├── colors.ts        # Color palette
│   │   │   │   ├── typography.ts    # Fonts, sizes, weights
│   │   │   │   ├── spacing.ts       # Spacing, radius, shadows
│   │   │   │   └── animation.ts     # Transitions, keyframes
│   │   │   ├── css-variables.ts     # CSS var generator
│   │   │   ├── global-styles.ts     # Global CSS generator
│   │   │   └── index.ts             # Main export
│   │   ├── styles/
│   │   │   └── global.css           # Pre-built CSS file
│   │   ├── package.json
│   │   └── tsconfig.json
│   └── api-client/
│       ├── src/
│       │   └── index.ts             # API client implementation
│       ├── package.json
│       └── tsconfig.json
├── mcp-servers/
│   └── mcp-tasks/
│       ├── src/
│       │   └── index.ts             # MCP server implementation
│       ├── package.json
│       └── tsconfig.json
├── api/                             # ✅ DEPLOYED
│   ├── app/
│   │   ├── core/
│   │   │   ├── config.py            # App configuration
│   │   │   └── database.py          # Database connection
│   │   ├── models/
│   │   │   └── task.py              # SQLAlchemy task model
│   │   ├── routes/
│   │   │   ├── tasks.py             # Task CRUD endpoints
│   │   │   └── search.py            # Search endpoint
│   │   ├── schemas/
│   │   │   └── task.py              # Pydantic schemas
│   │   └── main.py                  # FastAPI application
│   ├── venv/                        # Python virtual environment
│   ├── requirements.txt             # Python dependencies
│   ├── Dockerfile                   # Docker configuration
│   ├── fly.toml                     # Fly.io configuration
│   ├── .env.example                 # Environment template
│   ├── .dockerignore
│   ├── .gitignore
│   ├── run.sh                       # Local dev script
│   ├── README.md                    # API documentation
│   └── DEPLOYMENT.md                # Deployment guide
├── .github/
│   └── workflows/
│       └── ci.yml                   # GitHub Actions CI
├── index.html                       # Landing page
├── package.json                     # Root workspace config
├── turbo.json                       # Turborepo config
├── .gitignore
├── README.md                        # Main documentation
├── QUICKSTART.md                    # Getting started guide
├── GITHUB_SETUP.md                  # GitHub guide
└── PROJECT_CONTEXT.md               # This file
```

## Tools Planned (User's Original Request)

### Existing Tools to Integrate:
- Obsidian
- Telegram
- GitHub
- Slack
- Moltbot
- Claude Code

### Applications to Build (Each in Separate Repo):
- ⏳ Task management web app (8alls-task-web)
- ⏳ Calendar web app (8alls-calendar-web)
- ⏳ Calendar desktop app (8alls-calendar-desktop) - Electron/Tauri
- ⏳ Health mobile app (8alls-health-mobile) - iOS/Android
- ⏳ To-do list (separate from tasks?)
- ⏳ Music player (Spotify clone)
- ⏳ Budgeting tools
- ⏳ Calorie / Workout tracker

## Game Plan: Next Steps

### Phase 1: Foundation ✅ COMPLETE
- [x] Set up monorepo
- [x] Create design system package (pure CSS, no Tailwind)
- [x] Create API client package
- [x] Create first MCP server (mcp-tasks)
- [x] Documentation (README, QUICKSTART, GITHUB_SETUP)
- [x] Restructure for connector approach (apps in separate repos)
- [x] Landing page (index.html)
- [x] Deploy to GitHub Pages (https://8alls.com)

### Phase 2: Central API ✅ COMPLETE
- [x] Choose backend framework (FastAPI selected)
- [x] Build FastAPI backend with task endpoints
- [x] Create database models (SQLAlchemy)
- [x] Implement CRUD operations
- [x] Add search endpoint
- [x] Set up CORS for external apps
- [x] Create Docker configuration
- [x] Deploy to Fly.io (https://8alls-api.fly.dev)
- [x] Set up Supabase PostgreSQL database
- [x] Write deployment documentation

### Phase 3: Build First External App (CURRENT PRIORITY)
**Goal:** Validate the entire architecture works end-to-end

**Next Task:** Create 8alls-task-web repository

**Steps:**
1. Create new GitHub repo: `8alls-task-web`
2. Initialize Next.js app (no Tailwind!)
3. Install packages from this repo:
   ```bash
   npm install github:eddiemachado/8alls#main
   ```
4. Import design tokens in layout.tsx
5. Build task management UI using CSS variables
6. Connect to deployed API (https://8alls-api.fly.dev/api)
7. Test creating, listing, updating, deleting tasks
8. Deploy to Vercel (free tier)

**Why this validates everything:**
- ✅ Design tokens work in external app
- ✅ API client connects to production API
- ✅ Database persists data
- ✅ CORS works correctly
- ✅ Full stack operational

### Phase 4: MCP Server Integration (NEXT)

**API Requirements:**
```
Endpoints needed:
- Tasks API
  GET    /api/tasks
  POST   /api/tasks
  GET    /api/tasks/:id
  PUT    /api/tasks/:id
  DELETE /api/tasks/:id

- Calendar API
  GET    /api/events
  POST   /api/events
  GET    /api/events/:id
  PUT    /api/events/:id
  DELETE /api/events/:id

- Health API
  GET    /api/health
  POST   /api/health

- Finance API
  GET    /api/transactions
  POST   /api/transactions

- Search
  GET    /api/search?q=query
```

**Database:** PostgreSQL (recommended) or SQLite for simplicity

**Recommended Stack:**
```
Backend: FastAPI (Python)
Database: PostgreSQL
ORM: SQLAlchemy
Deployment: Railway or Fly.io
```

### Phase 4: MCP Server Integration
**Goal:** Connect MCP server to production API

**Steps:**
1. Update MCP server to use production URL
2. Configure Claude Desktop:
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
3. Test via Claude Desktop/Code:
   - "List my tasks"
   - "Create a task called 'Test' with high priority"
   - "Mark task X as complete"
4. Verify data persists in Supabase

### Phase 5: Build More Apps
**Goal:** Expand the suite

1. **Calendar Web App** (8alls-calendar-web)
   - [ ] Create repo
   - [ ] Use design tokens
   - [ ] Create calendar UI
   - [ ] Connect to events API
   - [ ] Deploy

2. **Calendar Desktop App** (8alls-calendar-desktop)
   - [ ] Electron or Tauri
   - [ ] Use design tokens
   - [ ] Native OS integration
   - [ ] Offline support

3. **Health Mobile App** (8alls-health-mobile)
   - [ ] React Native
   - [ ] iOS + Android
   - [ ] Use design tokens (adapted for mobile)
   - [ ] Health kit integration

4. **Budget Web App** (8alls-budget-web)
   - [ ] Transaction entry
   - [ ] Charts/graphs
   - [ ] Budget tracking

5. **Music Player Web** (8alls-music-web)
   - [ ] Playlist management
   - [ ] Audio player
   - [ ] Library organization

### Phase 6: MCP Server Expansion
**Goal:** Add more MCP servers

1. **mcp-calendar** - Calendar management via Claude
2. **mcp-health** - Health logging via Claude
3. **mcp-finance** - Transaction logging via Claude
4. **mcp-music** - Music control via Claude

### Phase 7: Integration with Existing Tools
**Goal:** Connect 8alls to external services

1. **Obsidian Integration**
   - [ ] File watcher to sync markdown → API
   - [ ] Bidirectional sync

2. **Telegram Bot**
   - [ ] Commands to query/create tasks
   - [ ] Notifications

3. **GitHub Integration**
   - [ ] Webhooks for issues → tasks
   - [ ] PR tracking

4. **Slack Integration**
   - [ ] Slash commands
   - [ ] Bot for queries

### Phase 8: Advanced Features
**Goal:** Cross-platform and polish

1. **Real-time Sync**
   - [ ] WebSocket support in API
   - [ ] Live updates across devices

2. **Advanced Features**
   - [ ] Data export
   - [ ] Backup/restore
   - [ ] Analytics dashboard

## Key Technical Details

### Design System Usage in External Apps

**Step 1: Install package**
```bash
# In your external app repo
npm install github:eddiemachado/8alls#main --save
```

**Step 2: Import in your app**
```typescript
// In layout.tsx or _app.tsx
import '@8alls/design-tokens/styles/global.css';
```

**Step 3: Use in CSS**
```css
.component {
  background-color: var(--color-primary-500);
  padding: var(--spacing-4);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-md);
}
```

**Step 4: Use in TypeScript**
```typescript
import { colors, spacing } from '@8alls/design-tokens';

const style = {
  backgroundColor: colors.primary[500],
  padding: spacing[4],
};
```

### API Client Usage in External Apps

**Step 1: Install package**
```bash
npm install github:eddiemachado/8alls#main --save
```

**Step 2: Initialize in your app**
```typescript
import { createApiClient } from '@8alls/api-client';

const api = createApiClient({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  apiKey: process.env.NEXT_PUBLIC_API_KEY,
});

// Use the client
const tasks = await api.getTasks();
const newTask = await api.createTask({
  title: 'Build feature',
  priority: 'high',
  completed: false,
});
```

### MCP Server Usage

**In Claude Desktop config:**
```json
{
  "mcpServers": {
    "8alls-tasks": {
      "command": "node",
      "args": ["/path/to/8alls/mcp-servers/mcp-tasks/dist/index.js"],
      "env": {
        "API_BASE_URL": "http://localhost:3000/api"
      }
    }
  }
}
```

## Important User Requirements

1. **NO Tailwind or CSS frameworks** - User specifically requested pure CSS
2. **Single user initially** - Architecture supports it but built for solo use first
3. **Central design system** - All apps must use same tokens/styles
4. **MCP integration** - Critical for Claude Code workflow
5. **Repo separation** - Apps in separate repos, not monorepo

## Environment Variables Needed

**For External Apps:**
```bash
NEXT_PUBLIC_API_BASE_URL=http://localhost:3000/api  # or production URL
NEXT_PUBLIC_API_KEY=your-api-key-here
```

**For MCP Servers:**
```bash
API_BASE_URL=http://localhost:3000/api
API_KEY=your-api-key-here
```

**For API Server:**
```bash
DATABASE_URL=postgresql://user:pass@localhost/8alls
JWT_SECRET=your-secret-here
PORT=3000
```

## Deployment Strategy

**This Repo (8alls):**
- **Landing Page**: ✅ GitHub Pages (https://8alls.com)
- **API**: ✅ Fly.io (https://8alls-api.fly.dev)
- **Database**: ✅ Supabase PostgreSQL (free tier)
- **Packages**: Auto-published to npm or consumed via git
- **MCP Servers**: Run locally (no deployment needed)

**External App Repos:**
- **Web Apps**: Vercel, Netlify, or Cloudflare Pages
- **Desktop Apps**: GitHub Releases with auto-update
- **Mobile Apps**: App Store, Play Store

## Commands Reference

**From this repo (8alls):**
```bash
# Install all dependencies
npm install

# Build all packages
npm run build

# Clean all builds
npm run clean
```

**From specific package:**
```bash
cd packages/design-tokens
npm run build      # Build package
npm run dev        # Watch mode
```

**MCP Server:**
```bash
cd mcp-servers/mcp-tasks
npm run build      # Compile TypeScript
npm start          # Run server
```

**External app repos:**
```bash
# Install with git dependency
npm install github:eddiemachado/8alls#main

# Or during development, link locally
cd /path/to/8alls
npm link

cd /path/to/8alls-task-web
npm link @8alls/design-tokens
npm link @8alls/api-client
```

## Common Issues & Solutions

**Issue:** Changes to design tokens not reflecting in external app
**Solution:**
1. Rebuild the tokens package: `cd packages/design-tokens && npm run build`
2. In external app: `npm update @8alls/design-tokens`

**Issue:** Types not working across packages
**Solution:** Ensure all packages are built, check tsconfig.json paths

**Issue:** MCP server not connecting
**Solution:** Check Claude Desktop config path, ensure server is built

**Issue:** External app can't find package
**Solution:** Make sure this repo is pushed to GitHub and use correct git URL

## Creating a New External App

**📖 Complete Guide:** See [EXTERNAL_APP_SETUP.md](EXTERNAL_APP_SETUP.md) for detailed instructions, troubleshooting, and examples.

**Quick Template:**

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

The [EXTERNAL_APP_SETUP.md](EXTERNAL_APP_SETUP.md) guide includes:
- Framework-specific setup (Next.js, Vite, React)
- Complete API client usage examples
- All available design tokens
- Testing procedures
- Deployment instructions
- Troubleshooting common issues

## Conversation Summary

**User's Journey:**
1. Started wanting to connect multiple tools (Obsidian, Telegram, etc.)
2. Needed a central API as the connecting point
3. Wanted consistent styling across all apps
4. Specifically did NOT want Tailwind or CSS frameworks
5. Needed to integrate with Claude Code via MCP
6. **Realized apps should be in separate repos** for better organization

**What We Delivered:**
- Complete monorepo for shared infrastructure
- Framework-agnostic design system (pure CSS + TypeScript)
- API client ready for backend integration
- MCP server for Claude integration
- Architecture that supports separate app repos
- Full documentation

**Current Status:**
- ✅ Foundation complete
- ✅ Restructured for connector approach
- ✅ Landing page deployed (https://8alls.com)
- ✅ Central API built and deployed (https://8alls-api.fly.dev)
- ✅ Production infrastructure operational ($0/month)
- 🔜 Ready to create first external app
- 🔜 Ready to update MCP server

## Production URLs

**Live Services:**
- 🌐 Landing Page: https://8alls.com
- 🚀 API Backend: https://8alls-api.fly.dev
- 📚 API Docs: https://8alls-api.fly.dev/docs
- 💚 Health Check: https://8alls-api.fly.dev/health
- 🗄️ Database: Supabase PostgreSQL (private)

**Cost:** $0/month (all free tiers)

## Current Status (As of Session 3)

### ✅ What's Working

**Infrastructure:**
- ✅ Landing page live at https://8alls.com (GitHub Pages)
- ✅ API live at https://8alls-api.fly.dev (Fly.io)
- ✅ Database running on Supabase (PostgreSQL)
- ✅ Design tokens ready to consume
- ✅ API client ready to consume
- ✅ MCP server built (needs production URL update)

**You can:**
- ✅ Create, list, search tasks via API
- ✅ View API docs at https://8alls-api.fly.dev/docs
- ✅ Manage database via Supabase dashboard
- ✅ Deploy API updates with `fly deploy`

**Cost: $0/month** (free tiers for everything)

### 🔜 What's Next

**Immediate next task:**
1. Create first external app (8alls-task-web)
2. Update MCP server to production URL
3. Test full stack end-to-end

## Next Session Goals

When you continue:

**Priority 1: Create First External App (1-2 hours)**
1. Create new repo: `8alls-task-web`
2. Initialize Next.js (no Tailwind)
3. Install from this repo: `npm install github:eddiemachado/8alls#main`
4. Import design tokens and build UI
5. Connect to production API
6. Deploy to Vercel

**This validates:**
- Design tokens work in external app
- API client works with production API
- Database persists correctly
- CORS is configured properly
- Full architecture is operational

**Priority 2: Update MCP Server (15 minutes)**
- Point to production API
- Test with Claude Desktop/Code
- Verify it works with real database

**Priority 3: Build More Apps**
- Calendar app
- Health tracker
- Budget tool

## Questions Answered

1. ✅ Which backend framework? → **FastAPI** (Python)
2. ✅ Database choice? → **PostgreSQL** (Supabase)
3. ✅ Hosting? → **Fly.io** (API) + **GitHub Pages** (landing)
4. ⏳ Which app to build first? → **8alls-task-web** (Next task)
5. ⏳ Publish to npm or use git dependencies? → TBD when building first app
6. ⏳ Any design system customizations needed? → TBD during first app

---

**Last Updated:** January 31, 2026 - Session 3
**Current Directory:** /Users/eddiemachado/Documents/Personal/8alls
**Landing Page:** https://8alls.com (GitHub Pages)
**Production API:** https://8alls-api.fly.dev (Fly.io)
**Database:** Supabase PostgreSQL
**Status:** Full infrastructure deployed and operational, ready to build first external app
**Cost:** $0/month (GitHub Pages + Fly.io + Supabase free tiers)
