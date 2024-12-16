import Table from '@components/Table';
import Search from '@components/Search';
import DeleteIcon from '../assets/deleteIcon.svg';
import DeleteIconDisable from '../assets/deleteIconDisabled.svg';
import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { obtenerTodasTareas, actualizarEstado, eliminarTarea } from '@services/tareas.service.js';
import { showSuccessAlert, showErrorAlert } from '@helpers/sweetAlert.js';
import '@styles/tareas.css';

const Tareas = () => {
  const [tareas, setTareas] = useState([]); // Estado para almacenar las tareas
  const [filterDetail, setFilterDetail] = useState(''); // Filtro de búsqueda
  const [selectedTareas, setSelectedTareas] = useState([]); // Tareas seleccionadas
  const navigate = useNavigate();

  // Función para obtener tareas desde el backend
  const fetchTareas = useCallback(async () => {
    try {
      const data = await obtenerTodasTareas();
      setTareas(data || []);
    } catch (error) {
      console.error('Error al obtener las tareas:', error);
    }
  }, []);

  // useEffect para cargar las tareas al montar el componente
  useEffect(() => {
    fetchTareas();
  }, [fetchTareas]);

  // Función para actualizar el estado de una tarea
  const handleUpdateStatus = async (id_tarea, estado) => {
    try {
      const response = await actualizarEstado(id_tarea, { estado });
      if (response) {
        fetchTareas(); // Actualizar la lista de tareas
      }
    } catch (error) {
      console.error('Error al actualizar el estado de la tarea:', error);
    }
  };

  // Función para eliminar una tarea
  const handleDelete = async (id_tarea) => {
    try {
      const response = await eliminarTarea(id_tarea);
      if (response.status === 'success') {
        showSuccessAlert('Eliminada', 'La tarea se ha eliminado');

        fetchTareas(); // Actualizar la lista de tareas
      } else {
        showErrorAlert('Error', 'La tarea no se ha podido eliminar');
      }
    } catch (error) {
      console.error('Error al eliminar la tarea:', error);
    }
  };

  // Configuración de columnas para la tabla
  const columns = [
    { title: 'ID', field: 'id_tarea', width: 80 },
    { title: 'Detalle', field: 'detalle', width: 300 },
    { title: 'Prioridad', field: 'prioridad', width: 150 },
    { title: 'Mecánico', field: 'mecanico', width: 150 },
    {
      title: 'Estado',
      field: 'estado',
      width: 150,
      formatter: (cell) => {
        const tarea = cell.getRow().getData();
        return `
          <select onchange="window.handleEstadoChange(${tarea.id_tarea}, this.value)">
            <option value="pendiente" ${tarea.estado === 'pendiente' ? 'selected' : ''}>Pendiente</option>
            <option value="en proceso" ${tarea.estado === 'en proceso' ? 'selected' : ''}>En Proceso</option>
            <option value="terminado" ${tarea.estado === 'terminado' ? 'selected' : ''}>Terminado</option>
          </select>
        `;
      },
    },
    {
      title: 'Comentarios',
      field: 'comentario',
      width: 250,
      formatter: (cell) => {
        const tarea = cell.getRow().getData();
        return `
          <div style="display: flex; gap: 5px;">

            <button 
              class="add-comment-btn" 
              onclick="window.handleAddComentario(${tarea.id_tarea})"
            >
              Añadir comentario
            </button>
            <button 
              class="view-task-btn" 
              onclick="window.handleComentarios(${tarea.id_tarea})"
            >
              Ver
            </button>
          </div>
        `;
      },
    },
  ];

  // Función global para manejar cambios en el estado desde el dropdown
  window.handleEstadoChange = async (id_tarea, nuevoEstado) => {
    await handleUpdateStatus(id_tarea, nuevoEstado);
  };

  // Función global para "Ver comentarios"
  window.handleComentarios = (id_tarea) => {
    console.log("Redirigiendo con ID:", id_tarea);
    navigate(`/comentarios/${id_tarea}`);
  };

  window.handleAddComentario = (id_tarea) => {
    if (id_tarea) {
      console.log("ID de la tarea:", id_tarea); // Depuración
      navigate(`/comentarios/crear/${id_tarea}`);
    } else {
      console.error("ID de la tarea no está definido");
    }
  };
  

  // Función para manejar cambios en el filtro
  const handleDetailFilterChange = (e) => {
    setFilterDetail(e.target.value);
  };

  // Función para manejar la selección en la tabla
  const handleSelectionChange = useCallback(
    (selectedRows) => {
      setSelectedTareas(selectedRows);
    },
    [setSelectedTareas]
  );

  return (
    <div className="main-container">
      <div className="table-container">
        <div className="top-table">
          <h1 className="title-table">Tareas</h1>
          <button onClick={() => navigate('/addtareas')}>Agregar Tarea</button>
          <div className="filter-actions">
            <Search
              value={filterDetail}
              onChange={handleDetailFilterChange}
              placeholder="Filtrar por detalle"
            />

            <button
              className="delete-tarea-button"
              onClick={() =>
                selectedTareas.forEach((tarea) => handleDelete(tarea.id_tarea))
              }
              disabled={selectedTareas.length === 0}
            >
              {selectedTareas.length === 0 ? (
                <img src={DeleteIconDisable} alt="delete-disabled" />
              ) : (
                <img src={DeleteIcon} alt="delete" />
              )}
            </button>
          </div>
        </div>

        <Table
          data={tareas}
          columns={columns}
          filter={filterDetail}
          dataToFilter="detalle"
          initialSortName="detalle"
          onSelectionChange={handleSelectionChange}
        />
      </div>
    </div>
  );
};

export default Tareas;
