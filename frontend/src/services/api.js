import axios from 'axios';

// Creamos una instancia preconfigurada de Axios
const api = axios.create({
    // Esta es la URL donde corre tu servidor de Django
    baseURL: 'http://localhost:8000/api/', 
});

export default api;