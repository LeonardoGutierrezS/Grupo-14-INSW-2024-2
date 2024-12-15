import axios from "./root.service.js";

// Obtener todas las categorías de bicicletas
export async function getAllCategorias() {
  try {
    const { data } = await axios.get("/categoria/getCategorias/");
    return data; // Devuelve la lista completa de categorías
  } catch (error) {
    console.error("Error al obtener las categorías:", error);
    return error.response.data;
  }
}

// Crear una nueva categoría de bicicleta
export async function createCategoria(categoriaData) {
  try {
    const { data } = await axios.post("/categoria/crearCategoria/", categoriaData);
    return data; // Devuelve los datos de la categoría creada
  } catch (error) {
    console.error("Error al crear la categoría:", error);
    return error.response.data;
  }
}

// Actualizar una categoría existente
export async function updateCategoria(id, categoriaData) {
  try {
    const { data } = await axios.patch(`/categoria/updateCategoria/${id}/`, categoriaData);
    return data; // Devuelve los datos actualizados
  } catch (error) {
    console.error("Error al actualizar la categoría:", error);
    return error.response.data;
  }
}

// Eliminar una categoría
export async function deleteCategoria(id) {
  try {
    const { data } = await axios.delete(`/categoria/deleteCategoria/${id}/`);
    return data; // Devuelve el mensaje de confirmación
  } catch (error) {
    console.error("Error al eliminar la categoría:", error);
    return error.response.data;
  }
}

// Obtener una categoría por su ID
export async function getCategoriaById(id) {
  try {
    const { data } = await axios.get(`/categoria/${id}/`);
    return data; // Devuelve los datos de la categoría
  } catch (error) {
    console.error("Error al obtener la categoría:", error);
    return error.response.data;
  }
}

// Obtener una categoría por su nombre
export async function getCategoriaByNombre(nombre) {
  try {
    const { data } = await axios.get(`/categoria/getCategoriaByNombre/${nombre}/`);
    return data; // Devuelve los datos de la categoría
  } catch (error) {
    console.error("Error al obtener la categoría:", error);
    return error.response.data;
  }
}