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

router.post("/crearCategoria", authenticateJwt, isAdmin, crearCategoria);           // http://localhost:3000/api/categoria/crearCategoria  POST
router.get("/getCategorias", getCategorias);                                        // http://localhost:3000/api/categoria/getCategorias  GET
router.get("/getCategoriaNombre/:nombre", getCategoriaNombre);                      // http://localhost:3000/api/categoria/getCategoriaNombre/:nombre
router.get("/getCategoriaId/:id", getCategoriaId);                                  // http://localhost:3000/api/categoria/getCategoriaId/:id
router.delete("/deleteCategoria/:id", authenticateJwt, isAdmin ,deleteCategoria);   // http://localhost:3000/api/categoria/deleteCategoria/:id
router.patch("/updateCategoria/:id", updateCategoria);                              // http://localhost:3000/api/categoria/updateCategoria/:id


export default router;