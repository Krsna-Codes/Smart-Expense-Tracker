// src/api.js
import axios from 'axios'

const api = axios.create({
  baseURL: '/api', // uses vite proxy
  timeout: 10000,
})

// add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// optional: auto-logout on 401 (helps debugging)
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('token')
      // optionally redirect: window.location = '/login'
    }
    return Promise.reject(err)
  }
)

export default api
