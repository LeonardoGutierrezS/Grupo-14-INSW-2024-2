"use strict"

import { 
    crearCategoriaService,
    getCategoriasService,
    getCategoriaNombreService,
    getCategoriaIdService,
    deleteCategoriaService,
    updateCategoriaService
} from "../services/categoria.service.js";

import { 
    categoriaBodyValidation 
} from "../validations/categoria.validation.js";

import { 
    handleErrorServer,
    handleErrorClient,
    handleSuccess
 } from "../handlers/responseHandlers.js";

export async function crearCategoria(req, res) {
    try {
        const {body} = req;
        const {error} = categoriaBodyValidation.validate(body);

        if (error) {
            return handleErrorClient(res, 400, "Error de validación", error.message);
        }

        const [crearCategoria, errorCrearCategoria] = await crearCategoriaService(body);

        if (errorCrearCategoria) {
            return handleErrorClient(res, 400, "Error al registrar Categoria", errorCrearCategoria);
        }
        handleSuccess(res, 201, "Categoria creada exitosamente", crearCategoria);
    }
    catch (error) {
        handleErrorServer(res, 500,"Error del Servidor", error.message);
    }
}

export async function getCategorias(req, res) {
    try {
        const [categorias, errorCategorias] = await getCategoriasService();

        if (errorCategorias) {
            return handleErrorClient(res, 404, "Error al obtener categorias", errorCategorias);
        }
        categorias.length === 0
        ? handleSuccess(res, 204)
        : handleSuccess(res, 200, "Categorias encontradas", categorias);
    }
    catch (error) {
        handleErrorServer(res, 500, "Error del Servidor", error.message);
    }
}

export async function getCategoriaNombre(req, res) {
    try {
        const {nombre} = req.params;
        const [categoria, errorCategoria] = await getCategoriaNombreService(nombre);

        if (errorCategoria) {
            return handleErrorClient(res, 404, "Error al obtener categoria", errorCategoria);
        }
        handleSuccess(res, 200, "Categoria encontrada", categoria);
    }
    catch (error) {
        handleErrorServer(res, 500, "Error del Servidor", error.message);
    }
}

export async function getCategoriaId(req, res) {
    try {
        const {id} = req.params;
        const [categoria, errorCategoria] = await getCategoriaIdService(id);

        if (errorCategoria) {
            return handleErrorClient(res, 404, "Error al obtener categoria", errorCategoria);
        }
        handleSuccess(res, 200, "Categoria encontrada", categoria);
    }
    catch (error) {
        handleErrorServer(res, 500, "Error del Servidor", error.message);
    }
}

export async function deleteCategoria(req, res) {
    try {
        const {id} = req.params;
        
        if (!id) {
            return handleErrorClient(res, 400, "Error de validación", "Id de la categoria es requerido");
        }

        const [categoria, errorCategoria] = await deleteCategoriaService(id);


        if (errorCategoria) {
            return handleErrorClient(res, 404, "Error al eliminar categoria", errorCategoria);
        }
        handleSuccess(res, 200, "Categoria eliminada", categoria);
    }
    catch (error) {
        handleErrorServer(res, 500, "Error del Servidor", error.message);
    }
}

export async function updateCategoria(req, res) {
    try {
        const {id} = req.params;
        const {body} = req;
        const {error} = categoriaBodyValidation.validate(body);

        if (error) {
            return handleErrorClient(res, 400, "Error de validación", error.message);
        }

        const [categoria, errorCategoria] = await updateCategoriaService(id, body);

        if (errorCategoria) {
            return handleErrorClient(res, 404, "Error al actualizar categoria", errorCategoria);
        }
        handleSuccess(res, 200, "Categoria actualizada", categoria);
    }
    catch (error) {
        handleErrorServer(res, 500, "Error del Servidor", error.message);
    }
}