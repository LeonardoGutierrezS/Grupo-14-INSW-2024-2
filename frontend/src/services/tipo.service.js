import axios from "./root.service.js";

// Obtener todos los tipos
export async function getAllTipos() {
  try {
    const { data } = await axios.get("/tipo/getTipos/");
    return data; // Devuelve la lista completa de tipos
  } catch (error) {
    console.error("Error al obtener los tipos:", error);
    return error.response.data;
  }
}

// Crear un nuevo tipo
export async function createTipo(tipoData) {
  try {
    const { data } = await axios.post("/tipo/crearTipo/", tipoData);
    return data; // Devuelve los datos del tipo creado
  } catch (error) {
    console.error("Error al crear el tipo:", error);
    return error.response.data;
  }
}

// Actualizar un tipo existente
export async function updateTipo(id, tipoData) {
  try {
    const { data } = await axios.put(`/tipo/updateTipo/${id}/`, tipoData);
    return data; // Devuelve los datos actualizados
  } catch (error) {
    console.error("Error al actualizar el tipo:", error);
    return error.response.data;
  }
}

// Eliminar un tipo
export async function deleteTipo(id) {
  try {
    const { data } = await axios.delete(`/tipo/deleteTipo/${id}/`);
    return data; // Devuelve el mensaje de confirmación
  } catch (error) {
    console.error("Error al eliminar el tipo:", error);
    return error.response.data;
  }
}

// Obtener un tipo por su ID
export async function getTipoById(id) {
  try {
    const { data } = await axios.get(`/tipo/${id}/`);
    return data; // Devuelve los datos del tipo
  } catch (error) {
    console.error("Error al obtener el tipo:", error);
    return error.response.data;
  }
}

// Obtener un tipo por su nombre
export async function getTipoByNombre(nombre) {
  try {
    const { data } = await axios.get(`/tipo/getTipoByNombre/${nombre}/`);
    return data; // Devuelve los datos del tipo
  } catch (error) {
    console.error("Error al obtener el tipo:", error);
    return error.response.data;
  }
}