
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
  leadService: EnhancedLeadService;
  itineraryService: EnhancedItineraryService;
  proposalService: EnhancedProposalService;
  notificationService: NotificationService;
  searchService: SearchService;
  authService: AuthService;
  isInitialized: boolean;
}

// Create the context
const EnhancedApiContext = createContext<EnhancedApiContextValue | undefined>(undefined);

// Create the provider component
export const EnhancedApiProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useUser();
  const [isInitialized, setIsInitialized] = useState(false);
  
  // Initialize the service factory
  const serviceFactory = EnhancedServiceFactory.getInstance();
  
  // Register all services
  useEffect(() => {
    const initializeServices = () => {
      // Register all required services
      serviceFactory.registerService('leads', new EnhancedLeadServiceProvider());
      serviceFactory.registerService('itineraries', new EnhancedItineraryServiceProvider());
      serviceFactory.registerService('proposals', new EnhancedProposalServiceProvider());
      serviceFactory.registerService('notifications', new NotificationServiceProvider());
      serviceFactory.registerService('search', new SearchServiceProvider());
      serviceFactory.registerService('auth', new AuthServiceProvider());
      
      setIsInitialized(true);
    };
    
    initializeServices();
    
    // Cleanup function
    return () => {
      serviceFactory.destroy();
    };
  }, []);
  
  // Update auth token when user changes
  useEffect(() => {
    if (user) {
      // In a real app, this would be the JWT token from your auth system
      const mockAuthToken = "mock-jwt-token-for-user-" + user.id;
      serviceFactory.setAuthToken(mockAuthToken);
    } else {
      // Clear token if no user is logged in
      serviceFactory.setAuthToken('');
    }
  }, [user]);
  
  // Access the registered services
  const leadService = serviceFactory.getService<EnhancedLeadService>('leads');
  const itineraryService = serviceFactory.getService<EnhancedItineraryService>('itineraries');
  const proposalService = serviceFactory.getService<EnhancedProposalService>('proposals');
  const notificationService = serviceFactory.getService<NotificationService>('notifications');
  const searchService = serviceFactory.getService<SearchService>('search');
  const authService = serviceFactory.getService<AuthService>('auth');
  
  // Create the context value
  const contextValue: EnhancedApiContextValue = {
    leadService,
    itineraryService,
    proposalService,
    notificationService,
    searchService,
    authService,
    isInitialized
  };
  
  return (
    <EnhancedApiContext.Provider value={contextValue}>
      {children}
    </EnhancedApiContext.Provider>
  );
};

// Create a hook to use the API context
export const useEnhancedApi = () => {
  const context = useContext(EnhancedApiContext);
  if (context === undefined) {
    throw new Error('useEnhancedApi must be used within an EnhancedApiProvider');
  }
  return context;
};
