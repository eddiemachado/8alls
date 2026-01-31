# External App Setup Guide

This guide explains how to create a new external app that connects to the 8alls infrastructure.

## Overview

The 8alls ecosystem uses a **central connector** architecture:
- **This repo (8alls)** provides shared infrastructure: design tokens, API client, and the central API
- **External apps** (separate repos) consume these packages and connect to the API

## Prerequisites

- Node.js 18+ installed
- Git installed
- Access to the 8alls repository: https://github.com/eddiemachado/8alls

## Quick Start

### 1. Create Your App

```bash
# Example: Creating a Next.js app (adjust for your framework)
npx create-next-app@latest my-8alls-app --typescript --tailwind=false --app

cd my-8alls-app
```

**Important:** Do NOT use Tailwind CSS. The 8alls design system uses pure CSS variables.

### 2. Install 8alls Packages

Install the shared packages from the 8alls repository:

```bash
npm install github:eddiemachado/8alls#main
```

This installs both:
- `@8alls/design-tokens` - Shared design system
- `@8alls/api-client` - API client for backend communication

### 3. Set Up Environment Variables

Create a `.env.local` file (or `.env` depending on your framework):

```bash
# For production
NEXT_PUBLIC_API_BASE_URL=https://8alls-api.fly.dev/api

# For local development (if running API locally)
# NEXT_PUBLIC_API_BASE_URL=http://localhost:8000/api
```

**Framework-specific variable names:**
- Next.js: `NEXT_PUBLIC_API_BASE_URL`
- Vite/React: `VITE_API_BASE_URL`
- Create React App: `REACT_APP_API_BASE_URL`

### 4. Import Design Tokens

Import the global CSS in your app's root layout/entry point:

**Next.js (App Router):**
```typescript
// app/layout.tsx
import '@8alls/design-tokens/styles/global.css';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
```

**Next.js (Pages Router):**
```typescript
// pages/_app.tsx
import '@8alls/design-tokens/styles/global.css';
import type { AppProps } from 'next/app';

export default function App({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}
```

**Vite/React:**
```typescript
// main.tsx or index.tsx
import '@8alls/design-tokens/styles/global.css';
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
```

### 5. Initialize API Client

Create an API client instance:

```typescript
// lib/api.ts (or utils/api.ts)
import { createApiClient } from '@8alls/api-client';

export const api = createApiClient({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || 'https://8alls-api.fly.dev/api',
});
```

**Framework-specific environment variable access:**
```typescript
// Next.js
baseURL: process.env.NEXT_PUBLIC_API_BASE_URL!

// Vite
baseURL: import.meta.env.VITE_API_BASE_URL

// Create React App
baseURL: process.env.REACT_APP_API_BASE_URL!
```

### 6. Use Design Tokens in Your Styles

**Option A: CSS Files**
```css
/* styles/component.css */
.card {
  background-color: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  padding: var(--spacing-4);
  box-shadow: var(--shadow-sm);
}

.button-primary {
  background-color: var(--color-primary-500);
  color: var(--color-primary-50);
  padding: var(--spacing-3) var(--spacing-6);
  border-radius: var(--radius-md);
  font-weight: var(--font-weight-semibold);
  transition: var(--transition-base);
}

.button-primary:hover {
  background-color: var(--color-primary-600);
}
```

**Option B: TypeScript (for dynamic styles)**
```typescript
import { colors, spacing, radius } from '@8alls/design-tokens';

const style = {
  backgroundColor: colors.primary[500],
  padding: spacing[4],
  borderRadius: radius.md,
};
```

**Option C: CSS Modules**
```css
/* Component.module.css */
.container {
  background: var(--color-background);
  padding: var(--spacing-8);
}

.heading {
  color: var(--color-text-primary);
  font-size: var(--font-size-3xl);
  font-weight: var(--font-weight-bold);
  margin-bottom: var(--spacing-4);
}
```

### 7. Use the API Client

Example usage in your components:

