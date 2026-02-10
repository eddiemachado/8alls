# @8alls/mcp-obsidian

MCP server for integrating Obsidian vaults with the 8alls productivity suite.

## Overview

This Model Context Protocol (MCP) server enables Claude to interact with your Obsidian vault and sync data with the 8alls API. It provides tools for:

- **Vault Operations**: Search, read, create, update, and list notes
- **Task Management**: Parse tasks from notes and sync to 8alls API
- **Daily Notes**: Auto-generate daily notes with tasks and events
- **Project Tracking**: Query and organize tasks by project

## Quick Start

### 1. Build the Server

```bash
cd mcp-servers/mcp-obsidian
npm install
npm run build
```

### 2. Configure Claude Desktop

Edit `~/Library/Application Support/Claude/claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "obsidian-8alls": {
      "command": "node",
      "args": [
        "/Users/YOUR_USERNAME/Documents/Personal/8alls/mcp-servers/mcp-obsidian/dist/index.js"
      ],
      "env": {
        "VAULT_PATH": "/Users/YOUR_USERNAME/Documents/YOUR_VAULT",
        "EIGHTBALLS_API_URL": "http://localhost:3000/api"
      }
    }
  }
}
```

**Environment Variables:**
- `VAULT_PATH` (required): Absolute path to your Obsidian vault
- `EIGHTBALLS_API_URL` (optional): API endpoint (default: `http://localhost:3000/api`)
- `EIGHTBALLS_API_KEY` (optional): API key for authentication

### 3. Restart Claude Desktop

Quit and reopen Claude Desktop to load the MCP server.

### 4. Test It

In Claude Desktop, try:
```
List all notes in my vault
```

## Task Syntax

Tasks in your Obsidian notes use a special syntax:

```markdown
- [ ] #task Title @priority #due:YYYY-MM-DD #project:name #tag:value
```

### Examples

```markdown
- [ ] #task Build authentication system @high #due:2026-02-15 #project:mobile-app
- [x] #task Write documentation @medium #project:website #tag:urgent
- [ ] #task Review pull requests @low
```

### Task Components

| Component | Syntax | Required | Example |
|-----------|--------|----------|---------|
| Marker | `#task` | Yes | `#task` |
| Checkbox | `- [ ]` or `- [x]` | Yes | `- [x]` |
| Title | Plain text | Yes | `Build auth system` |
| Priority | `@low`, `@medium`, `@high` | No (default: medium) | `@high` |
| Due Date | `#due:YYYY-MM-DD` | No | `#due:2026-02-20` |
| Project | `#project:name` | No | `#project:mobile-app` |
| Tags | `#tag:value` | No | `#tag:urgent` |

## Event Syntax

Events use a similar syntax:

```markdown
- #event Title @YYYY-MM-DD HH:MM-HH:MM #location:Office
```

### Examples

```markdown
- #event Team meeting @2026-02-10 14:00-15:00 #location:Office
- #event All-day conference @2026-02-15 #location:Convention-Center
- #event Dentist appointment @2026-02-12 10:30-11:30
```

## Available Tools

### Vault Operations

#### `search_vault`
Search for notes in the Obsidian vault.

```typescript
{
  query: string,      // Search query
  folder?: string     // Limit search to specific folder (optional)
}
```

**Example:**
```
Search my vault for notes about "authentication"
```

#### `read_note`
Read the contents of a specific note.

```typescript
{
  path: string        // Path to the note (relative to vault root)
}
```

**Example:**
```
Read the note at "Projects/Mobile App.md"
```

#### `create_note`
Create a new note in the vault.

```typescript
{
  path: string,       // Path for the new note
  content: string     // Content of the note
}
```

**Example:**
```
Create a new note at "Daily Notes/2026-02-10.md" with today's tasks
```

#### `update_note`
Update an existing note.

```typescript
{
  path: string,       // Path to the note
  content: string     // New content for the note
}
```

#### `append_to_note`
Append content to an existing note.

```typescript
{
  path: string,       // Path to the note
  content: string     // Content to append
}
```

**Example:**
```
Add a new task to my "Projects/Website.md" note
```

#### `list_notes`
List all notes in a folder.

```typescript
{
  folder?: string     // Folder path (optional, defaults to root)
}
```

**Example:**
```
List all notes in my "Daily Notes" folder
```

### 8alls Integration

#### `sync_tasks_from_note`
Parse tasks from a note and sync to 8alls API.

```typescript
{
  path: string        // Path to the note file
}
```

**Example:**
```
Sync all tasks from "Projects/Mobile App.md" to 8alls
```

#### `create_daily_note_with_tasks`
Create a daily note populated with tasks and events from 8alls.

```typescript
{
  date?: string,      // Date in YYYY-MM-DD format (defaults to today)
  path?: string       // Path for the daily note (defaults to Daily Notes/YYYY-MM-DD.md)
}
```

**Example:**
```
Create today's daily note with my tasks and events
```

#### `create_task_from_note`
Create a new task in 8alls and add it to a note.

```typescript
{
  title: string,
  priority: 'low' | 'medium' | 'high',
  dueDate?: string,   // YYYY-MM-DD (optional)
  notePath: string,   // Path to note to add task to
  project?: string    // Project tag (optional)
}
```

**Example:**
```
Create a high priority task "Review API design" due 2026-02-15 in my "Projects/Backend.md" note
```

#### `get_tasks_for_project`
Get all tasks from 8alls tagged with a specific project.

```typescript
{
  project: string     // Project name/tag
}
```

