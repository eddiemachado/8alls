/**
 * 8alls API Client
 * 
 * Shared API client for all 8alls applications to communicate
 * with the central API server.
 */

import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

// WebSocket event types
export type WebSocketEventType = 'task_created' | 'task_updated' | 'task_deleted' | 'event_created' | 'event_updated' | 'event_deleted';

export interface WebSocketMessage {
  type: WebSocketEventType;
  data: any;
  timestamp: string;
}

export type WebSocketCallback = (message: WebSocketMessage) => void;

export interface ApiClientConfig {
  baseURL: string;
  apiKey?: string;
  timeout?: number;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  dueDate?: string;
  priority: 'low' | 'medium' | 'high';
  tags?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface CalendarEvent {
  id: string;
  title: string;
  description?: string;
  start_time: string;
  end_time: string;
  all_day: boolean;
  location?: string;
  recurrence_rule?: string;
  status: 'confirmed' | 'tentative' | 'cancelled';
  event_type?: string;
  color?: string;
  tags?: string[];
  attendees?: Array<{ name: string; email: string }>;
  reminders?: Array<{ minutes_before: number; method: string }>;
  created_at?: string;
  updated_at?: string;
}

export interface EventFilters {
  start_date?: string;
  end_date?: string;
  event_type?: string;
  status?: 'confirmed' | 'tentative' | 'cancelled';
}

export interface HealthLog {
  id: string;
  date: string;
  type: 'workout' | 'calories' | 'weight' | 'sleep';
  value: number;
  unit: string;
  notes?: string;
  createdAt: string;
}

export interface Transaction {
  id: string;
  date: string;
  amount: number;
  category: string;
  description: string;
  type: 'income' | 'expense';
  createdAt: string;
}

export class WebSocketClient {
  private ws: WebSocket | null = null;
  private callbacks: Map<WebSocketEventType, Set<WebSocketCallback>> = new Map();
  private url: string;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 1000;

  constructor(url: string) {
    this.url = url;
  }

  connect(): void {
    try {
      this.ws = new WebSocket(this.url);

      this.ws.onopen = () => {
        console.log('WebSocket connected');
        this.reconnectAttempts = 0;
      };

      this.ws.onmessage = (event) => {
        try {
          const message: WebSocketMessage = JSON.parse(event.data);
          this.handleMessage(message);
        } catch (error) {
          console.error('Failed to parse WebSocket message:', error);
        }
      };

      this.ws.onerror = (error) => {
        console.error('WebSocket error:', error);
      };

      this.ws.onclose = () => {
        console.log('WebSocket disconnected');
        this.attemptReconnect();
      };
    } catch (error) {
      console.error('Failed to connect WebSocket:', error);
    }
  }

  private attemptReconnect(): void {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      const delay = this.reconnectDelay * Math.pow(2, this.reconnectAttempts - 1);
      console.log(`Attempting to reconnect in ${delay}ms (attempt ${this.reconnectAttempts}/${this.maxReconnectAttempts})`);

      setTimeout(() => {
        this.connect();
      }, delay);
    } else {
      console.error('Max reconnection attempts reached');
    }
  }

  private handleMessage(message: WebSocketMessage): void {
    const callbacks = this.callbacks.get(message.type);
    if (callbacks) {
      callbacks.forEach(callback => callback(message));
    }
  }

  on(eventType: WebSocketEventType, callback: WebSocketCallback): () => void {
    if (!this.callbacks.has(eventType)) {
      this.callbacks.set(eventType, new Set());
    }
    this.callbacks.get(eventType)!.add(callback);

    // Return unsubscribe function
    return () => {
      const callbacks = this.callbacks.get(eventType);
      if (callbacks) {
        callbacks.delete(callback);
      }
    };
  }

  disconnect(): void {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }

  isConnected(): boolean {
    return this.ws?.readyState === WebSocket.OPEN;
  }
}

export class ApiClient {
  private client: AxiosInstance;
  private wsClient?: WebSocketClient;

  constructor(config: ApiClientConfig) {
    this.client = axios.create({
      baseURL: config.baseURL,
      timeout: config.timeout || 10000,
      headers: {
        'Content-Type': 'application/json',
        ...(config.apiKey && { 'Authorization': `Bearer ${config.apiKey}` }),
      },
    });

    // Response interceptor for error handling
    this.client.interceptors.response.use(
      (response) => response,
      (error) => {
        console.error('API Error:', error.response?.data || error.message);
        return Promise.reject(error);
      }
    );
  }