**React Server Component (Next.js App Router):**
```typescript
// app/tasks/page.tsx
import { api } from '@/lib/api';

export default async function TasksPage() {
  const tasks = await api.getTasks();

  return (
    <div className="container">
      <h1>Tasks</h1>
      <ul>
        {tasks.map(task => (
          <li key={task.id}>{task.title}</li>
        ))}
      </ul>
    </div>
  );
}
```

**React Client Component:**
```typescript
'use client';

import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import type { Task } from '@8alls/api-client';

export function TaskList() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadTasks() {
      try {
        const data = await api.getTasks();
        setTasks(data);
      } catch (error) {
        console.error('Failed to load tasks:', error);
      } finally {
        setLoading(false);
      }
    }
    loadTasks();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <ul>
      {tasks.map(task => (
        <li key={task.id}>{task.title}</li>
      ))}
    </ul>
  );
}
```

**Creating a new task:**
```typescript
async function handleCreateTask(title: string) {
  try {
    const newTask = await api.createTask({
      title,
      description: '',
      completed: false,
      priority: 'medium',
      tags: [],
    });
    console.log('Task created:', newTask);
  } catch (error) {
    console.error('Failed to create task:', error);
  }
}
```

## Available Design Tokens

### Colors

**Primary & Secondary:**
```css
/* Primary (Indigo) */
--color-primary-50 through --color-primary-950

/* Secondary (Purple) */
--color-secondary-50 through --color-secondary-950
```

**Extended Color Palette (OKLCH):**
```css
/* Neutrals */
--color-santasgray-50 through --color-santasgray-950

/* Pinks & Reds */
--color-frenchrose-50 through --color-frenchrose-950
--color-razzledazzlerose-50 through --color-razzledazzlerose-950

/* Oranges */
--color-persimmon-50 through --color-persimmon-950
--color-meteor-50 through --color-meteor-950

/* Yellows & Greens */
--color-hokeypokey-50 through --color-hokeypokey-950
--color-limeade-50 through --color-limeade-950
--color-jade-50 through --color-jade-950

/* Teals & Cyans */
--color-keppel-50 through --color-keppel-950
--color-pacificblue-50 through --color-pacificblue-950

/* Blues */
--color-havelockblue-50 through --color-havelockblue-950
--color-chetwodeblue-50 through --color-chetwodeblue-950

/* Purples */
--color-heliotrope-50 through --color-heliotrope-950
```

**Semantic Colors:**
```css
--color-bg-primary
--color-bg-secondary
--color-bg-tertiary
--color-text-primary
--color-text-secondary
--color-text-tertiary
--color-border-primary
--color-border-secondary
--color-success
--color-warning
--color-error
--color-info
```

### Spacing
```css
--spacing-0    /* 0px */
--spacing-1    /* 4px */
--spacing-2    /* 8px */
--spacing-3    /* 12px */
--spacing-4    /* 16px */
--spacing-6    /* 24px */
--spacing-8    /* 32px */
--spacing-12   /* 48px */
--spacing-16   /* 64px */
--spacing-24   /* 96px */
```

### Typography
```css
--font-sans        /* Inter */
--font-mono        /* Fira Code */
--font-display     /* Cal Sans */

--font-size-xs     /* 12px */
--font-size-sm     /* 14px */
--font-size-base   /* 16px */
--font-size-lg     /* 18px */
--font-size-xl     /* 20px */
--font-size-2xl    /* 24px */
--font-size-3xl    /* 30px */
--font-size-4xl    /* 36px */

--font-weight-normal    /* 400 */
--font-weight-medium    /* 500 */
--font-weight-semibold  /* 600 */
--font-weight-bold      /* 700 */
```

### Border Radius
```css
--radius-none   /* 0 */
--radius-sm     /* 4px */
--radius-md     /* 8px */
--radius-lg     /* 12px */
--radius-xl     /* 16px */
--radius-full   /* 9999px */
```

### Shadows
```css
--shadow-sm
--shadow-md
--shadow-lg
--shadow-xl
```

