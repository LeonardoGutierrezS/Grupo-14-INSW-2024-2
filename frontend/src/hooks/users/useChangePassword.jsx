import { changePassword } from '@services/user.service.js';
import { showErrorAlert, showSuccessAlert } from '@helpers/sweetAlert.js';

export default function useChangePassword() {
    const handleChangePassword = async (currentPassword, newPassword) => {
        try {
            const response = await changePassword({ currentPassword, newPassword });
            if (response.status === 'Success') {
                showSuccessAlert('¡Éxito!', 'La contraseña ha sido actualizada.');
                return true;
            } else {
                showErrorAlert('Error', response.message || 'No se pudo cambiar la contraseña.');
                return false;
            }
        } catch (error) {
            console.error('Error:', error);
            showErrorAlert('Error', 'Ocurrió un error al cambiar la contraseña.');
            return false;
        }
    };

    return { handleChangePassword };
}
