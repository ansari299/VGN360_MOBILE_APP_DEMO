import React, { createContext, useState, useContext } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [authData, setAuthData] = useState({
    mobile: '',
    
    // You can add other auth-related data here
  });

  const updateAuthData = (newData) => {
    setAuthData(prev => ({ ...prev, ...newData }));
  };

  return (
    <AuthContext.Provider value={{ authData, updateAuthData }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};