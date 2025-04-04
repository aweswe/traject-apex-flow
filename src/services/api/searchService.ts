
import ApiClient, { ApiResponse } from './apiClient';
import { ServiceProvider } from './serviceFactory';

export interface SearchResult {
  id: string;
  type: 'lead' | 'itinerary' | 'proposal' | 'note';
  title: string;
  excerpt: string;
  url: string;
  createdAt: string;
  updatedAt: string;
  matchScore: number;
}

export interface SearchService {
  search(query: string, filters?: SearchFilter): Promise<ApiResponse<SearchResult[]>>;
  getRecentSearches(): Promise<ApiResponse<string[]>>;
  clearRecentSearches(): Promise<ApiResponse<void>>;
}

export interface SearchFilter {
  types?: ('lead' | 'itinerary' | 'proposal' | 'note')[];
  dateRange?: { start: string; end: string };
  limit?: number;
}

class SearchServiceImpl implements SearchService {
  constructor(private apiClient: ApiClient) {}

  async search(query: string, filters?: SearchFilter): Promise<ApiResponse<SearchResult[]>> {
    const params: Record<string, string> = { query };
    
    if (filters) {
      if (filters.types && filters.types.length > 0) {
        params.types = filters.types.join(',');
      }
      if (filters.dateRange) {
        params.startDate = filters.dateRange.start;
        params.endDate = filters.dateRange.end;
      }
      if (filters.limit) {
        params.limit = filters.limit.toString();
      }
    }
    
    return this.apiClient.get<SearchResult[]>('/search', params);
  }

  async getRecentSearches(): Promise<ApiResponse<string[]>> {
    return this.apiClient.get<string[]>('/search/recent');
  }

  async clearRecentSearches(): Promise<ApiResponse<void>> {
    return this.apiClient.delete<void>('/search/recent');
  }
}

export class SearchServiceProvider implements ServiceProvider<SearchService> {
  createService(client: ApiClient): SearchService {
    return new SearchServiceImpl(client);
  }
}
