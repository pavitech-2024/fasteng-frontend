export const isLocalHost = process.env.NEXT_PUBLIC_ENV === 'development';
export const isTest = process.env.NEXT_PUBLIC_ENV === 'test';

const [localhost, test, prod] = [
  'http://localhost:8080',
  'https://fasteng-backend.vercel.app/',
  'https://fasteng-backend-ecodigta.ocean.app/',
];

const Api = Axios.create({
  baseURL: isLocalHost || isTest ? localhost : prod,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
});
