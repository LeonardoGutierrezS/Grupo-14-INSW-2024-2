"use strict";
import Joi from "joi";

const comentarioValidationSchema = Joi.object({
  comentario: Joi.string().max(500).required().messages({
    "string.base": "El comentario debe ser un texto",
    "string.empty": "El comentario no puede estar vacío",
    "string.max": "El comentario no puede tener más de 500 caracteres",
    "any.required": "El comentario es obligatorio",
  }),
  tarea_id: Joi.number().integer().required().messages({
    "number.base": "El ID de la tarea debe ser un número entero",
    "any.required": "El ID de la tarea es obligatorio",
  }),
});

export const validateComentario = (data) => {
  const { error } = comentarioValidationSchema.validate(data, { abortEarly: false });
  return error ? error.details : null;
};