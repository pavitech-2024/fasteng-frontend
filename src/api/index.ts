import Axios from 'axios';

//.env
const isLocalHost = process.env.NODE_ENV === 'development';

const [localhost, test] = ['http://localhost:8082', 'https://development-fasteng-backend.vercel.app'];

const Api = Axios.create({
  baseURL: isLocalHost ? localhost : test,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
});

export default Api;
