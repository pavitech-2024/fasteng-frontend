import Api from '@/api';
import Cookies from 'js-cookie';
import { redirect } from 'next/navigation';

export interface ResponseAuthDto {
  statusCode: number;
  token?: string;
  user?: {
    _id: string;
    lastLoginList: Date[];
    photo: string | null;
    connections: number;
  };
  name?: string;
  email?: string;
  planName?: string;
  message?: string;
  errer?: string;
}

export default class Auth {
  async login(email: string, password: string) {
    return Api.post('auth/login', { email, password }).then((response) => {
      // get data from response
      const { statusCode, token, user, name, email, planName } = response.data as ResponseAuthDto;
      console.log(response.data);
      if (statusCode === 200) {
        // set token to cookies
        Cookies.set('token', JSON.stringify(token), { expires: 0.416 }); // 10horas
        Cookies.set('_id', JSON.stringify(user?._id), { expires: 0.416 }); // 10horas

        // set token to axios headers
        Api.defaults.headers.Authorization = `Bearer ${token}`;

        return {
          IsAuthorized: true,
          user,
          name,
          email,
          planName,
        };
      } else {
        return {
          IsAuthorized: false,
        };
      }
    });
  }

  logout = () => {
    // remove token from cookies
    Cookies.remove('token');
    Cookies.remove('_id');

    // remove token from axios headers
    delete Api.defaults.headers.Authorization;
    // redirect to login page
    return redirect('/login');
  };
}
