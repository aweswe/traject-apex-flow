
import React, { createContext, useContext, useState, ReactNode } from "react";

type UserRole = "admin" | "sales" | "manager" | "client";

interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
}

interface UserContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  // This would be replaced with actual authentication logic
  const login = async (email: string, password: string) => {
    try {
      // Mock authentication
      if (email && password) {
        const mockUser: User = {
          id: "1",
          name: "John Doe",
          email: email,
          role: "admin",
          avatar: "https://ui-avatars.com/api/?name=John+Doe",
        };
        
        setUser(mockUser);
        
        // Store in localStorage for persistence
        localStorage.setItem("user", JSON.stringify(mockUser));
        
        return true;
      }
      return false;
    } catch (error) {
      console.error("Login failed:", error);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  return (
    <UserContext.Provider value={{ 
      user, 
      setUser, 
      isAuthenticated: !!user,
      login,
      logout
    }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
