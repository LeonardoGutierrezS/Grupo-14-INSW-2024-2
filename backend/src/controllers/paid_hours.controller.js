"use strict";
import { registerPaidHoursService } from "../services/paid_hours.service.js";
import { handleErrorClient, handleErrorServer, handleSuccess } from "../handlers/responseHandlers.js";


export async function registerPaidHours(req, res) {
  try {
    const { userId } = req.params; // ID del empleado para el que se registrarán las horas pagadas
    const { paymentType } = req.body; // Tipo de pago: diario, semanal, mensual
    const approvedById = req.user.id; // ID del admin que aprueba el pago
    const userRole = req.user.rol;

    // Verificar que el usuario autenticado sea un admin
    if (userRole !== "administrador") {
      return handleErrorClient(res, 403, "No tienes permiso para aprobar pagos de horas trabajadas");
    }

    // Validar el tipo de pago
    if (!["diario", "semanal", "mensual"].includes(paymentType)) {
      return handleErrorClient(res, 400, "Tipo de pago inválido. Debe ser 'diario', 'semanal' o 'mensual'");
    }

    // Llamar al servicio para registrar el pago
    const [paidRecord, error] = await registerPaidHoursService(userId, paymentType, approvedById);

    if (error) {
      return handleErrorClient(res, 400, error);
    }

    // Respuesta exitosa
    handleSuccess(res, 201, "Horas pagadas registradas exitosamente", paidRecord);
  } catch (error) {
    console.error("Error en registerPaidHours:", error);
    handleErrorServer(res, 500, "Error interno del servidor");
  }
}
