#!/usr/bin/env node

/**
 * 8alls MCP Server - Obsidian Integration
 *
 * Integrates Obsidian vault with 8alls API for task/event syncing
 * and AI-powered knowledge management.
 */

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import { createApiClient } from '@8alls/api-client';
import { TaskParser } from './parsers/task-parser.js';
import { EventParser } from './parsers/event-parser.js';
import { SyncManager } from './sync/sync-manager.js';
import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration from environment
const VAULT_PATH = process.env.VAULT_PATH || process.env.OBSIDIAN_VAULT_PATH;
const API_BASE_URL = process.env.EIGHTBALLS_API_URL || process.env.API_BASE_URL || 'http://localhost:3000/api';
const API_KEY = process.env.EIGHTBALLS_API_KEY || process.env.API_KEY;

if (!VAULT_PATH) {
  console.error('Error: VAULT_PATH environment variable is required');
  process.exit(1);
}

// Initialize 8alls API client
const apiClient = createApiClient({
  baseURL: API_BASE_URL,
  apiKey: API_KEY,
});

// Initialize parsers and sync manager
const taskParser = new TaskParser();
const eventParser = new EventParser();
const syncManager = new SyncManager(apiClient, taskParser, eventParser);

// Create MCP server
const server = new Server(
  {
    name: '8alls-obsidian',
    version: '1.0.0',
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// Helper functions for file operations
async function searchVault(query: string, folder?: string): Promise<string[]> {
  if (!VAULT_PATH) throw new Error('VAULT_PATH not configured');
  const searchPath = folder ? path.join(VAULT_PATH, folder) : VAULT_PATH;
  const results: string[] = [];

  async function searchDir(dir: string) {
    const entries = await fs.readdir(dir, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);

      if (entry.isDirectory()) {
        await searchDir(fullPath);
      } else if (entry.name.endsWith('.md')) {
        const content = await fs.readFile(fullPath, 'utf-8');
        if (content.toLowerCase().includes(query.toLowerCase())) {
          if (!VAULT_PATH) throw new Error('VAULT_PATH not configured');
          results.push(path.relative(VAULT_PATH, fullPath));
        }
      }
    }
  }

  await searchDir(searchPath);
  return results;
}

async function listNotes(folder?: string): Promise<string[]> {
  if (!VAULT_PATH) throw new Error('VAULT_PATH not configured');
  const searchPath = folder ? path.join(VAULT_PATH, folder) : VAULT_PATH;
  const results: string[] = [];

  async function listDir(dir: string) {
    const entries = await fs.readdir(dir, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);

      if (entry.isDirectory()) {
        await listDir(fullPath);
      } else if (entry.name.endsWith('.md')) {
        if (!VAULT_PATH) throw new Error('VAULT_PATH not configured');
        results.push(path.relative(VAULT_PATH, fullPath));
      }
    }
  }

  await listDir(searchPath);
  return results;
}

// List available tools
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      // Vault operations
      {
        name: 'search_vault',
        description: 'Search for notes in the Obsidian vault',
        inputSchema: {
          type: 'object',
          properties: {
            query: {
              type: 'string',
              description: 'Search query',
            },
            folder: {
              type: 'string',
              description: 'Limit search to specific folder (optional)',
            },
          },
          required: ['query'],
        },
      },
      {
        name: 'read_note',
        description: 'Read the contents of a specific note',
        inputSchema: {
          type: 'object',
          properties: {
            path: {
              type: 'string',
              description: 'Path to the note (relative to vault root)',
            },
          },
          required: ['path'],
        },
      },
      {
        name: 'create_note',
        description: 'Create a new note in the vault',
        inputSchema: {
          type: 'object',
          properties: {
            path: {
              type: 'string',
              description: 'Path for the new note (relative to vault root)',
            },
            content: {
              type: 'string',
              description: 'Content of the note',
            },
          },
          required: ['path', 'content'],
        },
      },
      {
        name: 'update_note',
        description: 'Update an existing note',
        inputSchema: {
          type: 'object',
          properties: {
            path: {
              type: 'string',
              description: 'Path to the note',
            },
            content: {
              type: 'string',
              description: 'New content for the note',
            },
          },
          required: ['path', 'content'],
        },
      },
      {
        name: 'append_to_note',
        description: 'Append content to an existing note',
        inputSchema: {
          type: 'object',
          properties: {
            path: {
              type: 'string',
              description: 'Path to the note',
            },
            content: {
              type: 'string',
              description: 'Content to append',
            },
          },
          required: ['path', 'content'],
        },
      },
      {
        name: 'list_notes',
        description: 'List all notes in a folder',
        inputSchema: {
          type: 'object',
          properties: {
            folder: {
              type: 'string',
              description: 'Folder path (optional, defaults to root)',
            },
          },
        },
      },

      // 8alls Integration tools
      {
        name: 'sync_tasks_from_note',
        description: 'Parse tasks from a note and sync to 8alls API',
        inputSchema: {
          type: 'object',
          properties: {
            path: {
              type: 'string',
              description: 'Path to the note file',
            },
          },
          required: ['path'],
        },
      },
      {
        name: 'create_daily_note_with_tasks',
        description: 'Create a daily note populated with tasks and events from 8alls',
        inputSchema: {
          type: 'object',
          properties: {
            date: {
              type: 'string',
              description: 'Date in YYYY-MM-DD format (defaults to today)',
            },
            path: {
              type: 'string',
              description: 'Path where to create the daily note (defaults to Daily Notes/YYYY-MM-DD.md)',
            },
          },
        },
      },
      {
        name: 'create_task_from_note',
        description: 'Create a new task in 8alls and add it to a note',
        inputSchema: {
          type: 'object',
          properties: {
            title: {
              type: 'string',
              description: 'Task title',
            },
            priority: {
              type: 'string',
              enum: ['low', 'medium', 'high'],
              description: 'Task priority',
            },
            dueDate: {
              type: 'string',
              description: 'Due date (YYYY-MM-DD, optional)',
            },
            notePath: {
              type: 'string',
              description: 'Path to note to add task to',
            },
            project: {
              type: 'string',
              description: 'Project tag (optional)',
            },
          },
          required: ['title', 'priority', 'notePath'],
        },
      },
      {
        name: 'get_tasks_for_project',
        description: 'Get all tasks from 8alls tagged with a specific project',
        inputSchema: {
          type: 'object',
          properties: {
            project: {
              type: 'string',
              description: 'Project name/tag',
            },
          },
          required: ['project'],
        },
      },
    ],
  };
});

