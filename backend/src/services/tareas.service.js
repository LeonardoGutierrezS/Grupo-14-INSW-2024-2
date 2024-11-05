"use strict";
import { AppDataSource } from "../config/configDb.js";
import TareaSchema from "../entity/tareas.entity.js";
import User from "../entity/user.entity.js"; // Importa la entidad User

export const createTareaService = async (tareaData) => {
  const tareaRepository = AppDataSource.getRepository(TareaSchema);
  const userRepository = AppDataSource.getRepository(User);

  try {
    // Buscar el usuario por su ID
    const usuario = await userRepository.findOneBy({ id: tareaData.id });
    if (!usuario) {
      throw new Error("Usuario no encontrado");
    }

    // Crear la nueva tarea con la relación correcta
    const newTarea = tareaRepository.create({
      ...tareaData,
      usuario: usuario, // Asocia el usuario encontrado
    });

    // Guardar la nueva tarea en la base de datos
    await tareaRepository.save(newTarea);
    return newTarea;
  } catch (error) {
    throw new Error(`Error creando la tarea: ${error.message}`);
  }
};


// Obtener todas las tareas
export const getAllTareasService = async () => {
  const tareaRepository = AppDataSource.getRepository(TareaSchema);

  try {
    const tareas = await tareaRepository.find({ relations: ["usuario"] }); // Incluir relación con el usuario
    return tareas;
  } catch (error) {
    throw new Error(`Error obteniendo tareas: ${error.message}`);
  }
};

// Obtener una tarea por ID
export const getTareaByIdService = async (id) => {
  const tareaRepository = AppDataSource.getRepository(TareaSchema);

  try {
    const tarea = await tareaRepository.findOne({ where: { id_tarea: id }, relations: ["usuario"] });
    if (!tarea) {
      throw new Error("Tarea no encontrada");
    }
    return tarea;
  } catch (error) {
    throw new Error(`Error obteniendo la tarea: ${error.message}`);
  }
};

// Actualizar una tarea
export const updateTareaService = async (req, res) => {
    const { id } = req.params; // Obtener el ID de la tarea de los parámetros de la URL
    const tareaData = req.body; // Obtener los datos actualizados del cuerpo de la solicitud
  
    try {
      // Llamar al servicio para actualizar la tarea
      const updatedTarea = await updateTareaService(id, tareaData);
      return res.status(200).json({
        message: "Tarea actualizada con éxito",
        data: updatedTarea,
      });
    } catch (error) {
      return res.status(500).json({ message: `Error al actualizar la tarea: ${error.message}` });
    }
};

// Eliminar una tarea
export const deleteTareaService = async (id) => {
  const tareaRepository = AppDataSource.getRepository(TareaSchema);

  try {
    // Buscar y eliminar la tarea
    const tareaToDelete = await tareaRepository.findOneBy({ id_tarea: id });
    if (!tareaToDelete) {
      throw new Error("Tarea no encontrada");
    }

    await tareaRepository.remove(tareaToDelete);
    return { message: "Tarea eliminada con éxito" };
  } catch (error) {
    throw new Error(`Error eliminando la tarea: ${error.message}`);
  }
};