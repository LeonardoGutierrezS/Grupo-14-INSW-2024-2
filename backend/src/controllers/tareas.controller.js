import { AppDataSource } from "../config/configDb.js";
import TareaSchema from "../entity/tareas.entity.js";
import UserSchema from "../entity/user.entity.js";
import { handleErrorClient, handleErrorServer } from "../handlers/responseHandlers.js";
import { validateTarea } from "../validations/tareas.validation.js";
import { createTareaService, getAllTareasService, updateTareaService } from "../services/tareas.service.js";

export const crearTarea = async (req, res) => {
  const errors = validateTarea(req.body);
  if (errors) {
    return res.status(400).json({ message: "Datos inválidos", errors });
  }

  try {
    const newTarea = await createTareaService(req.body);
    return res.status(201).json({
      message: "Tarea creada con éxito",
      data: newTarea,
    });
  } catch (error) {
    return res.status(500).json({ message: `Error al crear la tarea: ${error.message}` });
  }
};
export const asignarTarea = async (req, res) => {
  try {
    const { comentario, prioridad, id } = req.body;

    // verificar si el usuario existe y es un mecánico
    const userRepository = AppDataSource.getRepository(User);
    const user = await userRepository.findOneBy({ id:id });

    if (!user || user.rol !== "mecánico") {
      return handleErrorClient(res, 400, "Usuario no válido o no es un mecánico");
    }

    const tareaRepository = AppDataSource.getRepository(Tarea);
    const nuevaTarea = tareaRepository.create({
      comentario,
      prioridad,
      usuario: user,
      estado: "pendiente",
    });

    await tareaRepository.save(nuevaTarea);
    res.status(201).json({ mensaje: "Tarea asignada con éxito", tarea: nuevaTarea });
  } catch (error) {
    handleErrorServer(res, 500, "Error al asignar tarea", error.message);
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
  const { id } = req.params;
  const tareaData = req.body; 

  try {
    const updatedTarea = await updateTareaService(id, tareaData);
    return res.status(200).json({
      message: "Tarea actualizada con éxito",
      data: updatedTarea,
    });
  } catch (error) {
    return res.status(500).json({ message: `Error al actualizar la tarea: ${error.message}` });
  }
};