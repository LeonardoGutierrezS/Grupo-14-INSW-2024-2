"use strict";
import { AppDataSource } from "../config/configDb.js";
import BicicletaSchema from "../entity/bicicleta.entity.js";
import ClienteSchema from "../entity/cliente.entity.js";
import ReparacionSchema from "../entity/reparacion.entity.js";

// Crear un nuevo ingreso de bicicleta (Bicicleta, Cliente, Reparación)
export const createIngresoBicicleta = async (req, res) => {
  console.log("entro al controlador") 
  const { bicicleta, cliente, reparacion } = req.body;

  try {
    const bicicletaRepository = AppDataSource.getRepository(BicicletaSchema);
    const clienteRepository = AppDataSource.getRepository(ClienteSchema);
    const reparacionRepository = AppDataSource.getRepository(ReparacionSchema);

    // Crear nuevo cliente
    const newCliente = clienteRepository.create(cliente);
    await clienteRepository.save(newCliente);

    // Crear nueva bicicleta
    const newBicicleta = bicicletaRepository.create(bicicleta);
    await bicicletaRepository.save(newBicicleta);

    // Crear nueva reparación vinculando la bicicleta y el cliente
    const newReparacion = reparacionRepository.create({
      ...reparacion,
      id_bici: newBicicleta.id_bici,
      id_cliente: newCliente.id_cliente,
    });
    await reparacionRepository.save(newReparacion);

    return res.status(201).json({
      message: "Ingreso de bicicleta creado con éxito",
      data: { newCliente, newBicicleta, newReparacion },
    });
  } catch (error) {
    return res.status(500).json({ message: "Error creando el ingreso", error });
  }
};

// Obtener todas las reparaciones (visualizar todos los ingresos)
export const getAllIngresos = async (req, res) => {
    console.log("Hola")
  try {
    const reparacionRepository = AppDataSource.getRepository(ReparacionSchema);
    const reparaciones = await reparacionRepository.find({
      relations: ["id_bici", "id_cliente"],
    });
    return res.status(200).json(reparaciones);
  } catch (error) {
    return res.status(500).json({ message: "Error obteniendo ingresos", error });
  }
};

// Editar un ingreso
export const updateIngresoBicicleta = async (req, res) => {
  const { id } = req.params;
  const { bicicleta, cliente, reparacion } = req.body;

  try {
    const bicicletaRepository = AppDataSource.getRepository(BicicletaSchema);
    const clienteRepository = AppDataSource.getRepository(ClienteSchema);
    const reparacionRepository = AppDataSource.getRepository(ReparacionSchema);

    // Actualizar datos de cliente
    const existingCliente = await clienteRepository.findOneBy({
      id_cliente: reparacion.id_cliente,
    });
    clienteRepository.merge(existingCliente, cliente);
    await clienteRepository.save(existingCliente);

    // Actualizar datos de bicicleta
    const existingBicicleta = await bicicletaRepository.findOneBy({
      id_bici: reparacion.id_bici,
    });
    bicicletaRepository.merge(existingBicicleta, bicicleta);
    await bicicletaRepository.save(existingBicicleta);

    // Actualizar datos de reparación
    const existingReparacion = await reparacionRepository.findOneBy({ id });
    reparacionRepository.merge(existingReparacion, reparacion);
    await reparacionRepository.save(existingReparacion);

    return res.status(200).json({
      message: "Ingreso actualizado con éxito",
      data: { existingCliente, existingBicicleta, existingReparacion },
    });
  } catch (error) {
    return res.status(500).json({ message: "Error actualizando el ingreso", error });
  }
};

// Eliminar un ingreso
export const deleteIngresoBicicleta = async (req, res) => {
  const { id } = req.params;

  try {
    const reparacionRepository = AppDataSource.getRepository(ReparacionSchema);

    // Eliminar la reparación
    const reparacionToDelete = await reparacionRepository.findOneBy({ id_reparacion: id });
    if (!reparacionToDelete)
      return res.status(404).json({ message: "Ingreso no encontrado" });

    await reparacionRepository.remove(reparacionToDelete);

    return res.status(200).json({ message: "Ingreso eliminado con éxito" });
  } catch (error) {
    return res.status(500).json({ message: "Error eliminando el ingreso", error });
  }
};