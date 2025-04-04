
import { ApiResponse } from './apiClient';
import { ServiceProvider } from './serviceFactory';
import { ProposalData, ProposalTemplate } from './proposalService';
import { EnhancedApiClient } from './enhancedApiClient';
import { BACKEND_CONFIG } from '../../config/backend.config';

// Enhanced proposal data with additional fields
export interface EnhancedProposalData extends ProposalData {
  clientEmail?: string;
  clientName?: string;
  coverImage?: string;
  includedServices: string[];
  excludedServices: string[];
  paymentSchedule?: PaymentSchedule[];
  termsAndConditions?: string;
  cancellationPolicy?: string;
  customSections?: CustomSection[];
  lastViewed?: string;
  viewCount?: number;
  expiryDate: string;
  additionalFees?: AdditionalFee[];
  version: number;
  revisionHistory?: RevisionHistory[];
  theme?: string;
}

// Payment schedule
export interface PaymentSchedule {
  id: string;
  description: string;
  amount: number;
  dueDate: string;
  isPaid: boolean;
  paymentMethod?: string;
  paymentId?: string;
}

// Custom section in proposal
export interface CustomSection {
  id: string;
  title: string;
  content: string;
  order: number;
  type: 'text' | 'images' | 'table' | 'list';
  data?: any;
}

// Additional fees
export interface AdditionalFee {
  id: string;
  description: string;
  amount: number;
  isOptional: boolean;
  isPerPerson: boolean;
}

// Revision history
export interface RevisionHistory {
  id: string;
  date: string;
  userId: string;
  userName: string;
  changes: string[];
}

// Enhanced proposal template
export interface EnhancedProposalTemplate extends ProposalTemplate {
  sections: string[];
  previewImages: string[];
  category: string;
  isDefault: boolean;
  createdBy: string;
  createdAt: string;
}

// Theme for proposals
export interface ProposalTheme {
  id: string;
  name: string;
  primaryColor: string;
  secondaryColor: string;
  fontFamily: string;
  preview: string;
  isDefault: boolean;
}

// Feedback from client
export interface ProposalFeedback {
  id: string;
  proposalId: string;
  type: 'comment' | 'rating' | 'edit-request';
  content: string;
  section?: string;
  createdAt: string;
  clientName?: string;
}

// Enhanced proposal service
export interface EnhancedProposalService {
  // Core CRUD operations
  getProposals(leadId?: string): Promise<ApiResponse<EnhancedProposalData[]>>;
  getProposal(id: string): Promise<ApiResponse<EnhancedProposalData>>;
  createProposal(data: Partial<EnhancedProposalData>): Promise<ApiResponse<EnhancedProposalData>>;
  updateProposal(id: string, data: Partial<EnhancedProposalData>): Promise<ApiResponse<EnhancedProposalData>>;
  deleteProposal(id: string): Promise<ApiResponse<void>>;
  duplicateProposal(id: string, newName?: string): Promise<ApiResponse<EnhancedProposalData>>;
  
  // Templates
  getTemplates(): Promise<ApiResponse<EnhancedProposalTemplate[]>>;
  getTemplate(id: string): Promise<ApiResponse<EnhancedProposalTemplate>>;
  createTemplate(data: Partial<EnhancedProposalTemplate>): Promise<ApiResponse<EnhancedProposalTemplate>>;
  
  // Themes
  getThemes(): Promise<ApiResponse<ProposalTheme[]>>;
  
  // PDF generation
  generatePdf(id: string, templateId: string, theme?: string): Promise<ApiResponse<{ url: string }>>;
  
  // Sending and tracking
  sendProposal(id: string, email: string, message?: string): Promise<ApiResponse<{ sent: boolean; error?: string }>>;
  trackViewStatus(id: string): Promise<ApiResponse<{ viewed: boolean; viewedAt?: string; viewCount: number }>>;
  getViewAnalytics(id: string): Promise<ApiResponse<{
    views: { date: string; count: number }[];
    avgTimeSpent: number;
    mostViewedSections: { section: string; views: number }[];
  }>>;
  
