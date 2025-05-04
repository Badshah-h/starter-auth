import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  ReactNode,
} from "react";
import { useNavigate } from "react-router-dom";
import { authService } from "../services/authService";
import { tokenStorage } from "../utils/tokenStorage";

interface User {
  id: string;
  name: string;
  email: string;
  username?: string;
  avatar_url?: string;
  role?: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string, remember?: boolean) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(tokenStorage.getToken());
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  // Define logout function before it's used
  const logout = async () => {
    try {
      setIsLoading(true);
      await authService.logout();
    } catch (err) {
      console.error("Logout error", err);
    } finally {
      tokenStorage.removeToken();
      setUser(null);
      setToken(null);
      setIsLoading(false);
      navigate("/");
    }
  };

  // Check if user is authenticated on mount
  useEffect(() => {
    const initAuth = async () => {
      const storedToken = tokenStorage.getToken();
      if (storedToken) {
        try {
          setIsLoading(true);
          const userData = await authService.getCurrentUser();
          setUser(userData);
          setToken(storedToken);
        } catch (err) {
          console.error("Failed to get user data", err);
          tokenStorage.removeToken();
          setToken(null);
          setUser(null);
        } finally {
          setIsLoading(false);
        }
      } else {
        setIsLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = async (email: string, password: string, remember = false) => {
    try {
      setIsLoading(true);
      setError(null);
      const { user: userData, token: authToken } = await authService.login(
        email,
        password,
        remember,
      );
      tokenStorage.setToken(authToken, remember);
      setUser(userData);
      setToken(authToken);
      navigate("/profile");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Login failed. Please check your credentials.",
      );
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string) => {
    try {
      setIsLoading(true);
      setError(null);
      await authService.register(name, email, password);
      // After registration, we don't automatically log in - user needs to verify email first
      setError(
        "Registration successful! Please check your email to verify your account.",
      );
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Registration failed. Please try again.",
      );
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const clearError = () => {
    setError(null);
  };

  const value = {
    user,
    token,
    isAuthenticated: !!user && !!token,
    isLoading,
    error,
    login,
    register,
    logout,
    clearError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Define the useAuth hook after the AuthProvider
const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

// Export the hook and provider separately
export { useAuth, AuthProvider };
