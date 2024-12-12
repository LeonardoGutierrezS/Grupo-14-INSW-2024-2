"use strict";

import { Router } from "express";

import {
    crearCategoria,
    getCategorias,
    getCategoriaNombre,
    getCategoriaId,
    deleteCategoria,
    updateCategoria

} from '../controllers/categoria.controller.js';

import { isAdmin } from "../middlewares/authorization.middleware.js";

import {authenticateJwt} from "../middlewares/authentication.middleware.js";

const router = Router();

router.post("/crearCategoria", authenticateJwt, isAdmin, crearCategoria); // http://localhost:3000/api/marca/crearMarca  POST
router.get("/getCategorias", getCategorias); // http://localhost:3000/api/marca/getMarcas  GET
router.get("/getCategoriaNombre/:nombre", getCategoriaNombre); 
router.get("/getCategoriaId/:id", getCategoriaId); 
router.delete("/deleteCategoria/:id", authenticateJwt, isAdmin ,deleteCategoria); 
router.patch("/updateCategoria/:id", updateCategoria); 


export default router;