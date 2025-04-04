
import React, { createContext, useContext, useEffect, useState } from 'react';
import ServiceFactory from '../services/api/serviceFactory';
import { LeadService, LeadServiceProvider } from '../services/api/leadService';
import { ItineraryService, ItineraryServiceProvider } from '../services/api/itineraryService';
import { ProposalService, ProposalServiceProvider } from '../services/api/proposalService';
import { NotificationService, NotificationServiceProvider } from '../services/api/notificationService';
import { SearchService, SearchServiceProvider } from '../services/api/searchService';
import { useUser } from './UserContext';

// Define the interface for what will be available through the API context
interface ApiContextValue {
  leadService: LeadService;
  itineraryService: ItineraryService;
  proposalService: ProposalService;
  notificationService: NotificationService;
  searchService: SearchService;
  isInitialized: boolean;
}

// Create the context
const ApiContext = createContext<ApiContextValue | undefined>(undefined);

// Create the provider component
export const ApiProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useUser();
  const [isInitialized, setIsInitialized] = useState(false);
  
  // Initialize the service factory
  const serviceFactory = ServiceFactory.getInstance();
  
  // Register all services
  useEffect(() => {
    const initializeServices = () => {
      // Register all required services
      serviceFactory.registerService('leads', new LeadServiceProvider());
      serviceFactory.registerService('itineraries', new ItineraryServiceProvider());
      serviceFactory.registerService('proposals', new ProposalServiceProvider());
      serviceFactory.registerService('notifications', new NotificationServiceProvider());
      serviceFactory.registerService('search', new SearchServiceProvider());
      
      setIsInitialized(true);
    };
    
    initializeServices();
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
  const leadService = serviceFactory.getService<LeadService>('leads');
  const itineraryService = serviceFactory.getService<ItineraryService>('itineraries');
  const proposalService = serviceFactory.getService<ProposalService>('proposals');
  const notificationService = serviceFactory.getService<NotificationService>('notifications');
  const searchService = serviceFactory.getService<SearchService>('search');
  
  // Create the context value
  const contextValue: ApiContextValue = {
    leadService,
    itineraryService,
    proposalService,
    notificationService,
    searchService,
    isInitialized
  };
  
  return (
    <ApiContext.Provider value={contextValue}>
      {children}
    </ApiContext.Provider>
  );
};

// Create a hook to use the API context
export const useApi = () => {
  const context = useContext(ApiContext);
  if (context === undefined) {
    throw new Error('useApi must be used within an ApiProvider');
  }
  return context;
};
