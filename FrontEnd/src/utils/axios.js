import axios from 'axios';

const instance = axios.create({
  // baseURL: 'https://allohealthhospital.onrender.com/api',
  baseURL: 'http://localhost:5000/api'
});

instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default instance;


// t1@gmail.com Doc
// t@gmail.com pat