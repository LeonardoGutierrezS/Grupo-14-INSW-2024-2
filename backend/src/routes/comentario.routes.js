"use strict";
import express from "express";
import { crearComentario, obtenerComentarios } from "../controllers/comentario.controller.js";
import { actualizarComentario, eliminarComentario } from "../controllers/comentario.controller.js";
import { isAdmin, isMechanic } from "../middlewares/authorization.middleware.js";

const router = express.Router();

router.post("/crear", isAdmin, isMechanic, crearComentario);
router.get("/:id_tarea", isAdmin, isMechanic, obtenerComentarios);
router.put("/:id_com", isAdmin, isMechanic, actualizarComentario);
router.delete("/:id_com", isAdmin, eliminarComentario);

export default router;