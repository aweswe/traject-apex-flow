
import React, { createContext, useContext, useEffect, useState } from 'react';
import ServiceFactory from '../services/api/serviceFactory';
import { LeadService, LeadServiceProvider } from '../services/api/leadService';
import { ItineraryService, ItineraryServiceProvider } from '../services/api/itineraryService';
import { ProposalService, ProposalServiceProvider } from '../services/api/proposalService';
import { NotificationService, NotificationServiceProvider } from '../services/api/notificationService';
import { SearchService, SearchServiceProvider } from '../services/api/searchService';
import { useUser } from './UserContext';
import { BACKEND_CONFIG } from '../config/backend.config';

// Define the interface for what will be available through the API context
interface ApiContextValue {
  leadService: LeadService | null;
  itineraryService: ItineraryService | null;
  proposalService: ProposalService | null;
  notificationService: NotificationService | null;
  searchService: SearchService | null;
  isInitialized: boolean;
}

// Initial context value
const initialContextValue: ApiContextValue = {
  leadService: null,
  itineraryService: null,
  proposalService: null,
  notificationService: null,
  searchService: null,
  isInitialized: false
};

// Create the context
const ApiContext = createContext<ApiContextValue>(initialContextValue);

// Create the provider component
export const ApiProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useUser();
  const [isInitialized, setIsInitialized] = useState(false);
  const [services, setServices] = useState<ApiContextValue>(initialContextValue);
  
  // Initialize the service factory and register services
  useEffect(() => {
    // Using the BACKEND_CONFIG.API_URL as the base URL
    const serviceFactory = ServiceFactory.getInstance();
    
    try {
      // Register all required services
      serviceFactory.registerService('leads', new LeadServiceProvider());
      serviceFactory.registerService('itineraries', new ItineraryServiceProvider());
      serviceFactory.registerService('proposals', new ProposalServiceProvider());
      serviceFactory.registerService('notifications', new NotificationServiceProvider());
      serviceFactory.registerService('search', new SearchServiceProvider());
      
      // Access the registered services
      const leadService = serviceFactory.getService<LeadService>('leads');
      const itineraryService = serviceFactory.getService<ItineraryService>('itineraries');
      const proposalService = serviceFactory.getService<ProposalService>('proposals');
      const notificationService = serviceFactory.getService<NotificationService>('notifications');
      const searchService = serviceFactory.getService<SearchService>('search');
      
      // Update services state
      setServices({
        leadService,
        itineraryService,
        proposalService,
        notificationService,
        searchService,
        isInitialized: true
      });
      
      setIsInitialized(true);
      console.log('API services initialized successfully');
    } catch (error) {
      console.error('Failed to initialize API services:', error);
    }
    
    return () => {
      // Clean up by destroying service factory
      serviceFactory.destroy();
    };
  }, []);
  
  // Update auth token when user changes
  useEffect(() => {
    if (user && isInitialized) {
      const serviceFactory = ServiceFactory.getInstance();
      // In a real app, this would be the JWT token from your auth system
      const mockAuthToken = "mock-jwt-token-for-user-" + user.id;
      serviceFactory.setAuthToken(mockAuthToken);
      console.log('Auth token updated for user:', user.id);
    }
  }, [user, isInitialized]);
  
  return (
    <ApiContext.Provider value={services}>
      {children}
    </ApiContext.Provider>
  );
};

// Create a hook to use the API context
export const useApi = () => {
  const context = useContext(ApiContext);
  if (!context) {
    throw new Error('useApi must be used within an ApiProvider');
  }
  return context;
};
