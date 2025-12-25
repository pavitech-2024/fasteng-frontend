import axios from 'axios';  

// .env
export const isLocalHost = process.env.NEXT_PUBLIC_ENV === 'development';
export const isTest = process.env.NEXT_PUBLIC_ENV === 'test';

// Corrigindo a URL (removendo barra extra no final)
const [localhost, prod] = [
  'http://localhost:8080',
  'https://fasteng-backend.vercel.app',
];

/*
  Caso precise de mais um ambiente (como o teste), adicione aqui:
  const [localhost, test, prod] = [
    'http://localhost:8080',
    'https://fasteng-backend.vercel.app/',
    'https://fasteng-backend-ecodigta.ocean.app/',
  ];
*/

const Api = axios.create({
  baseURL: isLocalHost || isTest ? localhost : prod,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
});

export default Api;
