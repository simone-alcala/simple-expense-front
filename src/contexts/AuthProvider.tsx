import React, { createContext, useContext } from 'react';

export type AuthContextType = {
  getToken: () => string | null;
  getName: () => string | null;
  login: (data: {token: string, name: string}) => void;
  logout: () => void;
  validateToken?: () => any;
}

const KEY = 'simple-expense-token';
const KEY_NAME = 'simple-expense-name';

export const AuthContext = createContext<AuthContextType>(
  { getToken: () => null,
    getName: () => null,
    login: (data: {token: string, name: string}) => null,
    logout: () => null
  }
);

type Props = {
  children: JSX.Element;
}

function AuthProvider( { children } : Props) {

  function login(data: {token: string, name: string} ) {
    localStorage.setItem(KEY, data.token);
    localStorage.setItem(KEY_NAME, data.name);
  }

  function logout() {
    localStorage.removeItem(KEY);   
    localStorage.removeItem(KEY_NAME);   
  }

  function getToken() {
    return localStorage.getItem(KEY);   
  }
  
  function getName() {
    return localStorage.getItem(KEY_NAME);   
  }

  return (
    <AuthContext.Provider value={{ getToken, login, logout, getName }}>
      { children }
    </AuthContext.Provider>
  );
}

export default AuthProvider;

export function useAuth() {  
  return useContext(AuthContext);
}