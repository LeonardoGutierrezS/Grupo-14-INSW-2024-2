"use strict";
import { AppDataSource } from "../config/configDb";
import BicicletaSchema from "../entity/Bicicleta";
import ClienteSchema from "../entity/Cliente";
import ReparacionSchema from "../entity/Reparacion";

// Crear un nuevo ingreso de bicicleta, cliente, y reparación
export const createIngresoBicicletaService = async (bicicletaData, clienteData, reparacionData) => {
  try {
    const bicicletaRepository = AppDataSource.getRepository(BicicletaSchema);
    const clienteRepository = AppDataSource.getRepository(ClienteSchema);
    const reparacionRepository = AppDataSource.getRepository(ReparacionSchema);

    // Crear nuevo cliente
    const newCliente = clienteRepository.create(clienteData);
    await clienteRepository.save(newCliente);

    // Crear nueva bicicleta
    const newBicicleta = bicicletaRepository.create(bicicletaData);
    await bicicletaRepository.save(newBicicleta);

    // Crear nueva reparación vinculando la bicicleta y el cliente
    const newReparacion = reparacionRepository.create({
      ...reparacionData,
      id_bici: newBicicleta.id_bici,
      id_cliente: newCliente.id_cliente,
    });
    await reparacionRepository.save(newReparacion);

    return { newCliente, newBicicleta, newReparacion };
  } catch (error) {
    throw new Error("Error creando el ingreso: " + error.message);
  }
};

// Obtener todas las reparaciones
export const getAllIngresosService = async () => {
  try {
    const reparacionRepository = AppDataSource.getRepository(ReparacionSchema);
    const reparaciones = await reparacionRepository.find({
      relations: ["id_bici", "id_cliente"],
    });
    return reparaciones;
  } catch (error) {
    throw new Error("Error obteniendo ingresos: " + error.message);
  }
};

// Editar un ingreso de bicicleta, cliente, y reparación
export const updateIngresoBicicletaService = async (id, bicicletaData, clienteData, reparacionData) => {
  try {
    const bicicletaRepository = AppDataSource.getRepository(BicicletaSchema);
    const clienteRepository = AppDataSource.getRepository(ClienteSchema);
    const reparacionRepository = AppDataSource.getRepository(ReparacionSchema);

    // Actualizar datos de cliente
    const existingCliente = await clienteRepository.findOneBy({
      id_cliente: reparacionData.id_cliente,
    });
    clienteRepository.merge(existingCliente, clienteData);
    await clienteRepository.save(existingCliente);

    // Actualizar datos de bicicleta
    const existingBicicleta = await bicicletaRepository.findOneBy({
      id_bici: reparacionData.id_bici,
    });
    bicicletaRepository.merge(existingBicicleta, bicicletaData);
    await bicicletaRepository.save(existingBicicleta);

    // Actualizar datos de reparación
    const existingReparacion = await reparacionRepository.findOneBy({ id_reparacion: id });
    reparacionRepository.merge(existingReparacion, reparacionData);
    await reparacionRepository.save(existingReparacion);

    return { existingCliente, existingBicicleta, existingReparacion };
  } catch (error) {
    throw new Error("Error actualizando el ingreso: " + error.message);
  }
};

// Eliminar un ingreso
export const deleteIngresoBicicletaService = async (id) => {
  try {
    const reparacionRepository = AppDataSource.getRepository(ReparacionSchema);

    // Eliminar la reparación
    const reparacionToDelete = await reparacionRepository.findOneBy({ id_reparacion: id });
    if (!reparacionToDelete) {
      throw new Error("Ingreso no encontrado");
    }

    await reparacionRepository.remove(reparacionToDelete);

    return { message: "Ingreso eliminado con éxito" };
  } catch (error) {
    throw new Error("Error eliminando el ingreso: " + error.message);
  }
};
