import ApiClient, { ApiResponse, RequestOptions } from './apiClient';
import { BACKEND_CONFIG } from '../../config/backend.config';

// Types for offline queue
interface QueuedRequest {
  id: string;
  endpoint: string;
  options: RequestOptions;
  timestamp: number;
  retryCount: number;
}

// Enhanced API client with offline support, retry logic, and better error handling
export class EnhancedApiClient extends ApiClient {
  private offlineQueue: QueuedRequest[] = [];
  private isProcessingQueue = false;
  private networkStatus: 'online' | 'offline' = 'online';
  private retryTimeouts: Record<string, NodeJS.Timeout> = {};

  constructor(baseUrl: string, defaultHeaders: Record<string, string> = {}) {
    super(baseUrl, defaultHeaders);
    this.setupNetworkListeners();
    this.loadOfflineQueue();
  }

  // Override the request method to add retry logic and offline support
  async request<T>(endpoint: string, options: RequestOptions = {}): Promise<ApiResponse<T>> {
    // If offline, queue the request and return a pending response
    if (this.networkStatus === 'offline') {
      this.queueRequest(endpoint, options);
      return {
        data: null,
        error: new Error('Network offline. Request queued for processing when network is available.'),
        status: 0,
      };
    }

    try {
      // Attempt the request with retry logic
      return await this.requestWithRetry<T>(endpoint, options);
    } catch (error) {
      // If the error is due to network issues, queue the request
      if (!navigator.onLine || error instanceof TypeError && error.message.includes('Network')) {
        this.networkStatus = 'offline';
        this.queueRequest(endpoint, options);
        return {
          data: null,
          error: new Error('Network offline. Request queued for processing when network is available.'),
          status: 0,
        };
      }

      // Otherwise, return the error
      console.error('API request failed:', error);
      return {
        data: null,
        error: error instanceof Error ? error : new Error('Unknown API error'),
        status: 0,
      };
    }
  }

  // Request with retry logic
  private async requestWithRetry<T>(endpoint: string, options: RequestOptions = {}, retryCount = 0): Promise<ApiResponse<T>> {
    try {
      const response = await super.request<T>(endpoint, options);
      
      // If the request was successful or it's a 4xx error (client error), don't retry
      if (response.error === null || (response.status >= 400 && response.status < 500)) {
        return response;
      }
      
      // If it's a server error and we haven't exceeded max retries, retry
      if (response.status >= 500 && retryCount < BACKEND_CONFIG.MAX_RETRIES) {
        // Exponential backoff
        const delay = Math.min(1000 * 2 ** retryCount, 30000);
        await new Promise(resolve => setTimeout(resolve, delay));
        return this.requestWithRetry<T>(endpoint, options, retryCount + 1);
      }
      
      return response;
    } catch (error) {
      // If it's a network error and we haven't exceeded max retries, retry
      if (retryCount < BACKEND_CONFIG.MAX_RETRIES) {
        const delay = Math.min(1000 * 2 ** retryCount, 30000);
        await new Promise(resolve => setTimeout(resolve, delay));
        return this.requestWithRetry<T>(endpoint, options, retryCount + 1);
      }
      
      throw error;
    }
  }

  // Queue a request for later processing
  private queueRequest(endpoint: string, options: RequestOptions): void {
    const queuedRequest: QueuedRequest = {
      id: Math.random().toString(36).substring(2, 9),
      endpoint,
      options,
      timestamp: Date.now(),
      retryCount: 0,
    };
    
    this.offlineQueue.push(queuedRequest);
    this.saveOfflineQueue();
    console.log('Request queued for later processing:', queuedRequest);
  }

  // Process the offline queue when back online
  private async processQueue(): Promise<void> {
    if (this.isProcessingQueue || this.offlineQueue.length === 0) {
      return;
    }
    
    this.isProcessingQueue = true;
    console.log('Processing offline queue:', this.offlineQueue.length, 'requests');
    
    // Process each request in the queue
    const queue = [...this.offlineQueue];
    this.offlineQueue = [];
    this.saveOfflineQueue();
    
    for (const queuedRequest of queue) {
      try {
        await super.request(queuedRequest.endpoint, queuedRequest.options);
        console.log('Successfully processed queued request:', queuedRequest.id);
      } catch (error) {
        console.error('Failed to process queued request:', queuedRequest.id, error);
        
        // If we still have retries left, requeue the request
        if (queuedRequest.retryCount < BACKEND_CONFIG.MAX_RETRIES) {
          queuedRequest.retryCount++;
          this.offlineQueue.push(queuedRequest);
          this.saveOfflineQueue();
        }
      }
    }
    
    this.isProcessingQueue = false;
    
    // If we have more items in the queue (from requeued items), process them
    if (this.offlineQueue.length > 0) {
      setTimeout(() => this.processQueue(), 5000); // Wait 5 seconds before processing again
    }
  }

  // Setup network status listeners
  private setupNetworkListeners(): void {
    if (typeof window !== 'undefined') {
      window.addEventListener('online', this.handleOnline);
      window.addEventListener('offline', this.handleOffline);
      this.networkStatus = navigator.onLine ? 'online' : 'offline';
    }
  }

  // Handle coming back online
  private handleOnline = (): void => {
    console.log('Network is now online');
    this.networkStatus = 'online';
    this.processQueue();
  };

  // Handle going offline
  private handleOffline = (): void => {
    console.log('Network is now offline');
    this.networkStatus = 'offline';
  };

  // Save the offline queue to localStorage
  private saveOfflineQueue(): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem('apiOfflineQueue', JSON.stringify(this.offlineQueue));
    }
  }

  // Load the offline queue from localStorage
  private loadOfflineQueue(): void {
    if (typeof window !== 'undefined') {
      const savedQueue = localStorage.getItem('apiOfflineQueue');
      if (savedQueue) {
        try {
          this.offlineQueue = JSON.parse(savedQueue);
          console.log('Loaded offline queue:', this.offlineQueue.length, 'requests');
        } catch (error) {
          console.error('Failed to parse saved offline queue:', error);
          this.offlineQueue = [];
        }
      }
    }
  }

  // Clean up event listeners on destroy
  public destroy(): void {
    if (typeof window !== 'undefined') {
      window.removeEventListener('online', this.handleOnline);
      window.removeEventListener('offline', this.handleOffline);
    }
    
    // Clear any retry timeouts
    Object.values(this.retryTimeouts).forEach(timeout => clearTimeout(timeout));
  }
}

export default EnhancedApiClient;
