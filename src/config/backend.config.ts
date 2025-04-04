
/**
 * Backend Configuration
 * Central configuration for API endpoints, authentication settings, and other backend-related parameters
 */

export const BACKEND_CONFIG = {
  // Base API URL (this would typically be an environment variable in production)
  API_URL: 'https://api.yourdomain.com',
  
  // API Version
  API_VERSION: 'v1',
  
  // Authentication endpoints
  AUTH: {
    LOGIN: '/auth/login',
    REFRESH: '/auth/refresh',
    REGISTER: '/auth/register',
    FORGOT_PASSWORD: '/auth/forgot-password',
    RESET_PASSWORD: '/auth/reset-password',
  },
  
  // Lead Management System endpoints
  LMS: {
    LEADS: '/leads',
    NOTES: '/notes',
    SEGMENTS: '/leads/segments',
    SCORE: '/leads/score-update',
    QUOTES: '/quotes',
    COMMUNICATION: {
      WHATSAPP: '/communication/whatsapp',
      EMAIL: '/communication/email',
    },
    AI: {
      SUMMARY: '/ai/summary',
      SUGGEST: '/ai/suggest',
    },
    SEARCH: '/search',
    SYNC: '/sync',
  },
  
  // Itinerary Builder endpoints
  ITINERARY: {
    BASE: '/itinerary',
    PREFERENCES: '/preferences',
    AI_RECOMMEND: '/ai-recommend',
    OPTIMIZE: '/optimize-route',
    COST: '/calculate-cost',
    PDF: '/pdf',
    APPROVE: '/approve',
  },
  
  // Admin endpoints
  ADMIN: {
    USERS: '/admin/users',
    ROLES: '/admin/roles',
  },
  
  // Request timeout in milliseconds
  TIMEOUT: 30000,
  
  // Maximum retries for failed requests
  MAX_RETRIES: 3,
  
  // Cache TTL (Time To Live) in seconds
  CACHE_TTL: {
    SHORT: 60, // 1 minute
    MEDIUM: 300, // 5 minutes
    LONG: 3600, // 1 hour
  },
};

/**
 * Utility function to build a complete API URL
 * @param endpoint - The API endpoint path
 * @returns The complete API URL
 */
export function getApiUrl(endpoint: string): string {
  return `${BACKEND_CONFIG.API_URL}/${BACKEND_CONFIG.API_VERSION}${endpoint}`;
}

export default BACKEND_CONFIG;
