import axios from './root.service.js';

export async function obtenerTodasTareas() {
  try {
    const { data } = await axios.get('/tareas/');
    console.log('Tareas obtenidas:', data);
    return data;
  } catch (error) {
    console.error('Error al obtener las tareas:', error);
    return error.response.data;
  }
}

export async function crearTarea(tareaData) {
  try {
    const { data } = await axios.post('/tareas/crear', tareaData);
    return data;
  } catch (error) {
    console.error('Error al crear la tarea:', error);
    return error.response.data;
  }
}

export async function actualizarEstado(id_tarea, tareaData) {
  try {
    const { data } = await axios.patch(`/tareas/estado/${id_tarea}`, tareaData);
    return data;
  } catch (error) {
    console.error('Error al actualizar la tarea:', error);
    return error.response.data;
  }
}

export async function eliminarTarea(id_tarea) {
  try {
    const { data } = await axios.delete(`/tareas/eliminar/${id_tarea}/`);
    return data;
  } catch (error) {
    console.error('Error al eliminar la tarea:', error);
    return error.response.data;
  }
}