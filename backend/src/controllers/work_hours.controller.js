"use strict";
import { registerCheckInService, registerCheckOutService } from "../services/work_hours.service.js";
import { handleErrorClient, handleErrorServer, handleSuccess } from "../handlers/responseHandlers.js";

export async function registerCheckIn(req, res) {
  try {
    
    const userId = req.user.id;
    const checkIn = new Date();

    const [workHour, error] = await registerCheckInService(userId, checkIn);
    if (error) return handleErrorClient(res, 400, "Error al registrar la hora de entrada", error);

    handleSuccess(res, 201, "Hora de entrada registrada exitosamente", workHour);
  } catch (error) {
    handleErrorServer(res, 500, error.message);
  }
}

export async function registerCheckOut(req, res) {
  try {
    const userId = req.user.id;
    const checkOut = new Date();

    const [workHour, error] = await registerCheckOutService(userId, checkOut);
    if (error) return handleErrorClient(res, 400, "Error al registrar la hora de salida", error);

    handleSuccess(res, 200, "Hora de salida registrada exitosamente", workHour);
  } catch (error) {
    handleErrorServer(res, 500, error.message);
  }
}
