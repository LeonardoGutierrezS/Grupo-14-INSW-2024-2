import axios from './root.service.js';

export const checkIn = async () => {
    try {
        const response = await axios.post('/user/check-in');
        return response.data;
    } catch (error) {
        console.error('Error al realizar el Check-In:', error.response?.data || error.message);
        return error.response?.data || { status: 'Error', message: 'Error al realizar el Check-In.' };
    }
};

export const checkOut = async () => {
    try {
        const response = await axios.post('/user/check-out');
        return response.data;
    } catch (error) {
        console.error('Error al realizar el Check-Out:', error.response?.data || error.message);
        return error.response?.data || { status: 'Error', message: 'Error al realizar el Check-Out.' };
    }
};

export async function getActiveShift() {
    try {
        const response = await axios.get(`/user/work-hours`);
        console.log('Respuesta del backend:', response);

        const activeShift = response.data.data.workHours.find(shift => !shift.check_out);
        return activeShift 
    } catch (error) {
        console.error('Error al obtener los turnos:', error.response?.data || error.message);
        throw error;
    }
}
