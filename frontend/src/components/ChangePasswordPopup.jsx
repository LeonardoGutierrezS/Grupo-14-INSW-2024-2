import { useState } from 'react';
import '@styles/popupPayH.css';
import CloseIcon from '@assets/XIcon.svg';
import { changePassword } from '@services/user.service.js';
import { showErrorAlert, showSuccessAlert } from '@helpers/sweetAlert.js';

export default function ChangePasswordPopup({ show, setShow }) {
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await changePassword({ currentPassword, newPassword });
            if (response.status === 'Success') {
                showSuccessAlert('¡Contraseña cambiada!', 'Tu contraseña se ha actualizado correctamente.');
                setShow(false);
            } else {
                showErrorAlert('Error', response.message || 'Ocurrió un problema al cambiar la contraseña.');
            }
        } catch (error) {
            console.error('Error al cambiar la contraseña:', error);
            showErrorAlert('Error', 'Ocurrió un problema al cambiar la contraseña.');
        } finally {
            setLoading(false);
        }
    };

    return (
        show && (
            <div className="bg">
                <div className="popup">
                    <button className="close" onClick={() => setShow(false)}>
                        <img src={CloseIcon} alt="Cerrar" />
                    </button>
                    <h2 className="popup-title">Cambiar Contraseña</h2>
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label>Contraseña Actual</label>
                            <input
                                type="password"
                                value={currentPassword}
                                onChange={(e) => setCurrentPassword(e.target.value)}
                                required
                                placeholder="********"
                            />
                        </div>
                        <div className="form-group">
                            <label>Nueva Contraseña</label>
                            <input
                                type="password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                required
                                placeholder="********"
                            />
                        </div>
                        <button type="submit" disabled={loading} className="button button-secondary">
                            {loading ? 'Cambiando...' : 'Cambiar Contraseña'}
                        </button>
                    </form>
                </div>
            </div>
        )
    );
}
