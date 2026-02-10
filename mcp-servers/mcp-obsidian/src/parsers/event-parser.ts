/**
 * Parser for event syntax in Obsidian notes
 *
 * Syntax: - #event Title @YYYY-MM-DD HH:MM-HH:MM #location:Office
 */

import { ParsedEvent } from '../api/types.js';

export class EventParser {
  parseEventLine(line: string, lineNumber: number): ParsedEvent | null {
    // Match: - #event Meeting @2026-02-05 14:00-15:00 #location:Office
    const eventRegex = /^-\s*#event\s+(.+)$/i;
    const match = line.match(eventRegex);

    if (!match) return null;

    const rest = match[1];

    // Extract date/time: @2026-02-05 14:00-15:00 or @2026-02-05 (all day)
    const dateTimeMatch = rest.match(/@(\d{4}-\d{2}-\d{2})(?:\s+(\d{2}:\d{2})-(\d{2}:\d{2}))?/);
    if (!dateTimeMatch) return null;

    const date = dateTimeMatch[1];
    const startTime = dateTimeMatch[2];
    const endTime = dateTimeMatch[3];

    const allDay = !startTime;
    const startDate = allDay ? date : `${date}T${startTime}:00`;
    const endDate = allDay ? date : `${date}T${endTime}:00`;

    // Extract location: #location:Office
    const locationMatch = rest.match(/#location:([\w\s-]+)/);
    const location = locationMatch?.[1];

    // Title is everything minus the special syntax
    const title = rest
      .replace(/@\d{4}-\d{2}-\d{2}(?:\s+\d{2}:\d{2}-\d{2}:\d{2})?/g, '')
      .replace(/#location:[\w\s-]+/g, '')
      .trim();

    return {
      title,
      startDate,
      endDate,
      allDay,
      location,
      lineNumber,
    };
  }

  parseNote(content: string): ParsedEvent[] {
    const lines = content.split('\n');
    const events: ParsedEvent[] = [];

    lines.forEach((line, index) => {
      const event = this.parseEventLine(line, index);
      if (event) {
        events.push(event);
      }
    });

    return events;
  }
}
