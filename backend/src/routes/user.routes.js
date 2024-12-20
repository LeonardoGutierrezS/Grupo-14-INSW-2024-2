"use strict";
import { getEmployeeWorkHours,
  registerCheckIn, 
  registerCheckOut, 
  updateCheckTime } from "../controllers/work_hours.controller.js";
import { Router } from "express";
import { isAdmin , isMechanic, isSeller } from "../middlewares/authorization.middleware.js";
import { checkActive } from "../middlewares/active.middleware.js";
import { authenticateJwt } from "../middlewares/authentication.middleware.js";
import {
  approvePayment,
  changePassword,
  deleteUser,
  getPaymentHistoryController,
  getUser,
  getUsers,
  registerEmployee,
  registerSeller,
  updateEmployeeStatus,
  updateUser,
  
} from "../controllers/user.controller.js";

const router = Router();

router
  .use(authenticateJwt)


router
  .get("/", getUsers)
  .get("/detail/", getUser)
  .patch("/detail/", updateUser)
  .delete("/detail/", deleteUser)
  .post("/register-mechanic", isAdmin, registerEmployee)
  .post("/register-seller", isAdmin, registerSeller)
  .post("/check-in",  checkActive,registerCheckIn)
  .post("/check-out", checkActive, registerCheckOut)
  .patch("/update-check-time/:id", isAdmin, updateCheckTime)
  .get("/work-hours", checkActive, getEmployeeWorkHours)
  .get("/work-hours/:userId", isAdmin, getEmployeeWorkHours)
  .patch("/approve-payment/:userId", isAdmin, approvePayment)
  .patch("/update-status/:userId", isAdmin, updateEmployeeStatus)
  .get("/payment-history/:userId", isAdmin, getPaymentHistoryController)
  .patch("/change-password", changePassword);
  
export default router;