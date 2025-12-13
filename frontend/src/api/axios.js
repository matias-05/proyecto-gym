import axios from 'axios';

const client = axios.create({
  baseURL: 'http://localhost:8000/api', // La URL de tu backend
});

export default client;