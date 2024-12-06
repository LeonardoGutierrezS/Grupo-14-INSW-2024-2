import axios from './root.service.js';
import { formatUserData } from '@helpers/formatData.js';

export async function getUsers() {
    try {
        const { data } = await axios.get('/user/');
        const formattedData = data.data.map(formatUserData);
        console.log("USUARIOS",formattedData);
        return formattedData;
    } catch (error) {
        return error.response.data;
    }
}

export async function updateUser(data, rut) {
    try {
        const response = await axios.patch(`/user/detail/?rut=${rut}`, {data, estado: data.estado});
        console.log(response);
        return response.data.data;
    } catch (error) {
        console.log(error);
        return error.response.data;
    }
}

export async function deleteUser(rut) {
    try {
        const response = await axios.delete(`/user/detail/?rut=${rut}`);
        return response.data;
    } catch (error) {
        return error.response.data;
    }
}
export async function createMechanic(data) {
    try {
        const response = await axios.post('/user/register-mechanic', data);
        return response.data;
    } catch (error) {
        return error.response.data;
    }
}
export async function createSeller(data) {
    try {
        const response = await axios.post('/user/register-seller', data);
        return response.data;
    } catch (error) {
        return error.response.data;
    }
}
export async function getWorkHours(userId) {
    try {
        const { data } = await axios.get(`/user/work-hours/${userId}`);
        return data;
    } catch (error) {
        console.error('Error al obtener los turnos:', error);
        throw error.response.data;
    }
}

export async function updateWorkHour(id, data) {
    try {
        const response = await axios.patch(`/user/update-check-time/${id}`, data);
        return response.data;
    } catch (error) {
        console.error('Error al actualizar el horario:', error);
        return error.response.data;
    }
}

