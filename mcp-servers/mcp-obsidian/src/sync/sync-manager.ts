/**
 * Sync manager - orchestrates syncing between Obsidian and 8alls API
 */

import { ApiClient } from '@8alls/api-client';
import { TaskParser } from '../parsers/task-parser.js';
import { ParsedTask } from '../api/types.js';
import { EventParser } from '../parsers/event-parser.js';
import { ParsedEvent } from '../api/types.js';
import matter from 'gray-matter';

export class SyncManager {
  constructor(
    private apiClient: ApiClient,
    private taskParser: TaskParser,
    private eventParser: EventParser
  ) {}

  async syncNoteToApi(notePath: string, noteContent: string): Promise<{
    tasksSynced: number;
    eventsSynced: number;
  }> {
    // Parse frontmatter to check if we've synced before
    const { data: frontmatter, content } = matter(noteContent);

    // Parse tasks from note
    const parsedTasks = this.taskParser.parseNote(content);
    let tasksSynced = 0;

    for (const task of parsedTasks) {
      // Check if task already has an ID in frontmatter
      const existingTaskId = frontmatter.tasks?.[task.lineNumber];

      if (existingTaskId) {
        // Update existing task
        await this.apiClient.updateTask(existingTaskId, {
          title: task.title,
          completed: task.completed,
          priority: task.priority,
          dueDate: task.dueDate,
          tags: task.tags,
        });
      } else {
        // Create new task
        const createdTask = await this.apiClient.createTask({
          title: task.title,
          completed: task.completed,
          priority: task.priority,
          dueDate: task.dueDate,
          tags: task.tags,
          description: `From note: ${notePath}`,
        });

        // Store task ID in frontmatter for future updates
        if (!frontmatter.tasks) frontmatter.tasks = {};
        frontmatter.tasks[task.lineNumber] = createdTask.id;
      }

      tasksSynced++;
    }

    // Parse events from note
    const parsedEvents = this.eventParser.parseNote(content);
    let eventsSynced = 0;

    for (const event of parsedEvents) {
      const existingEventId = frontmatter.events?.[event.lineNumber];

      if (!existingEventId) {
        const createdEvent = await this.apiClient.createEvent({
          title: event.title,
          start_time: event.startDate,
          end_time: event.endDate,
          all_day: event.allDay,
          location: event.location,
          status: 'confirmed',
        });

        if (!frontmatter.events) frontmatter.events = {};
        frontmatter.events[event.lineNumber] = createdEvent.id;
      }

      eventsSynced++;
    }

    return { tasksSynced, eventsSynced };
  }

  async generateDailyNote(date?: string): Promise<string> {
    const targetDate = date || new Date().toISOString().split('T')[0];

    // Fetch tasks for today
    const allTasks = await this.apiClient.getTasks();
    const todaysTasks = allTasks.filter(task =>
      task.dueDate?.startsWith(targetDate)
    );

    // Fetch events for today
    const allEvents = await this.apiClient.getEvents({
      start_date: targetDate,
      end_date: targetDate,
    });

    // Generate note content
    let content = `# Daily Note - ${targetDate}\n\n`;

    content += `## Today's Tasks\n`;
    for (const task of todaysTasks) {
      const checkbox = task.completed ? 'x' : ' ';
      content += `- [${checkbox}] #task ${task.title} @${task.priority}\n`;
    }

    content += `\n## Calendar\n`;
    for (const event of allEvents) {
      const time = event.all_day ? 'All day' :
        `${event.start_time.split('T')[1]?.slice(0, 5)} - ${event.end_time.split('T')[1]?.slice(0, 5)}`;
      content += `- ${time}: ${event.title}\n`;
    }

    content += `\n## Notes\n\n`;
    content += `## Completed\n<!-- Tasks moved here when checked -->\n`;

    return content;
  }
}
