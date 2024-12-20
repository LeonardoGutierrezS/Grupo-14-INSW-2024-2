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
  const { comentario } = req.body;
  const { id_tarea } = req.params;
  const user_id = req.user?.id; 

  try {
    const comentarioRepository = AppDataSource.getRepository(ComentarioSchema);
    const tareaRepository = AppDataSource.getRepository(TareaSchema);

    const tarea = await tareaRepository.findOne({
      where: { id_tarea: id_tarea },
    });

    if (!tarea) {
      return res.status(404).json({ message: "Tarea no encontrada" });
    }

    const nuevoComentario = comentarioRepository.create({
      comentario,
      tarea,
      usuario: { id: user_id },
      fecha_creacion: new Date(),
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
  const { id_tarea } = req.params;

  try {
    const comentarioRepository = AppDataSource.getRepository(ComentarioSchema);
    const tareaRepository = AppDataSource.getRepository(TareaSchema);

    const tarea = await tareaRepository.findOneBy({ id_tarea: id_tarea });
    if (!tarea) {
      return res.status(404).json({ message: "Tarea no encontrada" });
    }

    const comentarios = await comentarioRepository.find({
      where: { tarea: { id_tarea } },
      relations: ["usuario"],
      order: { fecha_creacion: "ASC" },
    });

    return res.status(200).json(comentarios);
  } catch (error) {
    console.error("Error al obtener comentarios:", error);
    return res.status(500).json({ message: "Error al obtener comentarios", error });
  }
};

export const actualizarComentario = async (req, res) => {
  console.log("ejecutando actualizarComentario con ID:", req.params.id_com);
  const { id_com } = req.params;
  const { comentario } = req.body;

  const errors = validateComentario(req.body);
  if (errors) {
    return res.status(400).json({ message: "Datos inválidos", errors });
  }
  try {
    const comentarioRepository = AppDataSource.getRepository(ComentarioSchema);
    const comentarioExistente = await comentarioRepository.findOneBy({ id_com: id_com });

    if (!comentarioExistente) {
      return res.status(404).json({ message: "Comentario no encontrado" });
    }

    comentarioExistente.comentario = comentario;
    await comentarioRepository.save(comentarioExistente);
    
    return res.status(200).json({ message: "Comentario actualizado con éxito", data: comentarioExistente });
  } catch (error){
    return res.status(500).json({ message: "Error al actualizar el comentario", error });
  }
};

export const eliminarComentario = async (req, res) => {
  const { id_com } = req.params;

  try {
    const comentarioRepository = AppDataSource.getRepository(ComentarioSchema);
    const comentarioExistente = await comentarioRepository.findOneBy({ id_com: id_com });

    if (!comentarioExistente) {
      return res.status(404).json({ message: "Comentario no existente" });
    }

    await comentarioRepository.remove(comentarioExistente);
    
    return res.status(200).json({ message: "Comentario eliminado con éxito" });
  } catch (error) {
    return res.status(500).json({ message: "Error al eliminar el comentario", error });
  } 
};