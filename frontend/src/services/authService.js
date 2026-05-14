// services/authService.js

import api from '../api/api';

export const registerUser = async(fullName, email, password) => {
    const response = await api.post('/auth/register', {
        full_name: fullName,
        email,
        password
    });
    return response;
}

export const loginUser = async (email, password) => {
    const formData = new FormData();
    formData.append('username', email);
    formData.append('password', password);

    const response = await api.post('/auth/login', formData);
    return response;
}
