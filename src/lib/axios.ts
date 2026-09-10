import axios from 'axios';

export const api = axios.create({
  baseURL: 'https://job-portal-backend-1-yib6.onrender.com',
  withCredentials: true,
});