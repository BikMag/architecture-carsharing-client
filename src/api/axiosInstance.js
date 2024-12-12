import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:8080/api',
  headers: {
    Authorization: `Basic ${localStorage.getItem('auth')}`,
  },
});

export default axiosInstance;