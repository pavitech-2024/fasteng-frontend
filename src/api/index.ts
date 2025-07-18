import Axios from 'axios';

//.env
export const isLocalHost = process.env.NEXT_PUBLIC_ENV === 'development';
console.log("🚀 ~ isLocalHost:", isLocalHost)
export const isTest = process.env.NEXT_PUBLIC_ENV === 'test';
console.log("🚀 ~ isTest:", isTest)

console.log("🚀 ~ process.env.NEXT_PUBLIC_ENV:", process.env.NEXT_PUBLIC_ENV)

const [localhost, test, prod] = [
  'http://localhost:8080',
  'https://fasteng-backend.vercel.app/',
  'https://fasteng-backend-eocdo.ondigitalocean.app/'
];

const Api = Axios.create({
  baseURL: isLocalHost ? localhost : isTest ? test : prod,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
});

export default Api;
