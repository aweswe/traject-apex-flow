
import { ApiResponse } from './apiClient';
import { ServiceProvider } from './serviceFactory';
import { EnhancedApiClient } from './enhancedApiClient';
import { BACKEND_CONFIG } from '../../config/backend.config';

// AI model type
export type AIModel = 'gpt-4o' | 'deepseek-coder' | 'claude-3-opus' | 'claude-3-sonnet' | 'gemini-pro';

// Prompt template
export interface PromptTemplate {
  id: string;
  name: string;
  description: string;
  template: string;
  modelId: string;
  category: string;
  parameters: string[];
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

// AI completion request
export interface AICompletionRequest {
  prompt: string;
  model?: AIModel;
  temperature?: number;
  maxTokens?: number;
  options?: Record<string, any>;
}

// AI completion response
export interface AICompletionResponse {
  text: string;
  usage: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
  model: string;
}

// AI service interface
export interface AIService {
  // Text completion
  generateCompletion(request: AICompletionRequest): Promise<ApiResponse<AICompletionResponse>>;
  
  // Itinerary suggestions
  generateItinerarySuggestions(
    destination: string,
    duration: number,
    preferences: string[]
  ): Promise<ApiResponse<string>>;
  
  // Lead engagement suggestions
  generateLeadEngagementSuggestions(
    leadId: string
  ): Promise<ApiResponse<{ subject: string; message: string }>>;
  
  // Lead analysis
  analyzeLeadPotential(
    leadId: string
  ): Promise<ApiResponse<{
    score: number;
    explanation: string;
    recommendations: string[];
  }>>;
  
  // Activity recommendations
  recommendActivities(
    destination: string,
    interests: string[],
    budget: string
  ): Promise<ApiResponse<{
    activities: {
      name: string;
      description: string;
      estimatedCost: string;
      tags: string[];
    }[];
  }>>;
  
  // Prompt templates
  getPromptTemplates(): Promise<ApiResponse<PromptTemplate[]>>;
  getPromptTemplate(id: string): Promise<ApiResponse<PromptTemplate>>;
  createPromptTemplate(template: Partial<PromptTemplate>): Promise<ApiResponse<PromptTemplate>>;
  updatePromptTemplate(id: string, template: Partial<PromptTemplate>): Promise<ApiResponse<PromptTemplate>>;
  deletePromptTemplate(id: string): Promise<ApiResponse<void>>;
  
  // Models
  getAvailableModels(): Promise<ApiResponse<{
    id: string;
    name: string;
    description: string;
    maxTokens: number;
    costPer1KTokens: number;
  }[]>>;
}

// AI service implementation
class AIServiceImpl implements AIService {
  constructor(private apiClient: EnhancedApiClient) {}

  // Text completion
  async generateCompletion(request: AICompletionRequest): Promise<ApiResponse<AICompletionResponse>> {
    return this.apiClient.post<AICompletionResponse>('/ai/completion', request);
  }

  // Itinerary suggestions
  async generateItinerarySuggestions(
    destination: string,
    duration: number,
    preferences: string[]
  ): Promise<ApiResponse<string>> {
    return this.apiClient.post<string>('/ai/itinerary-suggestions', {
      destination,
      duration,
      preferences
    });
  }

  // Lead engagement suggestions
  async generateLeadEngagementSuggestions(
    leadId: string
  ): Promise<ApiResponse<{ subject: string; message: string }>> {
    return this.apiClient.get<{ subject: string; message: string }>(`/ai/lead-engagement/${leadId}`);
  }

  // Lead analysis
  async analyzeLeadPotential(
    leadId: string
  ): Promise<ApiResponse<{
    score: number;
    explanation: string;
    recommendations: string[];
  }>> {
    return this.apiClient.get<{
      score: number;
      explanation: string;
      recommendations: string[];
    }>(`/ai/lead-analysis/${leadId}`);
  }

  // Activity recommendations
  async recommendActivities(
    destination: string,
    interests: string[],
    budget: string
  ): Promise<ApiResponse<{
    activities: {
      name: string;
      description: string;
      estimatedCost: string;
      tags: string[];
    }[];
  }>> {
    return this.apiClient.post<{
      activities: {
        name: string;
        description: string;
        estimatedCost: string;
        tags: string[];
      }[];
    }>('/ai/recommend-activities', {
      destination,
      interests,
      budget
    });
  }

  // Prompt templates
  async getPromptTemplates(): Promise<ApiResponse<PromptTemplate[]>> {
    return this.apiClient.get<PromptTemplate[]>('/ai/prompt-templates');
  }

  async getPromptTemplate(id: string): Promise<ApiResponse<PromptTemplate>> {
    return this.apiClient.get<PromptTemplate>(`/ai/prompt-templates/${id}`);
  }

  async createPromptTemplate(template: Partial<PromptTemplate>): Promise<ApiResponse<PromptTemplate>> {
    return this.apiClient.post<PromptTemplate>('/ai/prompt-templates', template);
  }

  async updatePromptTemplate(id: string, template: Partial<PromptTemplate>): Promise<ApiResponse<PromptTemplate>> {
    return this.apiClient.put<PromptTemplate>(`/ai/prompt-templates/${id}`, template);
  }

  async deletePromptTemplate(id: string): Promise<ApiResponse<void>> {
    return this.apiClient.delete<void>(`/ai/prompt-templates/${id}`);
  }

  // Models
  async getAvailableModels(): Promise<ApiResponse<{
    id: string;
    name: string;
    description: string;
    maxTokens: number;
    costPer1KTokens: number;
  }[]>> {
    return this.apiClient.get<{
      id: string;
      name: string;
      description: string;
      maxTokens: number;
      costPer1KTokens: number;
    }[]>('/ai/models');
  }
}

export class AIServiceProvider implements ServiceProvider<AIService> {
  createService(client: EnhancedApiClient): AIService {
    return new AIServiceImpl(client);
  }
}
