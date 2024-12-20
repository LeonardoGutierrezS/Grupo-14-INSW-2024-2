import Table from '@components/Table';
import Search from '@components/Search';
import DeleteIcon from '../assets/deleteIcon.svg';
import DeleteIconDisable from '../assets/deleteIconDisabled.svg';
import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { obtenerTodasTareas, actualizarEstado, eliminarTarea } from '@services/tareas.service.js';
import { showSuccessAlert, showErrorAlert } from '@helpers/sweetAlert.js';

const Tareas = () => {
  const [tareas, setTareas] = useState([]); 
  const [filterDetail, setFilterDetail] = useState(''); 
  const [selectedTareas, setSelectedTareas] = useState([]); 
  const navigate = useNavigate();

  const fetchTareas = useCallback(async () => {
    try {
      const data = await obtenerTodasTareas();
      setTareas(data || []);
    } catch (error) {
      console.error('Error al obtener las tareas:', error);
    }
  }, []);

  useEffect(() => {
    fetchTareas();
  }, [fetchTareas]);

  const handleUpdateStatus = async (id_tarea, nuevoEstado) => {
    try {
      const response = await actualizarEstado(id_tarea, { estado: nuevoEstado });
      if (response) {
        showSuccessAlert('Estado actualizado', 'El estado de la tarea se ha actualizado correctamente.');
        fetchTareas(); 
      } else {
        showErrorAlert('Error', 'No se pudo actualizar el estado de la tarea.');
      }
    } catch (error) {
      console.error('Error al actualizar el estado de la tarea:', error);
      showErrorAlert('Error', 'No se pudo actualizar el estado de la tarea.');
    }
  };


  const handleDelete = async (id_tarea) => {
    try {
      const response = await eliminarTarea(id_tarea);
      if (response) {
        showSuccessAlert('Eliminada', 'La tarea se ha eliminado');

        fetchTareas();
      } else {
        showErrorAlert('Error', 'La tarea no se ha podido eliminar');
      }
    } catch (error) {
      console.error('Error al eliminar la tarea:', error);
    }
  };

 
  const columns = [
    { title: 'Detalle', field: 'detalle', width: 300 },
    { title: 'Prioridad', field: 'prioridad', width: 150 },
    {
      title: 'Mecánico',
      field: 'usuario.nombreCompleto',
      width: 150,
      formatter: (cell) => {
        const tarea = cell.getRow().getData();
        return tarea.usuario?.nombreCompleto || "No asignado";
      },
    },
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
      width: 150,
      formatter: (cell) => {
        const tarea = cell.getRow().getData();
        return `
            <button 
              class="button button-secondary" 
              onclick="window.handleComentarios(${tarea.id_tarea})"
            >
              Ver
            </button>
          </div>
        `;
      },
    },
  ];

  window.handleEstadoChange = async (id_tarea, nuevoEstado) => {
    await handleUpdateStatus(id_tarea, nuevoEstado);
  };

  window.handleComentarios = () => {
    navigate('/comentario');
  };

  window.handleAddComentario = () => {
      navigate(`/comentario/addcomentario`);

  };

  const handleDetailFilterChange = (e) => {
    setFilterDetail(e.target.value);
  };

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
          <h1 style={{ color: "white"}}>Tareas</h1>
          <button className="button button-primary" onClick={() => navigate('/addtareas')}>Agregar Tarea</button>
          <button className="button button-primary" onClick={() => navigate('/addcomentario')}>Agregar Comentario</button>
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
