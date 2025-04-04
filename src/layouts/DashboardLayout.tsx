
import { Outlet, Navigate, useLocation } from "react-router-dom";
import { useState, useEffect, Suspense } from "react";
import { useUser } from "@/context/UserContext";
import Sidebar from "@/components/dashboard/Sidebar";
import Header from "@/components/dashboard/Header";
import { useNotifications } from "@/hooks/use-notifications";
import { useGlobalSearch } from "@/hooks/use-global-search";
import { SearchResult } from "@/services/api/searchService";
import ErrorBoundary from "@/components/ui/error-boundary";
import { LoadingState } from "@/components/ui/loading-state";
import { toast } from "sonner";

const DashboardLayout = () => {
  const { isAuthenticated, user } = useUser();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  
  // Notifications hook with safe fallbacks
  const { 
    notifications = [], 
    unreadCount = 0, 
    markAsRead = async () => {}, 
    markAllAsRead = async () => {}, 
    error: notificationsError 
  } = useNotifications();
  
  // Global search hook with safe fallbacks
  const { 
    query = '', 
    setQuery = () => {}, 
    results = [], 
    isLoading: isSearchLoading = false, 
    performSearch = async () => {} 
  } = useGlobalSearch();

  // Show toast for notification errors
  useEffect(() => {
    if (notificationsError) {
      toast.error("Notification Error", { 
        description: notificationsError.message || "Failed to load notifications"
      });
    }
  }, [notificationsError]);

  // Close mobile menu when changing routes
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsSearchOpen(false);
  }, [location.pathname]);

  // Handle search input
  const handleSearchInput = (value: string) => {
    setQuery(value);
    if (value.trim()) {
      performSearch(value);
    }
  };

  // Handle search result click
  const handleSearchResultClick = (result: SearchResult) => {
    // Navigate to the result URL
    window.location.href = result.url;
    setIsSearchOpen(false);
  };

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar - hidden on mobile unless menu is open */}
      <div className={`fixed inset-y-0 left-0 z-50 transform ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} md:relative md:translate-x-0 transition duration-200 ease-in-out`}>
        <Sidebar />
      </div>

      {/* Main Content */}
      <div className="flex flex-col flex-1 w-full overflow-hidden">
        <Header 
          isMobileMenuOpen={isMobileMenuOpen} 
          toggleMobileMenu={() => setIsMobileMenuOpen(!isMobileMenuOpen)} 
          notificationCount={unreadCount}
          notifications={notifications}
          onMarkRead={markAsRead}
          onMarkAllRead={markAllAsRead}
          onSearchOpen={() => setIsSearchOpen(true)}
          isSearchOpen={isSearchOpen}
          onSearchClose={() => setIsSearchOpen(false)}
          searchQuery={query}
          onSearchChange={handleSearchInput}
          searchResults={results}
          isSearchLoading={isSearchLoading}
          onSearchResultClick={handleSearchResultClick}
        />
        
        {/* Backdrop for mobile menu */}
        {isMobileMenuOpen && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
            onClick={() => setIsMobileMenuOpen(false)}
          />
        )}
        
        {/* Global search backdrop */}
        {isSearchOpen && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={() => setIsSearchOpen(false)}
          />
        )}
        
        {/* Main content area with padding */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-background">
          <ErrorBoundary>
            <Suspense fallback={<LoadingState message="Loading page..." />}>
              <Outlet />
            </Suspense>
          </ErrorBoundary>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
