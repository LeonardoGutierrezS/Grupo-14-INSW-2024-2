import axios from './root.service.js';

export async function obtenerComentarios(id_tarea) {
  try {
    const { data } = await axios.get(`/comentario/${id_tarea}`);
    // Asegurarnos de que la respuesta sea un arreglo
    if (Array.isArray(data)) {
      return data;
    } else {
      console.warn("La respuesta de comentarios no es un arreglo", data);
      return [];  // Devuelve un arreglo vacío si la respuesta no es válida
    }
  } catch (error) {
    console.error('Error al obtener los comentarios:', error);
    return [];  // Devuelve un arreglo vacío en caso de error
  }
}


export async function crearComentario(comentarioData) {
  try {
    const { data } = await axios.post('/comentario/crear', comentarioData);
    return data;
  } catch (error) {
    console.error('Error al crear el comentario:', error);
    return error.response.data;
  }
}

export async function actualizarComentario(id_com, comentarioData) {
  try {
    const { data } = await axios.put(`/comentario/${id_com}`, comentarioData);
    return data;
  } catch (error) {
    console.error('Error al actualizar el comentario:', error);
    return error.response.data;
  }
}

export async function eliminarComentario(id_tarea) {
  try {
    const { data } = await axios.delete(`/comentario/${id_tarea}`);
    return data;
  } catch (error) {
    console.error('Error al eliminar el comentario:', error);
    return error.response.data;
  }
}