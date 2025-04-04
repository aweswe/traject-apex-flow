
import ApiClient, { ApiResponse } from './apiClient';
import { ServiceProvider } from './serviceFactory';

export interface NotificationData {
  id: string;
  type: 'lead' | 'proposal' | 'payment' | 'system' | 'reminder';
  title: string;
  message: string;
  read: boolean;
  entityId?: string;
  entityType?: string;
  actionUrl?: string;
  createdAt: string;
}

export interface NotificationService {
  getNotifications(): Promise<ApiResponse<NotificationData[]>>;
  markAsRead(id: string): Promise<ApiResponse<NotificationData>>;
  markAllAsRead(): Promise<ApiResponse<void>>;
  deleteNotification(id: string): Promise<ApiResponse<void>>;
  getUnreadCount(): Promise<ApiResponse<{ count: number }>>;
  subscribeToRealTimeUpdates(callback: (notification: NotificationData) => void): () => void;
}

class NotificationServiceImpl implements NotificationService {
  private websocket: WebSocket | null = null;
  private subscribers: ((notification: NotificationData) => void)[] = [];
  
  constructor(private apiClient: ApiClient) {}

  async getNotifications(): Promise<ApiResponse<NotificationData[]>> {
    return this.apiClient.get<NotificationData[]>('/notifications');
  }

  async markAsRead(id: string): Promise<ApiResponse<NotificationData>> {
    return this.apiClient.patch<NotificationData>(`/notifications/${id}`, { read: true });
  }

  async markAllAsRead(): Promise<ApiResponse<void>> {
    return this.apiClient.post<void>('/notifications/mark-all-read', {});
  }

  async deleteNotification(id: string): Promise<ApiResponse<void>> {
    return this.apiClient.delete<void>(`/notifications/${id}`);
  }

  async getUnreadCount(): Promise<ApiResponse<{ count: number }>> {
    return this.apiClient.get<{ count: number }>('/notifications/unread-count');
  }

  subscribeToRealTimeUpdates(callback: (notification: NotificationData) => void): () => void {
    // Add the callback to subscribers
    this.subscribers.push(callback);
    
    // Initialize WebSocket if it doesn't exist
    if (!this.websocket || this.websocket.readyState === WebSocket.CLOSED) {
      // In a real app, this would connect to your WebSocket server
      const wsUrl = window.location.origin.replace(/^http/, 'ws') + '/api/notifications/ws';
      
      this.websocket = new WebSocket(wsUrl);
      
      this.websocket.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (data.type === 'notification') {
            // Notify all subscribers
            this.subscribers.forEach(sub => sub(data.notification));
          }
        } catch (error) {
          console.error('Failed to parse WebSocket message:', error);
        }
      };
      
      this.websocket.onerror = (error) => {
        console.error('WebSocket error:', error);
        // You might want to implement reconnection logic here
      };
    }
    
    // Return unsubscribe function
    return () => {
      this.subscribers = this.subscribers.filter(sub => sub !== callback);
      
      // Close WebSocket if no subscribers left
      if (this.subscribers.length === 0 && this.websocket) {
        this.websocket.close();
        this.websocket = null;
      }
    };
  }
}

export class NotificationServiceProvider implements ServiceProvider<NotificationService> {
  createService(client: ApiClient): NotificationService {
    return new NotificationServiceImpl(client);
  }
}
