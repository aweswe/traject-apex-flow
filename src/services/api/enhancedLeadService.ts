
import { ApiResponse } from './apiClient';
import { ServiceProvider } from './serviceFactory';
import { LeadData, LeadFilter } from './leadService';
import { EnhancedApiClient } from './enhancedApiClient';
import { BACKEND_CONFIG } from '../../config/backend.config';

// Extended lead data with additional fields
export interface EnhancedLeadData extends LeadData {
  customerType?: 'individual' | 'corporate' | 'recurring';
  budget?: number;
  priority?: 'low' | 'medium' | 'high';
  probability?: number; // 0-100%
  assignedTo?: string; // User ID
  leadScore?: number; // AI-calculated score
  lastContactDate?: string;
  nextFollowUpDate?: string;
  timeline?: LeadTimelineEvent[];
  preferences?: LeadPreference[];
}

// Lead timeline event
export interface LeadTimelineEvent {
  id: string;
  type: 'note' | 'email' | 'call' | 'meeting' | 'whatsapp' | 'status_change' | 'quote_sent';
  title: string;
  description?: string;
  createdBy: string; // User ID
  createdAt: string;
}

// Lead preference
export interface LeadPreference {
  id: string;
  category: string; // e.g., 'accommodation', 'transportation', 'activity'
  value: string; // e.g., 'luxury', 'budget', 'adventure'
  importance: number; // 1-5
}

// Lead note with enhanced fields
export interface LeadNote {
  id: string;
  leadId: string;
  content: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  isPinned?: boolean;
  category?: string;
}

// AI generated summary
export interface LeadAISummary {
  summary: string;
  keyPoints: string[];
  suggestedActions: string[];
  generatedAt: string;
}

// Email/WhatsApp communication
export interface LeadCommunication {
  id: string;
  leadId: string;
  type: 'email' | 'whatsapp';
  subject?: string;
  content: string;
  sentAt: string;
  status: 'draft' | 'sent' | 'delivered' | 'read' | 'failed';
  attachments?: string[];
}

// Enhanced lead service interface
export interface EnhancedLeadService {
  // Core CRUD operations
  getLeads(filters?: LeadFilter): Promise<ApiResponse<EnhancedLeadData[]>>;
  getLead(id: string): Promise<ApiResponse<EnhancedLeadData>>;
  createLead(data: Partial<EnhancedLeadData>): Promise<ApiResponse<EnhancedLeadData>>;
  updateLead(id: string, data: Partial<EnhancedLeadData>): Promise<ApiResponse<EnhancedLeadData>>;
  deleteLead(id: string): Promise<ApiResponse<void>>;
  
  // Notes management
  getNotes(leadId: string): Promise<ApiResponse<LeadNote[]>>;
  addNote(leadId: string, note: string, category?: string): Promise<ApiResponse<LeadNote>>;
  updateNote(noteId: string, data: Partial<LeadNote>): Promise<ApiResponse<LeadNote>>;
  deleteNote(noteId: string): Promise<ApiResponse<void>>;
  
  // Timeline
  getTimeline(leadId: string): Promise<ApiResponse<LeadTimelineEvent[]>>;
  addTimelineEvent(leadId: string, event: Partial<LeadTimelineEvent>): Promise<ApiResponse<LeadTimelineEvent>>;
  
  // Preferences
  getPreferences(leadId: string): Promise<ApiResponse<LeadPreference[]>>;
  updatePreferences(leadId: string, preferences: Partial<LeadPreference>[]): Promise<ApiResponse<LeadPreference[]>>;
  
  // Segmentation & Scoring
  getSegments(): Promise<ApiResponse<string[]>>;
  scoreLeads(leadIds: string[]): Promise<ApiResponse<{ id: string; score: number }[]>>;
  
