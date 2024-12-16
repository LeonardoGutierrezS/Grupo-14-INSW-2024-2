import { AppDataSource } from "../config/configDb.js";
import TareaSchema from "../entity/tareas.entity.js";
import UserSchema from "../entity/user.entity.js";
import { handleErrorClient, handleErrorServer } from "../handlers/responseHandlers.js";
import { validateTarea } from "../validations/tareas.validation.js";
import { createTareaService, getAllTareasService }  from"../services/tareas.service.js";
import { deleteTareaService, updateTareaService } from "../services/tareas.service.js";

export const crearTarea = async (req, res) => {
  const errors = validateTarea(req.body);
  if (errors) {
    return res.status(400).json({ message: "Datos inválidos", errors });
  }

  try {
    const newTarea = await createTareaService(req.body);
    return res.status(201).json({
      status: "success",
      message: "Tarea creada con éxito",
      data: newTarea,
    });
  } catch (error) {
    return res.status(500).json({ message: `Error al crear la tarea: ${error.message}` });
  }
};

export const obtenerTodasTareas = async (req, res) => {
  try {
    const tareas = await getAllTareasService();
    return res.status(200).json(tareas);
  } catch (error) {
    return res.status(500).json({ message: `Error al obtener las tareas: ${error.message}` });
  }
};

export const actualizarEstado = async (req, res) => {
  const { id_tarea } = req.params;
  const tareaData = req.body; 

  try {
    const updatedTarea = await updateTareaService(id_tarea, tareaData);
    return res.status(200).json({
      message: "Tarea actualizada con éxito",
      data: updatedTarea,
    });
  } catch (error) {
    return res.status(500).json({ message: `Error al actualizar la tarea: ${error.message}` });
  }
};

export const eliminarTarea = async (req, res) => {
  const { id_tarea } = req.params;

  try {
    const resultado = await deleteTareaService(id_tarea);
    return res.status(200).json({ status: "success", message: resultado.message });
  } catch (error) {
    return res.status(500).json({ message: `Error al eliminar la tarea: ${error.message}` });
  }
};
