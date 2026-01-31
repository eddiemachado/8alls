# 8alls Project Context & Game Plan

## Project Overview

**Project Name:** 8alls  
**Type:** Personal productivity suite monorepo  
**Goal:** Build a suite of interconnected productivity tools with a unified design system and central API

## What We've Built So Far

### ✅ Completed (Session 1)

1. **Monorepo Structure**
   - Set up with npm workspaces
   - Turborepo for build orchestration
   - Organized into packages/, apps/, and mcp-servers/

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

3. **@8alls/api-client Package**
   - TypeScript API client for central API
   - Type-safe methods for:
     - Tasks (list, get, create, update, delete)
     - Calendar events
     - Health logs
     - Transactions (budget)
     - Universal search
   - Location: `/packages/api-client/`

4. **Sample Task Web App**
   - Next.js 14 app demonstrating design system
   - Fully functional UI with mock data
   - Shows how to use CSS variables and tokens
   - Location: `/apps/task-web/`

5. **MCP Server for Tasks**
   - Model Context Protocol server for Claude integration
   - 6 tools: list_tasks, get_task, create_task, update_task, delete_task, search_tasks
   - Ready for Claude Code/Desktop
   - Location: `/mcp-servers/mcp-tasks/`

6. **Documentation**
   - README.md - Full project documentation
   - QUICKSTART.md - Step-by-step getting started
   - GITHUB_SETUP.md - GitHub deployment guide

7. **GitHub Ready**
   - .gitignore configured
   - .gitattributes for proper file handling
   - GitHub Actions CI workflow
   - Ready to push to repository

## Design Philosophy

**Core Principles:**
- **No CSS frameworks** - Pure CSS variables and vanilla styling
- **Centralized design system** - All apps share same tokens
- **Type safety** - TypeScript throughout
- **Single source of truth** - Central API for all data
- **MCP integration** - AI-powered automation via Claude

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
└──────────────────┬──────────────────────────────┘
                   │
      ┌────────────┼────────────┬─────────────┐
      │            │            │             │
   [MCP]       [REST API]   [WebSockets]     │
      │            │            │             │
  Claude Code  Web Apps    Real-time      Mobile Apps
  Claude AI    (Next.js)   Updates        (Future)
```

```
@8alls/design-tokens
       │
       ├─→ task-web (imports design system)
       ├─→ calendar-web (future)
       ├─→ health-mobile (future)
       └─→ budget-web (future)
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
├── apps/
│   └── task-web/
│       ├── src/
│       │   └── app/
│       │       ├── layout.tsx       # Root layout
│       │       ├── page.tsx         # Main page component
│       │       └── globals.css      # App-specific styles
│       ├── next.config.js
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

### Applications to Build:
- ✅ Task management (BUILT - task-web)
- ⏳ Calendar
- ⏳ To-do list (separate from tasks?)
- ⏳ Music player (Spotify clone)
- ⏳ Budgeting tools
- ⏳ Health / Calorie / Workout tracker

## Game Plan: Next Steps

### Phase 1: Foundation ✅ COMPLETE
- [x] Set up monorepo
- [x] Create design system package
- [x] Create API client package
- [x] Build sample app (task-web)
- [x] Create first MCP server
- [x] Documentation

### Phase 2: Validation & Deployment (CURRENT)
**Goal:** Make sure everything works and is accessible

1. **Local Validation** (30 min)
   - [ ] Run `npm install` in root
   - [ ] Run `npm run build` to build packages
   - [ ] Run `cd apps/task-web && npm run dev`
   - [ ] Verify app runs at http://localhost:3000
   - [ ] Test design system (colors, spacing work correctly)

2. **GitHub Setup** (15 min)
   - [ ] Initialize git: `git init`
   - [ ] First commit: `git add . && git commit -m "Initial commit"`
   - [ ] Create GitHub repo
   - [ ] Push code: `git push -u origin main`

3. **Customize Design System** (Optional, 1-2 hours)
   - [ ] Modify colors in `/packages/design-tokens/src/tokens/colors.ts`
   - [ ] Adjust spacing if needed
   - [ ] Update typography/fonts
   - [ ] Rebuild: `npm run build`

### Phase 3: Build Central API (NEXT PRIORITY)
**Goal:** Create the backend that all apps will connect to

**Decision Point:** Choose backend framework
- **Option A: FastAPI (Python)** - Fastest development, great for solo dev
- **Option B: NestJS (TypeScript)** - Type sharing with frontend, more boilerplate
- **Option C: Go** - Best performance, more verbose

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

### Phase 4: Connect Apps to API
**Goal:** Make apps functional with real data

1. **Update API client**
   - [ ] Set API_BASE_URL environment variable
   - [ ] Test API connection

2. **Update task-web app**
   - [ ] Replace mock data with API calls
   - [ ] Add error handling
   - [ ] Add loading states

3. **Test MCP server**
   - [ ] Configure Claude Desktop/Code
   - [ ] Test creating/reading tasks via Claude