**Example:**
```
Show me all tasks for the "mobile-app" project
```

## Usage Examples

### Example 1: Creating a Project Note

```
Create a new note at "Projects/Mobile App.md" with:
- A project overview
- Three high-priority tasks for authentication
- A section for meeting notes
```

Claude will:
1. Create the note with proper structure
2. Add tasks with `#task` syntax
3. Include project tags

### Example 2: Daily Note Workflow

```
Create today's daily note with all my tasks and events
```

Claude will:
1. Fetch tasks due today from 8alls API
2. Fetch events scheduled for today
3. Generate a formatted daily note
4. Save it to `Daily Notes/YYYY-MM-DD.md`

### Example 3: Project Task Review

```
Show me all tasks for the "website" project and create a summary note
```

Claude will:
1. Query 8alls API for project tasks
2. Analyze task status and priorities
3. Create a summary note with task breakdown

## Sync Strategy

### One-Way Sync (Obsidian → 8alls)

Currently, the MCP server supports **one-way sync** from Obsidian to 8alls:

1. **Initial Sync**: Tasks are parsed and created in 8alls API
2. **Tracking**: Task IDs are stored in note frontmatter
3. **Updates**: When syncing again, existing tasks are updated

**Note Frontmatter:**
```yaml
---
tasks:
  5: "task-id-abc-123"
  12: "task-id-def-456"
events:
  8: "event-id-xyz-789"
---
```

The line numbers map to task/event IDs for future updates.

### Future: Bidirectional Sync

Future versions will support:
- API → Obsidian sync
- Conflict resolution
- File watching for automatic sync

## File Structure

```
mcp-servers/mcp-obsidian/
├── src/
│   ├── api/
│   │   └── types.ts           # Type definitions
│   ├── parsers/
│   │   ├── task-parser.ts     # Task syntax parser
│   │   └── event-parser.ts    # Event syntax parser
│   ├── sync/
│   │   └── sync-manager.ts    # Sync orchestration
│   └── index.ts               # MCP server entry point
├── dist/                      # Build output
├── package.json
├── tsconfig.json
└── README.md
```

## Development

### Build

```bash
npm run build
```

### Watch Mode

```bash
npm run dev
```

### Test with MCP Inspector

```bash
npm run inspector
```

The inspector provides a UI for testing MCP tools without Claude Desktop.

## Troubleshooting

### "Cannot find module @8alls/api-client"

The API client dependency needs to be built:

```bash
cd ../../packages/api-client
npm run build
cd ../../mcp-servers/mcp-obsidian
npm install
```

### "VAULT_PATH not found"

Ensure your Claude Desktop config has the correct absolute path:

```json
{
  "env": {
    "VAULT_PATH": "/Users/YOUR_USERNAME/Documents/YOUR_VAULT"
  }
}
```

- Use absolute paths (no `~` or relative paths)
- No trailing slash
- Check file system permissions

### "Tasks not syncing"

1. **Verify task syntax**: Must include `#task` marker
   ```markdown
   - [ ] #task Title @priority
   ```

2. **Check API connection**:
   ```bash
   curl http://localhost:3000/api/tasks
   ```

3. **View server logs**: Check Claude Desktop logs for errors

### "Cannot read note"

- Verify the note path is relative to vault root
- Check file extension (must be `.md`)
- Ensure note exists and has read permissions

## Architecture

### Parser Layer

**TaskParser** and **EventParser** convert markdown syntax to structured data:

```typescript
// Input
"- [ ] #task Review code @high #due:2026-02-15"

// Output
{
  completed: false,
  title: "Review code",
  priority: "high",
  dueDate: "2026-02-15",
  lineNumber: 5
}
```

### Sync Layer

**SyncManager** orchestrates sync between Obsidian and 8alls API:

1. Parse note content
2. Check frontmatter for existing IDs
3. Create or update tasks/events
4. Store IDs in frontmatter for future updates

### MCP Layer

**Server** exposes tools to Claude via Model Context Protocol:

- Handles tool requests
- Manages file operations
- Coordinates parsers and sync manager

## Integration with 8alls Ecosystem

### API Client

Uses `@8alls/api-client` for all API communication:

```typescript
import { createApiClient } from '@8alls/api-client';

const apiClient = createApiClient({
  baseURL: 'http://localhost:3000/api',
  apiKey: process.env.API_KEY,
});
```

### Design System

Future UI components (Obsidian plugin) will use `@8alls/design-tokens`.

### Task Web App

Tasks synced from Obsidian appear in the task web app (`apps/task-web`).

## Roadmap

### Phase 2: Bidirectional Sync
- [ ] API → Obsidian sync
- [ ] File watcher for automatic syncing
- [ ] Conflict resolution strategy

### Phase 3: Advanced Features
- [ ] Template system for note generation
- [ ] Tag-based queries and filtering
- [ ] Graph view integration
- [ ] Batch operations

### Phase 4: Obsidian Plugin
- [ ] Native Obsidian plugin UI
- [ ] Settings panel
- [ ] Sync status indicators
- [ ] Command palette integration

## Contributing

This is part of the 8alls monorepo. See the main repo README for contribution guidelines.

## License

MIT

## Support

- **Issues**: https://github.com/YOUR_USERNAME/8alls/issues
- **Docs**: See `PROJECT_CONTEXT.md` in repo root
- **MCP Docs**: https://modelcontextprotocol.io

---

**Built with:**
- Model Context Protocol (MCP)
- TypeScript
- Node.js
- Obsidian markdown format
- 8alls API Client
