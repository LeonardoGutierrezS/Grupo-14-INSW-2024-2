import express from "express";
import { actualizarComentario, crearComentario } from "../controllers/comentario.controller.js";
import { eliminarComentario, obtenerComentarios } from "../controllers/comentario.controller.js";
import { isAdmin , isMechanic } from "../middlewares/authorization.middleware.js";
import { authenticateJwt } from "../middlewares/authentication.middleware.js";

const router = express.Router();

router.use(authenticateJwt);

router.get("/", obtenerComentarios);
router.post("/addcomentario", crearComentario);
router.put("/:id_com", actualizarComentario);
router.delete("/eliminar/:id_com", isAdmin, eliminarComentario);

export default router;