### Transitions
```css
--transition-fast   /* 150ms */
--transition-base   /* 250ms */
--transition-slow   /* 350ms */
```

## API Client Methods

### Tasks
```typescript
// List all tasks
const tasks = await api.getTasks();

// Get single task
const task = await api.getTask('task-id');

// Create task
const newTask = await api.createTask({
  title: 'New Task',
  description: 'Task description',
  completed: false,
  priority: 'high' | 'medium' | 'low',
  due_date: '2026-02-15',
  tags: ['work', 'urgent'],
});

// Update task
const updated = await api.updateTask('task-id', {
  completed: true,
});

// Delete task
await api.deleteTask('task-id');

// Search tasks
const results = await api.searchTasks('query');
```

### Future Endpoints (Coming Soon)
```typescript
// Calendar events
api.getEvents()
api.createEvent()

// Health logs
api.getHealthLogs()
api.createHealthLog()

// Transactions
api.getTransactions()
api.createTransaction()
```

## Testing Your Setup

### 1. Test Design Tokens

Create a test component to verify tokens are loaded:

```typescript
// components/TokenTest.tsx
export function TokenTest() {
  return (
    <div style={{ padding: 'var(--spacing-8)' }}>
      <h1 style={{
        color: 'var(--color-primary-500)',
        fontSize: 'var(--font-size-3xl)',
        fontWeight: 'var(--font-weight-bold)'
      }}>
        Design Tokens Working! 🎉
      </h1>
      <div style={{
        marginTop: 'var(--spacing-4)',
        padding: 'var(--spacing-4)',
        backgroundColor: 'var(--color-surface)',
        borderRadius: 'var(--radius-md)',
        boxShadow: 'var(--shadow-md)'
      }}>
        <p style={{ color: 'var(--color-text-primary)' }}>
          If you can see styled text, design tokens are working correctly.
        </p>
      </div>
    </div>
  );
}
```

### 2. Test API Connection

Create a test component to verify API connectivity:

```typescript
'use client';

import { useState, useEffect } from 'react';
import { api } from '@/lib/api';

export function ApiTest() {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [tasks, setTasks] = useState<any[]>([]);

  useEffect(() => {
    async function testApi() {
      try {
        const data = await api.getTasks();
        setTasks(data);
        setStatus('success');
      } catch (error) {
        console.error('API Error:', error);
        setStatus('error');
      }
    }
    testApi();
  }, []);

  return (
    <div style={{ padding: 'var(--spacing-8)' }}>
      <h2>API Connection Test</h2>
      {status === 'loading' && <p>Testing API connection...</p>}
      {status === 'success' && (
        <div>
          <p style={{ color: 'var(--color-success)' }}>
            ✅ API Connected! Found {tasks.length} tasks.
          </p>
        </div>
      )}
      {status === 'error' && (
        <p style={{ color: 'var(--color-error)' }}>
          ❌ API Connection Failed. Check console for details.
        </p>
      )}
    </div>
  );
}
```

## Deployment

### Vercel (Recommended for Next.js)

1. **Connect your repo to Vercel:**
   ```bash
   npm install -g vercel
   vercel
   ```

2. **Set environment variables in Vercel dashboard:**
   - `NEXT_PUBLIC_API_BASE_URL` = `https://8alls-api.fly.dev/api`

3. **Deploy:**
   ```bash
   vercel --prod
   ```

### Netlify

1. **Create `netlify.toml`:**
   ```toml
   [build]
     command = "npm run build"
     publish = "out"  # or "dist" depending on framework

   [[redirects]]
     from = "/*"
     to = "/index.html"
     status = 200
   ```

2. **Set environment variables in Netlify dashboard**

3. **Deploy via Netlify CLI or GitHub integration**

### Cloudflare Pages

1. **Build settings:**
   - Build command: `npm run build`
   - Output directory: `out` or `dist`

2. **Environment variables:**
   - Set `NEXT_PUBLIC_API_BASE_URL` in Pages settings

