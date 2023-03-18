import React, { createContext, useState, useContext, useEffect } from 'react';
import User from '@/entities/common/User';
import Auth from '@/services/auth';
import Cookies from 'js-cookie';

export type AuthContent = {
  isAuthenticated: boolean;
  user: User | null;
  AuthService: Auth;
  setUser: (user: User | null) => void;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthContext = createContext({} as AuthContent);

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);

  const AuthService = new Auth();

  useEffect(() => {
    console.log(user);
    if (user) Cookies.set('isAuthenticated', 'true');
    else Cookies.set('isAuthenticated', 'false');
  }, [user]);

  return (
    <AuthContext.Provider value={{ isAuthenticated: !!user, user, AuthService, setUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export default useAuth;
