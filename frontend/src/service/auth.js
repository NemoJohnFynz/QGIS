import axios from 'axios';
import authToken from '../storage/authToken.js';


async function register(formData) {
    try {
        const response = await axios.post(`${process.env.REACT_APP_API_URL}/auth/register`, formData, {});
        return response.data;
    } catch (error) {
        console.error('Error during registration:', error);
        throw error;
    }
}

async function login(formData) {
    try {
        const response = await axios.post('/api/auth/login', formData, {
            headers: {
                Authorization: `Bearer ${authToken.getToken()}`,
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error during login:', error);
        throw error;
    }
}

export { register, login }