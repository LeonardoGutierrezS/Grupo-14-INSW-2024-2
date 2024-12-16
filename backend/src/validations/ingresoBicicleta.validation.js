"use strict";
import Joi from "joi";

const domainEmailValidator = (value, helper) => {
  if (!value.endsWith("@gmail.com")) {
    return helper.message(
      "El correo electrónico debe ser del dominio @gmail.com"
    );
  }
  return value;
};

// Esquema de validación para Bicicleta
const bicicletaValidationSchema = Joi.object({
  marca: Joi.string().max(15).required().messages({
    "string.base": "La marca debe ser un texto",
    "string.empty": "La marca no puede estar vacía",
    "any.required": "La marca es obligatoria",
  }),
  modelo: Joi.string().max(15).required().messages({
    "string.empty": "El modelo no puede estar vacío",
    "any.required": "El modelo es obligatorio",
  }),
  color: Joi.string().max(15).required().messages({
    "string.base": "El color debe ser un texto",
    "string.empty": "El color no puede estar vacío",
    "any.required": "El color es obligatorio",
  }),
});

// Esquema de validación para Cliente
const clienteValidationSchema = Joi.object({
  rut: Joi.string()
  .min(9)
  .max(12)
  .pattern(/^(?:(?:[1-9]\d{0}|[1-2]\d{1})(\.\d{3}){2}|[1-9]\d{6}|[1-2]\d{7}|29\.999\.999|29999999)-[\dkK]$/)
  .messages({
    "string.empty": "El rut no puede estar vacío.",
      "string.base": "El rut debe ser de tipo string.",
      "string.min": "El rut debe tener como mínimo 9 caracteres.",
      "string.max": "El rut debe tener como máximo 12 caracteres.",
      "string.pattern.base": "Formato rut inválido, debe ser xx.xxx.xxx-x o xxxxxxxx-x.",
  }),
  nombre: Joi.string().min(15)
  .max(50)
  .pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/)
  .messages({
    "string.empty": "El nombre completo no puede estar vacío.",
    "string.base": "El nombre completo debe ser de tipo string.",
    "string.min": "El nombre completo debe tener como mínimo 15 caracteres.",
    "string.max": "El nombre completo debe tener como máximo 50 caracteres.",
    "string.pattern.base":
      "El nombre completo solo puede contener letras y espacios.",
  }),
  whatsapp: Joi.string().pattern(/^\+569\d{8}$/)
  .required()
  .messages({
    "string.base": "El WhatsApp debe ser un texto.",
    "string.empty": "El WhatsApp no puede estar vacío.",
    "string.pattern.base": "El WhatsApp debe comenzar con +569 seguido de 8 números, sin espacios.",
    "any.required": "El WhatsApp es obligatorio.",
  }),
  correo: Joi.string()
  .min(15)
  .max(35)
  .email()
  .messages({
    "string.empty": "El correo electrónico no puede estar vacío.",
      "string.base": "El correo electrónico debe ser de tipo string.",
      "string.email": "El correo electrónico debe finalizar en @gmail.com.",
      "string.min":
        "El correo electrónico debe tener como mínimo 15 caracteres.",
      "string.max":
        "El correo electrónico debe tener como máximo 35 caracteres.",
  })
  .custom(domainEmailValidator, "Validación dominio email"),
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
  //fecha_est_entrega: Joi.date().allow(null).messages({
    //"date.base": "La fecha estimada de entrega debe ser una fecha válida",
 // }),
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
