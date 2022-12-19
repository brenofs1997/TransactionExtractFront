import axios from 'axios';
import { BASE_URL } from '../utils/request';

export const api = axios.create({
    baseURL:BASE_URL
})