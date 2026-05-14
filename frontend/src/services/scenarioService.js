// services/scenarioService.js

import api from '../api/api'

export const saveScenario = async (scenarioData) => {
    const response = await api.post('/scenarios', scenarioData);
    return response;
}

export const getAllScenarios = async () => {
    const response = await api.get('/scenarios');
    return response;
}

export const getScenarioById = async (scenarioId) => {
    const response = await api.get(`/scenarios/${scenarioId}`);
    return response;
}

export const deleteScenarioById = async (scenarioId) => {
    await api.delete(`/scenarios/${scenarioId}`)
}