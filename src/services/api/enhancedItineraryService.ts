
import { ApiResponse } from './apiClient';
import { ServiceProvider } from './serviceFactory';
import { 
  ItineraryData, 
  ItineraryDay, 
  ItineraryActivity, 
  Accommodation 
} from './itineraryService';
import { EnhancedApiClient } from './enhancedApiClient';
import { BACKEND_CONFIG } from '../../config/backend.config';

// Enhanced itinerary preferences
export interface ItineraryPreference {
  id: string;
  itineraryId: string;
  category: string; // e.g., 'accommodation', 'activities', 'food'
  preference: string; // e.g., 'luxury', 'budget', 'adventure'
  importance: number; // 1-5
  notes?: string;
}

// Enhanced itinerary data with additional fields
export interface EnhancedItineraryData extends ItineraryData {
  leadId: string;
  travelStyle?: 'luxury' | 'premium' | 'standard' | 'budget';
  travelers: {
    adults: number;
    children: number;
    childrenAges?: number[];
  };
  preferences?: ItineraryPreference[];
  optimizedRoute?: boolean;
  pacing?: 'relaxed' | 'balanced' | 'active';
  publicTransport?: boolean;
  dietaryRequirements?: string[];
  accessibility?: string[];
  version?: number;
  isTemplate?: boolean;
  aiGenerated?: boolean;
  sharedUrl?: string;
  theme?: string;
}

// AI recommendation request
export interface AIRecommendationRequest {
  destination: string;
  duration: number;
  travelStyle?: string;
  interests?: string[];
  budget?: number;
  travelDates?: { start: string; end: string };
  excludeActivities?: string[];
  travelers?: {
    adults: number;
    children: number;
    childrenAges?: number[];
  };
}

// Cost calculation result
export interface CostCalculationResult {
  totalCost: number;
  breakdown: {
    accommodation: number;
    activities: number;
    transportation: number;
    meals: number;
    other: number;
  };
  perPerson: number;
  currency: string;
  priceClass: 'budget' | 'standard' | 'premium' | 'luxury';
}

// PDF generation options
export interface PDFOptions {
  theme?: 'default' | 'modern' | 'classic' | 'minimal';
  includeCosts?: boolean;
  includeMap?: boolean;
  includeImages?: boolean;
  customTitle?: string;
  customLogo?: string;
  watermark?: boolean;
}

// Enhanced itinerary service
export interface EnhancedItineraryService {
  // Core CRUD operations
  getItineraries(leadId?: string): Promise<ApiResponse<EnhancedItineraryData[]>>;
  getItinerary(id: string): Promise<ApiResponse<EnhancedItineraryData>>;
  createItinerary(data: Partial<EnhancedItineraryData>): Promise<ApiResponse<EnhancedItineraryData>>;
  updateItinerary(id: string, data: Partial<EnhancedItineraryData>): Promise<ApiResponse<EnhancedItineraryData>>;
  deleteItinerary(id: string): Promise<ApiResponse<void>>;
  duplicateItinerary(id: string, newName?: string): Promise<ApiResponse<EnhancedItineraryData>>;
  
  // Preferences
  getPreferences(itineraryId: string): Promise<ApiResponse<ItineraryPreference[]>>;
  updatePreferences(itineraryId: string, preferences: Partial<ItineraryPreference>[]): Promise<ApiResponse<ItineraryPreference[]>>;
  
  // Day management
  addDay(id: string, day: Partial<ItineraryDay>): Promise<ApiResponse<EnhancedItineraryData>>;
  updateDay(id: string, dayId: string, day: Partial<ItineraryDay>): Promise<ApiResponse<EnhancedItineraryData>>;
  removeDay(id: string, dayId: string): Promise<ApiResponse<EnhancedItineraryData>>;
  reorderDays(id: string, dayIds: string[]): Promise<ApiResponse<EnhancedItineraryData>>;
  
  // Activity management
  addActivity(id: string, dayId: string, activity: Partial<ItineraryActivity>): Promise<ApiResponse<EnhancedItineraryData>>;
  updateActivity(id: string, dayId: string, activityId: string, activity: Partial<ItineraryActivity>): Promise<ApiResponse<EnhancedItineraryData>>;
  removeActivity(id: string, dayId: string, activityId: string): Promise<ApiResponse<EnhancedItineraryData>>;
  reorderActivities(id: string, dayId: string, activityIds: string[]): Promise<ApiResponse<EnhancedItineraryData>>;
  
  // Accommodation management
  updateAccommodation(id: string, dayId: string, accommodation: Partial<Accommodation>): Promise<ApiResponse<EnhancedItineraryData>>;
  
