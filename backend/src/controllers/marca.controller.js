"use strict";
import { 
    crearMarcaService,
    getMarcasService,
    getMarcaNombreService,
    getMarcaIdService,
    deleteMarcaService,
    updateMarcaService
} from '../services/marca.service.js';

import { 
    marcaBodyValidation 
} from '../validations/marca.validation.js';

import { 
    handleErrorServer,
    handleErrorClient,
    handleSuccess
 } from '../handlers/responseHandlers.js';

export async function crearMarca(req, res) {
    try {
        const {body} = req;
        const {error} = marcaBodyValidation.validate(body);

        if (error) {
            return handleErrorClient(res, 400, "Error de validación", error.message);
        }

        const [crearMarca, errorCrearMarca] = await crearMarcaService(body);

        if (errorCrearMarca) {
            return handleErrorClient(res, 400, "Error al registrar Marca", errorCrearMarca);
        }
        handleSuccess(res, 201, "Marca creada exitosamente", crearMarca);
    }
    catch (error) {
        handleErrorServer(res, 500,"Error del Servidor", error.message);
    }    
}

export async function getMarcas(req, res) {
    try {
        const [marcas, errorMarcas] = await getMarcasService();

        if (errorMarcas) {
            return handleErrorClient(res, 404, "Error al obtener marcas", errorMarcas);
        }
        marcas.length === 0
        ? handleSuccess(res, 204)
        : handleSuccess(res, 200, "Marcas encontradas", marcas);
    }
    catch (error) {
        handleErrorServer(res, 500, "Error del Servidor", error.message);
    }
}

export async function getMarcaNombre(req, res) {
    try {
        const {nombre} = req.params;
        if (!nombre) {
            return handleErrorClient(res, 400, "Error de validación", "Nombre de la marca es requerido");
        }

        const [marca, errorMarca] = await getMarcaNombreService(nombre);

        if (errorMarca) {
            return handleErrorClient(res, 404, "Marca no encontrada", errorMarca);
        }
        handleSuccess(res, 200, "Marca encontrada", marca);
    }
    catch (error) {
        handleErrorServer(res, 500, "Error del Servidor", error.message);
    }
}

export async function getMarcaId(req, res) {
    try {
        const {id} = req.params;
        if (!id) {
            return handleErrorClient(res, 400, "Error de validación", "Id de la marca es requerido");
        }

        const [marca, errorMarca] = await getMarcaIdService(id);

        if (errorMarca) {
            return handleErrorClient(res, 404, "Marca no encontrada", errorMarca);
        }
        handleSuccess(res, 200, "Marca encontrada", marca);
    }
    catch (error) {
        handleErrorServer(res, 500, "Error del Servidor", error.message);
    }
}

export async function deleteMarca(req, res) {
    try {
        const {id} = req.params;
        if (!id) {
            return handleErrorClient(res, 400, "Error de validación", "Id de la marca es requerido");
        }

        const [marca, errorMarca] = await deleteMarcaService(id);

        if (errorMarca) {
            return handleErrorClient(res, 404, "Marca no encontrada", errorMarca);
        }
        handleSuccess(res, 200, "Marca eliminada", marca);
    }
    catch (error) {
        handleErrorServer(res, 500, "Error del Servidor", error.message);
    }
}



export async function updateMarca(req, res) {
    try {
        const {id} = req.params;
        const {body} = req;
        const {error} = marcaBodyValidation.validate(body);

        if (error) {
            return handleErrorClient(res, 400, "Error de validación", error.message);
        }

        const [marca, errorMarca] = await updateMarcaService(id, body);

        if (errorMarca) {
            return handleErrorClient(res, 404, "Marca no encontrada", errorMarca);
        }
        handleSuccess(res, 200, "Marca actualizada", marca);
    }
    catch (error) {
        handleErrorServer(res, 500, "Error del Servidor", error.message);
    }
}