## Troubleshooting

### Design Tokens Not Working

**Problem:** CSS variables are undefined or not working

**Solutions:**
1. Verify you imported the global CSS:
   ```typescript
   import '@8alls/design-tokens/styles/global.css';
   ```

2. Check import order - global CSS should be imported before component styles

3. Clear your build cache:
   ```bash
   rm -rf .next  # Next.js
   rm -rf dist   # Vite
   npm run build
   ```

### API Connection Issues

**Problem:** API calls failing with CORS errors

**Solution:** The production API (https://8alls-api.fly.dev) has CORS enabled for all origins. If you see CORS errors:
1. Verify you're using the correct URL (include `/api` in the path)
2. Check browser console for specific error messages
3. Try accessing the API directly: https://8alls-api.fly.dev/api/tasks

**Problem:** API calls return 404

**Solution:** Ensure your API base URL includes `/api`:
```typescript
// ✅ Correct
baseURL: 'https://8alls-api.fly.dev/api'

// ❌ Wrong
baseURL: 'https://8alls-api.fly.dev'
```

**Problem:** Types not available from `@8alls/api-client`

**Solution:**
1. Ensure the package is built:
   ```bash
   cd /path/to/8alls
   npm run build
   ```

2. Reinstall the package:
   ```bash
   npm install github:eddiemachado/8alls#main --force
   ```

### Package Installation Issues

**Problem:** Can't install packages from GitHub

**Solution:**
1. Ensure you have access to the repository
2. Use a GitHub personal access token if needed:
   ```bash
   npm install github:eddiemachado/8alls#main
   ```

3. Or use SSH:
   ```bash
   npm install git+ssh://git@github.com:eddiemachado/8alls.git#main
   ```

**Problem:** Changes to design tokens not reflecting

**Solution:**
1. Rebuild the tokens package in the 8alls repo:
   ```bash
   cd /path/to/8alls/packages/design-tokens
   npm run build
   ```

2. Update the package in your app:
   ```bash
   npm update @8alls/design-tokens
   ```

## Local Development with Local API

If you want to run the API locally instead of using production:

### 1. Clone and Run the API

```bash
cd /path/to/8alls/api
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

### 2. Update Environment Variable

```bash
# .env.local
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000/api
```

## Example App Structure

Recommended structure for your external app:

```
my-8alls-app/
├── app/                      # Next.js App Router
│   ├── layout.tsx           # Import global.css here
│   ├── page.tsx
│   └── tasks/
│       └── page.tsx
├── components/
│   ├── TaskList.tsx
│   └── TaskForm.tsx
├── lib/
│   └── api.ts               # API client instance
├── styles/
│   └── custom.css           # Your custom styles using CSS vars
├── .env.local               # Environment variables
├── package.json
└── README.md
```

## Additional Resources

- **Main Repo:** https://github.com/eddiemachado/8alls
- **API Documentation:** https://8alls-api.fly.dev/docs
- **API Health Check:** https://8alls-api.fly.dev/health
- **Landing Page:** https://8alls.com

## Design Guidelines

1. **No CSS Frameworks:** Use pure CSS with the provided CSS variables
2. **Consistent Spacing:** Use spacing tokens (`--spacing-*`) for all spacing
3. **Typography:** Use the provided font variables and sizes
4. **Colors:** Use semantic color variables (`--color-primary-*`, `--color-text-*`)
5. **Responsive:** Design mobile-first, use media queries as needed
6. **Dark Mode:** Design tokens include dark mode support (future implementation)

## Need Help?

If you encounter issues:
1. Check the API documentation: https://8alls-api.fly.dev/docs
2. Verify API is healthy: https://8alls-api.fly.dev/health
3. Review the main repo's PROJECT_CONTEXT.md for architecture details
4. Test API endpoints directly using the Swagger UI

---

**Last Updated:** January 31, 2026
**API Version:** 1.0.0
**Compatible Frameworks:** Next.js, React, Vite, Vue, Svelte, or any JavaScript framework
