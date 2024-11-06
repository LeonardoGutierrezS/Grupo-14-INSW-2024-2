"use strict";
import express from "express";
import { crearComentario, obtenerComentarios } from "../controllers/comentario.controller.js";

const router = express.Router();

router.post("/", crearComentario);
router.get("/:tarea_id", obtenerComentarios);

export default router;