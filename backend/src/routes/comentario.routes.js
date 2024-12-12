"use strict";
import express from "express";
import { crearComentario, obtenerComentarios } from "../controllers/comentario.controller.js";
import { actualizarComentario, eliminarComentario } from "../controllers/comentario.controller.js";

const router = express.Router();

router.post("/crear", crearComentario);
router.get("/:id_tarea", obtenerComentarios);
router.put("/:id_com", actualizarComentario);
router.delete("/:id_com", eliminarComentario);

export default router;