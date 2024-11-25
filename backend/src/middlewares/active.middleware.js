"use strict";
import { handleErrorClient } from "../handlers/responseHandlers.js";
import User from "../entity/user.entity.js";
import { AppDataSource } from "../config/configDb.js";

/**
 * Middleware para verificar si el usuario está activo.
 */
export async function checkActive(req, res, next) {
  try {
    const userRepository = AppDataSource.getRepository(User);
    const userId = req.user.id;

    // Obtener el estado del usuario
    const user = await userRepository.findOneBy({ id: userId });

    if (!user || user.estado !== "activo") {
      return handleErrorClient(res, 403, "El usuario no está activo y no puede realizar esta acción.");
    }

    next();
  } catch (error) {
    console.error("Error en el middleware checkActive:", error);
    res.status(500).json({ status: "Server error", message: "Error interno del servidor" });
  }
}
