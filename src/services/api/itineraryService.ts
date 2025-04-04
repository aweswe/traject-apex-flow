
import ApiClient, { ApiResponse } from './apiClient';
import { ServiceProvider } from './serviceFactory';

export interface ItineraryDay {
  id: string;
  day: number;
  activities: ItineraryActivity[];
  accommodation?: Accommodation;
  meals?: string[];
  notes?: string;
}

export interface ItineraryActivity {
  id: string;
  title: string;
  description: string;
  startTime?: string;
  endTime?: string;
  location?: {
    name: string;
    coordinates?: { lat: number; lng: number };
  };
  cost?: number;
  images?: string[];
  included: boolean;
}

export interface Accommodation {
  id: string;
  name: string;
  description?: string;
  location?: string;
  roomType?: string;
  checkIn?: string;
  checkOut?: string;
  cost?: number;
  images?: string[];
}

export interface ItineraryData {
  id: string;
  title: string;
  destination: string;
  duration: number;
  startDate?: string;
  endDate?: string;
  days: ItineraryDay[];
  totalCost?: number;
  status: 'draft' | 'published' | 'archived';
  createdAt: string;
  updatedAt: string;
}

export interface ItineraryService {
  getItineraries(): Promise<ApiResponse<ItineraryData[]>>;
  getItinerary(id: string): Promise<ApiResponse<ItineraryData>>;
  createItinerary(data: Partial<ItineraryData>): Promise<ApiResponse<ItineraryData>>;
  updateItinerary(id: string, data: Partial<ItineraryData>): Promise<ApiResponse<ItineraryData>>;
  deleteItinerary(id: string): Promise<ApiResponse<void>>;
  addDay(id: string, day: Partial<ItineraryDay>): Promise<ApiResponse<ItineraryData>>;
  updateDay(id: string, dayId: string, day: Partial<ItineraryDay>): Promise<ApiResponse<ItineraryData>>;
  removeDay(id: string, dayId: string): Promise<ApiResponse<ItineraryData>>;
  addActivity(id: string, dayId: string, activity: Partial<ItineraryActivity>): Promise<ApiResponse<ItineraryData>>;
  updateActivity(id: string, dayId: string, activityId: string, activity: Partial<ItineraryActivity>): Promise<ApiResponse<ItineraryData>>;
  removeActivity(id: string, dayId: string, activityId: string): Promise<ApiResponse<ItineraryData>>;
  getAiSuggestions(prompt: string, destination: string): Promise<ApiResponse<ItineraryActivity[]>>;
}

class ItineraryServiceImpl implements ItineraryService {
  constructor(private apiClient: ApiClient) {}

  async getItineraries(): Promise<ApiResponse<ItineraryData[]>> {
    return this.apiClient.get<ItineraryData[]>('/itineraries');
  }

  async getItinerary(id: string): Promise<ApiResponse<ItineraryData>> {
    return this.apiClient.get<ItineraryData>(`/itineraries/${id}`);
  }

  async createItinerary(data: Partial<ItineraryData>): Promise<ApiResponse<ItineraryData>> {
    return this.apiClient.post<ItineraryData>('/itineraries', data);
  }

  async updateItinerary(id: string, data: Partial<ItineraryData>): Promise<ApiResponse<ItineraryData>> {
    return this.apiClient.put<ItineraryData>(`/itineraries/${id}`, data);
  }

  async deleteItinerary(id: string): Promise<ApiResponse<void>> {
    return this.apiClient.delete<void>(`/itineraries/${id}`);
  }

  async addDay(id: string, day: Partial<ItineraryDay>): Promise<ApiResponse<ItineraryData>> {
    return this.apiClient.post<ItineraryData>(`/itineraries/${id}/days`, day);
  }

  async updateDay(id: string, dayId: string, day: Partial<ItineraryDay>): Promise<ApiResponse<ItineraryData>> {
    return this.apiClient.put<ItineraryData>(`/itineraries/${id}/days/${dayId}`, day);
  }

  async removeDay(id: string, dayId: string): Promise<ApiResponse<ItineraryData>> {
    return this.apiClient.delete<ItineraryData>(`/itineraries/${id}/days/${dayId}`);
  }

  async addActivity(id: string, dayId: string, activity: Partial<ItineraryActivity>): Promise<ApiResponse<ItineraryData>> {
    return this.apiClient.post<ItineraryData>(`/itineraries/${id}/days/${dayId}/activities`, activity);
  }

  async updateActivity(id: string, dayId: string, activityId: string, activity: Partial<ItineraryActivity>): Promise<ApiResponse<ItineraryData>> {
    return this.apiClient.put<ItineraryData>(`/itineraries/${id}/days/${dayId}/activities/${activityId}`, activity);
  }

  async removeActivity(id: string, dayId: string, activityId: string): Promise<ApiResponse<ItineraryData>> {
    return this.apiClient.delete<ItineraryData>(`/itineraries/${id}/days/${dayId}/activities/${activityId}`);
  }

  async getAiSuggestions(prompt: string, destination: string): Promise<ApiResponse<ItineraryActivity[]>> {
    return this.apiClient.post<ItineraryActivity[]>('/itineraries/ai-suggestions', { prompt, destination });
  }
}

export class ItineraryServiceProvider implements ServiceProvider<ItineraryService> {
  createService(client: ApiClient): ItineraryService {
    return new ItineraryServiceImpl(client);
  }
}
