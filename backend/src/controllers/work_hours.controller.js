"use strict";
import { getEmployeeWorkHoursService,
  registerCheckInService, 
  registerCheckOutService, 
  updateCheckTimeService,
 } from "../services/work_hours.service.js";
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



export async function updateCheckTime(req, res) {
  const { id } = req.params;
  const { check_in, check_out } = req.body;

  try {
    const [updatedRecord, error] = await updateCheckTimeService(id, check_in, check_out);

    if (error) {
      return res.status(400).json({
        status: "Client error",
        message: error,
      });
    }

    return res.status(200).json({
      status: "Success",
      message: "Hora de entrada y salida actualizada correctamente",
      data: updatedRecord,
    });
  } catch (error) {
    console.error("Error al actualizar la hora de entrada/salida:", error);
    return res.status(500).json({
      status: "Server error",
      message: "Error interno del servidor al actualizar el tiempo de turno",
    });
  }
}

export async function getEmployeeWorkHours(req, res) {
  try {
    let { userId } = req.params; // ID del usuario que queremos consultar
    const authenticatedUserId = req.user.id; // ID del usuario autenticado
    const userRole = req.user.rol; // Rol del usuario autenticado

    // Si el usuario es un mecanico le asigno su propio ID como userId
    if (userRole === "mecanico") {
      userId = authenticatedUserId;
    }

    // Si el usuario no es administrador y el userId es diferente del autenticado, no tiene permiso
    if (userRole !== "administrador" && parseInt(userId) !== authenticatedUserId) {
      return res.status(403).json({
        status: "Client error",
        message: "No tienes permiso para acceder a los turnos de otro usuario",
      });
    }

    const [workHoursData, error] = await getEmployeeWorkHoursService(userId);
    
    if (error) {
      return res.status(500).json({ status: "Server error", message: error });
    }

    res.status(200).json({
      status: "Success",
      message: "Turnos obtenidos exitosamente",
      data: workHoursData,
    });
  } catch (error) {
    console.error("Error al obtener los turnos del empleado:", error);
    res.status(500).json({ status: "Server error", message: "Error interno del servidor" });
  }
}
