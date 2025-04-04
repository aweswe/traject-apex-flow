
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

interface HeaderProps {
  isMobileMenuOpen: boolean;
  toggleMobileMenu: () => void;
}

const Header = ({ isMobileMenuOpen, toggleMobileMenu }: HeaderProps) => {
  const location = useLocation();
  const { user } = useUser();
  const [searchQuery, setSearchQuery] = useState("");

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
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Action buttons */}
      <Button variant="ghost" size="icon" aria-label="Notifications">
        <Bell className="h-5 w-5" />
      </Button>

      {/* Quick search for mobile */}
      <Button variant="ghost" size="icon" className="md:hidden" aria-label="Search">
        <Search className="h-5 w-5" />
      </Button>
    </header>
  );
};

export default Header;
