import Axios from 'axios';

//.env
// const isLocalHost = process.env.NODE_ENV === 'development';
const isLocalHost = false;

const [localhost, test] = ['http://localhost:8080', 'https://fasteng-backend-4kt2o.ondigitalocean.app/'];

const Api = Axios.create({
  baseURL: isLocalHost ? localhost : test,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
});

export default Api;