"use strict"
import { AppDataSource } from "../config/configDb.js";
import { handleErrorClient, handleErrorServer, handleSuccess, } from "../handlers/responseHandlers.js";
import { crearInventarioService, getInventarioTotalService } from "../services/inventario.service.js";
import { inventarioBodyValidation } from "../validations/inventario.validation.js";


export async function crearInventario (req , res) {
    try {
        const inventario = req.body;

        const { value, error } = inventarioBodyValidation.validate(inventario);

        if (error)  
            return res.status(400).json({
            message: error.message 
        })

        const inventarioGuardado = await crearInventarioService(inventario);
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
        const inventarioTotal = await getInventarioTotalService();

        if (inventarioTotal.length === 0) {
            return res.status(404).json({
                message: "No se encontraron objetos en el inventario.",
                data: null
            });
        }

        res.status(200).json({
            message: "Inventario obtenido exitosamente.",
            data: inventarioTotal
        });
    } catch (error) {
        console.error("Error al obtener el inventario:", error);
    }
}

export async function getInventarioById (req, res) {
    try {
        const { id } = req.params;

        const inventario = await getInventarioByIdService(id);

        if (!inventario) {
            return res.status(404).json({
                message: "No se encontró el objeto en el inventario.",
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