"use strict";
import Joi from "joi";

export const inventarioBodyValidation = Joi.object({
    nombre: Joi.string()
    .min(3)
    .max(100)
    .pattern(/^[A-ZÁÉÍÓÚÑ0-9]+(?:\s[A-ZÁÉÍÓÚÑ0-9]+)*$/)
    .required()
    .messages({
      "string.empty": "El nombre no puede estar vacío.",
      "string.base": "El nombre debe ser de tipo string.",
      "string.min": "El nombre debe tener como mínimo 3 caracteres.",
      "string.max": "El nombre debe tener como máximo 100 caracteres.",
      "string.pattern.base":
        "El nombre solo puede contener letras mayúsculas, números y un solo espacio entre palabras.",
    }),
    cantidad: Joi.number()
    .integer()
    .min(0)    
    .max(999999) 
    .required()
    .messages({
        "number.base": "La cantidad debe ser de tipo numérico.",
        "number.empty": "La cantidad no debe estar vacía.",
        "number.min": "La cantidad debe ser mayor o igual a 0.",
        "number.max": "La cantidad debe ser menor o igual a 999999."
    }), 

    precio: Joi.number()
    .integer() 
    .min(0)    
    .max(9999999) 
    .required()
    .messages({
        "number.base": "El precio debe ser de tipo numérico.",
        "number.empty": "El precio no debe estar vacío.",
        "number.min": "El precio debe ser mayor o igual a 0.",
        "number.max": "El precio debe ser menor o igual a 9999999."
    }),

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
    .required(),

    id_tipo: Joi.number()
    .required()    


});