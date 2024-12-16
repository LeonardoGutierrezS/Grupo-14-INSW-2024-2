import axios from './root.service.js';

// Obtener todas los inventarios

export async function getAllInventarios() {
  try {
    const { data } = await axios.get('/inventario/getInventarioTotal/');
    return data; // Devuelve la lista completa de inventarios
  } catch (error) {
    console.error('Error al obtener los inventarios:', error);
    return error.response.data;
  }
}

// Crear un nuevo inventario

export async function createInventario(inventarioData) {
  try {
    const { data } = await axios.post('/inventario/crearInventario/', inventarioData);
    return data; // Devuelve los datos del inventario creado
  } catch (error) {
    console.error('Error al crear el inventario:', error.message);
    return error.response.data;
  }
}

// Actualizar un inventario existente

export async function updateInventario(id, inventarioData) {
  try {
    const { data } = await axios.put(`/inventario/updateInventario/${id}/`, inventarioData);
    return data; // Devuelve los datos actualizados
  } catch (error) {
    console.error('Error al actualizar el inventario:', error);
    return error.response.data;
  }
}

// Actualizar la cantidad de un inventario

export async function updateInventarioCantidad(id, inventarioData) {
  try {
    const { data } = await axios.put(`/inventario/updateInventarioCantidad/${id}/`, inventarioData);
    return data; // Devuelve los datos actualizados
  } catch (error) {
    console.error('Error al actualizar la cantidad del inventario:', error);
    return error.response.data;
  }
}


// Eliminar un inventario

export async function deleteInventario(id) {
  try {
    const { data } = await axios.delete(`/inventario/deleteInventario/${id}/`);
    return data; // Devuelve el mensaje de confirmación
  } catch (error) {
    console.error('Error al eliminar el inventario:', error);
    return error.response.data;
  }
}
