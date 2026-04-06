import Axios from 'axios';

// env
export const isLocalHost = process.env.NEXT_PUBLIC_ENV === 'development';
export const isTest = process.env.NEXT_PUBLIC_ENV === 'test';
export const isProd = process.env.NEXT_PUBLIC_ENV === 'production';

// URLs por ambiente
const BASE_URL = isLocalHost
  ? 'http://localhost:8080'
  : 'https://fasteng-backend.vercel.app';

const Api = Axios.create({
  baseURL: BASE_URL,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
});

export default Api;
