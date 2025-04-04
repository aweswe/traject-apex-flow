
import { EnhancedApiClient } from './enhancedApiClient';
import { ServiceProvider } from './serviceFactory';
import { BACKEND_CONFIG } from '../../config/backend.config';

// Enhanced factory to create and manage service instances
export class EnhancedServiceFactory {
  private static instance: EnhancedServiceFactory;
  private apiClient: EnhancedApiClient;
  private services: Map<string, any> = new Map();

  private constructor(baseUrl: string) {
    this.apiClient = new EnhancedApiClient(baseUrl);
  }

  static getInstance(baseUrl: string = BACKEND_CONFIG.API_URL): EnhancedServiceFactory {
    if (!EnhancedServiceFactory.instance) {
      EnhancedServiceFactory.instance = new EnhancedServiceFactory(baseUrl);
    }
    return EnhancedServiceFactory.instance;
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
  getApiClient(): EnhancedApiClient {
    return this.apiClient;
  }

  // Clean up resources when no longer needed
  destroy(): void {
    this.apiClient.destroy();
  }
}

export default EnhancedServiceFactory;
