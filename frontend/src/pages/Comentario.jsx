import Table from '@components/Table';
import Search from '@components/Search';
import DeleteIcon from '../assets/deleteIcon.svg';
import DeleteIconDisable from '../assets/deleteIconDisabled.svg';
import UpdateIcon from '../assets/updateIcon.svg';
import UpdateIconDisable from '../assets/updateIconDisabled.svg';
import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { obtenerComentarios, actualizarComentario, eliminarComentario } from '@services/comentario.service.js';
import { showSuccessAlert, showErrorAlert } from '@helpers/sweetAlert.js';

const Comentarios = () => {
  const [comentarios, setComentarios] = useState([]); 
  const [filterDetail, setFilterDetail] = useState(''); 
  const [selectedComentarios, setSelectedComentarios] = useState([]); 
  const navigate = useNavigate();

  const fetchComentarios = useCallback(async (id_tarea = null) => {
    try {
      const data = await obtenerComentarios();
      console.log('Cometarios recibidos del backend:', data)
      const comentariosFiltrados = id_tarea
        ? data.filter((comentario) => comentario.tarea.id_tarea === id_tarea)
        : data;
      setComentarios(comentariosFiltrados || []);
    } catch (error) {
      console.error('Error al obtener los comentarios:', error);
    }
  }, []);

  useEffect(() => {
    fetchComentarios();
  }, [fetchComentarios]);

  const handleEditComment = async (id_comentario, nuevoTexto) => {
    try {
      const response = await actualizarComentario(id_comentario, { texto: nuevoTexto });
      if (response) {
        showSuccessAlert('Comentario actualizado', 'El texto del comentario se ha actualizado correctamente.');
        fetchComentarios(); 
      } else {
        showErrorAlert('Error', 'No se pudo actualizar el comentario.');
      }
    } catch (error) {
      console.error('Error al actualizar el comentario:', error);
      showErrorAlert('Error', 'No se pudo actualizar el comentario.');
    }
  };

  const handleDelete = async (id_comentario) => {
    try {
      const response = await eliminarComentario(id_comentario);
      if (response) {
        showSuccessAlert('Eliminado', 'El comentario se ha eliminado correctamente.');
        fetchComentarios(); 
      } else {
        showErrorAlert('Error', 'No se pudo eliminar el comentario.');
      }
    } catch (error) {
      console.error('Error al eliminar el comentario:', error);
      showErrorAlert('Error', 'No se pudo eliminar el comentario.');
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
        return comentario.tarea?.detalle || 'No asignado';
      },
    },
    {
        title: 'Mecánico',
        field: 'usuario.nombreCompleto',
        width: 200,
        formatter: (cell) => {
          const comentario = cell.getRow().getData();
          return comentario.usuario?.nombreCompleto || 'No especificado'; // Nombre del usuario que hizo el comentario
        },
    },
    {
      title: 'Acciones',
      field: 'actions',
      width: 200,
      formatter: (cell) => {
        const comentario = cell.getRow().getData();
        return `
          <button class="action-button" ${!comentario.texto ? 'disabled' : ''}>
            <img src="${comentario.texto ? UpdateIcon : UpdateIconDisable}" alt="edit" class="action-icon" />
          </button>
          <button class="action-button">
            <img src="${comentario.texto ? DeleteIcon : DeleteIconDisable}" alt="delete" class="action-icon" />
          </button>
        `;
      },
      cellClick: (e, cell) => {
        const comentario = cell.getRow().getData();
        if (e.target.alt === 'edit') {
          const nuevoTexto = prompt('Editar comentario:', comentario.texto);
          if (nuevoTexto) {
            handleEditComment(comentario.id_comentario, nuevoTexto);
          }
        } else if (e.target.alt === 'delete') {
          handleDelete(comentario.id_comentario);
        }
      },
    },
  ];

  const handleDetailFilterChange = (e) => {
    setFilterDetail(e.target.value);
  };

  const handleSelectionChange = useCallback(
    (selectedRows) => {
      setSelectedComentarios(selectedRows);
    },
    [setSelectedComentarios]
  );

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
          <div className="filter-actions">
            <Search
              value={filterDetail}
              onChange={handleDetailFilterChange}
              placeholder="Filtrar por comentario"
            />
            <button
              className="delete-comment-button"
              onClick={() =>
                selectedComentarios.forEach((comentario) => handleDelete(comentario.id_comentario))
              }
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
          dataToFilter="texto"
          initialSortName="id_comentario"
          onSelectionChange={handleSelectionChange}
        />
      </div>
    </div>
  );
};

export default Comentarios;
