import Table from '@components/Table';
import Search from '@components/Search';
import DeleteIcon from '../assets/deleteIcon.svg';
import DeleteIconDisable from '../assets/deleteIconDisabled.svg';
import UpdateIcon from '../assets/updateIcon.svg';
import UpdateIconDisable from '../assets/updateIconDisabled.svg';
import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { obtenerComentarios, eliminarComentario, actualizarComentario } from '@services/comentario.service.js';
import { obtenerTodasTareas } from '@services/tareas.service.js';
import { showSuccessAlert, showErrorAlert } from '@helpers/sweetAlert.js';
import Form from '@components/Form';

const Comentarios = () => {
  const [comentarios, setComentarios] = useState([]);
  const [filterDetail, setFilterDetail] = useState('');
  const [selectedComentarios, setSelectedComentarios] = useState([]);
  const [tareas, setTareas] = useState([]);
  const [tareaSeleccionada, setTareaSeleccionada] = useState('');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [comentarioToEdit, setComentarioToEdit] = useState(null);
  const navigate = useNavigate();

  const fetchComentarios = useCallback(async (id_tarea = null) => {
    try {
      const data = await obtenerComentarios();
      const comentariosFiltrados = id_tarea
        ? data.filter((comentario) => comentario.tarea.id_tarea === id_tarea)
        : data;
      setComentarios(comentariosFiltrados || []);
    } catch (error) {
      console.error('Error al obtener los comentarios:', error);
      showErrorAlert('Error', 'No se pudieron cargar los comentarios.');
    }
  }, []);

  const fetchTareas = async () => {
    try {
      const data = await obtenerTodasTareas();
      setTareas(data || []);
    } catch (error) {
      console.error('Error al obtener las tareas:', error);
      showErrorAlert('Error', 'No se pudieron cargar las tareas.');
    }
  };

  useEffect(() => {
    fetchComentarios();
    fetchTareas();
  }, [fetchComentarios]);

  const handleDelete = async () => {
    try {
      selectedComentarios.forEach(async (comentario) => {
        await eliminarComentario(comentario.id_com);
      });
      showSuccessAlert('Eliminado', 'El comentario se ha eliminado correctamente.');
      await fetchComentarios();
      setSelectedComentarios([]);
    } catch (error) {
      console.error('Error al eliminar los comentarios:', error);
      showErrorAlert('Error', 'No se pudieron eliminar los comentarios.');
    }
  };

  const handleOpenEditModal = () => {
    const comentario = selectedComentarios[0];
    if (!comentario) return showErrorAlert('Error', 'Selecciona un comentario para editar.');
    setComentarioToEdit(comentario);
    setIsEditModalOpen(true);
  };

  const handleUpdate = async (data) => {
    try {
      const response = await actualizarComentario(comentarioToEdit.id_com, { comentario: data.comentario });
      if (response) {
        showSuccessAlert('Actualizado', 'El comentario se actualizó correctamente.');
        fetchComentarios();
        setIsEditModalOpen(false);
        setComentarioToEdit(null);
      } else {
        showErrorAlert('Error', 'No se pudo actualizar el comentario.');
      }
    } catch (error) {
      console.error('Error al actualizar el comentario:', error);
      showErrorAlert('Error', 'No se pudo actualizar el comentario.');
    }
  };

  const columns = [
    { title: 'Comentario', field: 'comentario', width: 300 },
    {
      title: 'Tarea Asociada',
      field: 'tarea.detalle',
      width: 300,
      formatter: (cell) => {
        const comentario = cell.getRow().getData();
        return comentario.tarea?.detalle || 'No asignada';
      },
    },
    {
      title: 'Mecánico',
      field: 'usuario.nombreCompleto',
      width: 200,
      formatter: (cell) => {
        const comentario = cell.getRow().getData();
        return comentario.usuario?.nombreCompleto || 'No especificado';
      },
    },
  ];

  return (
    <div className="main-container">
      <div className="table-container">
        <div className="top-table">
          <h1 style={{ color: 'white' }}>Comentarios</h1>
          <button
            className="button button-primary"
            onClick={() => navigate('/addcomentario')}
          >
            Agregar Comentario
          </button>
          <select
            value={tareaSeleccionada}
            onChange={(e) => {
              const id_tarea = e.target.value;
              setTareaSeleccionada(id_tarea);
              fetchComentarios(id_tarea ? Number(id_tarea) : null);
            }}
            className="task-filter"
          >
            <option value="">Todas las tareas</option>
            {tareas.map((tarea) => (
              <option key={tarea.id_tarea} value={tarea.id_tarea}>
                {tarea.detalle}
              </option>
            ))}
          </select>
          <div className="filter-actions">
            <Search
              value={filterDetail}
              onChange={(e) => setFilterDetail(e.target.value)}
              placeholder="Filtrar por comentario"
            />
            <button
              className="edit-comment-button"
              onClick={handleOpenEditModal}
              disabled={selectedComentarios.length !== 1}
            >
              {selectedComentarios.length !== 1 ? (
                <img src={UpdateIconDisable} alt="edit-disabled" />
              ) : (
                <img src={UpdateIcon} alt="edit" />
              )}
            </button>
            <button
              className="delete-comment-button"
              onClick={handleDelete}
              disabled={selectedComentarios.length === 0}
            >
              {selectedComentarios.length === 0 ? (
                <img src={DeleteIconDisable} alt="delete-disabled" />
              ) : (
                <img src={DeleteIcon} alt="delete" />
              )}
            </button>
          </div>
        </div>
        <Table
          data={comentarios}
          columns={columns}
          filter={filterDetail}
          dataToFilter="comentario"
          initialSortName="comentario"
          onSelectionChange={(selectedRows) => setSelectedComentarios(selectedRows)}
        />
      </div>
      {isEditModalOpen && (
        <Form
          title="Editar Comentario"
          fields={[
            {
              label: 'Comentario',
              name: 'comentario',
              placeholder: 'Escribe tu comentario aquí...',
              fieldType: 'textarea',
              rows: 3,
              defaultValue: comentarioToEdit.comentario,
              required: true,
            },
          ]}
          onSubmit={handleUpdate}
          footerContent={
            <div className="button-container">
              <button type="submit" className="save-button">
                Guardar
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsEditModalOpen(false);
                  setComentarioToEdit(null);
                }}
                className="cancel-button"
              >
                Cancelar
              </button>
            </div>
          }
        />
      )}
    </div>
  );
};

export default Comentarios;
