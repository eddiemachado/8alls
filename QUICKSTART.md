# 8alls Quick Start Guide

This guide will help you get up and running with the 8alls monorepo in minutes.

## Step 1: Install Dependencies

```bash
cd 8alls
npm install
```

This installs all dependencies for all packages, apps, and MCP servers.

## Step 2: Build Shared Packages

```bash
npm run build
```

This builds:
- `@8alls/design-tokens` - Your design system
- `@8alls/api-client` - API client library

## Step 3: Run Your First App

```bash
cd apps/task-web
npm run dev
```

Open http://localhost:3000 to see the task management app!

## What You'll See

The task app demonstrates:
- ✅ Design system in action (colors, spacing, typography)
- ✅ CSS variables for theming
- ✅ Consistent styling
- ✅ Mock data (no backend required yet)

## Step 4: Customize the Design System

### Change Primary Color

Edit `packages/design-tokens/src/tokens/colors.ts`:

```typescript
primary: {
  500: '#ff6b6b',  // Change from indigo to red
  // ... update other shades
}
```

Rebuild and see changes instantly:

```bash
cd packages/design-tokens
npm run build
cd ../../apps/task-web
npm run dev
```

### Add Custom Spacing

Edit `packages/design-tokens/src/tokens/spacing.ts`:

```typescript
export const spacing = {
  // ... existing spacing
  custom: '2.5rem',  // Add your own
}
```

## Step 5: Create Your Own App

```bash
mkdir -p apps/my-app
cd apps/my-app
```

Create `package.json`:

```json
{
  "name": "@8alls/my-app",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "dev": "next dev -p 3001",
    "build": "next build"
  },
  "dependencies": {
    "@8alls/design-tokens": "*",
    "@8alls/api-client": "*",
    "next": "^14.0.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0"
  }
}
```

Create `src/app/layout.tsx`:

```typescript
import '@8alls/design-tokens/styles/global.css';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
```

Create `src/app/page.tsx`:

```typescript
'use client';
import { colors, spacing } from '@8alls/design-tokens';

export default function Home() {
  return (
    <div style={{
      padding: spacing[8],
      backgroundColor: 'var(--color-bg-primary)',
      minHeight: '100vh',
    }}>
      <h1 style={{ color: colors.primary[600] }}>
        My 8alls App
      </h1>
      <p style={{ color: 'var(--color-text-secondary)' }}>
        Built with the 8alls design system!
      </p>
    </div>
  );
}
```

Run it:

```bash
npm install
npm run dev
```

## Step 6: Using the API Client

```typescript
'use client';
import { useEffect, useState } from 'react';
import { api } from '@8alls/api-client';

export default function TasksPage() {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    // Once you have a backend API running
    api.getTasks()
      .then(setTasks)
      .catch(console.error);
  }, []);

  return (
    <div>
      {tasks.map(task => (
        <div key={task.id}>{task.title}</div>
      ))}
    </div>
  );
}
```

## Step 7: Set Up MCP Server (Optional)

Build the MCP server:

```bash
cd mcp-servers/mcp-tasks
npm run build
```

Add to Claude Desktop config (`~/Library/Application Support/Claude/claude_desktop_config.json` on Mac):

```json
{
  "mcpServers": {
    "8alls-tasks": {
      "command": "node",
      "args": ["/absolute/path/to/8alls/mcp-servers/mcp-tasks/dist/index.js"],
      "env": {
        "API_BASE_URL": "http://localhost:3000/api"
      }
    }
  }
}
```

Restart Claude Desktop, and you can now ask Claude to:
- "List my tasks"
- "Create a task called 'Finish project' with high priority"
- "Mark task X as complete"

## Common Patterns

### Using CSS Variables

```css
.button {
  background-color: var(--color-primary-500);
  padding: var(--spacing-4);
  border-radius: var(--radius-md);
  transition: var(--transition-all);
}

.button:hover {
  background-color: var(--color-primary-600);
}
```

### Using TypeScript Tokens

```typescript
import { colors, spacing, typography } from '@8alls/design-tokens';

const Card = ({ children }) => (
  <div style={{
    backgroundColor: colors.light.background.elevated,
    padding: spacing[6],
    borderRadius: '0.75rem',
    fontFamily: typography.fonts.sans,
    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
  }}>
    {children}
  </div>
);
```

### Dark Mode Support

Add theme toggle:

```typescript
'use client';
import { useState, useEffect } from 'react';

export default function ThemeToggle() {
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  return (
    <button onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>
      Toggle {theme === 'light' ? '🌙' : '☀️'}
    </button>
  );
}
```

## Next Steps

1. **Build Your Backend API** - Create FastAPI, NestJS, or Go server
2. **Connect Apps to API** - Update `API_BASE_URL` in environment variables
3. **Add More Apps** - Calendar, health tracker, budget tool
4. **Create More MCP Servers** - One for each domain (calendar, health, etc.)
5. **Deploy** - Use Vercel for web apps, Railway/Fly.io for API

## Need Help?

- Check the main [README.md](./README.md) for architecture details
- Look at `apps/task-web` for a complete example
- Explore `packages/design-tokens` for all available tokens

Happy building! 🎱
