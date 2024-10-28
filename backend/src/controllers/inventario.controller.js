"use strict"
import { AppDataSource } from "../config/configDb.js";

import inventarioSchema from "../entity/inventario.entity.js";

export async function crearInventario (req , res) {
    try {
        const inventarioRepository = AppDataSource.getRepository(inventarioSchema);
        const inventario = req.body;

        if (!inventario) {
            return res.status(400).json({ 
                message: "Es NECESARIO agregar los datos para el inventario.", 
                data: null
            });
        }

        const newInventario = inventarioRepository.create({
            nombre: inventario.nombre,
            marca: inventario.marca,
            tipo_objeto: inventario.tipo_objeto,
            cantidad: inventario.cantidad,
            precio: inventario.precio,
            descripcion: inventario.descripcion
        });

        const inventarioGuardado = await inventarioRepository.save(newInventario);

        res.status(201).json({
            message: "Inventario creado exitosamente.",
            data: inventarioGuardado
        });
    } catch (error) {
        console.error("Error al crear el inventario:", error);
    }
}

export async function getInventarioTotal (req, res) {
    try {
        const inventarioRepository = AppDataSource.getRepository(inventarioSchema);
        const inventario = await inventarioRepository.find();

        if (!inventario) {
            return res.status(404).json({
                message: "No se encontró ningún objeto en el inventario.",
                data: null
            });
        }

        res.status(200).json({
            message: "Inventario obtenido exitosamente.",
            data: inventario
        });
    } catch (error) {
        console.error("Error al obtener el inventario:", error);
    }
}

export async function getInventarioById (req, res) {
    try {
        const inventarioRepository = AppDataSource.getRepository(inventarioSchema);
       
        const id = req.params.id;

        const inventarioFound = await inventarioRepository.findOne({
            where: { 
                id: id
             }
        });

        if (!inventarioFound) {
            return res.status(404).json({
                message: "No se encontró ningún objeto en el inventario.",
                data: null
            });
        }

        res.status(200).json({
            message: "Inventario obtenido exitosamente.",
            data: inventarioFound
        });
    } catch (error) {
        console.error("Error al obtener el objeto del inventario:", error);
    }
}