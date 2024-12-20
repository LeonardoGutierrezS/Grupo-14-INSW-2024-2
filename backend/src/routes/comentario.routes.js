import express from "express";
import { actualizarComentario, crearComentario } from "../controllers/comentario.controller.js";
import { eliminarComentario, obtenerComentarios } from "../controllers/comentario.controller.js";

const router = express.Router();

router.get("/", obtenerComentarios);
router.post("/addcomentario", crearComentario);
router.put("/:id_com", actualizarComentario);
router.delete("/eliminar/:id_com", eliminarComentario);

export default router;
