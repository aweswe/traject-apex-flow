
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="text-center max-w-md mx-auto">
        <h1 className="text-6xl font-bold text-brand-purple mb-4">404</h1>
        <h2 className="text-2xl font-semibold mb-2">Page Not Found</h2>
        <p className="text-muted-foreground mb-6">
          The page you are looking for doesn't exist or has been moved.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button onClick={() => navigate("/")} className="w-full sm:w-auto">
            Go to Dashboard
          </Button>
          <Button 
            variant="outline" 
            onClick={() => navigate(-1)}
            className="w-full sm:w-auto"
          >
            Go Back
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
