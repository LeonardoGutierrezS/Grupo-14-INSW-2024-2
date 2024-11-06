"use strict";
import { Router } from "express";
import {
  createIngresoBicicleta,
  deleteIngresoBicicleta,
  getAllIngresos,
  updateIngresoBicicleta,
} from "../controllers/ingresoBicicleta.controller.js";
import { authenticateJwt } from "../middlewares/authentication.middleware.js";
import { isAdmin } from "../middlewares/authorization.middleware.js";

const router = Router();

// Aplicar middlewares `authenticateJwt` y `isAdmin` a todas las rutas de IngresoBicicleta
router.use(authenticateJwt).use(isAdmin);

// Ruta para crear un nuevo ingreso de bicicleta (POST)
router.post("/", createIngresoBicicleta);

// Ruta para obtener todos los ingresos (GET)
router.get("/", getAllIngresos);

// Ruta para actualizar un ingreso de bicicleta (PUT)
router.put("/:id", updateIngresoBicicleta);

// Ruta para eliminar un ingreso de bicicleta (DELETE)
router.delete("/:id", deleteIngresoBicicleta);

export default router;