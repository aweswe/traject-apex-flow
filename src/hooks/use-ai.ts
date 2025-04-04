
import { useState, useCallback } from 'react';
import { AIService } from '@/services/api/aiService';
import { useEnhancedApi } from '@/context/EnhancedApiContext';
import { toast } from "sonner";

interface UseAIOptions {
  showToast?: boolean;
}

export function useAI(options: UseAIOptions = {}) {
  const { showToast = true } = options;
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  
  // Get AI service from context
  const { authService, leadService, itineraryService } = useEnhancedApi();

  // Generate lead response suggestions
  const generateLeadResponseSuggestion = useCallback(async (leadId: string) => {
    setIsGenerating(true);
    setError(null);
    
    try {
      // This would normally call the AIService directly
      // For now simulate with a simple timeout
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // For demo purposes, return fixed suggestions
      const suggestions = {
        subject: "Follow-up on your travel inquiry",
        message: "Thank you for your interest in our travel services. Based on your preferences, I've put together some initial ideas that might interest you. Would you be available for a quick call this week to discuss these options further?"
      };
      
      if (showToast) {
        toast.success("AI suggestion generated");
      }
      
      return suggestions;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to generate suggestion');
      setError(error);
      
      if (showToast) {
        toast.error("Failed to generate suggestion", {
          description: error.message
        });
      }
      
      throw error;
    } finally {
      setIsGenerating(false);
    }
  }, [showToast]);
  
  // Generate itinerary suggestions
  const generateItinerarySuggestions = useCallback(async (destination: string, duration: number, preferences: string[]) => {
    setIsGenerating(true);
    setError(null);
    
    try {
      // This would normally call the AIService directly
      // For now simulate with a simple timeout
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // For demo purposes, return a fixed suggestion
      const suggestion = `Here's a ${duration}-day itinerary for ${destination}:\n\n` +
        `Day 1: Arrival and city exploration\n` +
        `Day 2: Cultural attractions and local cuisine\n` +
        `Day 3: Nature excursion with hiking${duration > 3 ? '\n' + 
        `Day 4: Beach day and water activities\n` +
        `Day 5: Shopping and farewell dinner` : ''}`;
      
      if (showToast) {
        toast.success("Itinerary suggestion generated");
      }
      
      return suggestion;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to generate itinerary suggestion');
      setError(error);
      
      if (showToast) {
        toast.error("Failed to generate itinerary suggestion", {
          description: error.message
        });
      }
      
      throw error;
    } finally {
      setIsGenerating(false);
    }
  }, [showToast]);
  
  // Generate activity recommendations
  const generateActivityRecommendations = useCallback(async (destination: string, interests: string[], budget: string) => {
    setIsGenerating(true);
    setError(null);
    
    try {
      // This would normally call the AIService directly
      // For now simulate with a simple timeout
      await new Promise(resolve => setTimeout(resolve, 1800));
      
      // For demo purposes, return fixed recommendations
      const recommendations = {
        activities: [
          {
            name: "Guided Historical Walking Tour",
            description: `Explore the rich history of ${destination} with a knowledgeable local guide.`,
            estimatedCost: budget === 'luxury' ? "$100 per person" : "$40 per person",
            tags: ["cultural", "educational", "walking"]
          },
          {
            name: "Sunset Sailing Experience",
            description: "Enjoy the breathtaking sunset views from the water with refreshments included.",
            estimatedCost: budget === 'luxury' ? "$150 per person" : "$75 per person",
            tags: ["romantic", "relaxing", "water"]
          },
          {
            name: "Local Cooking Class",
            description: "Learn to prepare authentic local dishes with fresh ingredients from the market.",
            estimatedCost: budget === 'luxury' ? "$120 per person" : "$60 per person",
            tags: ["culinary", "cultural", "hands-on"]
          }
        ]
      };
      
      if (showToast) {
        toast.success("Activity recommendations generated");
      }
      
      return recommendations;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to generate activity recommendations');
      setError(error);
      
      if (showToast) {
        toast.error("Failed to generate activity recommendations", {
          description: error.message
        });
      }
      
      throw error;
    } finally {
      setIsGenerating(false);
    }
  }, [showToast]);
  
  // Analyze lead potential
  const analyzeLeadPotential = useCallback(async (leadId: string) => {
    setIsGenerating(true);
    setError(null);
    
    try {
      // This would normally call the AIService directly
      // For now simulate with a simple timeout
      await new Promise(resolve => setTimeout(resolve, 1200));
      
      // For demo purposes, return a fixed analysis
      const analysis = {
        score: 85,
        explanation: "High engagement level with multiple interactions. Budget aligns with premium packages. Timeline indicates decision within 2 weeks.",
        recommendations: [
          "Offer personalized itinerary with premium accommodations",
          "Highlight unique local experiences",
          "Schedule a video call within the next 48 hours"
        ]
      };
      
      if (showToast) {
        toast.success("Lead analysis completed");
      }
      
      return analysis;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to analyze lead potential');
      setError(error);
      
      if (showToast) {
        toast.error("Failed to analyze lead potential", {
          description: error.message
        });
      }
      
      throw error;
    } finally {
      setIsGenerating(false);
    }
  }, [showToast]);
  
  return {
    isGenerating,
    error,
    generateLeadResponseSuggestion,
    generateItinerarySuggestions,
    generateActivityRecommendations,
    analyzeLeadPotential
  };
}
