import axios from 'axios';
import { message } from 'antd';

const http = axios.create({
  baseURL: '/api',
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
});

// 请求拦截器
http.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// 响应拦截器
http.interceptors.response.use(
  (response) => {
    const { code, message: msg } = response.data;
    if (code !== 0 && code !== undefined) {
      message.error(msg || '请求失败');
      return Promise.reject(new Error(msg));
    }
    return response.data;
  },
  async (error) => {
    if (error.response?.status === 401) {
      // 尝试刷新 Token
      const refreshToken = localStorage.getItem('refreshToken');
      if (refreshToken) {
        try {
          const res = await axios.post('/api/auth/refresh', { refreshToken });
          const { accessToken } = res.data.data;
          localStorage.setItem('accessToken', accessToken);
          error.config.headers.Authorization = `Bearer ${accessToken}`;
          return http(error.config);
        } catch {
          // 刷新失败
        }
      }
      localStorage.clear();
      window.location.href = '/login';
      return Promise.reject(error);
    }
    const msg = error.response?.data?.message || '网络连接失败';
    message.error(msg);
    return Promise.reject(error);
  },
);

export default http;
