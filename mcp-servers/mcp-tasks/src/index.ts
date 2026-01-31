#!/usr/bin/env node

/**
 * 8alls MCP Server - Tasks
 * 
 * Provides task management tools for Claude Code and other MCP clients.
 */

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import { createApiClient } from '@8alls/api-client';

// Initialize API client
const api = createApiClient({
  baseURL: process.env.API_BASE_URL || 'http://localhost:3000/api',
  apiKey: process.env.API_KEY,
});

// Create MCP server
const server = new Server(
  {
    name: '8alls-tasks',
    version: '1.0.0',
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// List available tools
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: 'list_tasks',
        description: 'List all tasks',
        inputSchema: {
          type: 'object',
          properties: {},
        },
      },
      {
        name: 'get_task',
        description: 'Get a specific task by ID',
        inputSchema: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              description: 'Task ID',
            },
          },
          required: ['id'],
        },
      },
      {
        name: 'create_task',
        description: 'Create a new task',
        inputSchema: {
          type: 'object',
          properties: {
            title: {
              type: 'string',
              description: 'Task title',
            },
            description: {
              type: 'string',
              description: 'Task description (optional)',
            },
            priority: {
              type: 'string',
              enum: ['low', 'medium', 'high'],
              description: 'Task priority',
            },
            dueDate: {
              type: 'string',
              description: 'Due date in ISO format (optional)',
            },
            tags: {
              type: 'array',
              items: { type: 'string' },
              description: 'Task tags (optional)',
            },
          },
          required: ['title', 'priority'],
        },
      },
      {
        name: 'update_task',
        description: 'Update an existing task',
        inputSchema: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              description: 'Task ID',
            },
            title: {
              type: 'string',
              description: 'New task title (optional)',
            },
            description: {
              type: 'string',
              description: 'New task description (optional)',
            },
            completed: {
              type: 'boolean',
              description: 'Task completion status (optional)',
            },
            priority: {
              type: 'string',
              enum: ['low', 'medium', 'high'],
              description: 'New task priority (optional)',
            },
            dueDate: {
              type: 'string',
              description: 'New due date in ISO format (optional)',
            },
          },
          required: ['id'],
        },
      },
      {
        name: 'delete_task',
        description: 'Delete a task',
        inputSchema: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              description: 'Task ID',
            },
          },
          required: ['id'],
        },
      },
      {
        name: 'search_tasks',
        description: 'Search tasks by query',
        inputSchema: {
          type: 'object',
          properties: {
            query: {
              type: 'string',
              description: 'Search query',
            },
          },
          required: ['query'],
        },
      },
    ],
  };
});

// Handle tool calls
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  // Ensure args is defined
  const toolArgs = args || {};

  try {
    switch (name) {
      case 'list_tasks': {
        const tasks = await api.getTasks();
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(tasks, null, 2),
            },
          ],
        };
      }

      case 'get_task': {
        const task = await api.getTask(toolArgs.id as string);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(task, null, 2),
            },
          ],
        };
      }

      case 'create_task': {
        const newTask = await api.createTask({
          title: toolArgs.title as string,
          description: toolArgs.description as string | undefined,
          completed: false,
          priority: toolArgs.priority as 'low' | 'medium' | 'high',
          dueDate: toolArgs.dueDate as string | undefined,
          tags: toolArgs.tags as string[] | undefined,
        });
        return {
          content: [
            {
              type: 'text',
              text: `Task created successfully!\n\n${JSON.stringify(newTask, null, 2)}`,
            },
          ],
        };
      }

      case 'update_task': {
        const updatedTask = await api.updateTask(toolArgs.id as string, {
          title: toolArgs.title as string | undefined,
          description: toolArgs.description as string | undefined,
          completed: toolArgs.completed as boolean | undefined,
          priority: toolArgs.priority as 'low' | 'medium' | 'high' | undefined,
          dueDate: toolArgs.dueDate as string | undefined,
        });
        return {
          content: [
            {
              type: 'text',
              text: `Task updated successfully!\n\n${JSON.stringify(updatedTask, null, 2)}`,
            },
          ],
        };
      }

      case 'delete_task': {
        await api.deleteTask(toolArgs.id as string);
        return {
          content: [
            {
              type: 'text',
              text: `Task ${toolArgs.id} deleted successfully!`,
            },
          ],
        };
      }

      case 'search_tasks': {
        const results = await api.search(toolArgs.query as string);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(results, null, 2),
            },
          ],
        };
      }

      default:
        throw new Error(`Unknown tool: ${name}`);
    }
  } catch (error) {
    return {
      content: [
        {
          type: 'text',
          text: `Error: ${error instanceof Error ? error.message : String(error)}`,
        },
      ],
      isError: true,
    };
  }
});

// Start server
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error('8alls MCP Tasks server running on stdio');
}

main().catch((error) => {
  console.error('Server error:', error);
  process.exit(1);
});
