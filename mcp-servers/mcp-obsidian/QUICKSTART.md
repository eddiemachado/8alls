# mcp-obsidian Quick Start Guide

## ✅ Installation Complete

The mcp-obsidian MCP server has been successfully built and is ready to use!

## 📋 Next Steps

### 1. Configure Claude Desktop

Edit your Claude Desktop configuration file:

**Path:** `~/Library/Application Support/Claude/claude_desktop_config.json`

Add this configuration:

```json
{
  "mcpServers": {
    "obsidian-8alls": {
      "command": "node",
      "args": [
        "/Users/eddiemachado/Documents/Personal/8alls/mcp-servers/mcp-obsidian/dist/index.js"
      ],
      "env": {
        "VAULT_PATH": "/path/to/your/obsidian/vault",
        "EIGHTBALLS_API_URL": "http://localhost:3000/api"
      }
    }
  }
}
```

**Important:** Replace `/path/to/your/obsidian/vault` with your actual Obsidian vault path!

### 2. Restart Claude Desktop

Completely quit Claude Desktop and reopen it to load the MCP server.

### 3. Test the Integration

In Claude Desktop, try these commands:

```
List all notes in my vault
```

```
Search my vault for "tasks"
```

```
Create today's daily note with my tasks and events
```

## 🎯 Task Syntax in Obsidian

Use this syntax in your notes:

```markdown
- [ ] #task Build authentication @high #due:2026-02-15 #project:mobile-app
- [x] #task Write docs @medium #project:website
- [ ] #task Review PRs @low
```

## 📅 Event Syntax

```markdown
- #event Team meeting @2026-02-10 14:00-15:00 #location:Office
- #event All-day conference @2026-02-15
```

## 🔧 Available Tools

Once configured in Claude Desktop, you can:

- **Search vault**: Find notes by content
- **Read/create/update notes**: Manage your Obsidian notes
- **Sync tasks**: Parse tasks from notes and sync to 8alls API
- **Generate daily notes**: Auto-create daily notes with tasks/events
- **Create tasks**: Add new tasks to notes and sync to 8alls
- **Query projects**: Get all tasks for a specific project

## 🐛 Troubleshooting

### Server not appearing in Claude Desktop

1. Check the config file path is correct
2. Ensure the `dist/index.js` path is absolute
3. Restart Claude Desktop completely

### "VAULT_PATH not found" error

- Use an absolute path (no `~` or relative paths)
- No trailing slash
- Check the directory exists and has read permissions

### Tasks not syncing

1. Verify task syntax includes `#task` marker
2. Check if 8alls API is running at `http://localhost:3000/api`
3. View Claude Desktop logs for errors

## 📚 Full Documentation

See [README.md](README.md) for complete documentation including:
- All available tools
- Detailed syntax guide
- Architecture overview
- Development guide

## 🚀 What's Next?

After getting mcp-obsidian working:

1. **Test vault operations** - Search, read, create notes
2. **Test task syncing** - Sync tasks from Obsidian to 8alls
3. **Build the central API** - If not already running
4. **Add more MCP servers** - Calendar, health, finance
5. **Build mobile apps** - iOS/Android with 8alls integration

---

**Need help?** Check the full [README.md](README.md) or the main project [PROJECT_CONTEXT.md](../../PROJECT_CONTEXT.md)
