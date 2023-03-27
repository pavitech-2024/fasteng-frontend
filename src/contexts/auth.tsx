import React, { createContext, useState, useContext, useEffect } from 'react';
import { setCookie, parseCookies, destroyCookie } from 'nookies';
import Api from '@/api';
import { useRouter } from 'next/router';

type User = {
  _id: string;
  lastLoginList: Date[];
  photo: string | null;
  connections: number;
  name: string;
  email: string;
  planName: string;
};

export type AuthContent = {
  isAuthenticated: boolean;
  user: User | null;
  signIn: (email: string, password: string) => Promise<void>;
  refreshLogin: () => Promise<void>;
  logout: () => Promise<void>;
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

  async function signIn(email: string, password: string) {
    try {
      const response = await Api.post('auth/login', { email, password });

      const { token, user, name, planName } = response.data;

      setCookie(undefined, 'fasteng.token', token, { maxAge: 60 * 60 * 10 }); // 10 hours
      setCookie(undefined, 'fasteng._id', user._id, { maxAge: 60 * 60 * 10 }); // 10 hours

      // set token to axios headers
      Api.defaults.headers.Authorization = `Bearer ${token}`;

      setUser({ ...user, name, planName, email });
      await Router.push('/home');
    } catch (error) {}
  }

  async function refreshLogin() {
    try {
      const { 'fasteng.token': token, 'fasteng._id': _id } = parseCookies();

      if (token && _id && !isAuthenticated) {
        const response = await Api.post('auth/refresh-login', { token, _id });
        const { user, name, planName, email } = response.data;

        setCookie(undefined, 'fasteng.token', token, { maxAge: 60 * 60 * 10 }); // 10 hoursrs
        setCookie(undefined, 'fasteng._id', user._id, { maxAge: 60 * 60 * 10 }); // 10 hours

        // set token to axios headers
        Api.defaults.headers.Authorization = `Bearer ${response.data.token}`;

        setUser({ ...user, name, planName, email });
        if (Router.pathname === '/') await Router.push('/home');
      }
    } catch (error) {
      if (Router.pathname !== '/') await Router.push('/');
    }
  }

  async function logout() {
    destroyCookie(undefined, 'fasteng.token');
    destroyCookie(undefined, 'fasteng._id');

    await Router.push('/');
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, signIn, refreshLogin, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export default useAuth;
