"use strict";
import Joi from "joi";

// Validación para crear un comentario (requiere id_tarea)
const comentarioCreateValidationSchema = Joi.object({
  comentario: Joi.string().max(500).required().messages({
    "string.base": "El comentario debe ser un texto",
    "string.empty": "El comentario no puede estar vacío",
    "string.max": "El comentario no puede tener más de 500 caracteres",
    "any.required": "El comentario es obligatorio",
  }),
  id_tarea: Joi.number().integer().required().messages({
    "number.base": "El ID de la tarea debe ser un número",
    "any.required": "El ID de la tarea es obligatorio",
  }),
});

// Validación para actualizar un comentario (no requiere id_tarea)
const comentarioUpdateValidationSchema = Joi.object({
  comentario: Joi.string().max(500).required().messages({
    "string.base": "El comentario debe ser un texto",
    "string.empty": "El comentario no puede estar vacío",
    "string.max": "El comentario no puede tener más de 500 caracteres",
    "any.required": "El comentario es obligatorio",
  }),
});

// Función para validar la creación de un comentario
export const validateCreateComentario = (data) => {
  const { error } = comentarioCreateValidationSchema.validate(data, { abortEarly: false });
  return error ? error.details : null;
};

// Función para validar la actualización de un comentario
export const validateUpdateComentario = (data) => {
  const { error } = comentarioUpdateValidationSchema.validate(data, { abortEarly: false });
  return error ? error.details : null;
};
