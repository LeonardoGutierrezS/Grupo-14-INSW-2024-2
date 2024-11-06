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
    marca: Joi.string()
    .min(2)
    .max(100)
    .pattern(new RegExp("^[a-zA-Z0-9 ]+$"))
    .required()
    .messages({
        "string.base": "La marca debe ser de tipo texto.",
        "string.empty": "La marca no debe estar vacía.",
        "string.min": "La marca debe tener al menos {#limit} caracteres.",
        "string.max": "La marca debe tener como máximo {#limit} caracteres.",
        "string.pattern.base": "La marca solo debe contener letras y números."
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
    .required(),
    precio: Joi.number().required(),
    descripcion: Joi.string().required()
});