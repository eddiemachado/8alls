# 8alls - Personal Productivity Suite

A monorepo containing a comprehensive suite of productivity tools with a unified design system and central API.

## 🎱 Philosophy

8alls is built around the concept of precision and interconnectedness - like the perfect 8-ball break. All applications share:
- A central design system for consistent UX
- A unified API for data synchronization
- MCP servers for AI-powered automation

## 📁 Project Structure

```
8alls/
├── packages/
│   ├── design-tokens/     # Central design system (colors, typography, spacing, etc.)
│   └── api-client/        # Shared API client for all apps
├── apps/
│   ├── task-web/          # Task management web app
│   ├── calendar-web/      # Calendar app (coming soon)
│   ├── health-mobile/     # Health tracker (coming soon)
│   └── budget-web/        # Budget tool (coming soon)
└── mcp-servers/
    ├── mcp-tasks/         # MCP server for task management
    ├── mcp-calendar/      # MCP server for calendar (coming soon)
    └── mcp-health/        # MCP server for health tracking (coming soon)
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or pnpm

### Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd 8alls

# Install all dependencies
npm install

# Build all packages
npm run build
```

### Running Applications

```bash
# Run the task web app
cd apps/task-web
npm run dev
# Opens on http://localhost:3000

# Run an MCP server
cd mcp-servers/mcp-tasks
npm run build
npm start
```

## 📦 Packages

### @8alls/design-tokens

The central design system providing consistent styling across all applications.

**Features:**
- Color palettes (primary, secondary, semantic colors)
- Typography system (fonts, sizes, weights)
- Spacing scale (4px base unit)
- Animations and transitions
- CSS variables for easy theming
- Light and dark mode support

**Usage:**

```typescript
import { colors, spacing, typography } from '@8alls/design-tokens';

const buttonStyle = {
  backgroundColor: colors.primary[500],
  padding: spacing[4],
  fontFamily: typography.fonts.sans,
  borderRadius: '0.5rem',
};
```

**CSS Variables:**

```css
@import '@8alls/design-tokens/styles/global.css';

.my-component {
  background-color: var(--color-primary-500);
  padding: var(--spacing-4);
  border-radius: var(--radius-md);
}
```

### @8alls/api-client

Shared API client for communicating with the central 8alls API.

**Features:**
- Type-safe API methods
- Automatic error handling
- Support for tasks, calendar, health, and finance APIs
- Universal search

**Usage:**

```typescript
import { createApiClient } from '@8alls/api-client';

const api = createApiClient({
  baseURL: 'http://localhost:3000/api',
  apiKey: 'your-api-key',
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
        "API_BASE_URL": "http://localhost:3000/api",
        "API_KEY": "your-api-key"
      }
    }
  }
}
```

## 🎨 Design System

The 8alls design system is built on these principles:

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
│           Central API Server                     │
│  (Your backend - FastAPI/NestJS/Go)             │
│                                                  │
│  Database: PostgreSQL                            │
└──────────────────┬──────────────────────────────┘
                   │
      ┌────────────┼────────────┬─────────────┐
      │            │            │             │
   [MCP]       [REST API]   [WebSockets]     │
      │            │            │             │
  Claude Code  Web Apps    Real-time      Mobile Apps
  Claude AI    Next.js     Updates        React Native
```

### Design System Flow

```
@8alls/design-tokens
       │
       ├─→ Web Apps (import tokens directly)
       ├─→ Mobile Apps (import tokens directly)
       └─→ MCP Servers (for generated content)
```

## 🛠️ Development

### Adding a New App

1. Create app directory:
```bash
mkdir -p apps/my-new-app
```

2. Create package.json with dependencies:
```json
{
  "name": "@8alls/my-new-app",
  "dependencies": {
    "@8alls/design-tokens": "*",
    "@8alls/api-client": "*"
  }
}
```

3. Import the global styles:
```typescript
import '@8alls/design-tokens/styles/global.css';
```

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
3. Changes automatically propagate to all apps

## 📝 Scripts

From the root directory:

```bash
# Install all dependencies
npm install

# Build all packages and apps
npm run build

# Run development mode for all apps
npm run dev

# Clean all build artifacts
npm run clean

# Lint all code
npm run lint
```

## 🎯 Roadmap

- [x] Design system with tokens
- [x] API client package
- [x] Task management app
- [x] MCP server for tasks
- [ ] Central API server (FastAPI/NestJS)
- [ ] Calendar app
- [ ] Health tracker
- [ ] Budget management app
- [ ] Music player
- [ ] Mobile apps (React Native)
- [ ] Real-time synchronization
- [ ] Offline support

## 🤝 Contributing

This is a personal project, but feel free to fork and adapt for your own use!

## 📄 License

MIT

---

Built with ❤️ using the 8alls design system
