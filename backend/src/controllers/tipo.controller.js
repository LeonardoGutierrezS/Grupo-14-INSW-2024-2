"use strict"

import { tipoBodyValidation } from "../validations/tipo.validation.js";

import {
    handleErrorServer,
    handleErrorClient,
    handleSuccess
} from "../handlers/responseHandlers.js";

import {
    crearTipoService,
    getTiposService,
    getTipoNombreService,
    getTipoIdService,
    deleteTipoService,
    updateTipoService
} from "../services/tipo.service.js";

export async function crearTipo(req, res) {
    try {
        const { body } = req;
        const { error } = tipoBodyValidation.validate(body);

        if (error) {
            return handleErrorClient(res, 400, "Error de validación", error.message);
        }

        const [crearTipo, errorCrearTipo] = await crearTipoService(body);

        if (errorCrearTipo) {
            return handleErrorClient(res, 400, "Error al registrar Tipo", errorCrearTipo);
        }
        handleSuccess(res, 201, "Tipo creado exitosamente", crearTipo);
    }
    catch (error) {
        handleErrorServer(res, 500, "Error del Servidor", error.message);
    }
}

export async function getTipos(req, res) {
    try {
        const [tipos, errorTipos] = await getTiposService();

        if (errorTipos) {
            return handleErrorClient(res, 404, "Error al obtener tipos", errorTipos);
        }
        tipos.length === 0
            ? handleSuccess(res, 204)
            : handleSuccess(res, 200, "Tipos encontrados", tipos);
    }
    catch (error) {
        handleErrorServer(res, 500, "Error del Servidor", error.message);
    }
}

export async function getTipoNombre(req, res) {
    try {
        const { nombre } = req.params;
        if (!nombre) {
            return handleErrorClient(res, 400, "Error de validación", "Nombre de tipo requerido");
        }

        const [tipo, errorTipo] = await getTipoNombreService(nombre);

        if (errorTipo) {
            return handleErrorClient(res, 404, "Error al obtener tipo", errorTipo);
        }
        handleSuccess(res, 200, "Tipo encontrado", tipo);
    }
    catch (error) {
        handleErrorServer(res, 500, "Error del Servidor", error.message);
    }
}

export async function getTipoId(req, res) {
    try {
        const { id_tipo } = req.params;
        if (!id_tipo) {
            return handleErrorClient(res, 400, "Error de validación", "Id de tipo requerido");
        }

        const [tipo, errorTipo] = await getTipoIdService(id_tipo);

        if (errorTipo) {
            return handleErrorClient(res, 404, "Error al obtener tipo", errorTipo);
        }
        handleSuccess(res, 200, "Tipo encontrado", tipo);
    }
    catch (error) {
        handleErrorServer(res, 500, "Error del Servidor", error.message);
    }
}

export async function deleteTipo(req, res) {
    try {
        const { id } = req.params;
        if (!id ) {
            return handleErrorClient(res, 400, "Error de validación", "Id de tipo requerido");
        }

        const [tipo, errorTipo] = await deleteTipoService(id);

        if (errorTipo) {
            return handleErrorClient(res, 404, "Error al eliminar tipo", errorTipo);
        }
        handleSuccess(res, 200, "Tipo eliminado", tipo);
    }
    catch (error) {
        handleErrorServer(res, 500, "Error del Servidor", error.message);
    }
}

export async function updateTipo(req, res) {
    try {
        const { id } = req.params;
        const { body } = req;
        const { error } = tipoBodyValidation.validate(body);

        if (error) {
            return handleErrorClient(res, 400, "Error de validación", error.message);
        }

        const [tipo, errorTipo] = await updateTipoService(id, body);

        if (errorTipo) {
            return handleErrorClient(res, 404, "Error al actualizar tipo", errorTipo);
        }
        handleSuccess(res, 200, "Tipo actualizado", tipo);
    }
    catch (error) {
        handleErrorServer(res, 500, "Error del Servidor", error.message);
    }
}