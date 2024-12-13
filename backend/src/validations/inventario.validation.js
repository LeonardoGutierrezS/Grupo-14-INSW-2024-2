"use strict";
import Joi from "joi";

export const inventarioBodyValidation = Joi.object({
    nombre: Joi.string()
    .min(3)
    .max(100)
    .pattern(new RegExp("^[a-zA-Z0-9 ]+$"))
    .required()
    .messages({
        "string.base": "El nombre debe ser de tipo texto.",
        "string.empty": "El nombre no debe estar vacío.",
        "string.min": "El nombre debe tener al menos {#limit} caracteres.",
        "string.max": "El nombre debe tener como máximo {#limit} caracteres.",
        "string.pattern.base": "El nombre solo debe contener letras y números."
    }),
    tipo_objeto: Joi.string()
    .min(3)
    .max(100)
    .pattern(new RegExp("^[a-zA-Z0-9 ]+$"))
    .required()
    .messages({
        "string.base": "El tipo de objeto debe ser de tipo texto.",
        "string.empty": "El tipo de objeto no debe estar vacío.",
        "string.min": "El tipo de objeto debe tener al menos {#limit} caracteres.",
        "string.max": "El tipo de objeto debe tener como máximo {#limit} caracteres.",
        "string.pattern.base": "El tipo de objeto solo debe contener letras y números."
    }),
    cantidad: Joi.number()
    .min(1)
    .max(999999)
    .required(),
    precio: Joi.number()
    .min(1)
    .max(999999)
    .required(),
    descripcion: Joi.string()
    .min(3)
    .max(1000)
    .pattern(new RegExp("^[a-zA-Z0-9 ]+$"))
    .required()
    .messages({
        "string.base": "La descripción debe ser de tipo texto.",
        "string.empty": "La descripción no debe estar vacía.",
        "string.min": "La descripción debe tener al menos {#limit} caracteres.",
        "string.max": "La descripción debe tener como máximo {#limit} caracteres.",
        "string.pattern.base": "La descripción solo debe contener letras y números."
    }),
    id_marca: Joi.number()
    .required(),
    id_categoria: Joi.number()
    .required()


});