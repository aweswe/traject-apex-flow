
import ApiClient, { ApiResponse } from './apiClient';
import { ServiceProvider } from './serviceFactory';

export interface LeadData {
  id: string;
  name: string;
  email: string;
  phone?: string;
  source?: string;
  status: 'new' | 'contacted' | 'qualified' | 'proposal' | 'closed' | 'lost';
  tags?: string[];
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface LeadFilter {
  status?: string;
  source?: string;
  dateRange?: { start: string; end: string };
  searchTerm?: string;
  tags?: string[];
  page?: number;
  limit?: number;
}

export interface LeadService {
  getLeads(filters?: LeadFilter): Promise<ApiResponse<LeadData[]>>;
  getLead(id: string): Promise<ApiResponse<LeadData>>;
  createLead(data: Partial<LeadData>): Promise<ApiResponse<LeadData>>;
  updateLead(id: string, data: Partial<LeadData>): Promise<ApiResponse<LeadData>>;
  deleteLead(id: string): Promise<ApiResponse<void>>;
  addNote(id: string, note: string): Promise<ApiResponse<LeadData>>;
  addTag(id: string, tag: string): Promise<ApiResponse<LeadData>>;
  removeTag(id: string, tag: string): Promise<ApiResponse<LeadData>>;
}

class LeadServiceImpl implements LeadService {
  constructor(private apiClient: ApiClient) {}

  async getLeads(filters?: LeadFilter): Promise<ApiResponse<LeadData[]>> {
    const params: Record<string, string> = {};
    
    if (filters) {
      if (filters.status) params.status = filters.status;
      if (filters.source) params.source = filters.source;
      if (filters.searchTerm) params.search = filters.searchTerm;
      if (filters.page) params.page = filters.page.toString();
      if (filters.limit) params.limit = filters.limit.toString();
      if (filters.tags && filters.tags.length > 0) params.tags = filters.tags.join(',');
      if (filters.dateRange) {
        params.startDate = filters.dateRange.start;
        params.endDate = filters.dateRange.end;
      }
    }
    
    return this.apiClient.get<LeadData[]>('/leads', params);
  }

  async getLead(id: string): Promise<ApiResponse<LeadData>> {
    return this.apiClient.get<LeadData>(`/leads/${id}`);
  }

  async createLead(data: Partial<LeadData>): Promise<ApiResponse<LeadData>> {
    return this.apiClient.post<LeadData>('/leads', data);
  }

  async updateLead(id: string, data: Partial<LeadData>): Promise<ApiResponse<LeadData>> {
    return this.apiClient.put<LeadData>(`/leads/${id}`, data);
  }

  async deleteLead(id: string): Promise<ApiResponse<void>> {
    return this.apiClient.delete<void>(`/leads/${id}`);
  }

  async addNote(id: string, note: string): Promise<ApiResponse<LeadData>> {
    return this.apiClient.post<LeadData>(`/leads/${id}/notes`, { note });
  }

  async addTag(id: string, tag: string): Promise<ApiResponse<LeadData>> {
    return this.apiClient.post<LeadData>(`/leads/${id}/tags`, { tag });
  }

  async removeTag(id: string, tag: string): Promise<ApiResponse<LeadData>> {
    return this.apiClient.delete<LeadData>(`/leads/${id}/tags/${tag}`);
  }
}

export class LeadServiceProvider implements ServiceProvider<LeadService> {
  createService(client: ApiClient): LeadService {
    return new LeadServiceImpl(client);
  }
}