  // Payment schedules
  addPaymentSchedule(id: string, schedule: Partial<PaymentSchedule>): Promise<ApiResponse<EnhancedProposalData>>;
  updatePaymentSchedule(id: string, scheduleId: string, data: Partial<PaymentSchedule>): Promise<ApiResponse<EnhancedProposalData>>;
  removePaymentSchedule(id: string, scheduleId: string): Promise<ApiResponse<EnhancedProposalData>>;
  
  // Custom sections
  addCustomSection(id: string, section: Partial<CustomSection>): Promise<ApiResponse<EnhancedProposalData>>;
  updateCustomSection(id: string, sectionId: string, data: Partial<CustomSection>): Promise<ApiResponse<EnhancedProposalData>>;
  removeCustomSection(id: string, sectionId: string): Promise<ApiResponse<EnhancedProposalData>>;
  reorderCustomSections(id: string, sectionIds: string[]): Promise<ApiResponse<EnhancedProposalData>>;
  
  // Client feedback
  getFeedback(id: string): Promise<ApiResponse<ProposalFeedback[]>>;
  respondToFeedback(id: string, feedbackId: string, response: string): Promise<ApiResponse<ProposalFeedback>>;
  
  // Version control
  getRevisionHistory(id: string): Promise<ApiResponse<RevisionHistory[]>>;
  revertToVersion(id: string, versionId: string): Promise<ApiResponse<EnhancedProposalData>>;
}

// Implementation of the enhanced proposal service
class EnhancedProposalServiceImpl implements EnhancedProposalService {
  constructor(private apiClient: EnhancedApiClient) {}

  // Core CRUD operations
  async getProposals(leadId?: string): Promise<ApiResponse<EnhancedProposalData[]>> {
    const params: Record<string, string> = {};
    if (leadId) {
      params.leadId = leadId;
    }
    return this.apiClient.get<EnhancedProposalData[]>('/proposals', params);
  }

  async getProposal(id: string): Promise<ApiResponse<EnhancedProposalData>> {
    return this.apiClient.get<EnhancedProposalData>(`/proposals/${id}`);
  }

  async createProposal(data: Partial<EnhancedProposalData>): Promise<ApiResponse<EnhancedProposalData>> {
    return this.apiClient.post<EnhancedProposalData>('/proposals', data);
  }

  async updateProposal(id: string, data: Partial<EnhancedProposalData>): Promise<ApiResponse<EnhancedProposalData>> {
    return this.apiClient.put<EnhancedProposalData>(`/proposals/${id}`, data);
  }

  async deleteProposal(id: string): Promise<ApiResponse<void>> {
    return this.apiClient.delete<void>(`/proposals/${id}`);
  }

  async duplicateProposal(id: string, newName?: string): Promise<ApiResponse<EnhancedProposalData>> {
    return this.apiClient.post<EnhancedProposalData>(`/proposals/${id}/duplicate`, { newName });
  }

  // Templates
  async getTemplates(): Promise<ApiResponse<EnhancedProposalTemplate[]>> {
    return this.apiClient.get<EnhancedProposalTemplate[]>('/proposal-templates');
  }

  async getTemplate(id: string): Promise<ApiResponse<EnhancedProposalTemplate>> {
    return this.apiClient.get<EnhancedProposalTemplate>(`/proposal-templates/${id}`);
  }

  async createTemplate(data: Partial<EnhancedProposalTemplate>): Promise<ApiResponse<EnhancedProposalTemplate>> {
    return this.apiClient.post<EnhancedProposalTemplate>('/proposal-templates', data);
  }

  // Themes
  async getThemes(): Promise<ApiResponse<ProposalTheme[]>> {
    return this.apiClient.get<ProposalTheme[]>('/proposal-themes');
  }

  // PDF generation
  async generatePdf(id: string, templateId: string, theme?: string): Promise<ApiResponse<{ url: string }>> {
    return this.apiClient.post<{ url: string }>(`/proposals/${id}/generate-pdf`, { templateId, theme });
  }

