
import { useState } from 'react';
import { useApi } from '@/context/ApiContext';
import { SearchResult } from '@/services/api/searchService';
import { useDebounce } from './use-debounce';

export function useGlobalSearch() {
  const { searchService } = useApi();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  
  // Debounce the search query to avoid too many API calls
  const debouncedQuery = useDebounce(query, 300);
  
  // Load recent searches
  const loadRecentSearches = async () => {
    try {
      const response = await searchService.getRecentSearches();
      if (response.data) {
        setRecentSearches(response.data);
      }
    } catch (err) {
      console.error('Failed to load recent searches:', err);
    }
  };
  
  // Clear recent searches
  const clearRecentSearches = async () => {
    try {
      await searchService.clearRecentSearches();
      setRecentSearches([]);
    } catch (err) {
      console.error('Failed to clear recent searches:', err);
    }
  };
  
  // Perform search
  const performSearch = async (searchQuery: string, limit?: number) => {
    if (!searchQuery.trim()) {
      setResults([]);
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await searchService.search(searchQuery, { limit });
      if (response.data) {
        setResults(response.data);
      } else if (response.error) {
        setError(response.error);
      }
    } catch (err) {
      setError(err instanceof Error ? err : new Error('An unknown error occurred'));
    } finally {
      setIsLoading(false);
    }
  };
  
  // Update the search when the debounced query changes
  const handleSearch = async () => {
    await performSearch(debouncedQuery);
  };
  
  return {
    query,
    setQuery,
    results,
    isLoading,
    error,
    recentSearches,
    loadRecentSearches,
    clearRecentSearches,
    performSearch,
    handleSearch
  };
}
