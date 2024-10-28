"use strict";
import Joi from "joi";

// Esquema de validación para Bicicleta
const bicicletaValidationSchema = Joi.object({
  marca: Joi.string().max(255).required().messages({
    "string.base": "La marca debe ser un texto",
    "string.empty": "La marca no puede estar vacía",
    "any.required": "La marca es obligatoria",
  }),
  modelo: Joi.string().max(255).required().messages({
    "string.base": "El modelo debe ser un texto",
    "string.empty": "El modelo no puede estar vacío",
    "any.required": "El modelo es obligatorio",
  }),
  color: Joi.string().max(50).required().messages({
    "string.base": "El color debe ser un texto",
    "string.empty": "El color no puede estar vacío",
    "any.required": "El color es obligatorio",
  }),
});

// Esquema de validación para Cliente
const clienteValidationSchema = Joi.object({
  rut: Joi.string().length(12).required().messages({
    "string.base": "El RUT debe ser un texto",
    "string.length": "El RUT debe tener exactamente 12 caracteres",
    "any.required": "El RUT es obligatorio",
  }),
  nombre: Joi.string().max(255).required().messages({
    "string.base": "El nombre debe ser un texto",
    "string.empty": "El nombre no puede estar vacío",
    "any.required": "El nombre es obligatorio",
  }),
  whatsapp: Joi.string().max(20).required().messages({
    "string.base": "El WhatsApp debe ser un texto",
    "string.empty": "El WhatsApp no puede estar vacío",
    "any.required": "El WhatsApp es obligatorio",
  }),
  correo: Joi.string().email().required().messages({
    "string.base": "El correo debe ser un texto",
    "string.email": "El correo debe ser un correo electrónico válido",
    "any.required": "El correo es obligatorio",
  }),
});

// Esquema de validación para Reparación
const reparacionValidationSchema = Joi.object({
  tipo_trabajo: Joi.string().max(255).required().messages({
    "string.base": "El tipo de trabajo debe ser un texto",
    "string.empty": "El tipo de trabajo no puede estar vacío",
    "any.required": "El tipo de trabajo es obligatorio",
  }),
  detalle_trabajo: Joi.string().allow(null, "").messages({
    "string.base": "El detalle del trabajo debe ser un texto",
  }),
  obs_bici: Joi.string().allow(null, "").messages({
    "string.base": "Las observaciones de la bicicleta deben ser un texto",
  }),
  repuestos: Joi.string().allow(null, "").messages({
    "string.base": "Los repuestos deben ser un texto",
  }),
  fecha_ingreso: Joi.date().required().messages({
    "date.base": "La fecha de ingreso debe ser una fecha válida",
    "any.required": "La fecha de ingreso es obligatoria",
  }),
  fecha_est_entrega: Joi.date().allow(null).messages({
    "date.base": "La fecha estimada de entrega debe ser una fecha válida",
  }),
  fecha_entrega: Joi.date().allow(null).messages({
    "date.base": "La fecha de entrega debe ser una fecha válida",
  }),
  precio: Joi.number().precision(2).required().messages({
    "number.base": "El precio debe ser un número",
    "any.required": "El precio es obligatorio",
  }),
  estado: Joi.string().max(50).required().messages({
    "string.base": "El estado debe ser un texto",
    "string.empty": "El estado no puede estar vacío",
    "any.required": "El estado es obligatorio",
  }),
});

// Validación para el ingreso completo de una bicicleta
export const validateIngresoBicicleta = (data) => {
  const bicicletaValidation = bicicletaValidationSchema.validate(data.bicicleta, { abortEarly: false });
  const clienteValidation = clienteValidationSchema.validate(data.cliente, { abortEarly: false });
  const reparacionValidation = reparacionValidationSchema.validate(data.reparacion, { abortEarly: false });

  // Unir los errores si existen
  const errors = {
    bicicletaErrors: bicicletaValidation.error ? bicicletaValidation.error.details : null,
    clienteErrors: clienteValidation.error ? clienteValidation.error.details : null,
    reparacionErrors: reparacionValidation.error ? reparacionValidation.error.details : null,
  };

  return errors;
};
