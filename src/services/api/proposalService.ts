
import ApiClient, { ApiResponse } from './apiClient';
import { ServiceProvider } from './serviceFactory';

export interface ProposalData {
  id: string;
  title: string;
  leadId: string;
  itineraryId: string;
  status: 'draft' | 'sent' | 'viewed' | 'accepted' | 'declined';
  validUntil?: string;
  totalCost: number;
  discount?: number;
  tax?: number;
  currency?: string;
  notes?: string;
  paymentTerms?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ProposalTemplate {
  id: string;
  name: string;
  description?: string;
  thumbnailUrl?: string;
}

export interface ProposalService {
  getProposals(): Promise<ApiResponse<ProposalData[]>>;
  getProposal(id: string): Promise<ApiResponse<ProposalData>>;
  createProposal(data: Partial<ProposalData>): Promise<ApiResponse<ProposalData>>;
  updateProposal(id: string, data: Partial<ProposalData>): Promise<ApiResponse<ProposalData>>;
  deleteProposal(id: string): Promise<ApiResponse<void>>;
  generatePdf(id: string, templateId: string): Promise<ApiResponse<{ url: string }>>;
  getTemplates(): Promise<ApiResponse<ProposalTemplate[]>>;
  sendProposal(id: string, email: string): Promise<ApiResponse<void>>;
  trackViewStatus(id: string): Promise<ApiResponse<{ viewed: boolean; viewedAt?: string }>>;
}

class ProposalServiceImpl implements ProposalService {
  constructor(private apiClient: ApiClient) {}

  async getProposals(): Promise<ApiResponse<ProposalData[]>> {
    return this.apiClient.get<ProposalData[]>('/proposals');
  }

  async getProposal(id: string): Promise<ApiResponse<ProposalData>> {
    return this.apiClient.get<ProposalData>(`/proposals/${id}`);
  }

  async createProposal(data: Partial<ProposalData>): Promise<ApiResponse<ProposalData>> {
    return this.apiClient.post<ProposalData>('/proposals', data);
  }

  async updateProposal(id: string, data: Partial<ProposalData>): Promise<ApiResponse<ProposalData>> {
    return this.apiClient.put<ProposalData>(`/proposals/${id}`, data);
  }

  async deleteProposal(id: string): Promise<ApiResponse<void>> {
    return this.apiClient.delete<void>(`/proposals/${id}`);
  }

  async generatePdf(id: string, templateId: string): Promise<ApiResponse<{ url: string }>> {
    return this.apiClient.post<{ url: string }>(`/proposals/${id}/generate-pdf`, { templateId });
  }

  async getTemplates(): Promise<ApiResponse<ProposalTemplate[]>> {
    return this.apiClient.get<ProposalTemplate[]>('/proposal-templates');
  }

  async sendProposal(id: string, email: string): Promise<ApiResponse<void>> {
    return this.apiClient.post<void>(`/proposals/${id}/send`, { email });
  }

  async trackViewStatus(id: string): Promise<ApiResponse<{ viewed: boolean; viewedAt?: string }>> {
    return this.apiClient.get<{ viewed: boolean; viewedAt?: string }>(`/proposals/${id}/track`);
  }
}

export class ProposalServiceProvider implements ServiceProvider<ProposalService> {
  createService(client: ApiClient): ProposalService {
    return new ProposalServiceImpl(client);
  }
}
