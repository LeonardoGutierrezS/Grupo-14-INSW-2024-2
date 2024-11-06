"use strict";

import { Router } from "express";
import {
    crearInventario,
    getInventarioById,
    getInventarioTotal

} from "../controllers/inventario.controller.js";



const router = Router();

router.
post("/crearInventario", crearInventario)           //  http://localhost:3000/api/inventario/crearInventario  POST
.get("/getInventarioTotal", getInventarioTotal)     //  http://localhost:3000/api/inventario/getInventarioTotal  GET
.get("/getInventarioById/:id", getInventarioById);  //  http://localhost:3000/api/inventario/getInventarioById/:id


export default router;