"use strict";

import { Router } from "express";

import {
    crearMarca,
    getMarcas,
    getMarcaNombre,
    getMarcaId,
    deleteMarca,
    updateMarca

} from '../controllers/marca.controller.js';

import { isAdmin } from "../middlewares/authorization.middleware.js";

import {authenticateJwt} from "../middlewares/authentication.middleware.js";

const router = Router();

router.post("/crearMarca", authenticateJwt, isAdmin, crearMarca);               // http://localhost:3000/api/marca/crearMarca  POST
router.get("/getMarcas", getMarcas);                                            // http://localhost:3000/api/marca/getMarcas  GET
router.get("/getMarcaNombre/:nombre", getMarcaNombre);                          // http://localhost:3000/api/marca/getMarcaNombre/(:nombre)  GET
router.get("/getMarcaId/:id", getMarcaId);                                      // http://localhost:3000/api/marca/getMarcaId/(:id)  GET
router.delete("/deleteMarca/:id", authenticateJwt, isAdmin ,deleteMarca);       // http://localhost:3000/api/marca/deleteMarca/(:id)  DELETE
router.put("/updateMarca/:id", updateMarca);                                    // http://localhost:3000/api/marca/updateMarca/(:id)  PATCH


export default router;