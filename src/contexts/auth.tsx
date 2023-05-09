import React, { createContext, useState, useContext, useEffect } from 'react';
import Api from '@/api';
import { useRouter } from 'next/router';
import Cookies from 'js-cookie';
import i18next from 'i18next';

type User = {
  _id: string;
  lastLoginList: Date[];
  photo: string | null;
  connections: number;
  name: string;
  email: string;
  planName: string;
  preferences: {
    language: string;
    decimal: number;
  };
};

export type AuthContent = {
  isAuthenticated: boolean;
  user: User | null;
  signIn: (email: string, password: string) => Promise<void>;
  refreshLogin: () => Promise<void>;
  logout: () => Promise<void>;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
};

export const AuthContext = createContext({} as AuthContent);

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  const [user, setUser] = useState<User | null>(null);
  const isAuthenticated = !!user;

  const Router = useRouter();

  useEffect(() => {
    async function loadUser() {
      try {
        if (user === null) {
          await refreshLogin();
        }
      } catch (error) {}
    }
    loadUser();
  });

  async function signIn(email: string, password: string): Promise<void> {
    try {
      const response = await Api.post('auth/login', { email, password });
      const { token, user, name, planName } = response.data;

      Cookies.set('fasteng.token', token, { expires: 0.416 });
      Cookies.set('fasteng._id', user._id, { expires: 0.416 });

      // set token to axios headers
      Api.defaults.headers.Authorization = `Bearer ${token}`;

      await setUser({ ...user, name, planName, email });

      user.preferences.language !== null && i18next.changeLanguage(user.preferences.language);

      Router.push('/home');
    } catch (error) {
      throw error;
    }
  }

  async function refreshLogin() {
    try {
      const { 'fasteng.token': token, 'fasteng._id': _id } = Cookies.get();

      if (token && _id && !isAuthenticated) {
        const response = await Api.post('auth/refresh-login', { token, _id });
        const { user, name, planName, email } = response.data;

        Cookies.set('fasteng.token', token, { expires: 0.416 });
        Cookies.set('fasteng._id', user._id, { expires: 0.416 });

        // set token to axios headers
        Api.defaults.headers.Authorization = `Bearer ${response.data.token}`;

        setUser({ ...user, name, planName, email });

        user.preferences.language !== null && i18next.changeLanguage(user.preferences.language);

        if (Router.pathname === '/') await Router.push('/home');
      }
    } catch (error) {
      if (Router.pathname !== '/') await Router.push('/');
      else throw error;
    }
  }

  async function logout() {
    Cookies.remove('fasteng.token');
    Cookies.remove('fasteng._id');

    await setUser(null);
    Router.push('/');
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, signIn, refreshLogin, logout, setUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export default useAuth;
