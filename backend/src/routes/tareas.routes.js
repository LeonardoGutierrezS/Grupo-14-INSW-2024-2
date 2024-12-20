"use strict"
import express from "express";
import { actualizarEstado, crearTarea } from "../controllers/tareas.controller.js";
import { eliminarTarea, obtenerTodasTareas } from "../controllers/tareas.controller.js"

const router = express.Router();

router.post("/crear", crearTarea);
router.get("/", obtenerTodasTareas);
router.patch("/estado/:id_tarea", actualizarEstado);
router.delete("/eliminar/:id_tarea", eliminarTarea)

export default router;