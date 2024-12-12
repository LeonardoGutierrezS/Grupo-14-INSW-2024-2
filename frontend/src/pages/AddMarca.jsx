import React, { useState, useEffect } from 'react';

import { 
    createMarca,
    getAllMarcas,
    deleteMarca,
} from '@services/marca.service.js';
import '@styles/form.css';

const AddMarca = () => {
    const [marcaData, setMarcaData] = useState({
        nombre: '',
    });

    const [marcas, setMarcas] = useState([]);

    // Función para obtener todas las marcas
    const fetchMarcas = async () => {
        try {
            const response = await getAllMarcas();
            setMarcas(response.data);  // Asumiendo que la respuesta es un array de marcas
        } catch (error) {
            console.error('Error al obtener las marcas:', error.response?.data || error.message);
        }
    };

    // Función para eliminar una marca
    const handleDelete = async (marcaId) => {
        try {
            const response = await deleteMarca(marcaId);  // Usando la función deleteMarca para eliminar
            alert('Marca eliminada con éxito');
            console.log('Respuesta del backend:', response);

            // Recargar la lista de marcas después de eliminar
            fetchMarcas();
        } catch (error) {
            alert('Error al eliminar la marca');
            console.error('Error:', error.response?.data || error.message);
        }
    };

    useEffect(() => {
        fetchMarcas();  // Cargar marcas al montar el componente
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            // Enviar los datos al backend en el formato esperado
            const response = await createMarca(marcaData);
            console.log('Respuesta del backend:', response);
            // DAME UNA ALERTA QUE ME DE EL MENSAJE DE LA RESPUESTA DEL BACKEND

            alert(response.data.message);

            // Limpiar los datos del formulario
            setMarcaData({ nombre: '' });

            // Recargar la lista de marcas después de agregar una nueva
            fetchMarcas();
        } catch (error) {
            alert('Error al registrar la marca');
            console.error('Error:', error.response?.data || error.message);
        }
    };

    return (
        <div className="container" style={{ paddingTop: '200px' }}>
            <form className="form" onSubmit={handleSubmit}>
                <h1>Agregar Marca</h1>

                {/* Sección Marca */}
                <div>
                    <h2>Marca</h2>
                    <label>
                        Nombre:
                        <input
                            type="text"
                            value={marcaData.nombre}
                            onChange={(e) => setMarcaData({ nombre: e.target.value })}
                            required
                        />
                    </label>
                </div>

                <button type="submit">Agregar Marca</button>

            </form>

            {/* Sección Listado de Marcas */}
        </div>
    );
};

export default AddMarca;