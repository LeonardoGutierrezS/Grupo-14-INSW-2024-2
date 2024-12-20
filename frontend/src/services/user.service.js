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

export async function getMechanics() {
    try {
        const { data } = await axios.get('/user/');
        // Filtrar usuarios con rol 'mecánico'
        const mechanics = data.data.filter(user => user.rol === 'mecanico');
        console.log("MECÁNICOS", mechanics);
        return mechanics;
    } catch (error) {
        console.error("Error al obtener mecánicos:", error.response.data);
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

export async function updateUserStatus(userId, newStatus) {
    console.log('Datos enviados al backend:', { userId, newStatus });
    try {
        const response = await axios.patch(`/user/update-status/${userId}`, { 
            newStatus 
        });
        return response.data; 
    } catch (error) {
        console.error('Error al actualizar el estado del usuario:', error.response?.data || error.message);
        return error.response?.data || { status: 'Error', message: 'Error al realizar la solicitud' };
    }
}

export async function approvePayment(userId, paymentType) {
    try {
        const response = await axios.patch(`/user/approve-payment/${userId}`, {
            paymentType,
        });
        return response.data; 
    } catch (error) {
        console.error('Error al aprobar el pago:', error.response?.data || error.message);
        return error.response?.data || { status: 'Error', message: 'Error al aprobar el pago.' };
    }
}
export async function getPaymentHistory(userId) {
    try {
        const response = await axios.get(`/user/payment-history/${userId}`);
        return response.data; 
    } catch (error) {
        console.error('Error al obtener el historial de pagos:', error.response?.data || error.message);
        return error.response?.data || { status: 'Error', message: 'Error al obtener el historial de pagos.' };
    }
}

export const getWorkHoursEmployee = async () => {
    try {
        const response = await axios.get('/user/work-hours');
        return response.data;
    } catch (error) {
        console.error('Error al obtener los turnos (empleado):', error.response?.data || error.message);
        return error.response?.data || { status: 'Error', message: 'Error al obtener los turnos.' };
    }
};

export async function getUsersWithHours() {
    try {
        const response = await axios.get('/user/users-with-hours');
        return response.data;
    } catch (error) {
        console.error('Error al obtener usuarios con horas trabajadas:', error.response?.data || error.message);
        return error.response?.data || { status: 'Error', message: 'Error al obtener usuarios con horas trabajadas.' };
    }
}

export async function changePassword({ currentPassword, newPassword }) {
    try {
        const response = await axios.patch('/user/change-password', {
            currentPassword,
            newPassword,
        });
        return response.data;
    } catch (error) {
        console.error('Error al cambiar la contraseña:', error.response?.data || error.message);
        return error.response?.data || { status: 'Error', message: 'Error al cambiar la contraseña.' };
    }
}