  // Generic request methods
  private async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response: AxiosResponse<T> = await this.client.get(url, config);
    return response.data;
  }

  private async post<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response: AxiosResponse<T> = await this.client.post(url, data, config);
    return response.data;
  }

  private async put<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response: AxiosResponse<T> = await this.client.put(url, data, config);
    return response.data;
  }

  private async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response: AxiosResponse<T> = await this.client.delete(url, config);
    return response.data;
  }

  // Task API
  async getTasks(): Promise<Task[]> {
    return this.get<Task[]>('/tasks');
  }

  async getTask(id: string): Promise<Task> {
    return this.get<Task>(`/tasks/${id}`);
  }

  async createTask(task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>): Promise<Task> {
    return this.post<Task>('/tasks', task);
  }

  async updateTask(id: string, updates: Partial<Task>): Promise<Task> {
    return this.put<Task>(`/tasks/${id}`, updates);
  }

  async deleteTask(id: string): Promise<void> {
    return this.delete<void>(`/tasks/${id}`);
  }

  // Calendar API
  async getEvents(filters?: EventFilters): Promise<CalendarEvent[]> {
    const params = new URLSearchParams();
    if (filters?.start_date) params.append('start_date', filters.start_date);
    if (filters?.end_date) params.append('end_date', filters.end_date);
    if (filters?.event_type) params.append('event_type', filters.event_type);
    if (filters?.status) params.append('status', filters.status);

    const queryString = params.toString();
    return this.get<CalendarEvent[]>(`/events${queryString ? `?${queryString}` : ''}`);
  }

  async getEvent(id: string): Promise<CalendarEvent> {
    return this.get<CalendarEvent>(`/events/${id}`);
  }

  async getEventsByDate(date: string): Promise<CalendarEvent[]> {
    return this.get<CalendarEvent[]>(`/events/date/${date}`);
  }

  async createEvent(event: Omit<CalendarEvent, 'id' | 'created_at' | 'updated_at'>): Promise<CalendarEvent> {
    return this.post<CalendarEvent>('/events', event);
  }

  async updateEvent(id: string, updates: Partial<CalendarEvent>): Promise<CalendarEvent> {
    return this.put<CalendarEvent>(`/events/${id}`, updates);
  }

  async deleteEvent(id: string): Promise<void> {
    return this.delete<void>(`/events/${id}`);
  }

  // Health API
  async getHealthLogs(): Promise<HealthLog[]> {
    return this.get<HealthLog[]>('/health');
  }

  async createHealthLog(log: Omit<HealthLog, 'id' | 'createdAt'>): Promise<HealthLog> {
    return this.post<HealthLog>('/health', log);
  }

  // Finance API
  async getTransactions(): Promise<Transaction[]> {
    return this.get<Transaction[]>('/transactions');
  }

  async createTransaction(transaction: Omit<Transaction, 'id' | 'createdAt'>): Promise<Transaction> {
    return this.post<Transaction>('/transactions', transaction);
  }

  // Universal search
  async search(query: string): Promise<any> {
    return this.get<any>(`/search?q=${encodeURIComponent(query)}`);
  }

  // WebSocket methods
  enableRealtime(wsUrl?: string): WebSocketClient {
    if (!this.wsClient) {
      const url = wsUrl || this.client.defaults.baseURL?.replace('http', 'ws') + '/ws';
      this.wsClient = new WebSocketClient(url);
      this.wsClient.connect();
    }
    return this.wsClient;
  }

  disableRealtime(): void {
    if (this.wsClient) {
      this.wsClient.disconnect();
      this.wsClient = undefined;
    }
  }

  onTaskCreated(callback: (task: Task) => void): () => void {
    if (!this.wsClient) {
      throw new Error('Realtime not enabled. Call enableRealtime() first.');
    }
    return this.wsClient.on('task_created', (message) => callback(message.data));
  }

  onTaskUpdated(callback: (task: Task) => void): () => void {
    if (!this.wsClient) {
      throw new Error('Realtime not enabled. Call enableRealtime() first.');
    }
    return this.wsClient.on('task_updated', (message) => callback(message.data));
  }

  onTaskDeleted(callback: (taskId: string) => void): () => void {
    if (!this.wsClient) {
      throw new Error('Realtime not enabled. Call enableRealtime() first.');
    }
    return this.wsClient.on('task_deleted', (message) => callback(message.data.id));
  }

  onEventCreated(callback: (event: CalendarEvent) => void): () => void {
    if (!this.wsClient) {
      throw new Error('Realtime not enabled. Call enableRealtime() first.');
    }
    return this.wsClient.on('event_created', (message) => callback(message.data));
  }

  onEventUpdated(callback: (event: CalendarEvent) => void): () => void {
    if (!this.wsClient) {
      throw new Error('Realtime not enabled. Call enableRealtime() first.');
    }
    return this.wsClient.on('event_updated', (message) => callback(message.data));
  }

  onEventDeleted(callback: (eventId: string) => void): () => void {
    if (!this.wsClient) {
      throw new Error('Realtime not enabled. Call enableRealtime() first.');
    }
    return this.wsClient.on('event_deleted', (message) => callback(message.data.id));
  }
}

// Factory function for easy instantiation
export function createApiClient(config: ApiClientConfig): ApiClient {
  return new ApiClient(config);
}

// Export default instance (can be configured via env vars)
export const api = createApiClient({
  baseURL: process.env.API_BASE_URL || 'http://localhost:3000/api',
  apiKey: process.env.API_KEY,
});
