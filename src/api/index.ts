import Axios from 'axios';
//env 
export const isLocalHost = process.env.NODE_ENV === 'development';
export const isTest = process.env.NODE_ENV === 'test';
export const isProd = process.env.NODE_ENV === 'production';
//URls por ambiente
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