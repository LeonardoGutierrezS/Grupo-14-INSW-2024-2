"use strict";
import { Router } from "express";
import userRoutes from "./user.routes.js";
import authRoutes from "./auth.routes.js";
import biciRoutes from "./ingresoBicicleta.routes.js";

import inventarioRoutes from "./inventario.routes.js";
import marcaRoutes from "./marca.routes.js";
import categoriaRoutes from "./categoria.routes.js";

import comentarioRoutes from "./comentario.routes.js";
import tareasRoutes from "./tareas.routes.js";


const router = Router();

router
    .use("/auth", authRoutes)
    .use("/user", userRoutes)


    .use("/inventario", inventarioRoutes)
    .use("/marca", marcaRoutes)
    .use("/categoria", categoriaRoutes)

    .use("/comentario", comentarioRoutes)
    .use("/tareas", tareasRoutes)
    .use("/bicicleta", biciRoutes);


export default router;