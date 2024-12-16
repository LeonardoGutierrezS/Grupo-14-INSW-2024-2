"use strict";

import Categoria from "../entity/categoria.entity.js";

import { AppDataSource } from "../config/configDb.js";

export async function crearCategoriaService(categoriaData) {
    try {
        const categoriaRepository = AppDataSource.getRepository(Categoria);
        const { nombre } = categoriaData;
        const createErrorMessage = (dataInfo, message) => ({ dataInfo, message });

        const categoriaExistente = await categoriaRepository.findOne({
            where: {nombre}, 
        });
        if (categoriaExistente) {
            return [null, createErrorMessage(null, "La categoria ya existe")];
        }

        const newCategoria = categoriaRepository.create({
            nombre
        });
        const categoriaGuardada = await categoriaRepository.save(newCategoria);
        return [categoriaGuardada, null];

    } catch (error) {
        console.error("Error al crear la categoria:", error);
        return [null, "Error interno del servidor"];
    }
}

export async function getCategoriasService() {
    try {
        const categoriaRepository = AppDataSource.getRepository(Categoria);
        const categorias = await categoriaRepository.find();
        if (!categorias || categorias.length === 0) return [null, "No hay categorias"];
        return [categorias, null];
    } catch (error) {
        console.error("Error al obtener las categorias:", error);
        return [null, "Error interno del servidor"];
    }
}

export async function getCategoriaNombreService(nombre) {
    try {
        const categoriaRepository = AppDataSource.getRepository(Categoria);
        const categoria = await categoriaRepository.findOne({
            where: { nombre },
        });
        if (!categoria) return [null, "Categoria no encontrada"];
        return [categoria, null];
    } catch (error) {
        console.error("Error al obtener la categoria:", error);
        return [null, "Error interno del servidor"];
    }
}

export async function getCategoriaIdService(id) {
    try {
        const categoriaRepository = AppDataSource.getRepository(Categoria);
        const categoria = await categoriaRepository.findOne({
            where: { id },
        });
        if (!categoria) return [null, "Categoria no encontrada"];
        return [categoria, null];
    } catch (error) {
        console.error("Error al obtener la categoria:", error);
        return [null, "Error interno del servidor"];
    }
}

export async function deleteCategoriaService(id_categoria) {
    try {
      const categoriaRepository = AppDataSource.getRepository(Categoria);
  
      // Buscar la categoría por ID
      const categoria = await categoriaRepository.findOne({
        where: { id_categoria },
      });
  
      if (!categoria) {
        return [null, "Categoría no encontrada"];
      }
  
      // Eliminar la categoría de la base de datos
      await categoriaRepository.remove(categoria);
  
      return [categoria, null];
    } catch (error) {
      console.error("Error al eliminar la categoría:", error.message || error);
      return [null, "Error interno del servidor"];
    }
  }

export async function updateCategoriaService(id_categoria, categoriaData) {
    try {
      const categoriaRepository = AppDataSource.getRepository(Categoria);
      const { nombre } = categoriaData;
      // Buscar la categoría por ID
      const categoria = await categoriaRepository.findOne({
        where: { id_categoria },
      });
  
      if (!categoria) {
        return [null, "Categoría no encontrada"];
      }
      // Actualizar el campo de nombre
      categoria.nombre = nombre;
      const categoriaActualizada = await categoriaRepository.save(categoria);
      return [categoriaActualizada, null];
    } catch (error) {
      console.error("Error al actualizar la categoría:", error.message || error);
      return [null, "Error interno del servidor"];
    }
  }

