import axios from 'axios';

const DEV = 'http://localhost:5000';

export const axiosConfig = axios.create({
  baseURL: DEV,
  timeout: 3000,  
});

export function getBearerToken(token: string) {
  return {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  }
}