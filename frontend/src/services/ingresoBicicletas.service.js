import axios from './root.service.js';

// Obtener todas las reparaciones (relacionadas con bicicletas y clientes)
export async function getAllIngresos() {
  try {
    const { data } = await axios.get('/bicicleta/');
    return data; // Devuelve la lista completa de ingresos
  } catch (error) {
    console.error('Error al obtener los ingresos:', error);
    return error.response.data;
  }
}

// Crear un nuevo ingreso (bicicleta, cliente y reparación)
export async function createIngresoBicicleta(bicicletaData, clienteData, reparacionData) {
  try {
    const { data } = await axios.post('/bicicleta/', {
      bicicleta: bicicletaData,
      cliente: clienteData,
      reparacion: reparacionData,
    });
    return data; // Devuelve los datos del ingreso creado
  } catch (error) {
    console.error('Error al crear el ingreso:', error);
    return error.response.data;
  }
}

// Obtener bicicletas para asignar tareas
export async function getBicicletas() {
  try {
    const { data } = await axios.get('/bicicleta/bicicletas'); // Endpoint para obtener bicicletas
    const bicicletas = data.map((bicicleta) => ({
      value: bicicleta.id_bici,
      label: `${bicicleta.marca || 'Sin marca'} ${bicicleta.modelo || 'Sin modelo'}`,
    }));
    console.log("BICICLETAS", bicicletas);
    return bicicletas;
  } catch (error) {
    console.error("Error al obtener bicicletas:", error.response?.data || error);
    return [];
  }
}

// Actualizar un ingreso existente (bicicleta, cliente y reparación)
export async function updateIngresoBicicleta(id, bicicletaData, clienteData, reparacionData) {
  try {
    const { data } = await axios.put(`/bicicleta/${id}/`, {
      bicicleta: bicicletaData,
      cliente: clienteData,
      reparacion: reparacionData,
    });
    return data; // Devuelve los datos actualizados
  } catch (error) {
    console.error('Error al actualizar el ingreso:', error);
    return error.response.data;
  }
}

// Eliminar un ingreso
export async function deleteIngreso(id) {
  try {
    const { data } = await axios.delete(`/bicicleta/${id}/`);
    return data; // Devuelve el mensaje de confirmación
  } catch (error) {
    console.error('Error al eliminar el ingreso:', error);
    return error.response.data;
  }
}
