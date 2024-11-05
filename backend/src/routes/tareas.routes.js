"use strict"
import express from "express";
import { actualizarEstado, asignarTarea, crearTarea, obtenerTodasTareas  } from "../controllers/tareas.controller.js";

const router = express.Router();

router.post("/crear", crearTarea);
router.post("/asignar", asignarTarea);
router.get("/", obtenerTodasTareas);
router.put("/estado/:id", actualizarEstado);

export default router;