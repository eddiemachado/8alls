# GitHub Setup Guide for 8alls

## Step 1: Initialize Git Repository

```bash
cd 8alls

# Initialize git
git init

# Add all files
git add .

# Make your first commit
git commit -m "Initial commit: 8alls monorepo with design system"
```

## Step 2: Create GitHub Repository

### Option A: Using GitHub CLI (Recommended)

```bash
# Install GitHub CLI if you don't have it
# Mac: brew install gh
# Windows: winget install --id GitHub.cli
# Linux: See https://github.com/cli/cli#installation

# Login to GitHub
gh auth login

# Create the repository (public)
gh repo create 8alls --public --source=. --remote=origin

# Push your code
git push -u origin main
```

### Option B: Using GitHub Website

1. Go to https://github.com/new
2. Repository name: `8alls`
3. Description: "Personal productivity suite with unified design system"
4. Choose **Public** or **Private**
5. Do NOT initialize with README (you already have one)
6. Click "Create repository"

Then run:

```bash
# Add the remote
git remote add origin https://github.com/YOUR_USERNAME/8alls.git

# Push your code
git branch -M main
git push -u origin main
```

## Step 3: Verify Upload

Go to `https://github.com/YOUR_USERNAME/8alls` and you should see:
- ✅ All packages, apps, and mcp-servers
- ✅ README.md displayed on the homepage
- ✅ File structure visible

## Step 4: Clone on Another Machine

```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/8alls.git
cd 8alls

# Install dependencies
npm install

# Build packages
npm run build

# Run an app
cd apps/task-web
npm run dev
```

## GitHub Repository Settings

### Recommended Settings

1. **Protect main branch:**
   - Settings → Branches → Add rule for `main`
   - Require pull request reviews (if working with others)

2. **Add topics:**
   - Click ⚙️ next to "About"
   - Add topics: `monorepo`, `design-system`, `productivity`, `typescript`, `nextjs`

3. **Add .gitignore (already included):**
   - Ignores `node_modules/`, `.next/`, `dist/`, etc.

## Working with the Monorepo on GitHub

### Making Changes

```bash
# Create a new branch
git checkout -b feature/new-calendar-app

# Make your changes...

# Commit
git add .
git commit -m "Add calendar app"

# Push
git push origin feature/new-calendar-app

# Create pull request on GitHub
```

### Keeping in Sync

```bash
# Pull latest changes
git pull origin main

# Reinstall dependencies if package.json changed
npm install

# Rebuild if design tokens changed
npm run build
```

## Monorepo Best Practices on GitHub

### Commit Message Convention

```
feat(design-tokens): add new color palette
fix(api-client): handle timeout errors
docs(readme): update installation steps
chore(deps): update dependencies
```

### Branch Strategy

```
main                    # Production-ready code
├── develop            # Integration branch (optional)
├── feature/calendar   # New features
├── fix/button-style   # Bug fixes
└── chore/deps-update  # Maintenance
```

## GitHub Actions (Optional CI/CD)

Create `.github/workflows/ci.yml`:

```yaml
name: CI

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  build:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'npm'
    
    - name: Install dependencies
      run: npm install
    
    - name: Build packages
      run: npm run build
    
    - name: Lint
      run: npm run lint
```

This will automatically build and test your code on every push!

## Deployment Options

### For Web Apps (Next.js)

**Vercel (Recommended for Next.js):**
1. Connect GitHub repo to Vercel
2. Set root directory to `apps/task-web`
3. Auto-deploys on every push to main

**Netlify:**
1. Connect GitHub repo
2. Build command: `cd apps/task-web && npm run build`
3. Publish directory: `apps/task-web/.next`

### For API Backend (when you build it)

**Railway:**
1. Connect GitHub repo
2. Auto-deploy FastAPI/NestJS/Go server

**Fly.io:**
1. `flyctl launch` in your API directory
2. Connect to GitHub for auto-deploy

### For MCP Servers

These run locally, so no deployment needed! Just:
1. Clone the repo on each machine
2. Build the MCP server
3. Configure Claude Desktop/Code to use it

## Private vs Public Repository

### Public Repository (Recommended)
- ✅ Free unlimited
- ✅ Can showcase your work
- ✅ Easy to share
- ⚠️ Anyone can see your code
- ⚠️ Don't commit API keys or secrets!

### Private Repository
- ✅ Code is hidden
- ✅ Good for sensitive projects
- ✅ Free for personal use
- ⚠️ Collaborators need permission

**Important:** Use environment variables for secrets, never commit:
- API keys
- Database passwords
- Auth tokens

Add to `.gitignore`:
```
.env
.env.local
.env*.local
```

## Collaboration (If Adding Team Members Later)

```bash
# Settings → Collaborators → Add people
# They can then:
git clone https://github.com/YOUR_USERNAME/8alls.git
cd 8alls
npm install
npm run build
```

## FAQ

**Q: Should I commit node_modules/?**
A: No, already in `.gitignore`

**Q: Should I commit dist/ folders?**
A: No, already in `.gitignore`. Built on each machine.

**Q: Can I use this with multiple computers?**
A: Yes! Clone on each machine and run `npm install`

**Q: How do I keep design tokens in sync?**
A: Pull from GitHub, run `npm run build` in the root

**Q: Can I host the full-stack app?**
A: Yes! 
- Frontend: Vercel/Netlify (free)
- Backend API: Railway/Fly.io (free tier available)
- Database: Supabase/PlanetScale (free tier)

## Next Steps

1. ✅ Push to GitHub
2. Add GitHub Actions for CI (optional)
3. Deploy a web app to Vercel
4. Build your backend API
5. Set up environment variables for API keys

Your monorepo is perfectly suited for GitHub! 🎱
