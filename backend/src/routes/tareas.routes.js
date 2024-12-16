"use strict"
import express from "express";
import { isAdmin, isMechanic } from "../middlewares/authorization.middleware.js";
import { actualizarEstado, crearTarea } from "../controllers/tareas.controller.js";
import { eliminarTarea, obtenerTodasTareas } from "../controllers/tareas.controller.js"

const router = express.Router();

router.post("/crear", isAdmin, crearTarea);
router.get("/", obtenerTodasTareas);
router.patch("/estado/:id_tarea", isAdmin, isMechanic, actualizarEstado);
router.delete("/eliminar/:id_tarea", isAdmin, eliminarTarea)

export default router;