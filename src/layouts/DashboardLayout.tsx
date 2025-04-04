
import { Outlet, Navigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { useUser } from "@/context/UserContext";
import Sidebar from "@/components/dashboard/Sidebar";
import Header from "@/components/dashboard/Header";

const DashboardLayout = () => {
  const { isAuthenticated, user } = useUser();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Close mobile menu when changing routes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

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
        />
        
        {/* Backdrop for mobile menu */}
        {isMobileMenuOpen && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
            onClick={() => setIsMobileMenuOpen(false)}
          />
        )}
        
        {/* Main content area with padding */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-background">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
