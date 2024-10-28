"use strict";
import WorkHours from "../entity/work_hours.entity.js";
import { AppDataSource } from "../config/configDb.js";

export async function registerCheckInService(userId, checkIn) {
  try {
    const workHoursRepository = AppDataSource.getRepository(WorkHours);

    const existingRecord = await workHoursRepository.findOne({
      where: { user: { id: userId }, check_out: null },
    });

    if (existingRecord) {
      return [null, "Ya tienes un turno en progreso"];
    }

    const newRecord = workHoursRepository.create({
      user: { id: userId },
      check_in: checkIn,
    });

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
  
      const workHour = await workHoursRepository.findOne({
        where: { user: { id: userId }, check_out: null },
      });
  
      if (!workHour) {
        return [null, "No tienes un turno en progreso"];
      }
  
      workHour.check_out = checkOut;
      
      // Cálculo en milisegundos, luego convertido a horas con decimales
      const durationInMilliseconds = checkOut - workHour.check_in;
      const totalHours = durationInMilliseconds / (1000 * 60 * 60); // de milisegundos a horas
  
      workHour.total_hours = totalHours.toFixed(2); // Guardamos con dos decimales (horas y minutos)
      
      await workHoursRepository.save(workHour);
      return [workHour, null];
    } catch (error) {
      console.error("Error al registrar la hora de salida:", error);
      return [null, "Error interno del servidor"];
    }
  }
  