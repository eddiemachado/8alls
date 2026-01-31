# 8alls Quick Start Guide

This guide will help you get up and running with the 8alls central infrastructure and create your first external app.

## Understanding the Architecture

**8alls is a connector repo** - it provides shared infrastructure that external app repos consume:

- **This repo (8alls)**: Design system, API client, MCP servers
- **External repos**: Individual apps (task-web, calendar-desktop, health-mobile, etc.)

## Part 1: Set Up the Central Repo (8alls)

### Step 1: Install Dependencies

```bash
cd 8alls
npm install
```

This installs dependencies for design tokens, API client, and MCP servers.

### Step 2: Build Shared Packages

```bash
npm run build
```

This builds:
- `@8alls/design-tokens` - Your design system
- `@8alls/api-client` - API client library
- `@8alls/mcp-tasks` - MCP server for tasks

### Step 3: Verify Everything Works

```bash
# Check that packages built successfully
ls packages/design-tokens/dist
ls packages/api-client/dist
ls mcp-servers/mcp-tasks/dist
```

Great! Your central infrastructure is ready.

## Part 2: Create Your First External App

Now we'll create a separate app repo that uses the 8alls packages.

### Step 1: Create New App Repo

```bash
# Create a new directory (outside of 8alls)
cd ..
mkdir 8alls-task-web
cd 8alls-task-web

# Initialize Next.js app (without Tailwind)
npx create-next-app@latest . --typescript --tailwind=false --app --src-dir
```

### Step 2: Install 8alls Packages

```bash
# Install from GitHub (make sure 8alls is pushed first)
npm install github:eddiemachado/8alls#main

# Or for local development, link the packages:
cd /path/to/8alls
npm link

cd /path/to/8alls-task-web
npm link @8alls/design-tokens
npm link @8alls/api-client
```

### Step 3: Import Design System

Edit `src/app/layout.tsx`:

```typescript
import type { Metadata } from 'next';
import '@8alls/design-tokens/styles/global.css';

export const metadata: Metadata = {
  title: '8alls Tasks',
  description: 'Task management with 8alls design system',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
```

### Step 4: Create Your First Page

Edit `src/app/page.tsx`:

```typescript
'use client';
import { colors, spacing } from '@8alls/design-tokens';

export default function Home() {
  return (
    <main style={{
      padding: spacing[8],
      backgroundColor: 'var(--color-bg-primary)',
      minHeight: '100vh',
    }}>
      <h1 style={{
        color: colors.primary[600],
        fontSize: 'var(--font-size-4xl)',
        fontWeight: 'var(--font-weight-bold)',
        marginBottom: spacing[4],
      }}>
        Welcome to 8alls Tasks
      </h1>

      <p style={{ color: 'var(--color-text-secondary)' }}>
        Built with the 8alls design system - pure CSS, no frameworks!
      </p>

      <div style={{
        marginTop: spacing[8],
        padding: spacing[6],
        backgroundColor: 'var(--color-bg-elevated)',
        borderRadius: 'var(--radius-lg)',
        boxShadow: 'var(--shadow-md)',
      }}>
        <h2 style={{ color: 'var(--color-text-primary)' }}>
          Task Example
        </h2>
        <p style={{ color: 'var(--color-text-secondary)' }}>
          This card uses CSS variables from the design system.
        </p>
      </div>
    </main>
  );
}
```

### Step 5: Run Your App

```bash
npm run dev
```

Open http://localhost:3000 to see your app using the 8alls design system!

## Part 3: Customize the Design System

### Change Colors

Go back to the 8alls repo and edit `packages/design-tokens/src/tokens/colors.ts`:

```typescript
primary: {
  500: '#ff6b6b',  // Change from indigo to red
  600: '#ee5a52',
  // ... update other shades
}
```

Rebuild and update:

```bash
cd /path/to/8alls
cd packages/design-tokens
npm run build

# If using git dependencies
git add .
git commit -m "Update primary color"
git push

# In your external app
cd /path/to/8alls-task-web
npm update @8alls/design-tokens

# If using npm link, just refresh your browser
```

### Add Custom Tokens

Edit `packages/design-tokens/src/tokens/spacing.ts`:

```typescript
export const spacing = {
  // ... existing spacing
  'custom-huge': '10rem',  // Add your own
}
```

Rebuild, and use it:

```css
.my-component {
  padding: var(--spacing-custom-huge);
}
```

## Part 4: Using the API Client

Create `src/lib/api.ts` in your external app:

```typescript
import { createApiClient } from '@8alls/api-client';

export const api = createApiClient({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000/api',
  apiKey: process.env.NEXT_PUBLIC_API_KEY,
});
```

Create `.env.local`:

