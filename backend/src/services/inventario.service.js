"use strict";

import Inventario from "../entity/inventario.entity.js";
import Marca from "../entity/marca.entity.js";
import Categoria from "../entity/categoria.entity.js";
import { AppDataSource } from "../config/configDb.js";

export async function crearInventarioService(inventarioData) {
  try {
    const inventarioRepository = AppDataSource.getRepository(Inventario);

    const { nombre, cantidad, precio, descripcion, id_marca, id_categoria, id_tipo, } = inventarioData;

    const createErrorMessage = (dataInfo, message) => ({ dataInfo, message });

    const inventarioExistente = await inventarioRepository.findOne({
      where: { nombre },
    });
    if (inventarioExistente) {
      return [null, createErrorMessage(null, "El inventario ya existe")];
    }
    //verificar la marca
    const marcaRepository = AppDataSource.getRepository(Marca);
    const marcaExistente = await marcaRepository.findOne({
      where: { id_marca },
    });
    if (!marcaExistente) {
      return [null, createErrorMessage(null, "La marca no existe")];
    }
    //verificar la categoria
    const categoriaRepository = AppDataSource.getRepository(Categoria);
    const categoriaExistente = await categoriaRepository.findOne({
      where: { id_categoria },
    });
    if (!categoriaExistente) {
      return [null, createErrorMessage(null, "La categoria no existe")];
    }
    
    const newInventario = inventarioRepository.create({
      nombre,
      cantidad,
      precio,
      descripcion,
      id_marca,
      id_categoria,
      id_tipo,
    });
    const inventarioGuardado = await inventarioRepository.save(newInventario);
    return [inventarioGuardado, null];
  }
  catch (error) {
    console.error("Error al crear el inventario:", error);
    return [null, "Error interno del servidor"];
  }
}

export async function getInventarioTotalService() {
  try {
    const inventarioRepository = AppDataSource.getRepository(Inventario);
    const inventario = await inventarioRepository.find();

    return [inventario, null];
  } catch (error) {
    console.error("Error al obtener el inventario:", error);
    return [null, "Error interno del servidor"];
  }
}

export async function getInventarioByIdService(id) {
  try {
    const inventarioRepository = AppDataSource.getRepository(Inventario);
    const inventario = await inventarioRepository.findOne(id);

    return [inventario, null];
  } catch (error) {
    console.error("Error al obtener el inventario:", error);
    return [null, "Error interno del servidor"];
  }
}

export async function getInventarioBynombreDeMarcaService(nombre) {
  try {
    const inventarioRepository = AppDataSource.getRepository(Inventario);
    const inventario = await inventarioRepository.find({
      where: { 
        marca: { 
          nombre: nombre 
        }
       },
       relations: ["marca"] 
    });

    return [inventario, null];
  } catch (error) {
    console.error("Error al obtener el inventario:", error);
    return [null, "Error interno del servidor"];
  }
}
export async function getInventarioBynombreDeCategoriaService(nombre) {
  try {
    const inventarioRepository = AppDataSource.getRepository(Inventario);
    const inventario = await inventarioRepository.find({
      where: { 
        categoria: { 
          nombre: nombre 
        }
       },
       relations: ["categoria"] 
    });

    return [inventario, null];
  } catch (error) {
    console.error("Error al obtener el inventario:", error);
    return [null, "Error interno del servidor"];
  }
}

export async function deleteInventarioService(id) {
  try {
    const inventarioRepository = AppDataSource.getRepository(Inventario);
    const inventario = await inventarioRepository.findOne({
      where: { id },
    });

    if (!inventario) {
      return [null, "El inventario no existe"];
    }

    await inventarioRepository.remove(inventario);

    return [inventario, null];
  } catch (error) {
    console.error("Error al eliminar el inventario:", error);
    return [null, "Error interno del servidor"];
  }
}