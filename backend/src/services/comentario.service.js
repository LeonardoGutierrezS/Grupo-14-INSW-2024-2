"use strict";
import { AppDataSource } from "../config/configDb.js";
import ComentarioSchema from "../entity/comentario.entity.js";

// Crear un nuevo comentario
export const createComentarioService = async (comentarioData) => {
  const comentarioRepository = AppDataSource.getRepository(ComentarioSchema);

  try {
    const newComentario = comentarioRepository.create(comentarioData);
    await comentarioRepository.save(newComentario);
    return newComentario;
  } catch (error) {
    throw new Error("Error creando el comentario: ${error.message}");
  }
};

// Obtener todos los comentarios
export const getAllComentariosService = async (id_tarea) => {
  const comentarioRepository = AppDataSource.getRepository(ComentarioSchema);

  try {
    const comentarios = await comentarioRepository.find({
    where: { tarea: { id_tarea } },
    relations: ["tarea", "usuario"],
    order: { fecha_creacion: "ASC" },
    });
    return comentarios;
  } catch (error) {
    throw new Error("Error obteniendo comentarios: ${error.message}");
  }
};

// Actualizar un comentario
export const updateComentarioService = async (id_com, comentarioData) => {
  const comentarioRepository = AppDataSource.getRepository(ComentarioSchema);

  try {
    // Buscar comentario existente
    const existingComentario = await comentarioRepository.findOneBy({ id_com: id_com });
    if (!existingComentario) {
      throw new Error("Comentario no encontrado");
    }

    // Actualizar y guardar el comentario
    comentarioRepository.merge(existingComentario, comentarioData);
    await comentarioRepository.save(existingComentario);

    return existingComentario;
  } catch (error) {
    throw new Error(`Error actualizando el comentario: ${error.message}`);
  }
};

// Eliminar un comentario
export const deleteComentarioService = async (id_com) => {
  const comentarioRepository = AppDataSource.getRepository(ComentarioSchema);

  try {
    // Buscar y eliminar el comentario
    const comentarioToDelete = await comentarioRepository.findOneBy({ id_com: id_com });
    if (!comentarioToDelete) {
      throw new Error("Comentario no encontrado");
    }

    await comentarioRepository.remove(comentarioToDelete);
    return { message: "Comentario eliminado con éxito" };
  } catch (error) {
    throw new Error(`Error eliminando el comentario: ${error.message}`);
  }
};