  // AI features
  getAIRecommendations(request: AIRecommendationRequest): Promise<ApiResponse<ItineraryActivity[]>>;
  optimizeRoute(id: string): Promise<ApiResponse<EnhancedItineraryData>>;
  
  // Cost calculation
  calculateCost(id: string): Promise<ApiResponse<CostCalculationResult>>;
  
  // PDF generation
  generatePDF(id: string, options?: PDFOptions): Promise<ApiResponse<{ url: string }>>;
  
  // Approval and sharing
  approveItinerary(id: string): Promise<ApiResponse<EnhancedItineraryData>>;
  getShareableLink(id: string): Promise<ApiResponse<{ url: string; expiresAt?: string }>>;
  
  // Templates
  getTemplates(): Promise<ApiResponse<EnhancedItineraryData[]>>;
  createTemplate(itineraryId: string, name: string, description?: string): Promise<ApiResponse<EnhancedItineraryData>>;
}

// Implementation of the enhanced itinerary service
class EnhancedItineraryServiceImpl implements EnhancedItineraryService {
  constructor(private apiClient: EnhancedApiClient) {}

  async getItineraries(leadId?: string): Promise<ApiResponse<EnhancedItineraryData[]>> {
    const params: Record<string, string> = {};
    if (leadId) {
      params.leadId = leadId;
    }
    return this.apiClient.get<EnhancedItineraryData[]>(`${BACKEND_CONFIG.ITINERARY.BASE}`, params);
  }

  async getItinerary(id: string): Promise<ApiResponse<EnhancedItineraryData>> {
    return this.apiClient.get<EnhancedItineraryData>(`${BACKEND_CONFIG.ITINERARY.BASE}/${id}`);
  }

  async createItinerary(data: Partial<EnhancedItineraryData>): Promise<ApiResponse<EnhancedItineraryData>> {
    return this.apiClient.post<EnhancedItineraryData>(`${BACKEND_CONFIG.ITINERARY.BASE}`, data);
  }

  async updateItinerary(id: string, data: Partial<EnhancedItineraryData>): Promise<ApiResponse<EnhancedItineraryData>> {
    return this.apiClient.put<EnhancedItineraryData>(`${BACKEND_CONFIG.ITINERARY.BASE}/${id}`, data);
  }

  async deleteItinerary(id: string): Promise<ApiResponse<void>> {
    return this.apiClient.delete<void>(`${BACKEND_CONFIG.ITINERARY.BASE}/${id}`);
  }

  async duplicateItinerary(id: string, newName?: string): Promise<ApiResponse<EnhancedItineraryData>> {
    return this.apiClient.post<EnhancedItineraryData>(`${BACKEND_CONFIG.ITINERARY.BASE}/${id}/duplicate`, { newName });
  }

  // Preferences
  async getPreferences(itineraryId: string): Promise<ApiResponse<ItineraryPreference[]>> {
    return this.apiClient.get<ItineraryPreference[]>(`${BACKEND_CONFIG.ITINERARY.BASE}/${itineraryId}${BACKEND_CONFIG.ITINERARY.PREFERENCES}`);
  }

  async updatePreferences(itineraryId: string, preferences: Partial<ItineraryPreference>[]): Promise<ApiResponse<ItineraryPreference[]>> {
    return this.apiClient.put<ItineraryPreference[]>(`${BACKEND_CONFIG.ITINERARY.BASE}/${itineraryId}${BACKEND_CONFIG.ITINERARY.PREFERENCES}`, { preferences });
  }

  // Day management
  async addDay(id: string, day: Partial<ItineraryDay>): Promise<ApiResponse<EnhancedItineraryData>> {
    return this.apiClient.post<EnhancedItineraryData>(`${BACKEND_CONFIG.ITINERARY.BASE}/${id}/days`, day);
  }

  async updateDay(id: string, dayId: string, day: Partial<ItineraryDay>): Promise<ApiResponse<EnhancedItineraryData>> {
    return this.apiClient.put<EnhancedItineraryData>(`${BACKEND_CONFIG.ITINERARY.BASE}/${id}/days/${dayId}`, day);
  }

  async removeDay(id: string, dayId: string): Promise<ApiResponse<EnhancedItineraryData>> {
    return this.apiClient.delete<EnhancedItineraryData>(`${BACKEND_CONFIG.ITINERARY.BASE}/${id}/days/${dayId}`);
  }

  async reorderDays(id: string, dayIds: string[]): Promise<ApiResponse<EnhancedItineraryData>> {
    return this.apiClient.put<EnhancedItineraryData>(`${BACKEND_CONFIG.ITINERARY.BASE}/${id}/days/reorder`, { dayIds });
  }

