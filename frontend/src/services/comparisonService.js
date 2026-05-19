// services/comparisonService.js

import api from '../api/api';

export const saveComparison = async (comaprisonData) => {
    const response = await api.post('/comparisons', comaprisonData)
    return response.data;
}

export const getAllComparisons = async() => {
    const response = await api.get('/comparisons');
    return response.data;
}

export const getComparisonById = async(comparisonId) => {
    const response = await api.get(`/comparisons/${comparisonId}`);
    return response.data;
}

export const deleteComparisonById = async (comparisonId) => {
    await api.delete(`/comparisons/${comparisonId}`)
}