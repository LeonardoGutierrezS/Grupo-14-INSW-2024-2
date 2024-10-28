"use strict";
import { registerCheckIn, registerCheckOut } from "../controllers/work_hours.controller.js";

import { Router } from "express";
import { isAdmin } from "../middlewares/authorization.middleware.js";
import { authenticateJwt } from "../middlewares/authentication.middleware.js";
import {
  deleteUser,
  getUser,
  getUsers,
  registerEmployee,
  updateUser,
  
} from "../controllers/user.controller.js";

const router = Router();

router
  .use(authenticateJwt)
  //.use(isAdmin); comente esto pq no me funcionaba el registro de hora :/

router
  .get("/", getUsers)
  .get("/detail/", getUser)
  .patch("/detail/", updateUser)
  .delete("/detail/", deleteUser)
  .post("/register-employee", isAdmin, registerEmployee)
  .post("/check-in", registerCheckIn)
  .post("/check-out", registerCheckOut);

export default router;