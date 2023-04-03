import Axios from 'axios';

const isLocalHost = true;

const [localhost, production] = ['http://localhost:8080', ''];

const Api = Axios.create({
  baseURL: isLocalHost ? localhost : production,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
});

export default Api;
