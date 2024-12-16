import { useState } from 'react';
import { updateIngresoBicicleta } from '@services/ingresoBicicletas.service.js';
import { showErrorAlert, showSuccessAlert } from '@helpers/sweetAlert.js';
import { formatPostUpdate } from '@helpers/formatData.js';

const useEditWork = (setWorks) => {
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [dataWork, setDataWork] = useState([]);

    const handleClickUpdate = () => {
        if (dataWork.length > 0) {
            setIsPopupOpen(true);
        }
    };

    const handleUpdate = async (updatedWorkData) => {
        console.log("Data enviada al actualizar: ", dataWork);
        if (updatedWorkData) {
            try {
                const id_reparacion = updatedWorkData.id_reparacion;
                const data = updatedWorkData;

    
                // Extraer y desestructurar los datos correctamente
                const updatedWork = await updateIngresoBicicleta(
                    id_reparacion,               // Primer parámetro: ID
                    { marca: data.marca, modelo: data.modelo, color: data.color }, // Datos de bicicleta
                    { rut: data.rut, nombre: data.nombre, whatsapp: data.whatsapp, correo: data.correo }, // Datos de cliente
                    { tipo_trabajo: data.tipo_trabajo, detalle_trabajo: data.detalle_trabajo, obs_bici: data.obs_bici, repuestos: data.repuestos, precio: data.precio, fecha_ingreso: data.fecha_ingreso, fecha_est_entrega: data.fecha_estimada_entrega } // Datos de reparación
                );
    
                showSuccessAlert('¡Actualizado!', 'El trabajo ha sido actualizado correctamente.');
                setIsPopupOpen(false);
    
                const formattedWork = formatPostUpdate(updatedWork);
    
                // Actualizar la lista de trabajos
                setWorks(prevWorks => prevWorks.map(work =>
                    work.id_reparacion === formattedWork.id_reparacion ? formattedWork : work
                ));
    
                setDataWork([]);
            } catch (error) {
                console.error('Error al actualizar el trabajo:', error);
                showErrorAlert('Cancelado', 'Ocurrió un error al actualizar el trabajo.');
            }
        }
    };

    return {
        handleClickUpdate,
        handleUpdate,
        isPopupOpen,
        setIsPopupOpen,
        dataWork,
        setDataWork
    };
};

export default useEditWork;
