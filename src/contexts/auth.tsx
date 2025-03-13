import React, { createContext, useState, useContext, useEffect } from 'react';
import Api from '@/api';
import { useRouter } from 'next/router';
import Cookies from 'js-cookie';
import i18next from 'i18next';

export type User = {
  _id: string;
  lastLoginList: Date[];
  photo: string | null;
  connections: number;
  name: string;
  email: string;
  phone: string;
  dob: string;
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

  /**
   * Authenticates the user by sending a POST request to the /auth/login endpoint with the given email and password.
   * If the authentication is successful, it sets the user and the token to the Axios headers.
   */
  async function signIn(email: string, password: string): Promise<void> {
    try {
      const response = await Api.post('auth/login', { email, password });

      const { token, user } = response.data;

      //Sets the token and the user id in the cookies for the next requests.
      Cookies.set('fasteng.token', token, { expires: 0.416 });
      Cookies.set('fasteng._id', user._id, { expires: 0.416 });

      //Sets the token in the Axios headers.
      Api.defaults.headers.Authorization = `Bearer ${token}`;

      //Updates the user state with the user data from the server.
      const updatedUser = await Api.get(`users/${user._id}`);

      setUser(updatedUser.data);

      //Changes the language of the app if the user has a preferred language.
      user.preferences.language !== null && i18next.changeLanguage(user.preferences.language);

      Router.push('/home');
    } catch (error) {
      throw error;
    }
  }

  /**
   * Checks if the user has a valid token and if not, it refreshes the token using the refresh-login endpoint.
   * If the refresh is successful, it updates the user state with the new user data from the server.
   * If the user has a preferred language, it changes the language of the app.
   * If the user is not in the root page, it redirects the user to the home page.
   */
  async function refreshLogin() {
    try {
      // Gets the token and the user id from the cookies.
      const { 'fasteng.token': token, 'fasteng._id': _id } = Cookies.get();

      // If the user is not authenticated and has a token and a user id, it refreshes the login.
      if (token && _id && !isAuthenticated) {

        const response = await Api.post('auth/refresh-login', { token, _id });

        const { user: loggedUser, token: newToken } = response.data;

        // Makes a GET request to the users endpoint with the logged user id to get the user data.
        const updatedUser = await Api.get(`users/${loggedUser._id}`);

        // Creates a new user object with the updated user data.
        const finalUser = { ...updatedUser.data };

        // Sets the new token and the user id to the cookies.
        Cookies.set('fasteng.token', newToken, { expires: 0.416 });
        Cookies.set('fasteng._id', finalUser._id, { expires: 0.416 });

        // Sets the new token to the axios headers.
        Api.defaults.headers.Authorization = `Bearer ${newToken}`;

        // Updates the user state with the new user data.
        setUser(finalUser);

        // If the user has a preferred language, it changes the language of the app.
        user.preferences.language !== null && i18next.changeLanguage(user.preferences.language);

        // If the user is not in the root page, it redirects the user to the home page.
        if (Router.pathname !== '/' && Router.pathname !== '/creators') {
          await Router.push('/home');
        }
      }
    } catch (error) {
      if (Router.pathname !== '/' && Router.pathname !== '/creators') {
        await Router.push('/');
      } else {
        throw error;
      }
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
