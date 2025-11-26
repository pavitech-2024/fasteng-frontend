import Axios from 'axios';

//.env 'https://oyster-app-nekyt.ondigitalocean.app'
const isLocalHost = process.env.NODE_ENV === 'development';

const [localhost, test] = ['http://localhost:8080', 'https://fasteng-backend.vercel.app/'];

const Api = Axios.create({
  baseURL: isLocalHost ? localhost : test,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
});

export default Api;
