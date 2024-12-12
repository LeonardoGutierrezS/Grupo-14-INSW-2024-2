import React, { useState, useEffect } from 'react';
import Table from '@components/Table';
import DeleteIcon from '../assets/deleteIcon.svg';
import UpdateIcon from '../assets/updateIcon.svg';
import {
    createInventario,
    getAllInventarios,
    deleteInventario,
    updateInventario,
} from '@services/inventario.service.js';

import { getAllMarcas } from '@services/marca.service.js';

import '@styles/inv.css';

const Inventario = () => {
    const [inventarioData, setInventarioData] = useState({
        nombre: '',
        tipo_objeto: '',
        cantidad: '',
        precio: '',
        descripcion: '',
        id_marca: '',
    });

    const [inventarios, setInventarios] = useState([]);
    const [filterNombre, setFilterNombre] = useState(''); // Filtro por nombre

    const [marcas, setMarcas] = useState([]);

    // Función para obtener todos los inventarios
    const fetchInventarios = async () => {
        try {
            const response = await getAllInventarios();
            setInventarios(response.data);  // Asumiendo que la respuesta es un array de inventarios
        } catch (error) {
            console.error('Error al obtener los inventarios:', error.response?.data || error.message);
            setInventarios([]);
        }
    };

    const fetchMarcas = async () => {
        try {
            const response = await getAllMarcas(); // Llamada al backend
            setMarcas(response.data); // Asume que el backend devuelve [{ id, nombre }]
        } catch (error) {
            console.error('Error al obtener las marcas:', error.response?.data || error.message);
        }
    };

    const getMarcaNombre = (id_marca) => {
        const marca = marcas.find((m) => m.id_marca === id_marca);
        return marca ? marca.nombre : "Sin marca";
    };

    useEffect(() => {
        fetchInventarios();  // Cargar inventarios al montar el componente
        fetchMarcas();  // Cargar marcas al montar el componente
    }, []);

    // Crear un nuevo array con nombres de marcas
    const inventariosConMarcas = inventarios.map((inventario) => ({
        ...inventario,
        id_marca: getMarcaNombre(inventario.id_marca), // Cambiar id_marca por el nombre
    }));

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            // Enviar los datos al backend en el formato esperado
            const response = await createInventario(inventarioData);
            alert('Inventario registrado con éxito');
            console.log('Respuesta del backend:', response);

            // Limpiar los datos del formulario
            setInventarioData({ nombre: '', cantidad: '', precio: '' });

            // Recargar la lista de inventarios después de agregar una nueva
            fetchInventarios();
        } catch (error) {
            alert('Error al registrar el inventario');
            console.error('Error:', error.response?.data || error.message);
        }
    };

    const handleDelete = async (id) => {
        try {
            await deleteInventario(id);
            alert('Inventario eliminado con éxito');
            fetchInventarios();  // Recargar la lista después de eliminar
        } catch (error) {
            alert('Error al eliminar el inventario');
            console.error('Error:', error.response?.data || error.message);
        }
    };

    const handleUpdate = (id) => {
        // Lógica para actualizar inventarios (abrir popup, etc.)
        alert('Actualizar inventario con ID: ' + id);
    };

    const columns = [
        { title: "Nombre", field: "nombre", width: 150, responsive: 0 },
        { title: "Marca", field: "id_marca", width: 100, responsive: 2 },
        { title: "Tipo de objeto", field: "tipo_objeto", width: 150, responsive: 0 },
        { title: "Cantidad", field: "cantidad", width: 150, responsive: 1 },
        { title: "Precio", field: "precio", width: 100, responsive: 2 },
        { title: "Descripción", field: "descripcion", width: 200, responsive: 3 },
    ];

    return (
        <div className="inv-container" style={{ paddingTop: '100px' }}>
            <div className="inv-form-section">
                <h2>Registrar Inventario</h2>
                <form onSubmit={handleSubmit}>
                    <div className="inv-form-group">
                        <label htmlFor="nombre">Nombre</label>
                        <input
                            type="text"
                            id="nombre"
                            name="nombre"
                            value={inventarioData.nombre}
                            onChange={(e) => setInventarioData({ ...inventarioData, nombre: e.target.value })}
                            required
                        />
                    </div>

                    <div className="inv-form-group">
                        <label htmlFor="tipo_objeto">Tipo de objeto</label>
                        <input
                            type="text"
                            id="tipo_objeto"
                            name="tipo_objeto"
                            value={inventarioData.tipo_objeto}
                            onChange={(e) => setInventarioData({ ...inventarioData, tipo_objeto: e.target.value })}
                            required
                        />
                    </div>
                    <div className="inv-form-group">
                        <label htmlFor="cantidad">Cantidad</label>
                        <input
                            type="number"
                            id="cantidad"
                            name="cantidad"
                            value={inventarioData.cantidad}
                            onChange={(e) => setInventarioData({ ...inventarioData, cantidad: e.target.value })}
                            required
                        />
                    </div>
                    <div className="inv-form-group">
                        <label htmlFor="precio">Precio</label>
                        <input
                            type="number"
                            id="precio"
                            name="precio"
                            value={inventarioData.precio}
                            onChange={(e) => setInventarioData({ ...inventarioData, precio: e.target.value })}
                            required
                        />
                    </div>
                    <div className="inv-form-group">
                        <label htmlFor="descripcion">Descripción</label>
                        <input
                            type="text"
                            id="descripcion"
                            name="descripcion"
                            value={inventarioData.descripcion}
                            onChange={(e) => setInventarioData({ ...inventarioData, descripcion: e.target.value })}
                            required
                        />
                    </div>
                    <div className="inv-form-group">
                        <label htmlFor="id_marca">Marca</label>
                        <select
                            id="id_marca"
                            name="id_marca"
                            value={inventarioData.id_marca}
                            onChange={(e) => setInventarioData({ ...inventarioData, id_marca: e.target.value })}
                            required
                        >
                            <option value="">Seleccionar marca</option>
                            {marcas.map((marca) => (
                                <option key={marca.id_marca} value={marca.id_marca}>{marca.nombre}</option>
                            ))}
                        </select>
                    </div>
                    <button type="submit">Registrar</button>
                </form>
            </div>

            <div className="inv-table-section">
                <h2>Listado de inventarios</h2>
                
                <input
                    type="text"
                    placeholder="Filtrar por nombre"
                    value={filterNombre}
                    onChange={(e) => setFilterNombre(e.target.value)}
                />

                <Table
                    columns={columns}
                    data={inventariosConMarcas}
                    filterNombre={filterNombre}
                    onDelete={handleDelete}
                    onUpdate={handleUpdate}
                />
            </div>
            
        </div>
    );
}

export default Inventario;
