
import React, { createContext, useContext, useEffect, useState } from 'react';
import EnhancedServiceFactory from '../services/api/enhancedServiceFactory';
import { EnhancedLeadService, EnhancedLeadServiceProvider } from '../services/api/enhancedLeadService';
import { EnhancedItineraryService, EnhancedItineraryServiceProvider } from '../services/api/enhancedItineraryService';
import { EnhancedProposalService, EnhancedProposalServiceProvider } from '../services/api/enhancedProposalService';
import { NotificationService, NotificationServiceProvider } from '../services/api/notificationService';
import { SearchService, SearchServiceProvider } from '../services/api/searchService';
import { AuthService, AuthServiceProvider } from '../services/api/authService';
import { useUser } from './UserContext';
import { BACKEND_CONFIG } from '../config/backend.config';

// Define the interface for what will be available through the enhanced API context
interface EnhancedApiContextValue {
  leadService: EnhancedLeadService | null;
  itineraryService: EnhancedItineraryService | null;
  proposalService: EnhancedProposalService | null;
  notificationService: NotificationService | null;
  searchService: SearchService | null;
  authService: AuthService | null;
  isInitialized: boolean;
}

// Initial context value
const initialContextValue: EnhancedApiContextValue = {
  leadService: null,
  itineraryService: null,
  proposalService: null,
  notificationService: null,
  searchService: null,
  authService: null,
  isInitialized: false
};

// Create the context
const EnhancedApiContext = createContext<EnhancedApiContextValue>(initialContextValue);

// Create the provider component
export const EnhancedApiProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useUser();
  const [isInitialized, setIsInitialized] = useState(false);
  const [services, setServices] = useState<EnhancedApiContextValue>(initialContextValue);
  
  // Initialize the service factory
  useEffect(() => {
    const initializeServices = () => {
      try {
        // Initialize the service factory
        const serviceFactory = EnhancedServiceFactory.getInstance();
        
        // Register all required services
        serviceFactory.registerService('leads', new EnhancedLeadServiceProvider());
        serviceFactory.registerService('itineraries', new EnhancedItineraryServiceProvider());
        serviceFactory.registerService('proposals', new EnhancedProposalServiceProvider());
        serviceFactory.registerService('notifications', new NotificationServiceProvider());
        serviceFactory.registerService('search', new SearchServiceProvider());
        serviceFactory.registerService('auth', new AuthServiceProvider());
        
        // Access the registered services
        const leadService = serviceFactory.getService<EnhancedLeadService>('leads');
        const itineraryService = serviceFactory.getService<EnhancedItineraryService>('itineraries');
        const proposalService = serviceFactory.getService<EnhancedProposalService>('proposals');
        const notificationService = serviceFactory.getService<NotificationService>('notifications');
        const searchService = serviceFactory.getService<SearchService>('search');
        const authService = serviceFactory.getService<AuthService>('auth');
        
        // Update services state
        setServices({
          leadService,
          itineraryService,
          proposalService,
          notificationService,
          searchService,
          authService,
          isInitialized: true
        });
        
        setIsInitialized(true);
        console.log('Enhanced API services initialized successfully');
      } catch (error) {
        console.error('Failed to initialize enhanced API services:', error);
      }
    };
    
    initializeServices();
    
    // Cleanup function
    return () => {
      const serviceFactory = EnhancedServiceFactory.getInstance();
      serviceFactory.destroy();
    };
  }, []);
  
  // Update auth token when user changes
  useEffect(() => {
    if (user && isInitialized) {
      const serviceFactory = EnhancedServiceFactory.getInstance();
      // In a real app, this would be the JWT token from your auth system
      const mockAuthToken = "mock-jwt-token-for-user-" + user.id;
      serviceFactory.setAuthToken(mockAuthToken);
      console.log('Enhanced API: Auth token updated for user:', user.id);
    }
  }, [user, isInitialized]);
  
  return (
    <EnhancedApiContext.Provider value={services}>
      {children}
    </EnhancedApiContext.Provider>
  );
};

// Create a hook to use the API context
export const useEnhancedApi = () => {
  const context = useContext(EnhancedApiContext);
  if (!context) {
    throw new Error('useEnhancedApi must be used within an EnhancedApiProvider');
  }
  return context;
};
