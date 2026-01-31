/**
 * 8alls API Client
 * 
 * Shared API client for all 8alls applications to communicate
 * with the central API server.
 */

import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

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
  startDate: string;
  endDate: string;
  allDay: boolean;
  location?: string;
  createdAt: string;
  updatedAt: string;
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

export class ApiClient {
  private client: AxiosInstance;

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
  async getEvents(): Promise<CalendarEvent[]> {
    return this.get<CalendarEvent[]>('/events');
  }

  async getEvent(id: string): Promise<CalendarEvent> {
    return this.get<CalendarEvent>(`/events/${id}`);
  }

  async createEvent(event: Omit<CalendarEvent, 'id' | 'createdAt' | 'updatedAt'>): Promise<CalendarEvent> {
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
