
import ApiClient from './apiClient';

// Service provider interface
export interface ServiceProvider<T> {
  createService(client: ApiClient): T;
}

// Factory to create and manage service instances
export class ServiceFactory {
  private static instance: ServiceFactory;
  private apiClient: ApiClient;
  private services: Map<string, any> = new Map();

  private constructor(baseUrl: string) {
    this.apiClient = new ApiClient(baseUrl);
  }

  static getInstance(baseUrl: string = '/api'): ServiceFactory {
    if (!ServiceFactory.instance) {
      ServiceFactory.instance = new ServiceFactory(baseUrl);
    }
    return ServiceFactory.instance;
  }

  // Register a new service provider
  registerService<T>(serviceName: string, provider: ServiceProvider<T>): void {
    if (!this.services.has(serviceName)) {
      this.services.set(serviceName, provider.createService(this.apiClient));
    }
  }

  // Get a service instance
  getService<T>(serviceName: string): T {
    const service = this.services.get(serviceName);
    if (!service) {
      throw new Error(`Service '${serviceName}' not registered`);
    }
    return service as T;
  }

  // Set authentication token for API requests
  setAuthToken(token: string): void {
    this.apiClient.setAuthToken(token);
  }

  // Get the API client directly if needed
  getApiClient(): ApiClient {
    return this.apiClient;
  }
}

export default ServiceFactory;
