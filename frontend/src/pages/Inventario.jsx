import  { useState, useEffect } from 'react';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import {
    createInventario,
    getAllInventarios,
    deleteInventario,
    updateInventario,
} from '@services/inventario.service.js';
import {
    getAllMarcas,
    createMarca,
    deleteMarca,
    updateMarca,
} from '@services/marca.service.js';
import {
    getAllCategorias,
    createCategoria,
    deleteCategoria,
    updateCategoria,
} from '@services/categoria.service.js';
import {
    getAllTipos,
    createTipo,
    deleteTipo,
    updateTipo,
} from '@services/tipo.service.js';
import '@styles/inv.css';
import { showErrorAlert, showSuccessAlert } from '@helpers/sweetAlert.js';
import { updateInventarioCantidad } from '../services/inventario.service';

const Modal = ({ isOpen, onClose, title, children, showCloseButton = true }) => {
    if (!isOpen) return null;
    return (
        <div className="inv-modal-overlay">
            <div className="inv-modal-content">
                <h3 className="inv-modal-title">{title}</h3>
                {children}
                {showCloseButton && (
                    <button className="inv-modal-close-btn" onClick={onClose}>Cerrar</button>
                )}
            </div>
        </div>
    );
};

const Inventario = () => {
    const [inventarios, setInventarios] = useState([]);
    const [marcas, setMarcas] = useState([]);
    const [categorias, setCategorias] = useState([]);
    const [tipos, setTipos] = useState([]);

    const [searchTerm, setSearchTerm] = useState('');
    const [selectedMarca, setSelectedMarca] = useState('');
    const [selectedCategoria, setSelectedCategoria] = useState('');
    const [selectedTipo, setSelectedTipo] = useState('');
    const [selectedEstado, setSelectedEstado] = useState('');

    const [isFormVisible, setFormVisible] = useState(false);

    const [isMarcaModalOpen, setMarcaModalOpen] = useState(false);
    const [isGestorDeMarcaModalOpen, setGestorDeMarcaModalOpen] = useState(false);

    const [isCategoriaModalOpen, setCategoriaModalOpen] = useState(false);
    const [isGestorDeCategoriaModalOpen, setGestorDeCategoriaModalOpen] = useState(false);

    const [isTipoModalOpen, setTipoModalOpen] = useState(false);
    const [isGestorDeTipoModalOpen, setGestorDeTipoModalOpen] = useState(false);

    const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
    const [isEditModalOpen, setEditModalOpen] = useState(false);
    const [deleteTarget, setDeleteTarget] = useState(null);
    const [editTarget, setEditTarget] = useState(null);

    const [inventarioData, setInventarioData] = useState({
        nombre: '',
        cantidad: '',
        precio: '',
        descripcion: '',
        id_marca: '',
        id_categoria: '',
        id_tipo: '',
    });

    const [newMarca, setNewMarca] = useState('');
    const [editMarca, setEditMarca] = useState(null);

    const [newCategoria, setNewCategoria] = useState('');
    const [editCategoria, setEditCategoria] = useState(null);

    const [newTipo, setNewTipo] = useState('');
    const [editTipo, setEditTipo] = useState(null);

    const [numero, setNumero] = useState(null);

    useEffect(() => {
        fetchInventarios();
        fetchMarcas();
        fetchCategorias();
        fetchTipos();
    }, []);

    const fetchInventarios = async () => {
        const response = await getAllInventarios();
        setInventarios(response.data || []);
    };

    const fetchMarcas = async () => {
        const response = await getAllMarcas();
        setMarcas(response.data || []);
    };

    const fetchCategorias = async () => {
        const response = await getAllCategorias();
        setCategorias(response.data || []);
    };

    const fetchTipos = async () => {
        const response = await getAllTipos();
        setTipos(response.data || []);
    };

    const getEstado = (cantidad) => {
        if (cantidad === 0) return 'Sin Stock';
        if (cantidad <= 15) return 'Bajo';
        return 'Disponible';
    };

    const filteredInventarios = inventarios.filter((inv) => {
        const estado = getEstado(inv.cantidad);
        const matchesSearch = inv.nombre.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesMarca = selectedMarca === '' || inv.id_marca === parseInt(selectedMarca);
        const matchesCategoria = selectedCategoria === '' || inv.id_categoria === parseInt(selectedCategoria);
        const matchesTipo = selectedTipo === '' || inv.id_tipo === parseInt(selectedTipo);
        const matchesEstado = selectedEstado === '' || estado === selectedEstado;

        return matchesSearch && matchesMarca && matchesCategoria && matchesTipo && matchesEstado;
    });

    const generarReporte = () => {
        const encabezados = [
            'Nombre',
            'Marca',
            'Categoría',
            'Tipo',
            'Cantidad',
            'Precio',
            'Descripción',
            'Estado'
        ];
        const filas = filteredInventarios.map((inv) => {
            const marca = marcas.find((m) => m.id_marca === inv.id_marca)?.nombre || 'Sin marca';
            const categoria = categorias.find((c) => c.id_categoria === inv.id_categoria)?.nombre || 'Sin categoría';
            const tipo = tipos.find((t) => t.id_tipo === inv.id_tipo)?.nombre || 'Sin tipo';
            const estado = getEstado(inv.cantidad);

            return [
                inv.nombre,
                marca,
                categoria,
                tipo,
                inv.cantidad,
                inv.precio,
                inv.descripcion,
                estado
            ].join(',');
        });

        const csvContent = [encabezados.join(','), ...filas].join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = 'reporte_inventario.csv';
        link.click();
    };

    const generarReportePDF = () => {
        const doc = new jsPDF();
        doc.text('Reporte de Inventario', 14, 15); // Título del reporte

        // Crear filas del PDF
        const filas = filteredInventarios.map((inv) => {
            const marca = marcas.find((m) => m.id_marca === inv.id_marca)?.nombre || 'Sin marca';
            const categoria = categorias.find((c) => c.id_categoria === inv.id_categoria)?.nombre || 'Sin categoría';
            const tipo = tipos.find((t) => t.id_tipo === inv.id_tipo)?.nombre || 'Sin tipo';
            const estado = getEstado(inv.cantidad);

            return [
                inv.nombre,
                marca,
                categoria,
                tipo,
                inv.cantidad,
                inv.precio,
                inv.descripcion,
                estado
            ];
        });

        // Configurar la tabla
        doc.autoTable({
            head: [['Nombre', 'Marca', 'Categoría', 'Tipo', 'Cantidad', 'Precio', 'Descripción', 'Estado']],
            body: filas,
            startY: 20, 
        });

        doc.save('reporte_inventario.pdf'); // Descargar el PDF
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await createInventario(inventarioData);
            if (response.status === 'Success') {
                showSuccessAlert('Inventario creado con éxito');
            } else {
                //muestra tambien el mensaje de error del backend y el detalle
                showErrorAlert('Error al crear el inventario',
                    `${response.message || "Mensaje no disponible"}\n${response.details || "Detalles no disponibles"}`
                );
            }
            fetchInventarios();
            setInventarioData({
                nombre: '',
                cantidad: '',
                precio: '',
                descripcion: '',
                id_marca: '',
                id_categoria: '',
                id_tipo: '',
            });
            setFormVisible(false);
        } catch (error) {
            console.error('Error al crear el inventario:', error);
        }
    };

    const handleEdit = async (e) => {
        e.preventDefault();
        if (editTarget) {
            try {
                const response = await updateInventario(editTarget.id, inventarioData);
                if (response.status === 'Success') {
                    showSuccessAlert('Inventario actualizado con éxito');
                } else {
                    showErrorAlert('Error al actualizar el inventario',
                        `${response.message || "Mensaje no disponible"}\n${response.details || "Detalles no disponibles"}`
                    );
                }
                fetchInventarios();
                setEditModalOpen(false);
                setEditTarget(null);
                setInventarioData({
                    nombre: '',
                    cantidad: '',
                    precio: '',
                    descripcion: '',
                    id_marca: '',
                    id_categoria: '',
                    id_tipo: '',
                });
            } catch (error) {
                console.error('Error al actualizar el inventario:', error);
            }
        }
    };
    const handleCantidadChange = async (id, nuevaCantidad) => {
        if (nuevaCantidad < 0) {
            showErrorAlert("La cantidad no puede ser negativa");
            return;
        }
    
        try {
            const response = await updateInventarioCantidad(id, { cantidad: nuevaCantidad });
            if (response.status === "Success") {
                showSuccessAlert("Cantidad actualizada con éxito");
                fetchInventarios(); // Actualizar la lista de inventarios
            } else {
                showErrorAlert(
                    "Error al actualizar la cantidad", 
                    `${response.message || "Mensaje no disponible"}\n${response.details || "Detalles no disponibles"}`
                );
            }
        } catch (error) {
            console.error("Error al actualizar la cantidad:", error);
            showErrorAlert("Error interno al actualizar la cantidad");
        }
    };

    const handleDelete = async () => {
        if (deleteTarget) {
            try {
                const response = await deleteInventario(deleteTarget.id);
                if (response.status === 'Success') {
                    showSuccessAlert('Inventario eliminado con éxito');
                } else {
                    showErrorAlert('Error al eliminar el inventario', response.details || response.message);
                }
                fetchInventarios();
                setDeleteModalOpen(false);
                setDeleteTarget(null);
            } catch (error) {
                console.error('Error al eliminar el inventario:', error);
            }
        }
    };

    const handleCreateMarca = async () => {
        try {
            const response = await createMarca({ nombre: newMarca });
            if (response.status === 'Success') {
                showSuccessAlert('Marca creada con éxito');
            } else {
                showErrorAlert('Error al crear la marca',
                    `${response.message || "Mensaje no disponible"}\n${response.details || "Detalles no disponibles"}`
                );
            }
            setMarcaModalOpen(false);
            setNewMarca('');
            fetchMarcas();
        } catch (error) {
            console.error('Error al crear la marca:', error);
        }
    };
    const handleUpdateMarca = async (id, nombre) => {
        try {
            const response = await updateMarca(id, { nombre });
            if (response.status === 'Success') {
                showSuccessAlert('Marca actualizada con éxito');
            } else {
                showErrorAlert('Error al actualizar la marca',
                    `${response.message || "Mensaje no disponible"}\n${response.details || "Detalles no disponibles"}`
                );
            }
            setEditMarca(null);
            fetchMarcas();
        } catch (error) {
            console.error('Error al actualizar la marca:', error);
        }
    };
    const handleDeleteMarca = async (id) => {
        try {
            const response = await deleteMarca(id); 
            if (response.status === 'Success') {
                showSuccessAlert('Marca eliminada con éxito');
            } else {
                showErrorAlert('Error al eliminar la marca La marca se encuentra en uso',
                    `${response.message || "Mensaje no disponible"}\n${response.details || "Detalles no disponibles"}`
                );
            }
            fetchMarcas();
        } catch (error) {
            console.error('Error al eliminar la marca:', error);
        }
    };


    const handleCreateCategoria = async () => {
        try {
            const response = await createCategoria({ nombre: newCategoria });
            if (response.status === 'Success') {
                showSuccessAlert('Categoría creada con éxito');
            } else {
                showErrorAlert('Error al crear la categoría',
                    `${response.message || "Mensaje no disponible"}\n${response.details || "Detalles no disponibles"}`
                );
            }
            setCategoriaModalOpen(false);
            setNewCategoria('');
            fetchCategorias();
        } catch (error) {
            console.error('Error al crear la categoría:', error);
        }
    };
    const handleUpdateCategoria = async (id, nombre) => {
        try {
            const response = await updateCategoria(id, { nombre });
            if (response.status === 'Success') {
                showSuccessAlert('Categoría actualizada con éxito');
            } else {
                showErrorAlert('Error al actualizar la categoría',
                    `${response.message || "Mensaje no disponible"}\n${response.details || "Detalles no disponibles"}`
                );
            }
            setEditCategoria(null);
            fetchCategorias();
        } catch (error) {
            console.error('Error al actualizar la categoría:', error);
        }
    };
    const handleDeleteCategoria = async (id) => {
        try {
            const response = await deleteCategoria(id);
            if (response.status === 'Success') {
                showSuccessAlert('Categoría eliminada con éxito');
            }
            else {
                showErrorAlert('Error al eliminar la categoría',
                    `${response.message || "Mensaje no disponible"}\n${response.details || "Detalles no disponibles"}`
                );
            }
            fetchCategorias();
        } catch (error) {
            console.error('Error al eliminar la categoría:', error);
        }
    };


    const handleCreateTipo = async () => {
        try {
            const response = await createTipo({ nombre: newTipo });
            if (response.status === 'Success') {
                showSuccessAlert('Tipo creado con éxito');
            }
            else {
                showErrorAlert('Error al crear el tipo',
                    `${response.message || "Mensaje no disponible"}\n${response.details || "Detalles no disponibles"}`
                );
            }
            setTipoModalOpen(false);
            setNewTipo('');
            fetchTipos();
        } catch (error) {
            console.error('Error al crear el tipo:', error);
        }
    };
    const handleUpdateTipo = async (id, nombre) => {
        try {
            const response = await updateTipo(id, { nombre });
            if (response.status === 'Success') {
                showSuccessAlert('Tipo actualizado con éxito');
            } else {
                showErrorAlert('Error al actualizar el tipo',
                    `${response.message || "Mensaje no disponible"}\n${response.details || "Detalles no disponibles"}`
                );
            }
            setEditTipo(null);
            fetchTipos();
        } catch (error) {
            console.error('Error al actualizar el tipo:', error);
        }
    };
    const handleDeleteTipo = async (id) => {
        try {
            const response = await deleteTipo(id);
            if (response.status === 'Success') {
                showSuccessAlert('Tipo eliminado con éxito');
            } else {
                showErrorAlert('Error al eliminar el tipo',
                    `${response.message || "Mensaje no disponible"}\n${response.details || "Detalles no disponibles"}`
                );
            }
            fetchTipos();
        } catch (error) {
            console.error('Error al eliminar el tipo:', error);
        }
    };

    return (
        
        <div className="inv-container">
            
            <h2 className="inv-title">Inventario</h2>
            
            {/* Filtros de búsqueda */}
            <div className="inv-filters">
                {/* Barra de búsqueda */}
                <input
                    type="text"
                    className="inv-input-search"
                    placeholder="Buscar por nombre"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                {/* Filtro por marca */}
                <select
                    className="inv-select-filter"
                    value={selectedMarca}
                    onChange={(e) => setSelectedMarca(e.target.value)}
                    >
                    <option value="">Todas las Marcas</option>
                    {marcas.map((marca) => (
                        <option key={marca.id_marca} value={marca.id_marca}>{marca.nombre}</option>
                    ))}
                </select>
                {/* Filtro por categoría */}
                <select
                    className="inv-select-filter"
                    value={selectedCategoria}
                    onChange={(e) => setSelectedCategoria(e.target.value)}
                    >
                    <option value="">Todas las Categorías</option>
                    {categorias.map((categoria) => (
                        <option key={categoria.id_categoria} value={categoria.id_categoria}>{categoria.nombre}</option>
                    ))}
                </select>
                {/* Filtro por tipo */}
                <select
                    className="inv-select-filter"
                    value={selectedTipo}
                    onChange={(e) => setSelectedTipo(e.target.value)}
                    >
                    <option value="">Todos los Tipos</option>
                    {tipos.map((tipo) => (
                        <option key={tipo.id_tipo} value={tipo.id_tipo}>{tipo.nombre}</option>
                    ))}
                </select>
                {/* Filtro por estado */}
                <select
                    className="inv-select-filter"
                    value={selectedEstado}
                    onChange={(e) => setSelectedEstado(e.target.value)}
                    >
                    <option value="">Todos los Estados</option>
                    <option value="Sin Stock">Sin Stock</option>
                    <option value="Bajo">Bajo</option>
                    <option value="Disponible">Disponible</option>
                </select>
            </div>

            {/* Tabla de inventarios */}
            <table className="inv-table">
                <thead>
                    <tr className='inv-tr-header'>
                        <th className="inv-th">Nombre</th>
                        <th className="inv-th">Marca</th>
                        <th className="inv-th">Categoría</th>
                        <th className="inv-th">Tipo</th>
                        <th className="inv-th">Cantidad</th>
                        <th className="inv-th">Precio</th>
                        <th className="inv-th">Descripción</th>
                        <th className="inv-th">Estado de Inventario</th>
                        <th className="inv-th">Acciones</th>
                        <th className="inv-th">Agregar/Restar</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredInventarios.map((inv) => {
                        // Determinar el estado del inventario basado en la cantidad
                        let estado = { texto: '', clase: '' };
                        if (inv.cantidad === 0) {
                            estado = { texto: 'Sin Stock', clase: 'estado-critico' }; // Negro
                        } else if (inv.cantidad <= 15) {
                            estado = { texto: 'Bajo', clase: 'estado-bajo' }; // Amarillo
                        } else {
                            estado = { texto: 'Disponible', clase: 'estado-disponible' }; // Verde
                        }

                        return (
                            <tr key={inv.id} className="inv-tr">
                                <td className="inv-td">{inv.nombre}</td>
                                <td className="inv-td">
                                    {marcas.find((m) => m.id_marca === inv.id_marca)?.nombre || 'Sin marca'}
                                </td>
                                <td className="inv-td">
                                    {categorias.find((c) => c.id_categoria === inv.id_categoria)?.nombre || 'Sin categoría'}
                                </td>
                                <td className="inv-td">
                                    {tipos.find((t) => t.id_tipo === inv.id_tipo)?.nombre || 'Sin tipo'}
                                </td>
                                <td className="inv-td">{inv.cantidad}</td>
                                <td className="inv-td">{inv.precio}</td>
                                <td className="inv-td">{inv.descripcion}</td>
                                <td className={`inv-td estado ${estado.clase}`}>{estado.texto}</td>
                                <td className="inv-td">
                                    <button
                                        className="inv-edit-button"
                                        onClick={() => {
                                            setEditTarget(inv);
                                            setInventarioData({
                                                nombre: inv.nombre,
                                                cantidad: inv.cantidad,
                                                precio: inv.precio,
                                                descripcion: inv.descripcion,
                                                id_marca: inv.id_marca,
                                                id_categoria: inv.id_categoria,
                                                id_tipo: inv.id_tipo,
                                            });
                                            setEditModalOpen(true);
                                        }}
                                    >
                                        Editar
                                    </button>
                                    <button
                                        className="inv-delete-button"
                                        onClick={() => {
                                            setDeleteTarget(inv);
                                            setDeleteModalOpen(true);
                                        }}
                                    >
                                        Eliminar
                                    </button>
                                </td>
                                <td className="inv-td">
                                    <input style={{ width: '50px', marginRight: '10px' }}
                                        type="number"
                                        value={numero}
                                        onChange={(e) => setNumero(parseInt(e.target.value))}
                                        className="inv-input"
                                        min="0"
                                    />
                                    <button
                                        className="inv-edit-button"
                                        onClick={() => handleCantidadChange(inv.id, inv.cantidad + numero)}
                                    >
                                        Agregar
                                    </button>
                                    <button
                                        className="inv-delete-button"
                                        onClick={() => handleCantidadChange(inv.id, inv.cantidad - numero)}
                                        disabled={inv.cantidad <= 0}
                                    >
                                        Restar
                                    </button>
                                </td>
                                
                            </tr>
                        );
                    })}
                </tbody>
            </table>


            <div className="inv-botones-container">
                {/* Botón centralizado para Agregar Inventario */}
                <div className="inv-boton-central">
                    <button className="inv-button" onClick={() => setFormVisible(!isFormVisible)}>
                        {isFormVisible ? 'Ocultar Formulario' : 'Agregar Inventario'}
                    </button>
                </div>

                {/* Línea inferior con botones alineados a la izquierda y derecha */}
                <div className="inv-boton-linea">
                    {/* Botones alineados a la izquierda */}
                    <div className="inv-botones-izquierda">
                        <button className="inv-button" onClick={() => setGestorDeMarcaModalOpen(true)}>
                            Gestionar Marcas
                        </button>
                        <button className="inv-button" onClick={() => setGestorDeCategoriaModalOpen(true)}>
                            Gestionar Categorías
                        </button>
                        <button className="inv-button" onClick={() => setGestorDeTipoModalOpen(true)}>
                            Gestionar Tipos
                        </button>
                    </div>

                    {/* Botones alineados a la derecha */}
                    <div className="inv-botones-derecha">
                        <button className="inv-button" onClick={generarReporte}>
                            Crear Reporte CSV
                        </button>
                        <button className="inv-button" onClick={generarReportePDF}>
                            Crear Reporte PDF
                        </button>
                    </div>
                </div>
            </div>

            {/* Formulario para agregar inventario */}
            {isFormVisible && (
                <form onSubmit={handleSubmit} className="inv-form">
                    <div className="inv-form-group">
                        <label className="inv-label">Nombre</label>
                        <input
                            type="text"
                            className="inv-input"
                            value={inventarioData.nombre}
                            onChange={(e) => setInventarioData({ ...inventarioData, nombre: e.target.value })}
                            required
                        />
                    </div>
                    <div className="inv-form-group">
                        <label className="inv-label">Marca</label>
                        <select
                            className="inv-select"
                            value={inventarioData.id_marca}
                            onChange={(e) => setInventarioData({ ...inventarioData, id_marca: e.target.value })}
                            required
                        >
                            <option value="">Seleccionar marca</option>
                            {marcas.map((m) => (
                                <option key={m.id} value={m.id_marca}>{m.nombre}</option>
                            ))}
                        </select>
                        <button className="inv-add-button" type="button" onClick={() => setMarcaModalOpen(true)}>+ Añadir Marca</button>
                    </div>
                    <div className="inv-form-group">
                        <label className="inv-label">Categoría</label>
                        <select
                            className="inv-select"
                            value={inventarioData.id_categoria}
                            onChange={(e) => setInventarioData({ ...inventarioData, id_categoria: e.target.value })}
                            required
                        >
                            <option value="">Seleccionar categoría</option>
                            {categorias.map((c) => (
                                <option key={c.id} value={c.id_categoria}>{c.nombre}</option>
                            ))}
                        </select>
                        <button className="inv-add-button" type="button" onClick={() => setCategoriaModalOpen(true)}>+ Añadir Categoría</button>
                    </div>
                    <div className="inv-form-group">
                        <label className="inv-label">Tipo</label>
                        <select
                            className="inv-select"
                            value={inventarioData.id_tipo}
                            onChange={(e) => setInventarioData({ ...inventarioData, id_tipo: e.target.value })}
                            required
                        >
                            <option value="">Seleccionar tipo</option>
                            {tipos.map((t) => (
                                <option key={t.id} value={t.id_tipo}>{t.nombre}</option>
                            ))}
                        </select>
                        <button className="inv-add-button" type="button" onClick={() => setTipoModalOpen(true)}>+ Añadir Tipo</button>
                    </div>
                    <div className="inv-form-group">
                        <label className="inv-label">Cantidad</label>
                        <input
                            type="number"
                            className="inv-input"
                            value={inventarioData.cantidad}
                            onChange={(e) => setInventarioData({ ...inventarioData, cantidad: e.target.value })}
                            required
                        />
                    </div>
                    <div className="inv-form-group">
                        <label className="inv-label">Precio</label>
                        <input
                            type="number"
                            className="inv-input"
                            value={inventarioData.precio}
                            onChange={(e) => setInventarioData({ ...inventarioData, precio: e.target.value })}
                            required
                        />
                    </div>
                    <div className="inv-form-group">
                        <label className="inv-label">Descripción</label>
                        <input
                            type="text"
                            className="inv-input"
                            value={inventarioData.descripcion}
                            onChange={(e) => setInventarioData({ ...inventarioData, descripcion: e.target.value })}
                            required
                        />
                    </div>
                    <button type="submit" className="inv-submit-button">Registrar</button>
                </form>
            )}

            {/* Modal para confirmar eliminación */}
            <Modal isOpen={isDeleteModalOpen} onClose={() => setDeleteModalOpen(false)} title="Confirmar Eliminación" showCloseButton={false}>
                <p>¿Estás seguro que quieres eliminar "{deleteTarget?.nombre}"?</p>
                <div className="inv-modal-actions">
                    <button className="inv-modal-save-button" onClick={handleDelete}>Confirmar</button>
                    <button className="inv-modal-close-btn" onClick={() => setDeleteModalOpen(false)}>Cancelar</button>
                </div>
            </Modal>

            {/* Modal para editar inventario */}
            <Modal isOpen={isEditModalOpen} onClose={() => setEditModalOpen(false)} title="Editar Inventario">
                <form onSubmit={handleEdit} className="inv-form">
                    <div className="inv-form-group">
                        <label className="inv-label">Nombre</label>
                        <input
                            type="text"
                            className="inv-input"
                            value={inventarioData.nombre}
                            onChange={(e) => setInventarioData({ ...inventarioData, nombre: e.target.value })}
                            required
                        />
                    </div>
                    <div className="inv-form-group">
                        <label className="inv-label">Marca</label>
                        <select
                            className="inv-select"
                            value={inventarioData.id_marca}
                            onChange={(e) => setInventarioData({ ...inventarioData, id_marca: e.target.value })}
                            required
                        >
                            <option value="">Seleccionar marca</option>
                            {marcas.map((m) => (
                                <option key={m.id} value={m.id_marca}>{m.nombre}</option>
                            ))}
                        </select>
                    </div>
                    <div className="inv-form-group">
                        <label className="inv-label">Categoría</label>
                        <select
                            className="inv-select"
                            value={inventarioData.id_categoria}
                            onChange={(e) => setInventarioData({ ...inventarioData, id_categoria: e.target.value })}
                            required
                        >
                            <option value="">Seleccionar categoría</option>
                            {categorias.map((c) => (
                                <option key={c.id} value={c.id_categoria}>{c.nombre}</option>
                            ))}
                        </select>
                    </div>
                    <div className="inv-form-group">
                        <label className="inv-label">Tipo</label>
                        <select
                            className="inv-select"
                            value={inventarioData.id_tipo}
                            onChange={(e) => setInventarioData({ ...inventarioData, id_tipo: e.target.value })}
                            required
                        >
                            <option value="">Seleccionar tipo</option>
                            {tipos.map((t) => (
                                <option key={t.id} value={t.id_tipo}>{t.nombre}</option>
                            ))}
                        </select>
                    </div>
                    <div className="inv-form-group">
                        <label className="inv-label">Cantidad</label>
                        <input
                            type="number"
                            className="inv-input"
                            value={inventarioData.cantidad}
                            onChange={(e) => setInventarioData({ ...inventarioData, cantidad: e.target.value })}
                            required
                        />
                    </div>
                    <div className="inv-form-group">
                        <label className="inv-label">Precio</label>
                        <input
                            type="number"
                            className="inv-input"
                            value={inventarioData.precio}
                            onChange={(e) => setInventarioData({ ...inventarioData, precio: e.target.value })}
                            required
                        />
                    </div>
                    <div className="inv-form-group">
                        <label className="inv-label">Descripción</label>
                        <input
                            type="text"
                            className="inv-input"
                            value={inventarioData.descripcion}
                            onChange={(e) => setInventarioData({ ...inventarioData, descripcion: e.target.value })}
                            required
                        />
                    </div>
                    <button type="submit" className="inv-submit-button">Actualizar</button>
                </form>
            </Modal>

            {/* Modal para añadir marca */}
            <Modal isOpen={isMarcaModalOpen} onClose={() => setMarcaModalOpen(false)} title="Añadir Marca">
                <input
                    type="text"
                    className="inv-modal-input"
                    value={newMarca}
                    onChange={(e) => setNewMarca(e.target.value)}
                    placeholder="Nombre de la marca"
                />
                <button className="inv-modal-save-button" onClick={handleCreateMarca}>Guardar</button>
            </Modal>

            {/* Modal Para gestionar marcas */}
            <Modal isOpen={isGestorDeMarcaModalOpen} onClose={() => setGestorDeMarcaModalOpen(false)} title="Gestor de Marcas">
                <input
                    type="text"
                    className="inv-input"
                    placeholder="Nueva Marca"
                    value={newMarca}
                    onChange={(e) => setNewMarca(e.target.value)}
                />
                <button className="inv-add-button" onClick={handleCreateMarca}>Añadir Marca</button>
                <table className="inv-table">
                    <thead>
                        <tr>
                            <th className="inv-th">Nombre</th>
                            <th className="inv-th">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {marcas.map((marca) => (
                            <tr key={marca.id_marca} className="inv-tr">
                                <td className="inv-td">
                                    {editMarca === marca.id_marca ? (
                                        <input
                                            type="text"
                                            className="inv-input"
                                            defaultValue={marca.nombre}
                                            onChange={(e) => setNewMarca(e.target.value)}
                                        />
                                    ) : (
                                        marca.nombre
                                    )}
                                </td>
                                <td className="inv-td">
                                    {editMarca === marca.id_marca ? (
                                        <button
                                            className="inv-save-button"
                                            onClick={() => handleUpdateMarca(marca.id_marca, newMarca)}
                                        >
                                            Guardar
                                        </button>
                                    ) : (
                                        <button
                                            className="inv-edit-button"
                                            onClick={() => setEditMarca(marca.id_marca)}
                                        >
                                            Editar
                                        </button>
                                    )}
                                    <button
                                        className="inv-delete-button"
                                        onClick={() => handleDeleteMarca(marca.id_marca)}
                                    >
                                        Eliminar
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </Modal>


            {/* Modal para añadir categoría */}
            <Modal isOpen={isCategoriaModalOpen} onClose={() => setCategoriaModalOpen(false)} title="Añadir Categoría">
                <input
                    type="text"
                    className="inv-modal-input"
                    value={newCategoria}
                    onChange={(e) => setNewCategoria(e.target.value)}
                    placeholder="Nombre de la categoría"
                />
                <button className="inv-modal-save-button" onClick={handleCreateCategoria}>Guardar</button>
            </Modal>

            {/* Modal Para gestionar categorías */}
            <Modal isOpen={isGestorDeCategoriaModalOpen} onClose={() => setGestorDeCategoriaModalOpen(false)} title="Gestor de Categorías">
                <input
                    type="text"
                    className="inv-input"
                    placeholder="Nueva Categoría"
                    value={newCategoria}
                    onChange={(e) => setNewCategoria(e.target.value)}
                />
                <button className="inv-add-button" onClick={handleCreateCategoria}>Añadir Categoría</button>
                <table className="inv-table">
                    <thead>
                        <tr>
                            <th className="inv-th">Nombre</th>
                            <th className="inv-th">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {categorias.map((categoria) => (
                            <tr key={categoria.id_categoria} className="inv-tr">
                                <td className="inv-td">
                                    {editCategoria === categoria.id_categoria ? (
                                        <input
                                            type="text"
                                            className="inv-input"
                                            defaultValue={categoria.nombre}
                                            onChange={(e) => setNewCategoria(e.target.value)}
                                        />
                                    ) : (
                                        categoria.nombre
                                    )}
                                </td>
                                <td className="inv-td">
                                    {editCategoria === categoria.id_categoria ? (
                                        <button
                                            className="inv-save-button"
                                            onClick={() => handleUpdateCategoria(categoria.id_categoria, newCategoria)}
                                        >
                                            Guardar
                                        </button>
                                    ) : (
                                        <button
                                            className="inv-edit-button"
                                            onClick={() => setEditCategoria(categoria.id_categoria)}
                                        >
                                            Editar
                                        </button>
                                    )}
                                    <button
                                        className="inv-delete-button"
                                        onClick={() => handleDeleteCategoria(categoria.id_categoria)}
                                    >
                                        Eliminar
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </Modal>

            {/* Modal para añadir tipo */}
            <Modal isOpen={isTipoModalOpen} onClose={() => setTipoModalOpen(false)} title="Añadir Tipo">
                <input
                    type="text"
                    className="inv-modal-input"
                    value={newTipo}
                    onChange={(e) => setNewTipo(e.target.value)}
                    placeholder="Nombre del tipo"
                />
                <button className="inv-modal-save-button" onClick={handleCreateTipo}>Guardar</button>
            </Modal>
                
            {/* Modal Para gestionar tipos */}
            <Modal isOpen={isGestorDeTipoModalOpen} onClose={() => setGestorDeTipoModalOpen(false)} title="Gestor de Tipos">
                <input
                    type="text"
                    className="inv-input"
                    placeholder="Nuevo Tipo"
                    value={newTipo}
                    onChange={(e) => setNewTipo(e.target.value)}
                />
                <button className="inv-add-button" onClick={handleCreateTipo}>Añadir Tipo</button>
                <table className="inv-table">
                    <thead>
                        <tr>
                            <th className="inv-th">Nombre</th>
                            <th className="inv-th">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {tipos.map((tipo) => (
                            <tr key={tipo.id_tipo} className="inv-tr">
                                <td className="inv-td">
                                    {editTipo === tipo.id_tipo ? (
                                        <input
                                            type="text"
                                            className="inv-input"
                                            defaultValue={tipo.nombre}
                                            onChange={(e) => setNewTipo(e.target.value)}
                                        />
                                    ) : (
                                        tipo.nombre
                                    )}
                                </td>
                                <td className="inv-td">
                                    {editTipo === tipo.id_tipo ? (
                                        <button
                                            className="inv-save-button"
                                            onClick={() => handleUpdateTipo(tipo.id_tipo, newTipo)}
                                        >
                                            Guardar
                                        </button>
                                    ) : (
                                        <button
                                            className="inv-edit-button"
                                            onClick={() => setEditTipo(tipo.id_tipo)}
                                        >
                                            Editar
                                        </button>
                                    )}
                                    <button
                                        className="inv-delete-button"
                                        onClick={() => handleDeleteTipo(tipo.id_tipo)}
                                    >
                                        Eliminar
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </Modal>
        </div>
    );
};

export default Inventario;