  // Communication
  sendEmail(leadId: string, email: { subject: string; content: string; attachments?: string[] }): Promise<ApiResponse<LeadCommunication>>;
  sendWhatsApp(leadId: string, message: { content: string; attachments?: string[] }): Promise<ApiResponse<LeadCommunication>>;
  getCommunicationHistory(leadId: string): Promise<ApiResponse<LeadCommunication[]>>;
  
  // AI Integration
  getAISummary(leadId: string): Promise<ApiResponse<LeadAISummary>>;
  getAISuggestions(leadId: string): Promise<ApiResponse<string[]>>;
  
  // Tagging
  addTag(id: string, tag: string): Promise<ApiResponse<EnhancedLeadData>>;
  removeTag(id: string, tag: string): Promise<ApiResponse<EnhancedLeadData>>;
  
  // Duplicate detection
  checkDuplicates(data: Partial<EnhancedLeadData>): Promise<ApiResponse<EnhancedLeadData[]>>;
  
  // Offline sync
  syncOfflineData(): Promise<ApiResponse<{ synced: number; failed: number }>>;
}

// Implementation of the enhanced lead service
class EnhancedLeadServiceImpl implements EnhancedLeadService {
  constructor(private apiClient: EnhancedApiClient) {}

  async getLeads(filters?: LeadFilter): Promise<ApiResponse<EnhancedLeadData[]>> {
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
    
    return this.apiClient.get<EnhancedLeadData[]>(`${BACKEND_CONFIG.LMS.LEADS}`, params);
  }

  async getLead(id: string): Promise<ApiResponse<EnhancedLeadData>> {
    return this.apiClient.get<EnhancedLeadData>(`${BACKEND_CONFIG.LMS.LEADS}/${id}`);
  }

  async createLead(data: Partial<EnhancedLeadData>): Promise<ApiResponse<EnhancedLeadData>> {
    return this.apiClient.post<EnhancedLeadData>(`${BACKEND_CONFIG.LMS.LEADS}`, data);
  }

  async updateLead(id: string, data: Partial<EnhancedLeadData>): Promise<ApiResponse<EnhancedLeadData>> {
    return this.apiClient.put<EnhancedLeadData>(`${BACKEND_CONFIG.LMS.LEADS}/${id}`, data);
  }

  async deleteLead(id: string): Promise<ApiResponse<void>> {
    return this.apiClient.delete<void>(`${BACKEND_CONFIG.LMS.LEADS}/${id}`);
  }

  // Notes management
  async getNotes(leadId: string): Promise<ApiResponse<LeadNote[]>> {
    return this.apiClient.get<LeadNote[]>(`${BACKEND_CONFIG.LMS.LEADS}/${leadId}/notes`);
  }

  async addNote(leadId: string, note: string, category?: string): Promise<ApiResponse<LeadNote>> {
    return this.apiClient.post<LeadNote>(`${BACKEND_CONFIG.LMS.LEADS}/${leadId}/notes`, { 
      content: note, 
      category 
    });
  }

  async updateNote(noteId: string, data: Partial<LeadNote>): Promise<ApiResponse<LeadNote>> {
    return this.apiClient.put<LeadNote>(`${BACKEND_CONFIG.LMS.NOTES}/${noteId}`, data);
  }

  async deleteNote(noteId: string): Promise<ApiResponse<void>> {
    return this.apiClient.delete<void>(`${BACKEND_CONFIG.LMS.NOTES}/${noteId}`);
  }

  // Timeline
  async getTimeline(leadId: string): Promise<ApiResponse<LeadTimelineEvent[]>> {
    return this.apiClient.get<LeadTimelineEvent[]>(`${BACKEND_CONFIG.LMS.LEADS}/${leadId}/timeline`);
  }

  async addTimelineEvent(leadId: string, event: Partial<LeadTimelineEvent>): Promise<ApiResponse<LeadTimelineEvent>> {
    return this.apiClient.post<LeadTimelineEvent>(`${BACKEND_CONFIG.LMS.LEADS}/${leadId}/timeline`, event);
  }

