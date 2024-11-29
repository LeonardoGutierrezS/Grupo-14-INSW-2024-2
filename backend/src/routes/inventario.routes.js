"use strict";

import { Router } from "express";
import {
    crearInventario,
    getInventarioById,
    getInventarioTotal,
    getInventarioBynombreDeMarca,
    deleteInventario,

} from "../controllers/inventario.controller.js";

import { isAdmin } from "../middlewares/authorization.middleware.js";

import {authenticateJwt} from "../middlewares/authentication.middleware.js";


const router = Router();

router.
post("/crearInventario", authenticateJwt, isAdmin, crearInventario)                                   //  http://localhost:3000/api/inventario/crearInventario  POST
.get("/getInventarioTotal", getInventarioTotal)                             //  http://localhost:3000/api/inventario/getInventarioTotal  GET
.get("/getInventarioById/:id", getInventarioById)                           //  http://localhost:3000/api/inventario/getInventarioById/:id
.get("/getInventarioBynombreDeMarca/:nombre", getInventarioBynombreDeMarca) //  http://localhost:3000/api/inventario/getInventarioBynombreDeMarca/:nombre
.delete("/deleteInventario/:id", authenticateJwt, isAdmin, deleteInventario);                         //  http://localhost:3000/api/inventario/deleteInventario/:id


export default router;