import { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { obtenerComentarios, actualizarComentario, eliminarComentario } from "@services/comentario.service";
import { showSuccessAlert, showErrorAlert } from "@helpers/sweetAlert.js";

const Comentarios = () => {
  const { id_tarea } = useParams(); // ID de la tarea seleccionada
  const [comentarios, setComentarios] = useState([]); // Estado para los comentarios
  const [editando, setEditando] = useState(null); // ID del comentario en edición
  const [comentarioEditado, setComentarioEditado] = useState(""); // Contenido editado
  const navigate = useNavigate();

  // Función para obtener comentarios
  const fetchComentarios = useCallback(async () => {
    try {
      const data = await obtenerComentarios(id_tarea);
      // Verificamos si la data es un arreglo
      if (Array.isArray(data)) {
        setComentarios(data);
      } else {
        console.warn("Los datos recibidos no son un arreglo:", data);
        setComentarios([]); // Aseguramos que comentarios siempre sea un arreglo
      }
    } catch (error) {
      console.error("Error al obtener comentarios:", error);
      showErrorAlert("Error", "No se pudieron cargar los comentarios.");
    }
  }, [id_tarea]);

  // useEffect para cargar los comentarios al montar el componente
  useEffect(() => {
    console.log("ID de la tarea recibido:", id_tarea);
    fetchComentarios();
  }, [fetchComentarios, id_tarea]);

  // Función para editar un comentario
  const handleEdit = (comentario) => {
    setEditando(comentario.id_com);
    setComentarioEditado(comentario.comentario);
  };

  // Función para guardar la edición de un comentario
  const handleUpdate = async (id_com) => {
    const comentarioData = { comentario: comentarioEditado.trim() };
    console.log("Actualizando comentario:", comentarioData); // Verificar estructura
    if (!comentarioData.comentario) {
      showErrorAlert("Error", "El comentario no puede estar vacío.");
      return;
    }
  
    try {
      await actualizarComentario(id_com, comentarioData);
      showSuccessAlert("Actualizado", "Comentario actualizado correctamente.");
      setEditando(null);
      setComentarioEditado("");
      fetchComentarios();
    } catch (error) {
      console.error("Error al actualizar el comentario:", error);
      showErrorAlert("Error", "No se pudo actualizar el comentario.");
    }
  };
  
  // Función para eliminar un comentario
  const handleDelete = async (id_com) => {
    try {
      await eliminarComentario(id_com);
      showSuccessAlert("Eliminado", "Comentario eliminado correctamente.");
      fetchComentarios();
    } catch (error) {
      console.error("Error al eliminar el comentario:", error);
      showErrorAlert("Error", "No se pudo eliminar el comentario.");
    }
  };

  return (
    <div className="main-container">
      <div className="table-container">
        <h1 className="title-table">Comentarios de la Tarea {id_tarea}</h1>

        <ul className="comments-list">
          {/* Verificamos que comentarios sea un arreglo antes de hacer el map */}
          {Array.isArray(comentarios) && comentarios.length > 0 ? (
            comentarios.map((comentario) => (
              <li key={comentario.id_com} className="comment-item">
                {editando === comentario.id_com ? (
                  <div className="edit-comment">
                    <textarea
                      value={comentarioEditado}
                      onChange={(e) => setComentarioEditado(e.target.value)}
                      rows="2"
                    />
                    <button onClick={() => handleUpdate(comentario.id_com)}>Guardar</button>
                    <button onClick={() => setEditando(null)}>Cancelar</button>
                  </div>
                ) : (
                  <div className="comment-content">
                    <p>{comentario.comentario}</p>
                    <small>Creado por: {comentario.usuario?.nombre || "Anónimo"}</small>
                    <div className="comment-actions">
                      <button onClick={() => handleEdit(comentario)}>Editar</button>
                      <button onClick={() => handleDelete(comentario.id_com)}>Eliminar</button>
                    </div>
                  </div>
                )}
              </li>
            ))
          ) : (
            <p>No se encontraron comentarios.</p>
          )}
        </ul>

        <button onClick={() => navigate("/tareas")} className="back-button">
          Volver a Tareas
        </button>
      </div>
    </div>
  );
};

export default Comentarios;
