"use strict";

import { Router } from "express";

import {
    crearTipo,
    getTipos,
    getTipoNombre,
    getTipoId,
    deleteTipo,
    updateTipo

} from '../controllers/tipo.controller.js';

import { isAdmin } from "../middlewares/authorization.middleware.js";

import {authenticateJwt} from "../middlewares/authentication.middleware.js";

const router = Router();

router.post("/crearTipo", authenticateJwt, isAdmin, crearTipo);         // http://localhost:3000/api/tipo/crearTipo  POST
router.get("/getTipos", getTipos);                                      // http://localhost:3000/api/tipo/getTipos  GET
router.get("/getTipoNombre/:nombre", getTipoNombre);                    // http://localhost:3000/api/tipo/getTipoNombre/(:nombre)  GET
router.get("/getTipoId/:id", getTipoId);                                // http://localhost:3000/api/tipo/getTipoId/(:id)  GET
router.delete("/deleteTipo/:id", authenticateJwt, isAdmin ,deleteTipo); // http://localhost:3000/api/tipo/deleteTipo/(:id)  DELETE
router.put("/updateTipo/:id", authenticateJwt, isAdmin ,updateTipo);                            // http://localhost:3000/api/tipo/updateTipo/(:id)  PATCH

export default router;