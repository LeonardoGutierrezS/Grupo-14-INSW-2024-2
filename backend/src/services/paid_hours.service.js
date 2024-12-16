"use strict";
import { AppDataSource } from "../config/configDb.js";
import PaidHours from "../entity/paid_hours.entity.js";
import User from "../entity/user.entity.js";
import WorkHours from "../entity/work_hours.entity.js";

export async function registerPaidHoursService(userId, paymentType, approvedById) {
  try {
    const paidHoursRepository = AppDataSource.getRepository(PaidHours);
    const workHoursRepository = AppDataSource.getRepository(WorkHours);
    const userRepository = AppDataSource.getRepository(User);

    // Verificar si el empleado existe
    const user = await userRepository.findOneBy({ id: userId });
    if (!user) return [null, "Empleado no encontrado"];

    // Obtener el total de horas acumuladas del empleado
    const totalWorkHours = await workHoursRepository
      .createQueryBuilder("workHours")
      .select("SUM(workHours.total_hours)", "total")
      .where("workHours.user.id = :userId", { userId })
      .getRawOne();

    const totalHours = parseFloat(totalWorkHours.total) || 0;
    if (totalHours === 0) return [null, "No hay horas acumuladas para pagar"];

    // Crear el registro de pago
    const paidRecord = paidHoursRepository.create({
      paidHours: totalHours,
      paymentType,
      user,
      approvedBy: { id: approvedById },
    });

    // Guardar el registro de pago
    await paidHoursRepository.save(paidRecord);

    // Resetear las horas acumuladas del empleado
    await workHoursRepository.update(
      { user: { id: userId } },
      { total_hours: 0 }
    );

    return [paidRecord, null];
  } catch (error) {
    console.error("Error al registrar horas pagadas:", error);
    return [null, "Error interno del servidor"];
  }
}
export const getPaymentHistoryService = async (userId) => {
  const paidHoursRepository = AppDataSource.getRepository(PaidHours);
  try {
    const paymentHistory = await paidHoursRepository.find({
      where: { user: { id: userId } },
      relations: ["user", "approvedBy"],
      order: { approvedAt: "DESC" }, // Ordenar por fecha de aprobación descendente
    });

    if (paymentHistory.length === 0) {
      return [null, "No se encontraron pagos para este usuario."];
    }

    return [paymentHistory, null];
  } catch (error) {
    console.error("Error al obtener el historial de pagos:", error);
    return [null, "Error interno del servidor al obtener el historial de pagos."];
  }
};