import Axios from 'axios';

//.env
export const isLocalHost = process.env.NEXT_PUBLIC_ENV === 'development';
export const isTest = process.env.NEXT_PUBLIC_ENV === 'test';


//corrigi url
const [localhost] = [
  'http://localhost:8080',
];


/*
const [localhost, test, prod] = [
  'http://localhost:8080',
  'https://fasteng-backend.vercel.app/',
  'https://fasteng-backend-ecodigta.ocean.app/',
];
*/


const Api = Axios.create({
  baseURL: localhost,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
});

export default Api;
