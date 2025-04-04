
import { useState } from "react";
import { useLocation } from "react-router-dom";
import { useUser } from "@/context/UserContext";
import { 
  Bell, 
  Search, 
  Menu, 
  X 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { NotificationData } from "@/services/api/notificationService";
import { SearchResult } from "@/services/api/searchService";

interface HeaderProps {
  isMobileMenuOpen: boolean;
  toggleMobileMenu: () => void;
  // Add notification related props
  notificationCount?: number;
  notifications?: NotificationData[];
  onMarkRead?: (id: string) => Promise<void>;
  onMarkAllRead?: () => Promise<void>;
  // Add search related props
  isSearchOpen?: boolean;
  onSearchOpen?: () => void;
  onSearchClose?: () => void;
  searchQuery?: string;
  onSearchChange?: (value: string) => void;
  searchResults?: SearchResult[];
  isSearchLoading?: boolean;
  onSearchResultClick?: (result: SearchResult) => void;
}

const Header = ({ 
  isMobileMenuOpen, 
  toggleMobileMenu,
  notificationCount = 0,
  notifications = [],
  onMarkRead,
  onMarkAllRead,
  isSearchOpen = false,
  onSearchOpen,
  onSearchClose,
  searchQuery = "",
  onSearchChange,
  searchResults = [],
  isSearchLoading = false,
  onSearchResultClick
}: HeaderProps) => {
  const location = useLocation();
  const { user } = useUser();
  const [searchQuery, setSearchQuery] = useState("");

  // Handle search input change
  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    if (onSearchChange) {
      onSearchChange(value);
    }
  };

  // Get the current page title based on route
  const getPageTitle = () => {
    switch (location.pathname) {
      case '/':
        return 'Dashboard';
      case '/leads':
        return 'Lead Management';
      case '/itinerary':
        return 'Itinerary Builder';
      case '/proposals':
        return 'Proposal Builder';
      case '/settings':
        return 'Settings';
      default:
        return 'Dashboard';
    }
  };

  return (
    <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-card px-4 md:px-6">
      {/* Mobile menu toggle */}
      <Button 
        variant="ghost" 
        size="icon" 
        className="md:hidden" 
        onClick={toggleMobileMenu}
      >
        {isMobileMenuOpen ? (
          <X className="h-5 w-5" />
        ) : (
          <Menu className="h-5 w-5" />
        )}
        <span className="sr-only">Toggle menu</span>
      </Button>

      {/* Page title */}
      <h1 className="text-lg font-semibold md:text-xl">{getPageTitle()}</h1>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Search bar */}
      <div className="hidden md:flex relative w-full max-w-sm items-center">
        <Search className="absolute left-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search..."
          className="pl-8 w-full bg-background"
          value={searchQuery}
          onChange={handleSearchInputChange}
          onClick={onSearchOpen}
        />
      </div>

      {/* Action buttons */}
      <Button 
        variant="ghost" 
        size="icon" 
        aria-label="Notifications"
        onClick={onMarkAllRead}
      >
        <Bell className="h-5 w-5" />
        {notificationCount > 0 && (
          <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] text-white">
            {notificationCount > 9 ? '9+' : notificationCount}
          </span>
        )}
      </Button>

      {/* Quick search for mobile */}
      <Button 
        variant="ghost" 
        size="icon" 
        className="md:hidden" 
        aria-label="Search"
        onClick={onSearchOpen}
      >
        <Search className="h-5 w-5" />
      </Button>
    </header>
  );
};

export default Header;
