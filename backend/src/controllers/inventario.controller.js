"use strict"
import { 
    crearInventarioService,
    getInventarioTotalService,
    getInventarioByIdService,
    getInventarioBynombreDeMarcaService,
    deleteInventarioService, 
} from "../services/inventario.service.js";

import { 
    inventarioBodyValidation
} from "../validations/inventario.validation.js";

import { 
    handleErrorServer,
    handleErrorClient,
    handleSuccess
 } from '../handlers/responseHandlers.js';

export async function crearInventario (req, res) {
    try {
        const {body} = req;
        const {error} = inventarioBodyValidation.validate(body);

        if (error) {
            return handleErrorClient(res, 400, "Error de validación", error.message);
        }

        const [crearInventario, errorCrearInventario] = await crearInventarioService(body);

        if (errorCrearInventario) {
            return handleErrorClient(res, 400, "Error al registrar Inventario", errorCrearInventario);
        }
        handleSuccess(res, 201, "Inventario creado exitosamente", crearInventario);
    }
    catch (error) {
        handleErrorServer(res, 500,"Error del Servidor", error.message);
    }    
}

export async function getInventarioTotal (req, res) {
    try {
        const [inventario, errorInventario] = await getInventarioTotalService();

        if (errorInventario) {
            return handleErrorClient(res, 404, "Error al obtener inventarios", errorInventario);
        }
        inventario.length === 0
        ? handleSuccess(res, 204)
        : handleSuccess(res, 200, "Inventarios encontrados", inventario);
    }
    catch (error) {
        handleErrorServer(res, 500, "Error del Servidor", error.message);
    }
}

export async function getInventarioById (req, res) {
    try {
        const {id} = req.params;

        if (!id) {
            return handleErrorClient(res, 400, "Error de validación", "El id es requerido");
        }

        const [inventario, errorInventario] = await getInventarioByIdService(id);

        if (errorInventario) {
            return handleErrorClient(res, 404, "Error al obtener inventario", errorInventario);
        }
        handleSuccess(res, 200, "Inventario encontrado", inventario);
    }
    catch (error) {
        handleErrorServer(res, 500, "Error del Servidor", error.message);
    }
}

export async function getInventarioBynombreDeMarca (req, res) {
    try {
        const {nombre} = req.params;

        if (!nombre) {
            return handleErrorClient(res, 400, "Error de validación", "El nombre es requerido");
        }

        const [inventario, errorInventario] = await getInventarioBynombreDeMarcaService(nombre);

        if (errorInventario) {
            return handleErrorClient(res, 404, "Error al obtener inventario", errorInventario);
        }
        handleSuccess(res, 200, "Inventario encontrado", inventario);
    }
    catch (error) {
        handleErrorServer(res, 500, "Error del Servidor", error.message);
    }
}

export async function deleteInventario (req, res) {
    try {
        const {id} = req.params;

        if (!id) {
            return handleErrorClient(res, 400, "Error de validación", "El id es requerido");
        }

        const [inventario, errorInventario] = await deleteInventarioService(id);

        if (errorInventario) {
            return handleErrorClient(res, 404, "Error al eliminar inventario", errorInventario);
        }
        handleSuccess(res, 200, "Inventario eliminado", inventario);
    }
    catch (error) {
        handleErrorServer(res, 500, "Error del Servidor", error.message);
    }
}