import Axios from 'axios';

//.env
const isLocalHost = process.env.NODE_ENV === 'development';

const [localhost, test] = [
  'http://localhost:8080',
  // 'https://fasteng-backend-eocdo.ondigitalocean.app/'
  'https://fasteng-backend-test2.vercel.app/',
];

const Api = Axios.create({
  baseURL: isLocalHost ? localhost : test,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
});

export default Api;
