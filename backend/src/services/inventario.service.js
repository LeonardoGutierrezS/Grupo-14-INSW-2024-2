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

    //verificar si el inventario ya existe al tener el nombre, id_tipo, id_marca, id_categoria
    //iguales a uno ya existente
    
    const inventarioExistente = await inventarioRepository.findOne({
      where: {
        nombre,
        id_tipo,
        id_marca,
        id_categoria,
      },
    });
    
    if (inventarioExistente && inventarioExistente.id !== id) {
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
    if (inventario.length === 0) {
      return [null, `No se encontraron inventarios para la marca: ${nombre}`];
    }


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
    if (inventario.length === 0) {
      return [null, `No se encontraron inventarios para la categoria: ${nombre}`];
    }


    return [inventario, null];
  } catch (error) {
    console.error("Error al obtener el inventario:", error);
    return [null, "Error interno del servidor"];
  }
}
export async function getInventarioBynombreDeTipoService(nombre) {
  try {
    const inventarioRepository = AppDataSource.getRepository(Inventario);
    const inventario = await inventarioRepository.find({
      where: { 
        tipo: { 
          nombre: nombre 
        }
       },
       relations: ["tipo"] 
    });
    if (inventario.length === 0) {
      return [null, `No se encontraron inventarios para el tipo: ${nombre}`];
    }
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


export async function updateInventarioService(id, inventarioData) {
  try {
    const inventarioRepository = AppDataSource.getRepository(Inventario);

    // Buscar el inventario por ID
    const inventario = await inventarioRepository.findOne({ where: { id } });
    if (!inventario) {
      return [null, "El inventario no existe"];
    }

    const { nombre, cantidad, precio, descripcion, id_marca, id_categoria, id_tipo } = inventarioData;

    // Verificar si ya existe un inventario con los mismos atributos
    const inventarioExistente = await inventarioRepository.findOne({
      where: {
        nombre,
        cantidad,
        precio,
        descripcion,
        id_tipo,
        id_marca,
        id_categoria,
      },
    });

    if (inventarioExistente && inventarioExistente.id !== id) {
      return [null, "El inventario ya existe con esos atributos"];
    }

    // Actualizar los campos del inventario encontrado
    Object.assign(inventario, { nombre, cantidad, precio, descripcion, id_marca, id_categoria, id_tipo });

    // Guardar los cambios en la base de datos
    await inventarioRepository.save(inventario);

    return [inventario, null];
  } catch (error) {
    console.error("Error al actualizar el inventario:", error.message || error);
    return [null, "Error interno del servidor"];
  }
}

// ahora un update que modifique solo la cantidad de un inventario

export async function updateInventarioCantidadService(id, inventarioData) {
  try {
    const inventarioRepository = AppDataSource.getRepository(Inventario);

    // Buscar el inventario por ID
    const inventario = await inventarioRepository.findOne({ where: { id } });
    if (!inventario) {
      return [null, "El inventario no existe"];
    }

    const { cantidad } = inventarioData;

    // Actualizar los campos del inventario encontrado
    Object.assign(inventario, { cantidad });

    // Guardar los cambios en la base de datos
    await inventarioRepository.save(inventario);

    return [inventario, null];
  } catch (error) {
    console.error("Error al actualizar el inventario:", error.message || error);
    return [null, "Error interno del servidor"];
  }
}