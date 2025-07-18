import Axios from 'axios';

//.env
export const isLocalHost = process.env.NODE_ENV === 'development';
console.log("🚀 ~ isLocalHost:", isLocalHost)
export const isTest = process.env.NODE_ENV === 'test';
console.log("🚀 ~ isTest:", isTest)

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