  // Sending and tracking
  async sendProposal(id: string, email: string, message?: string): Promise<ApiResponse<{ sent: boolean; error?: string }>> {
    return this.apiClient.post<{ sent: boolean; error?: string }>(`/proposals/${id}/send`, { email, message });
  }

  async trackViewStatus(id: string): Promise<ApiResponse<{ viewed: boolean; viewedAt?: string; viewCount: number }>> {
    return this.apiClient.get<{ viewed: boolean; viewedAt?: string; viewCount: number }>(`/proposals/${id}/track`);
  }

  async getViewAnalytics(id: string): Promise<ApiResponse<{
    views: { date: string; count: number }[];
    avgTimeSpent: number;
    mostViewedSections: { section: string; views: number }[];
  }>> {
    return this.apiClient.get<{
      views: { date: string; count: number }[];
      avgTimeSpent: number;
      mostViewedSections: { section: string; views: number }[];
    }>(`/proposals/${id}/analytics`);
  }

  // Payment schedules
  async addPaymentSchedule(id: string, schedule: Partial<PaymentSchedule>): Promise<ApiResponse<EnhancedProposalData>> {
    return this.apiClient.post<EnhancedProposalData>(`/proposals/${id}/payment-schedule`, schedule);
  }

  async updatePaymentSchedule(id: string, scheduleId: string, data: Partial<PaymentSchedule>): Promise<ApiResponse<EnhancedProposalData>> {
    return this.apiClient.put<EnhancedProposalData>(`/proposals/${id}/payment-schedule/${scheduleId}`, data);
  }

  async removePaymentSchedule(id: string, scheduleId: string): Promise<ApiResponse<EnhancedProposalData>> {
    return this.apiClient.delete<EnhancedProposalData>(`/proposals/${id}/payment-schedule/${scheduleId}`);
  }

  // Custom sections
  async addCustomSection(id: string, section: Partial<CustomSection>): Promise<ApiResponse<EnhancedProposalData>> {
    return this.apiClient.post<EnhancedProposalData>(`/proposals/${id}/sections`, section);
  }

  async updateCustomSection(id: string, sectionId: string, data: Partial<CustomSection>): Promise<ApiResponse<EnhancedProposalData>> {
    return this.apiClient.put<EnhancedProposalData>(`/proposals/${id}/sections/${sectionId}`, data);
  }

  async removeCustomSection(id: string, sectionId: string): Promise<ApiResponse<EnhancedProposalData>> {
    return this.apiClient.delete<EnhancedProposalData>(`/proposals/${id}/sections/${sectionId}`);
  }

  async reorderCustomSections(id: string, sectionIds: string[]): Promise<ApiResponse<EnhancedProposalData>> {
    return this.apiClient.put<EnhancedProposalData>(`/proposals/${id}/sections/reorder`, { sectionIds });
  }

  // Client feedback
  async getFeedback(id: string): Promise<ApiResponse<ProposalFeedback[]>> {
    return this.apiClient.get<ProposalFeedback[]>(`/proposals/${id}/feedback`);
  }

  async respondToFeedback(id: string, feedbackId: string, response: string): Promise<ApiResponse<ProposalFeedback>> {
    return this.apiClient.post<ProposalFeedback>(`/proposals/${id}/feedback/${feedbackId}/respond`, { response });
  }

  // Version control
  async getRevisionHistory(id: string): Promise<ApiResponse<RevisionHistory[]>> {
    return this.apiClient.get<RevisionHistory[]>(`/proposals/${id}/revisions`);
  }

  async revertToVersion(id: string, versionId: string): Promise<ApiResponse<EnhancedProposalData>> {
    return this.apiClient.post<EnhancedProposalData>(`/proposals/${id}/revert`, { versionId });
  }
}

export class EnhancedProposalServiceProvider implements ServiceProvider<EnhancedProposalService> {
  createService(client: EnhancedApiClient): EnhancedProposalService {
    return new EnhancedProposalServiceImpl(client);
  }
}
