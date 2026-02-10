/**
 * Parser for task syntax in Obsidian notes
 *
 * Syntax: - [ ] #task Title @priority #due:YYYY-MM-DD #project:name #tag:value
 */

import { ParsedTask } from '../api/types.js';

export class TaskParser {
  parseTaskLine(line: string, lineNumber: number): ParsedTask | null {
    // Regex to match: - [ ] #task Title @priority #due:date #project:name #tag:value
    const taskRegex = /^-\s*\[([ x])\]\s*#task\s+(.+)$/i;
    const match = line.match(taskRegex);

    if (!match) return null;

    const completed = match[1].toLowerCase() === 'x';
    const rest = match[2];

    // Extract priority: @high, @medium, @low
    const priorityMatch = rest.match(/@(high|medium|low)/i);
    const priority = (priorityMatch?.[1]?.toLowerCase() as 'high' | 'medium' | 'low') || 'medium';

    // Extract due date: #due:2026-02-05
    const dueDateMatch = rest.match(/#due:(\d{4}-\d{2}-\d{2})/);
    const dueDate = dueDateMatch?.[1];

    // Extract project: #project:mobile-app
    const projectMatch = rest.match(/#project:([\w-]+)/);
    const project = projectMatch?.[1];

    // Extract other tags: #tag:value
    const tags: string[] = [];
    const tagMatches = rest.matchAll(/#tag:([\w-]+)/g);
    for (const match of tagMatches) {
      tags.push(match[1]);
    }

    // Title is everything minus the special syntax
    const title = rest
      .replace(/@(high|medium|low)/gi, '')
      .replace(/#due:\d{4}-\d{2}-\d{2}/g, '')
      .replace(/#project:[\w-]+/g, '')
      .replace(/#tag:[\w-]+/g, '')
      .trim();

    return {
      rawText: line,
      completed,
      title,
      priority,
      dueDate,
      tags,
      project,
      lineNumber,
    };
  }

  parseNote(content: string): ParsedTask[] {
    const lines = content.split('\n');
    const tasks: ParsedTask[] = [];

    lines.forEach((line, index) => {
      const task = this.parseTaskLine(line, index);
      if (task) {
        tasks.push(task);
      }
    });

    return tasks;
  }
}
