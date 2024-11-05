"use strict";
import { AppDataSource } from "../config/configDb.js";
import ComentarioSchema from "../entity/comentario.entity.js";
import TareaSchema from "../entity/tareas.entity.js";
import UserSchema from "../entity/user.entity.js";
import { validateComentario } from "../validations/comentario.validation.js"; // Importa la validación

export const crearComentario = async (req, res) => {
  const errors = validateComentario(req.body);
  if (errors) {
    return res.status(400).json({ message: "Datos inválidos", errors });
  }
  const { comentario, tarea_id } = req.body;
  const userId = req.user.id; 

  try {
    const comentarioRepository = AppDataSource.getRepository(ComentarioSchema);
    const tareaRepository = AppDataSource.getRepository(TareaSchema);

    const tarea = await tareaRepository.findOneBy({ id_tarea: tarea_id });
    if (!tarea) {
      return res.status(404).json({ message: "Tarea no encontrada" });
    }

    const nuevoComentario = comentarioRepository.create({
      comentario,
      tarea,
      usuario: { id: userId },
    });

    await comentarioRepository.save(nuevoComentario);

    return res.status(201).json({
      message: "Comentario creado con éxito",
      data: nuevoComentario,
    });
  } catch (error) {
    return res.status(500).json({ message: "Error al crear comentario", error });
  }
};

export const obtenerComentarios = async (req, res) => {
  const { tarea_id } = req.params;

  try {
    const comentarioRepository = AppDataSource.getRepository(ComentarioSchema);
    const tareaRepository = AppDataSource.getRepository(TareaSchema);

    const tarea = await tareaRepository.findOneBy({ id_tarea: tarea_id });
    if (!tarea) {
      return res.status(404).json({ message: "Tarea no encontrada" });
    }

    const comentarios = await comentarioRepository.find({
      where: { tarea: { id_tarea: tarea_id } },
      relations: ["usuario"],
    });

    return res.status(200).json(comentarios);
  } catch (error) {
    return res.status(500).json({ message: "Error al obtener comentarios", error });
  }
};