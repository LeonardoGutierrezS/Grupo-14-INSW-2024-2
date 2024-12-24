"use strict"
import express from "express";
import { actualizarEstado, crearTarea } from "../controllers/tareas.controller.js";
import { eliminarTarea, obtenerTodasTareas } from "../controllers/tareas.controller.js";
import { isAdmin , isMechanic } from "../middlewares/authorization.middleware.js";
import { authenticateJwt } from "../middlewares/authentication.middleware.js";

const router = express.Router();

router.use(authenticateJwt)

router.post("/crear", isAdmin, crearTarea);
router.get("/", obtenerTodasTareas);
router.patch("/estado/:id_tarea", actualizarEstado);
router.delete("/eliminar/:id_tarea", isAdmin, eliminarTarea)

export default router;