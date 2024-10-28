"use strict";

import Inventario from "../entity/inventario.entity.js";
import { AppDataSource } from "../config/configDb.js";

export async function crearInventarioService(dataInventario) {
  try {
    const inventarioRepository = AppDataSource.getRepository(Inventario);
    
    const newInventario = inventarioRepository.create({
        nombre: dataInventario.nombre,
        marca: dataInventario.marca,
        tipo_objeto: dataInventario.tipo_objeto,
        cantidad: dataInventario.cantidad,
        precio: dataInventario.precio,
        descripcion: dataInventario.descripcion
    });
    const inventarioGuardado = await inventarioRepository.save(newInventario);

    return inventarioGuardado;
  } catch (error) {
    console.error("Error al crear el inventario:", error);
  }
}

export async function getInventarioTotalService() {
  try {
    const inventarioRepository = AppDataSource.getRepository(Inventario);
    const inventario = await inventarioRepository.find();

    return inventario;
  } catch (error) {
    console.error("Error al obtener el inventario:", error);
  }
}

export async function getInventarioByIdService(id) {
    try {
        const inventarioRepository = AppDataSource.getRepository(Inventario);
        const inventario = await inventarioRepository.findOne(id);
    
        return inventario;
    } catch (error) {
        console.error("Error al obtener el inventario:", error);
    }
}