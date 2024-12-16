"use strict";
import WorkHours from "../entity/work_hours.entity.js";
import { AppDataSource } from "../config/configDb.js";

export async function registerCheckInService(userId, checkIn) {
  try {
    const workHoursRepository = AppDataSource.getRepository(WorkHours);

    // Realizar una consulta directa a la base de datos y verificar si algún turno en progreso existe
    const existingRecord = await workHoursRepository
      .createQueryBuilder("workHours")
      .where("workHours.userId = :userId", { userId })
      .andWhere("workHours.check_out IS NULL")
      .getOne();


    if (existingRecord) {
      // Si existe un registro sin check_out, se considera como turno en progreso
      return [null, "Ya tienes un turno en progreso"];
    }

    // Si no hay registro en progreso, crear uno nuevo
    const newRecord = workHoursRepository.create({
      user: { id: userId },
      check_in: checkIn,
    });
    console.log("Valor de check_in antes de guardar:", newRecord.check_in);
    await workHoursRepository.save(newRecord);
    return [newRecord, null];
  } catch (error) {
    console.error("Error al registrar la hora de entrada:", error);
    return [null, "Error interno del servidor"];
  }
}


export async function registerCheckOutService(userId, checkOut) {
  try {
    const workHoursRepository = AppDataSource.getRepository(WorkHours);

    // Encontrar el ultimo registro sin check_out para el usuario especifico
    const workHour = await workHoursRepository.findOne({
      where: { user: { id: userId }, check_out: null },
      order: { check_in: "DESC" },
    });

    if (!workHour) {
      console.log("No se encontró un turno en progreso para el userId ${userId}");
      return [null, "No tienes un turno en progreso"];
    }

    // Calcula la duración en milisegundos y luego convierte a horas con decimales
    const durationInMilliseconds = checkOut - workHour.check_in;
    const totalHours = durationInMilliseconds / (1000 * 60 * 60); // de milisegundos a horas
    console.log("Horas trabajadas en este turno:", totalHours);
    // Guarda solo las horas trabajadas en este turno específico
    workHour.check_out = checkOut;
    workHour.total_hours = totalHours.toFixed(2); // Guarda con dos decimales

    await workHoursRepository.save(workHour);
    return [workHour, null];
  } catch (error) {
    console.error("Error al registrar la hora de salida:", error);
    return [null, "Error interno del servidor"];
  }
}

  
export async function updateCheckTimeService(id, newCheckIn, newCheckOut) {
  try {
    const workHoursRepository = AppDataSource.getRepository(WorkHours);

    // Buscar el registro de turno por ID
    const workHour = await workHoursRepository.findOne({ where: { id } });

    if (!workHour) {
      return [null, "Registro de turno no encontrado"];
    }

    // Actualizar check_in y check_out
    workHour.check_in = newCheckIn ? new Date(newCheckIn) : workHour.check_in;
    workHour.check_out = newCheckOut ? new Date(newCheckOut) : workHour.check_out;

    // Recalcular total_hours si check_in o check_out fueron actualizados
    if (newCheckIn || newCheckOut) {
      const durationInMilliseconds = workHour.check_out - workHour.check_in;
      workHour.total_hours = (durationInMilliseconds / (1000 * 60 * 60)).toFixed(2);
    }

    // Guardar los cambios
    await workHoursRepository.save(workHour);

    return [workHour, null];
  } catch (error) {
    console.error("Error al actualizar la hora de entrada/salida:", error);
    return [null, "Error interno del servidor"];
  }
}


export async function getEmployeeWorkHoursService(userId) {
  try {
    const workHoursRepository = AppDataSource.getRepository(WorkHours);

    // Agregar logs para verificar el userId
    console.log("Buscando turnos para userId:", userId);

    const workHours = await workHoursRepository.find({
      where: { user: { id: userId } },
    });

    // Verificar si hay resultados
    console.log("Turnos encontrados:", workHours);

    // Si no hay turnos, devolvemos el array vacio y totalHours en 0
    if (!workHours || workHours.length === 0) {
      return [{ workHours: [], totalHours: "0.00" }, null];
    }

    const totalHours = workHours.reduce((sum, record) => sum + parseFloat(record.total_hours), 0).toFixed(2);

    return [{ workHours, totalHours }, null];
  } catch (error) {
    console.error("Error al obtener los turnos:", error);
    return [null, "Error interno del servidor"];
  }
}
