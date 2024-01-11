import axios from 'axios';

const BASE_URL = `${process.env.REACT_APP_BASE_ENDPOINT}/api/v1`;
export const APP_ENVIRONMENT = 'local';
export let BASE_ENDPOINT = '';

if (APP_ENVIRONMENT === 'local') {
  BASE_ENDPOINT = 'http://localhost:5000';
} else if (APP_ENVIRONMENT === 'development') {
  BASE_ENDPOINT = 'https://api.dev.vibex.cloud';
} else if (APP_ENVIRONMENT === 'staging') {
  BASE_ENDPOINT = 'https://api.stg.vibex.cloud';
} else if (APP_ENVIRONMENT === 'production') {
  BASE_ENDPOINT = 'https://api.vibex.cloud';
}

export default axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
  withCredentials: true
});
