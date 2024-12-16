"use strict";
import { AppDataSource } from "../config/configDb.js";
import BicicletaSchema from "../entity/bicicleta.entity.js";
import ClienteSchema from "../entity/cliente.entity.js";
import ReparacionSchema from "../entity/reparacion.entity.js";


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
export const updateIngresoBicicletaService = async (id, updateData) => {
  try {
    const bicicletaRepository = AppDataSource.getRepository(BicicletaSchema);
    const clienteRepository = AppDataSource.getRepository(ClienteSchema);
    const reparacionRepository = AppDataSource.getRepository(ReparacionSchema);

    // Obtener la reparación actual
    const reparacion = await reparacionRepository.findOne({
      where: { id_reparacion: id },
      relations: ["id_bici", "id_cliente"],
    });

    if (!reparacion) {
      throw new Error("Ingreso no encontrado");
    }

    // Actualizar campos específicos de la reparación
    if (updateData.reparacion) {
      Object.assign(reparacion, updateData.reparacion);
      await reparacionRepository.save(reparacion);
    }

    // Actualizar campos específicos de la bicicleta
    if (updateData.bicicleta) {
      const bicicleta = await bicicletaRepository.findOneBy({
        id_bici: reparacion.id_bici.id_bici,
      });
      if (!bicicleta) throw new Error("Bicicleta no encontrada");
      Object.assign(bicicleta, updateData.bicicleta);
      await bicicletaRepository.save(bicicleta);
    }

    // Actualizar campos específicos del cliente
    if (updateData.cliente) {
      const cliente = await clienteRepository.findOneBy({
        id_cliente: reparacion.id_cliente.id_cliente,
      });
      if (!cliente) throw new Error("Cliente no encontrado");
      Object.assign(cliente, updateData.cliente);
      await clienteRepository.save(cliente);
    }

    return { message: "Ingreso actualizado con éxito" };
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
