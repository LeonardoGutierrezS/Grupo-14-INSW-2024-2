"use strict";
import { AppDataSource } from "../config/configDb.js";
import TareaSchema from "../entity/tareas.entity.js";
import User from "../entity/user.entity.js";
import Bicicleta from "../entity/bicicleta.entity.js";

const MAX_TAREAS_MECANICO = 3;

export const createTareaService = async (tareaData) => {
  const tareaRepository = AppDataSource.getRepository(TareaSchema);
  const userRepository = AppDataSource.getRepository(User);
  const bicicletaRepository = AppDataSource.getRepository(Bicicleta);

  try {
    const usuario = await userRepository.findOneBy({ id: tareaData.id });
    if (!usuario) {
      throw new Error("Usuario no encontrado");
    }

    const bicicleta = await bicicletaRepository.findOneBy({ id_bici: tareaData.id_bici });
    if (!bicicleta) {
      throw new Error("Bicicleta no encontrada");
    }

    const tareasActivas = await tareaRepository.count({
      where: {
        usuario: { id: usuario.id },
        estado: "pendiente"
      }
    });

    if (tareasActivas >= MAX_TAREAS_MECANICO){
      throw new Error ("El mecánico ya está trabajando en el número máximo de tareas asignadas");
    }

    const newTarea = tareaRepository.create({
      ...tareaData,
      usuario: usuario,
      bicicleta: bicicleta,
    });

    // Guardar la nueva tarea en la base de datos
    await tareaRepository.save(newTarea);
    return newTarea;
  } catch (error) {
    throw new Error(`Error creando la tarea: ${error.message}`);
  }
};

export const getAllTareasService = async () => {
  const tareaRepository = AppDataSource.getRepository(TareaSchema);

  try {
    const tareas = await tareaRepository.find({ 
      relations: ["usuario", "bicicleta"],
      select: {
        id_tarea: true,
        detalle: true,
        prioridad: true,
        estado: true,
        usuario: {
          id: true,
          nombreCompleto: true,
        },
        bicicleta: {
          id_bici: true,
          marca: true,
          modelo: true,
        }
      },
    }); // Incluir relación con el usuario
    return tareas;
  } catch (error) {
    throw new Error(`Error obteniendo tareas: ${error.message}`);
  }
};

export const getTareaByIdService = async (id) => {
  const tareaRepository = AppDataSource.getRepository(TareaSchema);

  try {
    const tarea = await tareaRepository.findOne({ where: { idTarea: id }, relations: ["usuario"] });
    if (!tarea) {
      throw new Error("Tarea no encontrada");
    }
    return tarea;
  } catch (error) {
    throw new Error(`Error obteniendo la tarea: ${error.message}`);
  }
};

// Actualizar una tarea
export const updateTareaService = async (id_tarea, tareaData) => {
  const tareaRepository = AppDataSource.getRepository(TareaSchema);

  try {
    const existingTarea = await tareaRepository.findOneBy({ id_tarea: id_tarea });
    if (!existingTarea) {
      throw new Error("Tarea no encontrada");
    }

    tareaRepository.merge(existingTarea, tareaData);
    await tareaRepository.save(existingTarea);

    return existingTarea;
  } catch (error) {
    throw new Error(`Error actualizando la tarea: ${error.message}`);
  }
};

// Eliminar una tarea
export const deleteTareaService = async (id_tarea) => {
  const tareaRepository = AppDataSource.getRepository(TareaSchema);

  try {
    // Buscar y eliminar la tarea
    const tareaToDelete = await tareaRepository.findOneBy({ id_tarea: id_tarea });
    if (!tareaToDelete) {
      throw new Error("Tarea no encontrada");
    }

    await tareaRepository.remove(tareaToDelete);

    return { status: "success", message: "Tarea eliminada con éxito" };
  } catch (error) {
    return { status: "error", message: `Error eliminando la tarea: ${error.message}` };
  }
};