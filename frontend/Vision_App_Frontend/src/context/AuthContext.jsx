import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(localStorage.getItem('role') || null);
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      // In a real app we might validate the token/fetch profile here
      // For now, we trust the stored token and role
      setToken(token);
      setRole(role);
    }
    setLoading(false);
  }, [token, role]);

  const login = async (credentials) => {
    try {
      const data = await authService.login(credentials);
      // Assuming backend returns { token } -> Need to decode JWT to find role
      const receivedToken = data.token || data.jwt || data;
      let receivedRole = data.role;
      
      if (!receivedRole && typeof receivedToken === 'string') {
        try {
          const base64Url = receivedToken.split('.')[1];
          const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
          const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
              return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
          }).join(''));
          const parsed = JSON.parse(jsonPayload);
          receivedRole = parsed.role || parsed.roles || parsed.authorities;
          
          // Handle arrays like authorities: ["ROLE_DOCTOR"]
          if (Array.isArray(receivedRole)) {
            receivedRole = receivedRole[0];
          }
          if (typeof receivedRole === 'object' && receivedRole !== null) {
            receivedRole = receivedRole.authority || receivedRole.role;
          }
        } catch (e) {
          console.error("Failed to parse JWT payload", e);
        }
      }

      // Format role safely
      if (typeof receivedRole === 'string' && receivedRole.startsWith('ROLE_')) {
        receivedRole = receivedRole.replace('ROLE_', ''); // Normalize to "DOCTOR" / "PATIENT"
      }
      
      localStorage.setItem('token', receivedToken);
      localStorage.setItem('role', receivedRole);
      
      setToken(receivedToken);
      setRole(receivedRole);
      setUser(data.user);
      
      return data;
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    setToken(null);
    setRole(null);
    setUser(null);
    window.location.href = '/login';
  };

  const value = {
    user,
    role,
    token,
    login,
    logout,
    isAuthenticated: !!token,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
