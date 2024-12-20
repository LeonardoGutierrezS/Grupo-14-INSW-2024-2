"use strict";
import Joi from "joi";

const comentarioValidationSchema = Joi.object({
  comentario: Joi.string().max(500).required().messages({
    "string.base": "El comentario debe ser un texto",
    "string.empty": "El comentario no puede estar vacío",
    "string.max": "El comentario no puede tener más de 500 caracteres",
    "any.required": "El comentario es obligatorio",
  }),
});

export const validateComentario = (data) => {
  const { error } = comentarioValidationSchema.validate(data, { abortEarly: false });
  return error ? error.details : null;
};