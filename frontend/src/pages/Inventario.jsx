import React, { useState, useEffect } from 'react';
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
} from '@services/tipo.service.js';
import '@styles/inv.css';

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

    const [isFormVisible, setFormVisible] = useState(false);

    const [isMarcaModalOpen, setMarcaModalOpen] = useState(false);
    const [isGestorDeMarcaModalOpen, setGestorDeMarcaModalOpen] = useState(false);

    const [isCategoriaModalOpen, setCategoriaModalOpen] = useState(false);
    const [isGestorDeCategoriaModalOpen, setGestorDeCategoriaModalOpen] = useState(false);

    const [isTipoModalOpen, setTipoModalOpen] = useState(false);

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

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await createInventario(inventarioData);
            alert('Inventario creado con éxito');
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
                await updateInventario(editTarget.id, inventarioData);
                alert(`Inventario "${inventarioData.nombre}" actualizado con éxito`);
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

    const handleDelete = async () => {
        if (deleteTarget) {
            try {
                await deleteInventario(deleteTarget.id);
                alert(`Inventario "${deleteTarget.nombre}" eliminado con éxito`);
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
            await createMarca({ nombre: newMarca });
            alert('Marca creada con éxito');
            setMarcaModalOpen(false);
            setNewMarca('');
            fetchMarcas();
        } catch (error) {
            console.error('Error al crear la marca:', error);
        }
    };
    const handleUpdateMarca = async (id, nombre) => {
        try {
            await updateMarca(id, { nombre });
            alert('Marca actualizada con éxito');
            setEditMarca(null);
            fetchMarcas();
        } catch (error) {
            console.error('Error al actualizar la marca:', error);
        }
    };
    const handleDeleteMarca = async (id) => {
        try {
            await deleteMarca(id); 
            alert('Marca eliminada con éxito');
            fetchMarcas();
        } catch (error) {
            console.error('Error al eliminar la marca:', error);
        }
    };


    const handleCreateCategoria = async () => {
        try {
            await createCategoria({ nombre: newCategoria });
            alert('Categoría creada con éxito');
            setCategoriaModalOpen(false);
            setNewCategoria('');
            fetchCategorias();
        } catch (error) {
            console.error('Error al crear la categoría:', error);
        }
    };
    const handleUpdateCategoria = async (id, nombre) => {
        try {
            await updateCategoria(id, { nombre });
            alert('Categoría actualizada con éxito');
            setEditCategoria(null);
            fetchCategorias();
        } catch (error) {
            console.error('Error al actualizar la categoría:', error);
        }
    };
    const handleDeleteCategoria = async (id) => {
        try {
            await deleteCategoria(id);
            alert('Categoría eliminada con éxito');
            fetchCategorias();
        } catch (error) {
            console.error('Error al eliminar la categoría:', error);
        }
    };


    const handleCreateTipo = async () => {
        try {
            await createTipo({ nombre: newTipo });
            alert('Tipo creado con éxito');
            setTipoModalOpen(false);
            setNewTipo('');
            fetchTipos();
        } catch (error) {
            console.error('Error al crear el tipo:', error);
        }
    };

    return (
        <div className="inv-container">
            <h2 className="inv-title">Inventario</h2>

            {/* Tabla de inventarios */}
            <table className="inv-table">
                <thead>
                    <tr>
                        <th className="inv-th">Nombre</th>
                        <th className="inv-th">Marca</th>
                        <th className="inv-th">Categoría</th>
                        <th className="inv-th">Tipo</th>
                        <th className="inv-th">Cantidad</th>
                        <th className="inv-th">Precio</th>
                        <th className="inv-th">Descripción</th>
                        <th className="inv-th">Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {inventarios.map((inv) => (
                        <tr key={inv.id} className="inv-tr">
                            <td className="inv-td">{inv.nombre}</td>
                            <td className="inv-td">{marcas.find((m) => m.id_marca === inv.id_marca)?.nombre || 'Sin marca'}</td>
                            <td className="inv-td">{categorias.find((c) => c.id_categoria === inv.id_categoria)?.nombre || 'Sin categoría'}</td>
                            <td className="inv-td">{tipos.find((t) => t.id_tipo === inv.id_tipo)?.nombre || 'Sin tipo'}</td>
                            <td className="inv-td">{inv.cantidad}</td>
                            <td className="inv-td">{inv.precio}</td>
                            <td className="inv-td">{inv.descripcion}</td>
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
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Botón para mostrar el formulario */}
            <button className="inv-button" onClick={() => setFormVisible(!isFormVisible)}>
                {isFormVisible ? 'Ocultar Formulario' : 'Agregar Inventario'}
            </button>
            {/* Botón para mostrar el modal Gestor de marcas */}
            <button className="inv-button-marca" onClick={() => setGestorDeMarcaModalOpen(true)}>Gestionar Marcas</button>
            {/* Botón para mostrar el modal Gestor de categorías */}
            <button className="inv-button-categoria" onClick={() => setGestorDeCategoriaModalOpen(true)}>Gestionar Categorías</button>

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
        </div>
    );
};

export default Inventario;
