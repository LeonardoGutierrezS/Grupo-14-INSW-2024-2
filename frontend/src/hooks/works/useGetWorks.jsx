import { useState, useEffect } from 'react';
import { getAllIngresos } from '@services/ingresoBicicletas.service.js';

const useGetWorks = () => {
    const [works, setWorks] = useState([]);

    const fetchWorks = async () => {
        try {
            const response = await getAllIngresos();
            const formattedData = response.map(work => ({
                id_reparacion: work.id_reparacion,
                bicicleta: `${work.id_bici.marca} ${work.id_bici.modelo}`,
                marca: work.id_bici.marca,
                modelo: work.id_bici.modelo,
                color: work.id_bici.color,
                nombre_cliente: work.id_cliente.nombre,
                rut: work.id_cliente.rut,
                whatsapp: work.id_cliente.whatsapp,
                correo: work.id_cliente.correo,
                tipo_trabajo: work.tipo_trabajo,
                detalle_trabajo: work.detalle_trabajo,
                obs_bici: work.obs_bici,
                repuestos: work.repuestos,
                fechaIngreso: work.fecha_ingreso,
                fechaEstimadaEntrega: work.fecha_est_entrega,
                fechaEntrega: work.fecha_entrega,
                precio: work.precio,
                estado: work.estado,
                id: work.id_reparacion,
            }));
            filterCurrentSessionUser(formattedData);
            setWorks(formattedData);
        } catch (error) {
            console.error("Error: ", error);
        }
    };

    const filterCurrentSessionUser = (formattedData) => {
        try {
            const { cliente } = JSON.parse(sessionStorage.getItem('usuario'));
            for (let i = 0; i < formattedData.length; i++) {
                if (formattedData[i].cliente === cliente) {
                    formattedData.splice(i, 1);
                    break;
                }
            }
        } catch (error) {
            console.error("Error filtering session user: ", error);
        }
    };

    useEffect(() => {
        fetchWorks();
    }, []);

    return { works, fetchWorks, setWorks };
};

export default useGetWorks;