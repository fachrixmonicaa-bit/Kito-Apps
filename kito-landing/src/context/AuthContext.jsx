import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('kito_auth') === 'true';
  });
  
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('kito_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  useEffect(() => {
    localStorage.setItem('kito_auth', isAuthenticated);
  }, [isAuthenticated]);

  useEffect(() => {
    if (user) {
      localStorage.setItem('kito_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('kito_user');
    }
  }, [user]);

  const login = (role = 'admin') => {
    let userData = {
      name: 'Admin Kito',
      email: 'admin@kitoapps.com',
      role: 'admin'
    };
    
    if (role === 'agen1') {
      userData = { name: 'Agen 1', email: 'agen1@kitoapps.com', role: 'agent' };
    } else if (role === 'agen2') {
      userData = { name: 'Agen 2', email: 'agen2@kitoapps.com', role: 'agent' };
    }

    const savedProfiles = JSON.parse(localStorage.getItem('kito_profiles') || '{}');
    if (savedProfiles[userData.email]) {
      userData = { ...userData, ...savedProfiles[userData.email] };
    }

    setUser(userData);
    setIsAuthenticated(true);
    return true;
  };

  const updateProfile = (updates) => {
    const updatedUser = { ...user, ...updates };
    setUser(updatedUser);
    
    const savedProfiles = JSON.parse(localStorage.getItem('kito_profiles') || '{}');
    savedProfiles[user.email] = updatedUser;
    localStorage.setItem('kito_profiles', JSON.stringify(savedProfiles));
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
