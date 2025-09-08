import axios from 'axios';
const base = import.meta.env.VITE_API_BASE || 'http://localhost:5000/api';
const api = axios.create({ baseURL: base, timeout: 60000 });
export default api;