  // Activity management
  async addActivity(id: string, dayId: string, activity: Partial<ItineraryActivity>): Promise<ApiResponse<EnhancedItineraryData>> {
    return this.apiClient.post<EnhancedItineraryData>(`${BACKEND_CONFIG.ITINERARY.BASE}/${id}/days/${dayId}/activities`, activity);
  }

  async updateActivity(id: string, dayId: string, activityId: string, activity: Partial<ItineraryActivity>): Promise<ApiResponse<EnhancedItineraryData>> {
    return this.apiClient.put<EnhancedItineraryData>(`${BACKEND_CONFIG.ITINERARY.BASE}/${id}/days/${dayId}/activities/${activityId}`, activity);
  }

  async removeActivity(id: string, dayId: string, activityId: string): Promise<ApiResponse<EnhancedItineraryData>> {
    return this.apiClient.delete<EnhancedItineraryData>(`${BACKEND_CONFIG.ITINERARY.BASE}/${id}/days/${dayId}/activities/${activityId}`);
  }

  async reorderActivities(id: string, dayId: string, activityIds: string[]): Promise<ApiResponse<EnhancedItineraryData>> {
    return this.apiClient.put<EnhancedItineraryData>(`${BACKEND_CONFIG.ITINERARY.BASE}/${id}/days/${dayId}/activities/reorder`, { activityIds });
  }

  // Accommodation management
  async updateAccommodation(id: string, dayId: string, accommodation: Partial<Accommodation>): Promise<ApiResponse<EnhancedItineraryData>> {
    return this.apiClient.put<EnhancedItineraryData>(`${BACKEND_CONFIG.ITINERARY.BASE}/${id}/days/${dayId}/accommodation`, accommodation);
  }

  // AI features
  async getAIRecommendations(request: AIRecommendationRequest): Promise<ApiResponse<ItineraryActivity[]>> {
    return this.apiClient.post<ItineraryActivity[]>(`${BACKEND_CONFIG.ITINERARY.BASE}${BACKEND_CONFIG.ITINERARY.AI_RECOMMEND}`, request);
  }

  async optimizeRoute(id: string): Promise<ApiResponse<EnhancedItineraryData>> {
    return this.apiClient.post<EnhancedItineraryData>(`${BACKEND_CONFIG.ITINERARY.BASE}/${id}${BACKEND_CONFIG.ITINERARY.OPTIMIZE}`, {});
  }

  // Cost calculation
  async calculateCost(id: string): Promise<ApiResponse<CostCalculationResult>> {
    return this.apiClient.post<CostCalculationResult>(`${BACKEND_CONFIG.ITINERARY.BASE}/${id}${BACKEND_CONFIG.ITINERARY.COST}`, {});
  }

  // PDF generation
  async generatePDF(id: string, options?: PDFOptions): Promise<ApiResponse<{ url: string }>> {
    return this.apiClient.post<{ url: string }>(`${BACKEND_CONFIG.ITINERARY.BASE}/${id}${BACKEND_CONFIG.ITINERARY.PDF}`, options || {});
  }

  // Approval and sharing
  async approveItinerary(id: string): Promise<ApiResponse<EnhancedItineraryData>> {
    return this.apiClient.post<EnhancedItineraryData>(`${BACKEND_CONFIG.ITINERARY.BASE}/${id}${BACKEND_CONFIG.ITINERARY.APPROVE}`, {});
  }

  async getShareableLink(id: string): Promise<ApiResponse<{ url: string; expiresAt?: string }>> {
    return this.apiClient.get<{ url: string; expiresAt?: string }>(`${BACKEND_CONFIG.ITINERARY.BASE}/${id}/share`);
  }

  // Templates
  async getTemplates(): Promise<ApiResponse<EnhancedItineraryData[]>> {
    return this.apiClient.get<EnhancedItineraryData[]>(`${BACKEND_CONFIG.ITINERARY.BASE}/templates`);
  }

  async createTemplate(itineraryId: string, name: string, description?: string): Promise<ApiResponse<EnhancedItineraryData>> {
    return this.apiClient.post<EnhancedItineraryData>(`${BACKEND_CONFIG.ITINERARY.BASE}/templates`, {
      itineraryId,
      name,
      description
    });
  }
}

export class EnhancedItineraryServiceProvider implements ServiceProvider<EnhancedItineraryService> {
  createService(client: EnhancedApiClient): EnhancedItineraryService {
    return new EnhancedItineraryServiceImpl(client);
  }
}
