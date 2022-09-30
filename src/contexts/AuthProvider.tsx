import React, { createContext, useContext } from 'react';

export type AuthContextType = {
  getToken: () => string | null;
  login: (token: string) => void;
  logout: () => void;
  validateToken?: () => any;
}

const KEY = 'simple-expense-token';

export const AuthContext = createContext<AuthContextType>(
  { getToken: () => null,
    login: (s: string) => null,
    logout: () => null
  }
);

type Props = {
  children: JSX.Element;
}

function AuthProvider( { children } : Props) {

  function login(data: string) {
    localStorage.setItem(KEY, data);
  }

  function logout() {
    localStorage.removeItem(KEY);   
  }

  function getToken() {
    return localStorage.getItem(KEY);   
  }
  
  return (
    <AuthContext.Provider value={{ getToken, login, logout }}>
      { children }
    </AuthContext.Provider>
  );
}

export default AuthProvider;

export function useAuth() {  
  return useContext(AuthContext);
}