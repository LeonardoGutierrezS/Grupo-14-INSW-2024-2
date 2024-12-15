"use strict";

import Marca from "../entity/marca.entity.js";

import { AppDataSource } from "../config/configDb.js";

export async function crearMarcaService(marcaData) {
    try {
        const marcaRepository = AppDataSource.getRepository(Marca);
        const { nombre } = marcaData;
        const createErrorMessage = (dataInfo, message) => ({ dataInfo, message });

        const marcaExistente = await marcaRepository.findOne({
            where: {nombre}, 
        });
        if (marcaExistente) {
            return [null, createErrorMessage(null, "La marca ya existe")];
        }

        const newMarca = marcaRepository.create({
            nombre
        });
        const marcaGuardada = await marcaRepository.save(newMarca);
        return [marcaGuardada, null];

    } catch (error) {
        console.error("Error al crear la marca:", error);
        return [null, "Error interno del servidor"];
    }
}

export async function getMarcasService() {
    try {
        const marcaRepository = AppDataSource.getRepository(Marca);
        const marcas = await marcaRepository.find();
        if (!marcas || marcas.length === 0) return [null, "No hay marcas"];
        return [marcas, null];
    } catch (error) {
        console.error("Error al obtener las marcas:", error);
        return [null, "Error interno del servidor"];
    }
}

export async function getMarcaNombreService(nombre) {
    try {
        const marcaRepository = AppDataSource.getRepository(Marca);
        const marca = await marcaRepository.findOne({
            where: { nombre },
        });
        if (!marca) return [null, "Marca no encontrada"];
        return [marca, null];
    } catch (error) {
        console.error("Error al obtener la marca:", error);
        return [null, "Error interno del servidor"];
    }
}

export async function getMarcaIdService(id_marca) {
    try {
        const marcaRepository = AppDataSource.getRepository(Marca);
        const marca = await marcaRepository.findOne({
            where: { id_marca },
        });
        if (!marca) return [null, "Marca no encontrada"];
        return [marca, null];
    } catch (error) {
        console.error("Error al obtener la marca:", error);
        return [null, "Error interno del servidor"];
    }
}

export async function deleteMarcaService(id_marca) {
    try {
        const marcaRepository = AppDataSource.getRepository(Marca);
        const marca = await marcaRepository.findOne({
            where: { id_marca },
        });
        if (!marca) return [null, "Marca no encontrada"];



        await marcaRepository.remove(marca);
        return [marca, null];
    } catch (error) {
        console.error("Error al eliminar la marca:", error);
        return [null, "Error interno del servidor"];
    }
}

export async function updateMarcaService(id_marca, marcaData) {
    try {
        const marcaRepository = AppDataSource.getRepository(Marca);
        const { nombre } = marcaData;
        const marca = await marcaRepository.findOne({
            where: { id_marca },
        });

        if (!marca) return [null, "Marca no encontrada"];
        marca.nombre = nombre;
        const marcaGuardada = await marcaRepository.save(marca);
        return [marcaGuardada, null];
        
    } catch (error) {
        console.error("Error al actualizar la marca:", error);
        return [null, "Error interno del servidor"];
    }
}

