import axios from './root.service.js';
import { formatUserData } from '@helpers/formatData.js';

export async function getUsers() {
    try {
        const { data } = await axios.get('/user/');
        const formattedData = data.data.map(formatUserData);
        console.log("USUARIOS", formattedData);
        return formattedData;
    } catch (error) {
        return error.response.data;
    }
}

// Obtener mecánicos filtrando por rol 'mecanico'
export async function getMechanics() {
    try {
        const { data } = await axios.get('/user/');
        // Filtra usuarios que tengan el rol 'mecanico'
        const mechanics = data.data
            .filter(user => user.rol === 'mecanico')
            .map(formatUserData); // Formatear los datos si es necesario
        console.log("MECÁNICOS", mechanics);
        return mechanics;
    } catch (error) {
        console.error("Error al obtener mecánicos:", error.response?.data || error.message);
        return [];
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
        const response = await axios.post('/user/register-employee', data);
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
