"use strict";
import Joi from "joi";

// Esquema de validación para Tarea
const tareaValidationSchema = Joi.object({
  detalle: Joi.string().max(1000).required().messages({
    "string.base": "El detalle debe ser un texto",
    "string.empty": "El detalle no puede estar vacío",
    "string.max": "El detalle no puede tener más de 1000 caracteres",
    "any.required": "El detalle es obligatorio",
  }),
  prioridad: Joi.string().valid("baja", "media", "alta").required().messages({
    "string.base": "La prioridad debe ser un texto",
    "any.only": "La prioridad debe ser 'baja', 'media' o 'alta'",
    "any.required": "La prioridad es obligatoria",
  }),
  id: Joi.number().integer().required().messages({
    "number.base": "El ID del usuario debe ser un número entero",
    "any.required": "El ID del usuario es obligatorio",
  }),
  estado: Joi.string().valid("pendiente", "en proceso", "terminado").optional().messages({
    "string.base": "El estado debe ser un texto",
    "any.only": "El estado debe ser 'pendiente', 'en proceso' o 'terminado'",
  }),
});

export const validateTarea = (data) => {
  const { error } = tareaValidationSchema.validate(data, { abortEarly: false });
  return error ? error.details : null;
};