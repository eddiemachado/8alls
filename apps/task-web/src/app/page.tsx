'use client';

import { useState } from 'react';
import { colors, spacing } from '@8alls/design-tokens';

interface Task {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  dueDate?: string;
}

// Mock data for demonstration
const mockTasks: Task[] = [
  {
    id: '1',
    title: 'Set up 8alls monorepo',
    description: 'Initialize the monorepo with design tokens and API client',
    completed: true,
    priority: 'high',
    dueDate: '2026-01-28',
  },
  {
    id: '2',
    title: 'Create task management app',
    description: 'Build a beautiful task manager using the design system',
    completed: false,
    priority: 'high',
    dueDate: '2026-01-29',
  },
  {
    id: '3',
    title: 'Add calendar integration',
    description: 'Integrate with the calendar app',
    completed: false,
    priority: 'medium',
    dueDate: '2026-02-01',
  },
];

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>(mockTasks);
  const [showForm, setShowForm] = useState(false);

  const toggleTask = (id: string) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  return (
    <div>
      <header className="header">
        <div className="header-content">
          <h1 className="logo">8alls Tasks</h1>
          <button 
            className="button button-primary"
            onClick={() => setShowForm(!showForm)}
          >
            {showForm ? 'Cancel' : '+ New Task'}
          </button>
        </div>
      </header>

      <main className="container">
        {showForm && (
          <div style={{
            backgroundColor: 'var(--color-bg-elevated)',
            border: '1px solid var(--color-border-primary)',
            borderRadius: 'var(--radius-lg)',
            padding: spacing[6],
            marginBottom: spacing[8],
          }}>
            <h2 style={{ marginBottom: spacing[4] }}>Create New Task</h2>
            <form>
              <div className="form-group">
                <label className="label" htmlFor="title">Title</label>
                <input
                  className="input"
                  type="text"
                  id="title"
                  placeholder="Enter task title..."
                />
              </div>
              <div className="form-group">
                <label className="label" htmlFor="description">Description</label>
                <textarea
                  className="input"
                  id="description"
                  rows={3}
                  placeholder="Enter task description..."
                />
              </div>
              <div className="form-group">
                <label className="label" htmlFor="priority">Priority</label>
                <select className="input" id="priority">
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
              <div className="form-group">
                <label className="label" htmlFor="dueDate">Due Date</label>
                <input className="input" type="date" id="dueDate" />
              </div>
              <button type="submit" className="button button-primary">
                Create Task
              </button>
            </form>
          </div>
        )}

        <div className="task-list">
          {tasks.map(task => (
            <div key={task.id} className="task-card">
              <div className="task-header">
                <input
                  type="checkbox"
                  className="checkbox"
                  checked={task.completed}
                  onChange={() => toggleTask(task.id)}
                />
                <h3 
                  className="task-title"
                  style={{
                    textDecoration: task.completed ? 'line-through' : 'none',
                    opacity: task.completed ? 0.6 : 1,
                  }}
                >
                  {task.title}
                </h3>
                <span className={`badge badge-${task.priority}`}>
                  {task.priority}
                </span>
              </div>
              
              {task.description && (
                <p className="task-description">{task.description}</p>
              )}
              
              <div className="task-meta">
                {task.dueDate && (
                  <span>📅 Due: {new Date(task.dueDate).toLocaleDateString()}</span>
                )}
              </div>
            </div>
          ))}
        </div>

        {tasks.length === 0 && (
          <div style={{
            textAlign: 'center',
            padding: spacing[12],
            color: 'var(--color-text-tertiary)',
          }}>
            <p>No tasks yet. Create one to get started!</p>
          </div>
        )}
      </main>
    </div>
  );
}
