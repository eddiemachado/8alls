# 8alls Project Context & Game Plan

## Project Overview

**Project Name:** 8alls
**Type:** Central connector monorepo for productivity suite
**Goal:** Provide shared infrastructure (design system, API client, MCP servers) that external app repos consume

## What We've Built So Far

### ✅ Completed (Session 1-2)

1. **Monorepo Structure**
   - Set up with npm workspaces
   - Turborepo for build orchestration
   - Organized into packages/ and mcp-servers/
   - Apps live in separate repos

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

5. **Documentation**
   - README.md - Full project documentation
   - QUICKSTART.md - Step-by-step getting started
   - GITHUB_SETUP.md - GitHub deployment guide

6. **GitHub Ready**
   - .gitignore configured
   - .gitattributes for proper file handling
   - GitHub Actions CI workflow
   - Ready to push to repository

## Architecture Philosophy

### Central Connector Approach

**This repo (8alls) provides:**
- ✅ Shared design tokens (can be consumed by any app)
- ✅ Shared API client (connects apps to central backend)
- ✅ MCP servers (Claude Code integration)
- 🔜 Central API backend (single source of truth for data)
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
┌─────────────────────────────────────────────────┐
│         Central API Server (TO BUILD)            │
│    FastAPI / NestJS / Go                         │
│    Database: PostgreSQL                          │
│    Location: This repo (api/)                    │
└──────────────────┬──────────────────────────────┘
                   │
      ┌────────────┼────────────┬─────────────┐
      │            │            │             │
   [MCP]       [REST API]   [WebSockets]     │
      │            │            │             │
  Claude Code  Web Apps    Real-time      Mobile Apps
  Claude AI   (Separate    Updates       (Separate
               repos)                      repos)
```

```
8alls/ (This Repo)
├── packages/
│   ├── design-tokens/    → Shared styling
│   └── api-client/       → Shared API client
├── mcp-servers/
│   └── mcp-tasks/        → Claude integration
└── api/                  → Central backend (TO BUILD)

External App Repos:
├── 8alls-task-web/
│   └── npm install @8alls/design-tokens @8alls/api-client
├── 8alls-calendar-desktop/
│   └── npm install @8alls/design-tokens @8alls/api-client
└── 8alls-health-mobile/
    └── npm install @8alls/design-tokens @8alls/api-client
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
├── .github/
│   └── workflows/
│       └── ci.yml                   # GitHub Actions CI
├── package.json                     # Root workspace config
├── turbo.json                       # Turborepo config
├── .gitignore
├── .gitattributes
├── README.md
├── QUICKSTART.md
└── GITHUB_SETUP.md
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
- [x] Create design system package
- [x] Create API client package
- [x] Create first MCP server
- [x] Documentation
- [x] Restructure for connector approach

### Phase 2: Central API (CURRENT PRIORITY)
**Goal:** Build the backend that all apps connect to

**Decision Point:** Choose backend framework
- **Option A: FastAPI (Python)** - Fastest development, great for solo dev
- **Option B: NestJS (TypeScript)** - Type sharing with frontend, more boilerplate
- **Option C: Go** - Best performance, more verbose

**API Location:** `/api` directory in this repo

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

### Phase 3: Publish Packages
**Goal:** Make packages available to external repos

**Options:**
1. **Private npm registry** (npm, GitHub Packages)
2. **Git dependencies** (install from GitHub directly)
3. **Local linking** (npm link during development)

**For git dependencies:**
```json
{
  "dependencies": {
    "@8alls/design-tokens": "github:eddiemachado/8alls#main",
    "@8alls/api-client": "github:eddiemachado/8alls#main"
  }
}
```

### Phase 4: Build First External App
**Goal:** Validate the connector architecture works

**Recommended:** Start with task-web
1. **Create new repo: 8alls-task-web**
   - [ ] Initialize Next.js project
   - [ ] Install @8alls/design-tokens
   - [ ] Install @8alls/api-client
   - [ ] Build task management UI
   - [ ] Connect to API
   - [ ] Deploy to Vercel

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
- **Packages**: Auto-published to npm or consumed via git
- **API**: Deploy to Railway, Fly.io, or DigitalOcean
- **Database**: Supabase, PlanetScale, or self-hosted PostgreSQL
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

**Template process:**

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

3. **Import design tokens**
   ```typescript
   // In app/layout.tsx
   import '@8alls/design-tokens/styles/global.css';
   ```

4. **Initialize API client**
   ```typescript
   // In lib/api.ts
   import { createApiClient } from '@8alls/api-client';

   export const api = createApiClient({
     baseURL: process.env.NEXT_PUBLIC_API_BASE_URL!,
   });
   ```

5. **Start building!**

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
- ⏳ Ready to build central API
- ⏳ Ready to create first external app
- ⏳ Ready to deploy

## Next Session Goals

When you continue with Claude Code:

1. **Build the central API:**
   - Choose framework (FastAPI recommended)
   - Set up database (PostgreSQL)
   - Implement endpoints
   - Deploy to Railway/Fly.io

2. **Create first external app:**
   - New repo: 8alls-task-web
   - Install design tokens + API client
   - Build task management UI
   - Deploy to Vercel

3. **Publish packages** (optional):
   - Publish to npm (private or public)
   - Or continue using git dependencies

## Questions to Answer Next Session

1. Which backend framework? (FastAPI, NestJS, or Go)
2. Database choice? (PostgreSQL or SQLite initially)
3. Which app to build first?
4. Publish to npm or use git dependencies?
5. Any design system customizations needed?

---

**Last Updated:** January 31, 2026
**Current Directory:** /Users/eddiemachado/Documents/Personal/8alls
**Ready for:** Building central API and first external app
