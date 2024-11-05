"use strict";
import { Router } from "express";
import userRoutes from "./user.routes.js";
import authRoutes from "./auth.routes.js";
import biciRoutes from "./ingresoBicicleta.routes.js";
import inventarioRoutes from "./inventario.routes.js";

const router = Router();

router
    .use("/auth", authRoutes)
    .use("/user", userRoutes)
    .use("/bicicleta", biciRoutes)
    .use("/inventario", inventarioRoutes);
export default router;