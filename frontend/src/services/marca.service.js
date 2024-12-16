import axios from './root.service.js';

// Obtener todas las marcas 
export async function getAllMarcas() {
  try {
    const { data } = await axios.get('/marca/getMarcas/');
    return data; // Devuelve la lista completa de marcas
  } catch (error) {
    console.error('Error al obtener las marcas:', error);
    return error.response.data;
  }
}

// Crear una nueva marca 
export async function createMarca(marcaData) {
  try {
    const { data } = await axios.post('/marca/crearMarca/', marcaData);
    return data; // Devuelve los datos de la marca creada
  } catch (error) {
    console.error('Error al crear la marca:', error);
    return error.response.data;
  }
}

// Actualizar una marca existente
export async function updateMarca(id, marcaData) {
  try {
    const { data } = await axios.put(`/marca/updateMarca/${id}/`, marcaData);
    return data; // Devuelve los datos actualizados
  } catch (error) {
    console.error('Error al actualizar la marca:', error);
    return error.response.data;
  }
}

// Eliminar una marca
export async function deleteMarca(id) {
  try {
    const { data } = await axios.delete(`/marca/deleteMarca/${id}/`);
    return data; // Devuelve el mensaje de confirmación
  } catch (error) {
    console.error('Error al eliminar la marca:', error);
    return error.response.data;
  }
}

// Obtener una marca por su ID
export async function getMarcaById(id) {
  try {
    const { data } = await axios.get(`/marca/${id}/`);
    return data; // Devuelve los datos de la marca
  } catch (error) {
    console.error('Error al obtener la marca:', error);
    return error.response.data;
  }
}

// Obtener una marca por su nombre
export async function getMarcaByNombre(nombre) {
  try {
    const { data } = await axios.get(`/marca/nombre/${nombre}/`);
    return data; // Devuelve los datos de la marca
  } catch (error) {
    console.error('Error al obtener la marca:', error);
    return error.response.data;
  }
}

