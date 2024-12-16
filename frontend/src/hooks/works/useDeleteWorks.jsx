import { deleteIngreso } from '@services/ingresoBicicletas.service.js';
import { deleteDataAlert, showErrorAlert, showSuccessAlert } from '@helpers/sweetAlert.js';

const useDeleteWork = (fetchWorks, setDataWork) => {
    const handleDelete = async (dataWork) => {
        if (dataWork.length > 0) {
            try {
                const result = await deleteDataAlert();
                if (result.isConfirmed) {
                    const response = await deleteIngreso(dataWork[0].id_reparacion);
                    if (response.status === 'Client error') {
                        return showErrorAlert('Error', response.details);
                    }
                    showSuccessAlert('¡Eliminado!', 'El trabajo ha sido eliminado correctamente.');
                    await fetchWorks();
                    setDataWork([]);
                } else {
                    showErrorAlert('Cancelado', 'La operación ha sido cancelada.');
                }
            } catch (error) {
                console.error('Error al eliminar el trabajo:', error);
                showErrorAlert('Cancelado', 'Ocurrió un error al eliminar el trabajo.');
            }
        }
    };

    return {
        handleDelete
    };
};

export default useDeleteWork;