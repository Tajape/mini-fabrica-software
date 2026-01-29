// Instancia axios com baseURL apontando para a API do backend
// Exporta a instância para ser usada em todo o front (api.get, api.post, etc.)
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://127.0.0.1:8000/api', // Altere se sua API não rodar na porta 8000
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

export default api;