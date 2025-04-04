
import { NavLink } from "react-router-dom";
import { useUser } from "@/context/UserContext";
import { 
  LayoutDashboard, 
  Users, 
  CalendarRange, 
  FileText, 
  Settings, 
  LogOut 
} from "lucide-react";

const Sidebar = () => {
  const { user, logout } = useUser();

  const navItems = [
    { 
      name: "Dashboard", 
      path: "/", 
      icon: <LayoutDashboard className="w-5 h-5" /> 
    },
    { 
      name: "Lead Management", 
      path: "/leads", 
      icon: <Users className="w-5 h-5" /> 
    },
    { 
      name: "Itinerary Builder", 
      path: "/itinerary", 
      icon: <CalendarRange className="w-5 h-5" /> 
    },
    { 
      name: "Proposals", 
      path: "/proposals", 
      icon: <FileText className="w-5 h-5" /> 
    },
    { 
      name: "Settings", 
      path: "/settings", 
      icon: <Settings className="w-5 h-5" /> 
    }
  ];

  return (
    <div className="flex flex-col h-full w-64 bg-card border-r">
      {/* Logo area */}
      <div className="p-4 border-b flex items-center gap-2">
        <div className="w-8 h-8 rounded-md bg-brand-purple flex items-center justify-center">
          <span className="text-white font-bold">LM</span>
        </div>
        <span className="font-bold text-lg text-foreground">TravelEase</span>
      </div>

      {/* User profile area */}
      <div className="p-4 border-b">
        <div className="flex items-center">
          <div className="w-10 h-10 rounded-full bg-accent mr-3 overflow-hidden">
            {user?.avatar ? (
              <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-white font-medium">
                {user?.name?.charAt(0)}
              </div>
            )}
          </div>
          <div>
            <div className="font-medium text-sm">{user?.name}</div>
            <div className="text-xs text-muted-foreground capitalize">{user?.role}</div>
          </div>
        </div>
      </div>

      {/* Navigation area */}
      <nav className="flex-1 overflow-y-auto p-2">
        <ul className="space-y-1">
          {navItems.map((item) => (
            <li key={item.path}>
              <NavLink
                to={item.path}
                className={({ isActive }) => 
                  `flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${
                    isActive 
                      ? 'bg-accent/10 text-accent font-medium'
                      : 'text-foreground hover:bg-muted/80'
                  }`
                }
                end={item.path === '/'}
              >
                {item.icon}
                <span>{item.name}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      {/* Logout button */}
      <div className="p-4 border-t">
        <button
          onClick={logout}
          className="flex items-center gap-3 w-full px-3 py-2 text-sm text-muted-foreground hover:text-destructive rounded-md hover:bg-muted/80 transition-colors"
        >
          <LogOut className="w-5 h-5" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
