# Deployment Guide - Fly.io + Supabase

## Architecture

- **Fly.io**: Hosts the FastAPI application (free tier)
- **Supabase**: PostgreSQL database (free tier)

This gives you better database management and flexibility.

## Part 1: Set Up Supabase Database

### Step 1: Create Supabase Account

1. Go to https://supabase.com
2. Sign up (free account)
3. Create a new project

**When prompted:**
- Project name: `8alls`
- Database password: (save this somewhere safe!)
- Region: Select closest to you

Wait 2-3 minutes for database to provision.

### Step 2: Get Database Connection String

1. In Supabase dashboard, go to **Settings** → **Database**
2. Scroll to **Connection string** → **URI**
3. Copy the connection string (looks like):
   ```
   postgresql://postgres.xxxxx:[YOUR-PASSWORD]@aws-0-us-west-1.pooler.supabase.com:6543/postgres
   ```
4. Replace `[YOUR-PASSWORD]` with your actual password
5. Save this - you'll need it for Fly.io

### Step 3: Test Connection Locally (Optional)

```bash
cd api
echo "DATABASE_URL=postgresql://postgres.xxxxx:..." > .env
source venv/bin/activate
uvicorn app.main:app --reload
```

Visit http://localhost:8000/api/tasks to verify it works.

## Part 2: Deploy to Fly.io

### Step 1: Install Fly CLI

```bash
curl -L https://fly.io/install.sh | sh
```

Add to PATH:
```bash
# Add to ~/.zshrc or ~/.bashrc
export FLYCTL_INSTALL="/Users/$USER/.fly"
export PATH="$FLYCTL_INSTALL/bin:$PATH"

# Reload
source ~/.zshrc
```

Verify:
```bash
fly version
```

### Step 2: Login

```bash
cd /Users/eddiemachado/Documents/Personal/8alls/api
fly auth login
```

### Step 3: Launch App

```bash
fly launch --no-deploy
```

**When prompted:**
- App name: `8alls-api` (or your choice)
- Region: Select closest to you (same as Supabase if possible)
- **PostgreSQL: NO** (we're using Supabase!)
- **Redis: NO**

### Step 4: Set Environment Variables

```bash
# Set your Supabase database URL
fly secrets set DATABASE_URL="postgresql://postgres.xxxxx:YOUR-PASSWORD@aws-0-us-west-1.pooler.supabase.com:6543/postgres"

# Set CORS origins
fly secrets set CORS_ORIGINS="http://localhost:3000,http://localhost:3001"
```

### Step 5: Deploy

```bash
fly deploy
```

Wait 2-3 minutes for deployment.

### Step 6: Verify

```bash
# Check status
fly status

# View logs
fly logs

# Open in browser
fly open

# Test API
curl https://8alls-api.fly.dev/health
curl https://8alls-api.fly.dev/api/tasks

# View API docs
fly open /docs
```

## Your URLs

**API:**
- Base: `https://8alls-api.fly.dev`
- Docs: `https://8alls-api.fly.dev/docs`
- Tasks: `https://8alls-api.fly.dev/api/tasks`
- Search: `https://8alls-api.fly.dev/api/search`

**Database:**
- Supabase Dashboard: https://supabase.com/dashboard
- View/edit data in the Table Editor
- Run queries in SQL Editor

## Update External Services

### External Apps (.env.local)

```bash
NEXT_PUBLIC_API_BASE_URL=https://8alls-api.fly.dev/api
```

### MCP Server (Claude Desktop config)

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

## Ongoing Deployments

```bash
cd api
fly deploy
```

That's it!

## Manage Database (Supabase)

**View Tables:**
1. Go to Supabase dashboard
2. Click **Table Editor**
3. See all your tasks, events, etc.

**Run SQL Queries:**
1. Go to **SQL Editor**
2. Write and run queries
3. Much easier than command line!

**Create Backups:**
1. Go to **Settings** → **Database**
2. Click **Create backup**

**View API Logs:**
- Fly.io: `fly logs`
- Supabase: Dashboard → Logs

## Useful Commands

### Fly.io

```bash
# View logs
fly logs

# View status
fly status

# Restart app
fly apps restart 8alls-api

# SSH into machine
fly ssh console

# View secrets
fly secrets list

# Update secret
fly secrets set DATABASE_URL="new-url"

# Scale
fly scale memory 512  # Increase RAM
```

### Supabase

```bash
# Install Supabase CLI (optional)
npm install -g supabase

# Link project
supabase link --project-ref YOUR-PROJECT-REF

# Pull schema
supabase db pull

# Push migrations
supabase db push
```

## Costs

### Supabase (Free Tier)
- 500MB database storage
- Unlimited API requests
- 50,000 monthly active users
- 2GB bandwidth

**Your usage:** ~10MB
**Cost:** $0/month

### Fly.io (Free Tier)
- 3 shared-cpu VMs (256MB each)
- 160GB bandwidth/month
- Unlimited requests

**Your usage:** 1 VM (256MB)
**Cost:** $0/month

**Total: $0/month**

## Architecture Benefits

**Why Supabase + Fly.io?**
1. **Better database UI** - View/edit data easily
2. **Database independence** - Can switch hosting providers
3. **Easy backups** - One-click backups in Supabase
4. **Real-time potential** - Supabase has real-time features
5. **Future-proof** - Can add Supabase auth, storage, etc.

## Troubleshooting

**Can't connect to database:**
```bash
# Test connection string locally
psql "postgresql://postgres.xxxxx:..."

# Check Supabase is running
# Go to dashboard → Should say "Healthy"

# Check Fly.io logs
fly logs
```

**Build fails:**
```bash
fly logs
# Look for errors
```

**App not responding:**
```bash
fly status
fly apps restart 8alls-api
```

## Security Best Practices

1. **Never commit DATABASE_URL** - Use `.env` locally, `fly secrets` for production
2. **Use strong database password** - Supabase generates one
3. **Restrict CORS** - Only allow your actual app domains
4. **Consider API keys** - Add authentication middleware
5. **Enable Row Level Security** - In Supabase (advanced)

## Next Steps

1. ✅ Deploy API to Fly.io
2. ✅ Connect to Supabase database
3. Create external app (8alls-task-web)
4. Update MCP server to use production URL
5. Add more endpoints (calendar, health, finance)
6. Add authentication

## GitHub Actions (Optional)

Auto-deploy on push:

**.github/workflows/deploy-api.yml:**
```yaml
name: Deploy API to Fly.io
on:
  push:
    branches: [main, master]
    paths:
      - 'api/**'
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: superfly/flyctl-actions/setup-flyctl@master
      - run: flyctl deploy --remote-only
        working-directory: ./api
        env:
          FLY_API_TOKEN: ${{ secrets.FLY_API_TOKEN }}
```

Get token: `fly auth token`
Add to GitHub Secrets as `FLY_API_TOKEN`

---

**Resources:**
- Fly.io Docs: https://fly.io/docs
- Supabase Docs: https://supabase.com/docs
- FastAPI Docs: https://fastapi.tiangolo.com
