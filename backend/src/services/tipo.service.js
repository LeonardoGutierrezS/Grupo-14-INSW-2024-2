"use strict"

import Tipo from "../entity/tipo.entity.js";

import { AppDataSource } from "../config/configDb.js";

export async function crearTipoService(tipoData) {
    try {
        const tipoRepository = AppDataSource.getRepository(Tipo);
        const { nombre } = tipoData;
        const createErrorMessage = (dataInfo, message) => ({ dataInfo, message });

        const tipoExistente = await tipoRepository.findOne({
            where: {nombre}, 
        });
        if (tipoExistente) {
            return [null, createErrorMessage(null, "El tipo ya existe")];
        }

        const newTipo = tipoRepository.create({
            nombre
        });
        const tipoGuardado = await tipoRepository.save(newTipo);
        return [tipoGuardado, null];

    } catch (error) {
        console.error("Error al crear el tipo:", error);
        return [null, "Error interno del servidor"];
    }
}

export async function getTiposService() {
    try {
        const tipoRepository = AppDataSource.getRepository(Tipo);
        const tipos = await tipoRepository.find();
        if (!tipos || tipos.length === 0) return [null, "No hay tipos"];
        return [tipos, null];
    } catch (error) {
        console.error("Error al obtener los tipos:", error);
        return [null, "Error interno del servidor"];
    }
}

export async function getTipoNombreService(nombre) {
    try {
        const tipoRepository = AppDataSource.getRepository(Tipo);
        const tipo = await tipoRepository.findOne({
            where: { nombre },
        });
        if (!tipo) return [null, "Tipo no encontrado"];
        return [tipo, null];
    } catch (error) {
        console.error("Error al obtener el tipo:", error);
        return [null, "Error interno del servidor"];
    }
}

export async function getTipoIdService(id_tipo) {
    try {
        const tipoRepository = AppDataSource.getRepository(Tipo);
        const tipo = await tipoRepository.findOne({
            where: { id_tipo },
        });
        if (!tipo) return [null, "Tipo no encontrado"];
        return [tipo, null];
    } catch (error) {
        console.error("Error al obtener el tipo:", error);
        return [null, "Error interno del servidor"];
    }
}

export async function deleteTipoService(id_tipo) {
    try {
        const tipoRepository = AppDataSource.getRepository(Tipo);
        const tipo = await tipoRepository.findOne({
            where: { id_tipo },
        });
        if (!tipo) return [null, "Tipo no encontrado"];

        await tipoRepository.remove(tipo);
        return [tipo, null];
    } catch (error) {
        console.error("Error al eliminar el tipo:", error.message);
        return [null, "Error interno del servidor"];
    }
}


export async function updateTipoService(id_tipo, tipoData) {
    try {
        const tipoRepository = AppDataSource.getRepository(Tipo);
        const { nombre } = tipoData;
        const tipo = await tipoRepository.findOne({
            where: { id_tipo },
        });

        if (!tipo) return [null, "Tipo no encontrado"];
        tipo.nombre = nombre;
        const tipoActualizado = await tipoRepository.save(tipo);
        return [tipoActualizado, null];
        
    } catch (error) {
        console.error("Error al actualizar el tipo:", error);
        return [null, "Error interno del servidor"];
    }
}