```bash
NEXT_PUBLIC_API_BASE_URL=http://localhost:3000/api
NEXT_PUBLIC_API_KEY=your-api-key
```

Use in a component:

```typescript
'use client';
import { useEffect, useState } from 'react';
import { api } from '../lib/api';

export default function TasksList() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Once you have a backend API running
    api.getTasks()
      .then(setTasks)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h2>My Tasks</h2>
      {tasks.map(task => (
        <div key={task.id} style={{
          padding: 'var(--spacing-4)',
          marginBottom: 'var(--spacing-2)',
          backgroundColor: 'var(--color-bg-elevated)',
          borderRadius: 'var(--radius-md)',
        }}>
          {task.title}
        </div>
      ))}
    </div>
  );
}
```

## Part 5: Set Up MCP Server (Optional)

Back in the 8alls repo, the MCP server is already built. Now configure Claude Desktop.

Edit `~/Library/Application Support/Claude/claude_desktop_config.json` (Mac) or equivalent:

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

### Pure CSS Styling (No Frameworks!)

8alls uses **pure CSS variables** - no Tailwind, Bootstrap, or other frameworks.

```css
/* styles.css */
.button {
  background-color: var(--color-primary-500);
  color: var(--color-text-on-primary);
  padding: var(--spacing-3) var(--spacing-6);
  border-radius: var(--radius-md);
  border: none;
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-medium);
  cursor: pointer;
  transition: var(--transition-all);
}

.button:hover {
  background-color: var(--color-primary-600);
  transform: translateY(-1px);
  box-shadow: var(--shadow-lg);
}

.card {
  background-color: var(--color-bg-elevated);
  padding: var(--spacing-6);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-md);
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

```typescript
'use client';
import { useState, useEffect } from 'react';

export default function ThemeToggle() {
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  return (
    <button
      onClick={toggleTheme}
      style={{
        padding: 'var(--spacing-2) var(--spacing-4)',
        backgroundColor: 'var(--color-bg-elevated)',
        border: '1px solid var(--color-border-primary)',
        borderRadius: 'var(--radius-md)',
        cursor: 'pointer',
      }}
    >
      {theme === 'light' ? '🌙 Dark' : '☀️ Light'}
    </button>
  );
}
```

## Workflow for Multiple Apps

### Structure Your Projects

```
~/projects/
├── 8alls/                    # Central infrastructure repo
│   ├── packages/
│   │   ├── design-tokens/
│   │   └── api-client/
│   └── mcp-servers/
├── 8alls-task-web/          # Task management web app
├── 8alls-calendar-web/      # Calendar web app
├── 8alls-calendar-desktop/  # Desktop calendar (Electron/Tauri)
└── 8alls-health-mobile/     # Mobile health app (React Native)
```

### Development Workflow

1. **Make changes to design system** (in 8alls repo)
   ```bash
   cd ~/projects/8alls/packages/design-tokens
   # Edit tokens
   npm run build
   git add . && git commit -m "Update colors"
   git push
   ```

2. **Update external apps**
   ```bash
   cd ~/projects/8alls-task-web
   npm update @8alls/design-tokens
   # Or if linked: just refresh browser
   ```

3. **All apps automatically use new design**

## Next Steps

1. **Build Your Backend API**
   - Create FastAPI, NestJS, or Go server
   - Implement endpoints defined in api-client
   - Deploy to Railway or Fly.io

2. **Connect Apps to API**
   - Update `NEXT_PUBLIC_API_BASE_URL` in each app
   - Test API integration

3. **Create More Apps**
   - Follow the same pattern for calendar, health, budget apps
   - Each in its own repo
   - All using same design system

4. **Add More MCP Servers**
   - Create mcp-calendar, mcp-health, etc.
   - One for each domain

5. **Deploy**
   - Web apps → Vercel, Netlify
   - API → Railway, Fly.io
   - Desktop apps → GitHub Releases
   - Mobile apps → App stores

## Publishing Options

### Option 1: Git Dependencies (Recommended for Solo Dev)

```json
{
  "dependencies": {
    "@8alls/design-tokens": "github:eddiemachado/8alls#main",
    "@8alls/api-client": "github:eddiemachado/8alls#main"
  }
}
```

### Option 2: Private npm Registry

Publish to npm (private):

```bash
cd packages/design-tokens
npm publish --access private
```

### Option 3: Local Linking (Development)

```bash
npm link
```

## Need Help?

- Check the main [README.md](./README.md) for architecture details
- See [PROJECT_CONTEXT.md](./PROJECT_CONTEXT.md) for full project context
- Review [GITHUB_SETUP.md](./GITHUB_SETUP.md) for deployment

Happy building! 🎱
