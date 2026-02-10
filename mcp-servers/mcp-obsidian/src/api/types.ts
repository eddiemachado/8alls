/**
 * Type definitions shared between MCP server and 8alls API
 */

export interface Task {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  dueDate?: string;
  tags?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface CalendarEvent {
  id: string;
  title: string;
  description?: string;
  startDate: string;
  endDate: string;
  allDay: boolean;
  location?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ParsedTask {
  rawText: string;
  completed: boolean;
  title: string;
  priority: 'low' | 'medium' | 'high';
  dueDate?: string;
  tags: string[];
  project?: string;
  lineNumber: number;
}

export interface ParsedEvent {
  title: string;
  startDate: string;
  endDate: string;
  allDay: boolean;
  location?: string;
  lineNumber: number;
}
