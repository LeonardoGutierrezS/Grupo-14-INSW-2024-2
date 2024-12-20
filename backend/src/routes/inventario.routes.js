"use strict";

import { Router } from "express";
import {
    crearInventario,
    getInventarioById,
    getInventarioTotal,
    getInventarioBynombreDeMarca,
    getInventarioBynombreDeCategoria,
    getInventarioBynombreDeTipo,
    deleteInventario,
    updateInventario,
    updateInventarioCantidad,

} from "../controllers/inventario.controller.js";

import { isAdmin, isMechanic } from "../middlewares/authorization.middleware.js";

import {authenticateJwt} from "../middlewares/authentication.middleware.js";


const router = Router();

router.
post("/crearInventario", authenticateJwt, isAdmin, crearInventario)                         //  http://localhost:3000/api/inventario/crearInventario  POST
.get("/getInventarioTotal", getInventarioTotal)                                             //  http://localhost:3000/api/inventario/getInventarioTotal  GET
.get("/getInventarioById/:id", getInventarioById)                                           //  http://localhost:3000/api/inventario/getInventarioById/:id
.get("/getInventarioBynombreDeMarca/:nombre", getInventarioBynombreDeMarca)                 //  http://localhost:3000/api/inventario/getInventarioBynombreDeMarca/:nombre
.get("/getInventarioBynombreDeCategoria/:nombre", getInventarioBynombreDeCategoria)         //  http://localhost:3000/api/inventario/getInventarioBynombreDeCategoria/:nombre
.get("/getInventarioBynombreDeTipo/:nombre", getInventarioBynombreDeTipo)                   //  http://localhost:3000/api/inventario/getInventarioBynombreDeTipo/:nombre
.delete("/deleteInventario/:id", authenticateJwt, isAdmin, deleteInventario)                //  http://localhost:3000/api/inventario/deleteInventario/:id
.put("/updateInventario/:id", authenticateJwt, isAdmin, updateInventario)                   //  http://localhost:3000/api/inventario/updateInventario/:id
.put("/updateInventarioCantidad/:id", authenticateJwt, isAdmin, updateInventarioCantidad);  //  http://localhost:3000/api/inventario/updateInventarioCantidad/:id



export default router;