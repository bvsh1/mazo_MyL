import axios from 'axios';

const api = axios.create({
    // Vite inyectará la URL correcta dependiendo de dónde esté corriendo
    baseURL: import.meta.env.VITE_API_URL, 
});

export default api;