### Phase 5: Build More Apps
**Goal:** Expand the suite

1. **Calendar App** (apps/calendar-web)
   - [ ] Copy task-web structure
   - [ ] Create calendar UI components
   - [ ] Connect to events API
   - [ ] Create mcp-calendar server

2. **Health Tracker** (apps/health-web or health-mobile)
   - [ ] Workout logging
   - [ ] Calorie tracking
   - [ ] Weight tracking
   - [ ] Charts/graphs
   - [ ] Create mcp-health server

3. **Budget Tool** (apps/budget-web)
   - [ ] Transaction entry
   - [ ] Category management
   - [ ] Expense reports
   - [ ] Budget tracking
   - [ ] Create mcp-finance server

4. **Music Player** (apps/music-web)
   - [ ] Playlist management
   - [ ] Audio player
   - [ ] Library organization

### Phase 6: Integration with Existing Tools
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

### Phase 7: Mobile & Advanced Features
**Goal:** Cross-platform and polish

1. **Mobile Apps** (React Native)
   - [ ] Reuse design tokens
   - [ ] Offline support
   - [ ] Push notifications

2. **Real-time Sync**
   - [ ] WebSocket support in API
   - [ ] Live updates across devices

3. **Advanced Features**
   - [ ] Data export
   - [ ] Backup/restore
   - [ ] Analytics dashboard

## Key Technical Details

### Design System Usage

**In CSS:**
```css
.component {
  background-color: var(--color-primary-500);
  padding: var(--spacing-4);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-md);
}
```

**In TypeScript/React:**
```typescript
import { colors, spacing } from '@8alls/design-tokens';

const style = {
  backgroundColor: colors.primary[500],
  padding: spacing[4],
};
```

**Importing global styles:**
```typescript
// In every app's layout.tsx
import '@8alls/design-tokens/styles/global.css';
```

### API Client Usage

```typescript
import { createApiClient } from '@8alls/api-client';

const api = createApiClient({
  baseURL: process.env.API_BASE_URL || 'http://localhost:3000/api',
  apiKey: process.env.API_KEY,
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

## Environment Variables Needed

**For Apps:**
```bash
API_BASE_URL=http://localhost:3000/api  # or production URL
API_KEY=your-api-key-here
```

**For MCP Servers:**
```bash
API_BASE_URL=http://localhost:3000/api
API_KEY=your-api-key-here
```

## Deployment Strategy

**Frontend (Web Apps):**
- Platform: Vercel (recommended for Next.js)
- Cost: Free tier
- Auto-deploy from GitHub

**Backend (API):**
- Platform: Railway or Fly.io
- Database: Supabase or PlanetScale
- Cost: Free tier available

**MCP Servers:**
- Run locally on development machine
- No deployment needed

## Commands Reference

**From root directory:**
```bash
# Install all dependencies
npm install

# Build all packages
npm run build

# Run in dev mode (all apps)
npm run dev

# Clean all builds
npm run clean
```

**From specific app:**
```bash
cd apps/task-web
npm run dev        # Run development server
npm run build      # Production build
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

## Common Issues & Solutions

**Issue:** Changes to design tokens not reflecting in app
**Solution:** Rebuild the tokens package: `cd packages/design-tokens && npm run build`

**Issue:** Types not working across packages
**Solution:** Ensure all packages are built, check tsconfig.json paths

**Issue:** MCP server not connecting
**Solution:** Check Claude Desktop config path, ensure server is built

## Conversation Summary

**User's Journey:**
1. Started wanting to connect multiple tools (Obsidian, Telegram, etc.)
2. Needed a central API as the connecting point
3. Wanted consistent styling across all apps
4. Specifically did NOT want Tailwind or CSS frameworks
5. Needed to integrate with Claude Code via MCP

**What We Delivered:**
- Complete monorepo structure
- Framework-agnostic design system (pure CSS + TypeScript)
- API client ready for backend integration
- Working sample app
- MCP server for Claude integration
- Full documentation

**Current Status:**
- ✅ Foundation complete
- ⏳ Ready to build backend API
- ⏳ Ready to add more apps
- ⏳ Ready to deploy

## Next Session Goals

When you open this in Claude Code, the immediate next steps are:

1. **Validate the setup works:**
   - Run `npm install && npm run build`
   - Start task-web and verify it runs
   
2. **Choose your path:**
   - Build the central API (FastAPI recommended)
   - OR customize the design system
   - OR build another app (calendar/health/budget)

3. **Push to GitHub:**
   - Get code under version control
   - Enable multi-machine development

**Recommended:** Start with building the FastAPI backend - it's the missing piece that makes everything functional.

## Questions to Answer Next Session

1. Which backend framework? (FastAPI, NestJS, or Go)
2. Database choice? (PostgreSQL or SQLite initially)
3. Which app to build next after API is ready?
4. Any design system customizations needed?

---

**Last Updated:** January 31, 2026  
**Session Location:** /home/claude/8alls (also in /mnt/user-data/outputs/8alls)  
**Ready for:** Claude Code import and continuation