// Handle tool calls
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  if (!VAULT_PATH) {
    return {
      content: [{
        type: 'text',
        text: 'Error: VAULT_PATH not configured',
      }],
      isError: true,
    };
  }

  if (!args) {
    return {
      content: [{
        type: 'text',
        text: 'Error: No arguments provided',
      }],
      isError: true,
    };
  }

  try {
    switch (name) {
      case 'search_vault': {
        const results = await searchVault(args.query as string, args.folder as string | undefined);
        return {
          content: [{
            type: 'text',
            text: `Found ${results.length} notes:\n${results.join('\n')}`,
          }],
        };
      }

      case 'read_note': {
        const fullPath = path.join(VAULT_PATH, args.path as string);
        const content = await fs.readFile(fullPath, 'utf-8');
        return {
          content: [{
            type: 'text',
            text: content,
          }],
        };
      }

      case 'create_note': {
        const fullPath = path.join(VAULT_PATH, args.path as string);
        await fs.mkdir(path.dirname(fullPath), { recursive: true });
        await fs.writeFile(fullPath, args.content as string, 'utf-8');
        return {
          content: [{
            type: 'text',
            text: `Created note at ${args.path}`,
          }],
        };
      }

      case 'update_note': {
        const fullPath = path.join(VAULT_PATH, args.path as string);
        await fs.writeFile(fullPath, args.content as string, 'utf-8');
        return {
          content: [{
            type: 'text',
            text: `Updated note at ${args.path}`,
          }],
        };
      }

      case 'append_to_note': {
        const fullPath = path.join(VAULT_PATH, args.path as string);
        await fs.appendFile(fullPath, args.content as string, 'utf-8');
        return {
          content: [{
            type: 'text',
            text: `Appended to note at ${args.path}`,
          }],
        };
      }

      case 'list_notes': {
        const results = await listNotes(args.folder as string | undefined);
        return {
          content: [{
            type: 'text',
            text: `Found ${results.length} notes:\n${results.join('\n')}`,
          }],
        };
      }

      case 'sync_tasks_from_note': {
        const fullPath = path.join(VAULT_PATH, args.path as string);
        const content = await fs.readFile(fullPath, 'utf-8');
        const result = await syncManager.syncNoteToApi(args.path as string, content);

        return {
          content: [{
            type: 'text',
            text: `Synced ${result.tasksSynced} tasks and ${result.eventsSynced} events to 8alls API`,
          }],
        };
      }

      case 'create_daily_note_with_tasks': {
        const noteContent = await syncManager.generateDailyNote(args.date as string | undefined);
        const date = (args.date as string | undefined) || new Date().toISOString().split('T')[0];
        const notePath = (args.path as string) || `Daily Notes/${date}.md`;
        const fullPath = path.join(VAULT_PATH, notePath);

        await fs.mkdir(path.dirname(fullPath), { recursive: true });
        await fs.writeFile(fullPath, noteContent, 'utf-8');

        return {
          content: [{
            type: 'text',
            text: `Created daily note at ${notePath}`,
          }],
        };
      }

      case 'create_task_from_note': {
        const task = await apiClient.createTask({
          title: args.title as string,
          priority: args.priority as 'low' | 'medium' | 'high',
          dueDate: args.dueDate as string | undefined,
          completed: false,
          tags: args.project ? [args.project as string] : [],
        });

        // Append task to note
        const fullPath = path.join(VAULT_PATH, args.notePath as string);
        const taskLine = `\n- [ ] #task ${args.title} @${args.priority}${args.dueDate ? ` #due:${args.dueDate}` : ''}${args.project ? ` #project:${args.project}` : ''}\n`;
        await fs.appendFile(fullPath, taskLine, 'utf-8');

        return {
          content: [{
            type: 'text',
            text: `Created task "${args.title}" (ID: ${task.id}) and added to ${args.notePath}`,
          }],
        };
      }

      case 'get_tasks_for_project': {
        const allTasks = await apiClient.getTasks();
        const projectTasks = allTasks.filter(task =>
          task.tags?.includes(args.project as string)
        );

        return {
          content: [{
            type: 'text',
            text: JSON.stringify(projectTasks, null, 2),
          }],
        };
      }

      default:
        throw new Error(`Unknown tool: ${name}`);
    }
  } catch (error) {
    return {
      content: [{
        type: 'text',
        text: `Error: ${error instanceof Error ? error.message : String(error)}`,
      }],
      isError: true,
    };
  }
});

// Start server
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error('8alls MCP Obsidian server running on stdio');
}

main().catch((error) => {
  console.error('Server error:', error);
  process.exit(1);
});