  // Preferences
  async getPreferences(leadId: string): Promise<ApiResponse<LeadPreference[]>> {
    return this.apiClient.get<LeadPreference[]>(`${BACKEND_CONFIG.LMS.LEADS}/${leadId}/preferences`);
  }

  async updatePreferences(leadId: string, preferences: Partial<LeadPreference>[]): Promise<ApiResponse<LeadPreference[]>> {
    return this.apiClient.put<LeadPreference[]>(`${BACKEND_CONFIG.LMS.LEADS}/${leadId}/preferences`, { preferences });
  }

  // Segmentation & Scoring
  async getSegments(): Promise<ApiResponse<string[]>> {
    return this.apiClient.get<string[]>(`${BACKEND_CONFIG.LMS.SEGMENTS}`);
  }

  async scoreLeads(leadIds: string[]): Promise<ApiResponse<{ id: string; score: number }[]>> {
    return this.apiClient.post<{ id: string; score: number }[]>(`${BACKEND_CONFIG.LMS.SCORE}`, { leadIds });
  }

  // Communication
  async sendEmail(leadId: string, email: { subject: string; content: string; attachments?: string[] }): Promise<ApiResponse<LeadCommunication>> {
    return this.apiClient.post<LeadCommunication>(`${BACKEND_CONFIG.LMS.LEADS}/${leadId}${BACKEND_CONFIG.LMS.COMMUNICATION.EMAIL}`, email);
  }

  async sendWhatsApp(leadId: string, message: { content: string; attachments?: string[] }): Promise<ApiResponse<LeadCommunication>> {
    return this.apiClient.post<LeadCommunication>(`${BACKEND_CONFIG.LMS.LEADS}/${leadId}${BACKEND_CONFIG.LMS.COMMUNICATION.WHATSAPP}`, message);
  }

  async getCommunicationHistory(leadId: string): Promise<ApiResponse<LeadCommunication[]>> {
    return this.apiClient.get<LeadCommunication[]>(`${BACKEND_CONFIG.LMS.LEADS}/${leadId}/communications`);
  }

  // AI Integration
  async getAISummary(leadId: string): Promise<ApiResponse<LeadAISummary>> {
    return this.apiClient.get<LeadAISummary>(`${BACKEND_CONFIG.LMS.LEADS}/${leadId}${BACKEND_CONFIG.LMS.AI.SUMMARY}`);
  }

  async getAISuggestions(leadId: string): Promise<ApiResponse<string[]>> {
    return this.apiClient.get<string[]>(`${BACKEND_CONFIG.LMS.LEADS}/${leadId}${BACKEND_CONFIG.LMS.AI.SUGGEST}`);
  }

  // Tagging
  async addTag(id: string, tag: string): Promise<ApiResponse<EnhancedLeadData>> {
    return this.apiClient.post<EnhancedLeadData>(`${BACKEND_CONFIG.LMS.LEADS}/${id}/tags`, { tag });
  }

  async removeTag(id: string, tag: string): Promise<ApiResponse<EnhancedLeadData>> {
    return this.apiClient.delete<EnhancedLeadData>(`${BACKEND_CONFIG.LMS.LEADS}/${id}/tags/${tag}`);
  }

  // Duplicate detection
  async checkDuplicates(data: Partial<EnhancedLeadData>): Promise<ApiResponse<EnhancedLeadData[]>> {
    return this.apiClient.post<EnhancedLeadData[]>(`${BACKEND_CONFIG.LMS.LEADS}/duplicate-check`, data);
  }

  // Offline sync
  async syncOfflineData(): Promise<ApiResponse<{ synced: number; failed: number }>> {
    return this.apiClient.post<{ synced: number; failed: number }>(`${BACKEND_CONFIG.LMS.SYNC}`, {});
  }
}

export class EnhancedLeadServiceProvider implements ServiceProvider<EnhancedLeadService> {
  createService(client: EnhancedApiClient): EnhancedLeadService {
    return new EnhancedLeadServiceImpl(client);
  }
}
