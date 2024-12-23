import axios from './root.service.js';

export async function obtenerComentarios() {
  try {
    const { data } = await axios.get('/comentario');
    console.log('datos backend:', data)
    return data;
  } catch (error) {
    console.error('Error al obtener los comentarios:', error);
    return error.response.data;
  }
}

export async function crearComentario(id_tarea, comentarioData) {
  console.log('ID de la tarea enviado:', id_tarea);
  console.log('Datos del comentario enviados:', comentarioData);
  
  try {
    const { data } = await axios.post(`/comentario/addcomentario`, comentarioData);
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

export async function eliminarComentario(id_com) {
  if (!id_com){
    console.error("ID comentario no proporcionado");
    return;
  }
  
  try {
    const { data } = await axios.delete(`/comentario/eliminar/${id_com}/`);
    return data;
  } catch (error) {
    console.error('Error al eliminar el comentario', error);
    return error.response.data;
  }
}