"use strict";
import { AppDataSource } from "../config/configDb.js";
import ComentarioSchema from "../entity/comentario.entity.js";

// Crear un nuevo comentario
export const createComentarioService = async (comentarioData) => {
  const comentarioRepository = AppDataSource.getRepository(ComentarSchema);

  try {
    const newComentario = comentarioRepository.create(comentarioData);
    await comentarioRepository.save(newComentario);
    return newComentario;
  } catch (error) {
    throw new Error(`Error creando el comentario: ${error.message}`);
  }
};

// Obtener todos los comentarios
export const getAllComentariosService = async () => {
  const comentarioRepository = AppDataSource.getRepository(ComentarSchema);

  try {
    const comentarios = await comentarioRepository.find({ relations: ["tarea", "usuario"] });
    return comentarios;
  } catch (error) {
    throw new Error(`Error obteniendo comentarios: ${error.message}`);
  }
};

// Obtener un comentario por ID
export const getComentarioByIdService = async (id) => {
  const comentarioRepository = AppDataSource.getRepository(ComentarSchema);

  try {
    const comentario = await comentarioRepository.findOneBy({ relations: ["tarea", "usuario"] });
    if (!comentario) {
      throw new Error("Comentario no encontrado");
    }
    return comentario;
  } catch (error) {
    throw new Error(`Error obteniendo el comentario: ${error.message}`);
  }
};

// Actualizar un comentario
export const updateComentarioService = async (id, comentarioData) => {
  const comentarioRepository = AppDataSource.getRepository(ComentarSchema);

  try {
    // Buscar comentario existente
    const existingComentario = await comentarioRepository.findOneBy({ id_com: id });
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
export const deleteComentarioService = async (id) => {
  const comentarioRepository = AppDataSource.getRepository(ComentarSchema);

  try {
    // Buscar y eliminar el comentario
    const comentarioToDelete = await comentarioRepository.findOneBy({ id_com: id });
    if (!comentarioToDelete) {
      throw new Error("Comentario no encontrado");
    }

    await comentarioRepository.remove(comentarioToDelete);
    return { message: "Comentario eliminado con éxito" };
  } catch (error) {
    throw new Error(`Error eliminando el comentario: ${error.message}`);
  }
};
