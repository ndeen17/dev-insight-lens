import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import axios from 'axios';

interface User {
  _id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'Freelancer' | 'BusinessOwner';
  country: string;
  companyName?: string;
  githubUsername?: string;
  profilePicture?: string;
  bio?: string;
  isActive: boolean;
  savedDevelopers?: string[];
  createdAt: string;
  updatedAt: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (data: SignupData) => Promise<void>;
  logout: () => void;
  updateUser: (user: User) => void;
}

interface SignupData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: 'Freelancer' | 'BusinessOwner';
  country: string;
  companyName?: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Load user from localStorage on mount
  useEffect(() => {
    const loadUser = async () => {
      const storedToken = localStorage.getItem('authToken');
      const storedUser = localStorage.getItem('user');

      if (storedToken && storedUser) {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
        
        // Set axios default header
        axios.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;

        // Verify token is still valid by fetching current user
        try {
          const response = await axios.get(`${API_BASE_URL}/api/auth/me`);
          setUser(response.data.user);
          localStorage.setItem('user', JSON.stringify(response.data.user));
        } catch (error) {
          // Token invalid, clear auth
          console.error('Token validation failed:', error);
          localStorage.removeItem('authToken');
          localStorage.removeItem('user');
          setToken(null);
          setUser(null);
          delete axios.defaults.headers.common['Authorization'];
        }
      }
      
      setLoading(false);
    };

    loadUser();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/api/auth/login`, {
        email,
        password
      });

      const { token: newToken, user: newUser } = response.data;

      // Save to state
      setToken(newToken);
      setUser(newUser);

      // Save to localStorage
      localStorage.setItem('authToken', newToken);
      localStorage.setItem('user', JSON.stringify(newUser));

      // Set axios default header
      axios.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;

    } catch (error: any) {
      console.error('Login error:', error);
      const message = error.response?.data?.message || 'Login failed. Please try again.';
      throw new Error(message);
    }
  };

  const signup = async (data: SignupData) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/api/auth/signup`, data);

      const { token: newToken, user: newUser } = response.data;

      // Save to state
      setToken(newToken);
      setUser(newUser);

      // Save to localStorage
      localStorage.setItem('authToken', newToken);
      localStorage.setItem('user', JSON.stringify(newUser));

      // Set axios default header
      axios.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;

    } catch (error: any) {
      console.error('Signup error:', error);
      const message = error.response?.data?.message || 'Signup failed. Please try again.';
      throw new Error(message);
    }
  };

  const logout = () => {
    // Clear state
    setUser(null);
    setToken(null);

    // Clear localStorage
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');

    // Remove axios default header
    delete axios.defaults.headers.common['Authorization'];
  };

  const updateUser = (updatedUser: User) => {
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
  };

  const value: AuthContextType = {
    user,
    token,
    loading,
    isAuthenticated: !!user && !!token,
    login,
    signup,
    logout,
    updateUser
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Configure axios interceptor to attach token to all requests
axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Intercept 401 responses and logout
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      delete axios.defaults.headers.common['Authorization'];
      window.location.href = '/auth/signin';
    }
    return Promise.reject(error);
  }
);
