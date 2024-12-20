"use strict";
import {
  deleteUserService,
  getUserService,
  getUsersService,
  registerEmployeeService,
  registerSellerService,
  updateEmployeeStatusService,
  updateUserService,
  
} from "../services/user.service.js";
import {
  userBodyValidation,
  userQueryValidation,
} from "../validations/user.validation.js";
import {
  handleErrorClient,
  handleErrorServer,
  handleSuccess,
} from "../handlers/responseHandlers.js";
import { getPaymentHistoryService, registerPaidHoursService } from "../services/paid_hours.service.js";
import { AppDataSource } from "../config/configDb.js";
import WorkHours from "../entity/work_hours.entity.js"; 
import { changePasswordService } from "../services/user.service.js";


export async function getUser(req, res) {
  try {
    const { rut, id, email } = req.query;

    const { error } = userQueryValidation.validate({ rut, id, email });

    if (error) return handleErrorClient(res, 400, error.message);

    const [user, errorUser] = await getUserService({ rut, id, email });

    if (errorUser) return handleErrorClient(res, 404, errorUser);

    handleSuccess(res, 200, "Usuario encontrado", user);
  } catch (error) {
    handleErrorServer(res, 500, error.message);
  }
}

export async function getUsers(req, res) {
  try {
    const [users, errorUsers] = await getUsersService();

    if (errorUsers) return handleErrorClient(res, 404, errorUsers);

    users.length === 0
      ? handleSuccess(res, 204)
      : handleSuccess(res, 200, "Usuarios encontrados", users);
  } catch (error) {
    handleErrorServer(
      res,
      500,
      error.message,
    );
  }
}

export async function updateUser(req, res) {
  try {
    const { rut, id, email } = req.query;
    const { body } = req;

    const { error: queryError } = userQueryValidation.validate({
      rut,
      id,
      email,
    });

    if (queryError) {
      return handleErrorClient(
        res,
        400,
        "Error de validación en la consulta",
        queryError.message,
      );
    }

    const { error: bodyError } = userBodyValidation.validate(body);

    if (bodyError)
      return handleErrorClient(
        res,
        400,
        "Error de validación en los datos enviados",
        bodyError.message,
      );

    const [user, userError] = await updateUserService({ rut, id, email }, body);

    if (userError) return handleErrorClient(res, 400, "Error modificando al usuario", userError);

    handleSuccess(res, 200, "Usuario modificado correctamente", user);
  } catch (error) {
    handleErrorServer(res, 500, error.message);
  }
}

export async function deleteUser(req, res) {
  try {
    const { rut, id, email } = req.query;

    const { error: queryError } = userQueryValidation.validate({
      rut,
      id,
      email,
    });

    if (queryError) {
      return handleErrorClient(
        res,
        400,
        "Error de validación en la consulta",
        queryError.message,
      );
    }

    const [userDelete, errorUserDelete] = await deleteUserService({
      rut,
      id,
      email,
    });

    if (errorUserDelete) return handleErrorClient(res, 404, "Error eliminado al usuario", errorUserDelete);

    handleSuccess(res, 200, "Usuario eliminado correctamente", userDelete);
  } catch (error) {
    handleErrorServer(res, 500, error.message);
  }
}
export async function registerEmployee(req, res) {
  try {
    const { body } = req;
    const { error } = userBodyValidation.validate(body);

    if (error) {
      return handleErrorClient(res, 400, "Error de validación", error.message);
    }

    const [newEmployee, errorEmployee] = await registerEmployeeService(body);

    if (errorEmployee) {
      return handleErrorClient(res, 400, "Error al registrar empleado", errorEmployee);
    }

    handleSuccess(res, 201, "Empleado registrado exitosamente", newEmployee);
  } catch (error) {
    handleErrorServer(res, 500, "Error del servidor al registrar empleado");
  }
}
export async function registerSeller(req, res) {
  try {
    const { body } = req;
    const { error } = userBodyValidation.validate(body);

    if (error) {
      return handleErrorClient(res, 400, "Error de validación", error.message);
    }

    const [newEmployee, errorEmployee] = await registerSellerService(body);

    if (errorEmployee) {
      return handleErrorClient(res, 400, "Error al registrar empleado", errorEmployee);
    }

    handleSuccess(res, 201, "Empleado registrado exitosamente", newEmployee);
  } catch (error) {
    handleErrorServer(res, 500, "Error del servidor al registrar empleado");
  }
}
export async function approvePayment(req, res) {
  try {
    const { userId } = req.params; // ID del empleado para el que se aprobarán las horas
    const { paymentType } = req.body; // Tipo de pago: diario, semanal o mensual
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
    console.error("Error en approvePayment:", error);
    handleErrorServer(res, 500, "Error interno del servidor");
  }
}
export async function updateEmployeeStatus(req, res) {
  console.log("Datos recibidos en el backend:", req.body);
  try {
    const { userId } = req.params; // ID del empleado a actualizar
    const { newStatus } = req.body; // Nuevo estado (activo/inactivo)
    const userRole = req.user.rol;

    // Verificar que el usuario autenticado sea un administrador
    if (userRole !== "administrador") {
      return handleErrorClient(res, 403, "No tienes permiso para actualizar el estado de los empleados");
    }

    // Llamar al servicio para actualizar el estado del empleado
    const [updatedEmployee, error] = await updateEmployeeStatusService(userId, newStatus);

    if (error) {
      return handleErrorClient(res, 400, error);
    }

    // Respuesta exitosa
    handleSuccess(res, 200, "Estado del empleado actualizado exitosamente", updatedEmployee);
  } catch (error) {
    console.error("Error en updateEmployeeStatus:", error);
    handleErrorServer(res, 500, "Error interno del servidor");
  }
}
export const getPaymentHistoryController = async (req, res) => {
  const { userId } = req.params;

  try {
    const [paymentHistory, error] = await getPaymentHistoryService(userId);

    if (error) {
      return res.status(404).json({ status: "Error", message: error });
    }

    return res.status(200).json({
      status: "Success",
      message: "Historial de pagos obtenido exitosamente.",
      data: paymentHistory,
    });
  } catch (error) {
    console.error("Error al obtener el historial de pagos:", error);
    return res.status(500).json({
      status: "Error",
      message: "Error interno del servidor al obtener el historial de pagos.",
    });
  }
};
export async function getUsersWithHours(req, res) {
  try {
      const workHoursRepository = AppDataSource.getRepository(WorkHours);

      const usersWithHours = await workHoursRepository
          .createQueryBuilder("workHours")
          .innerJoin("workHours.user", "user")
          .select("user.id", "userId")
          .addSelect("user.nombreCompleto", "nombreCompleto")
          .addSelect("user.rol", "rol")
          .addSelect("SUM(workHours.total_hours)", "totalHours")
          .groupBy("user.id")
          .having("SUM(workHours.total_hours) > 0")
          .getRawMany();

      return res.status(200).json({ status: "Success", data: usersWithHours });
  } catch (error) {
      console.error("Error al obtener usuarios con horas trabajadas:", error);
      res.status(500).json({ status: "Error", message: "Error interno del servidor" });
  }
}



export async function changePassword(req, res) {
    try {
        const { currentPassword, newPassword } = req.body;
        const userId = req.user.id; 

        const result = await changePasswordService(userId, currentPassword, newPassword);

        res.status(200).json({ status: "Success", message: result.message });
    } catch (error) {
        console.error("Error al cambiar la contraseña:", error.message);
        res.status(400).json({ status: "Error", message: error.message });
    }
}

