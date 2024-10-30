import axios, { AxiosInstance, InternalAxiosRequestConfig, AxiosHeaders } from 'axios';
import { config } from '../config-global';

// Create a type for the token data structure
interface TokenData {
    isToken: string; // Adjust type based on your actual token structure
}

// Create an Axios instance with the base URL from the configuration
export const appAxios: AxiosInstance = axios.create({
    baseURL: config.API_URL,
});

// Add a request interceptor
appAxios.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        const storage = localStorage.getItem('estate-admin-auth');
        const tokenData: TokenData | null = storage ? JSON.parse(storage) : null;
        let token = tokenData?.isToken || null;

        if (token) {
            // Remove any surrounding quotes from the token
            token = token.replace(/^"|"$/g, '');
        }

        // Ensure headers are an instance of AxiosHeaders
        config.headers = config.headers instanceof AxiosHeaders 
            ? config.headers 
            : new AxiosHeaders();

        // Set the Authorization header if the token exists
        if (token) {
            config.headers.set('Authorization', `Bearer ${token}`);
        }

        return config;
    },
    (error) => {
        console.log('appAxios: ', error);
        return Promise.reject(error);
    }
);
