"use strict";
import User from "../entity/user.entity.js";
import { AppDataSource } from "../config/configDb.js";
import { comparePassword, encryptPassword } from "../helpers/bcrypt.helper.js";
import bcrypt from "bcryptjs";
import { changePasswordValidation } from "../validations/user.validation.js";

export async function getUserService(query) {
  try {
    const { rut, id, email } = query;

    const userRepository = AppDataSource.getRepository(User);

    const userFound = await userRepository.findOne({
      where: [{ id: id }, { rut: rut }, { email: email }],
    });

    if (!userFound) return [null, "Usuario no encontrado"];

    const { password, ...userData } = userFound;

    return [userData, null];
  } catch (error) {
    console.error("Error obtener el usuario:", error);
    return [null, "Error interno del servidor"];
  }
}

export async function getUsersService() {
  try {
    const userRepository = AppDataSource.getRepository(User);

    const users = await userRepository.find();

    if (!users || users.length === 0) return [null, "No hay usuarios"];

    const usersData = users.map(({ password, ...user }) => user);

    return [usersData, null];
  } catch (error) {
    console.error("Error al obtener a los usuarios:", error);
    return [null, "Error interno del servidor"];
  }
}

export async function updateUserService(query, body) {
  try {
    const { id, rut, email } = query;

    const userRepository = AppDataSource.getRepository(User);

    const userFound = await userRepository.findOne({
      where: [{ id: id }, { rut: rut }, { email: email }],
    });

    if (!userFound) return [null, "Usuario no encontrado"];

    const existingUser = await userRepository.findOne({
      where: [{ rut: body.rut }, { email: body.email }],
    });

    if (existingUser && existingUser.id !== userFound.id) {
      return [null, "Ya existe un usuario con el mismo rut o email"];
    }

    if (body.password) {
      const matchPassword = await comparePassword(
        body.password,
        userFound.password,
      );

      if (!matchPassword) return [null, "La contraseña no coincide"];
    }

    const dataUserUpdate = {
      nombreCompleto: body.nombreCompleto,
      rut: body.rut,
      email: body.email,
      rol: body.rol,
      updatedAt: new Date(),
    };

    if (body.newPassword && body.newPassword.trim() !== "") {
      dataUserUpdate.password = await encryptPassword(body.newPassword);
    }

    await userRepository.update({ id: userFound.id }, dataUserUpdate);

    const userData = await userRepository.findOne({
      where: { id: userFound.id },
    });

    if (!userData) {
      return [null, "Usuario no encontrado después de actualizar"];
    }

    const { password, ...userUpdated } = userData;

    return [userUpdated, null];
  } catch (error) {
    console.error("Error al modificar un usuario:", error);
    return [null, "Error interno del servidor"];
  }
}

export async function deleteUserService(query) {
  try {
    const { id, rut, email } = query;

    const userRepository = AppDataSource.getRepository(User);

    const userFound = await userRepository.findOne({
      where: [{ id: id }, { rut: rut }, { email: email }],
    });

    if (!userFound) return [null, "Usuario no encontrado"];

    if (userFound.rol === "administrador") {
      return [null, "No se puede eliminar un usuario con rol de administrador"];
    }

    const userDeleted = await userRepository.remove(userFound);

    const { password, ...dataUser } = userDeleted;

    return [dataUser, null];
  } catch (error) {
    console.error("Error al eliminar un usuario:", error);
    return [null, "Error interno del servidor"];
  }
}
export async function registerEmployeeService(user) {
  try {
    const userRepository = AppDataSource.getRepository(User);

    const { nombreCompleto, rut, email, rol } = user;

    const createErrorMessage = (dataInfo, message) => ({
      dataInfo,
      message,
    });

    const existingEmailUser = await userRepository.findOne({
      where: { email },
    });

    if (existingEmailUser) {
      return [null, createErrorMessage("email", "Correo electrónico en uso")];
    }

    const existingRutUser = await userRepository.findOne({
      where: { rut },
    });

    if (existingRutUser) {
      return [null, createErrorMessage("rut", "RUT ya registrado")];
    }

    const newEmployee = userRepository.create({
      nombreCompleto,
      email,
      rut,
      password: await encryptPassword(user.password),
      rol: rol || "mecanico",  // Usamos el rol proporcionado o por defecto mecanico
    });

    await userRepository.save(newEmployee);

    const { password, ...dataEmployee } = newEmployee;

    return [dataEmployee, null];
  } catch (error) {
    console.error("Error al registrar un empleado", error);
    return [null, "Error interno del servidor"];
  }
}

export async function registerSellerService(user) {
  try {
    const userRepository = AppDataSource.getRepository(User);

    const { nombreCompleto, rut, email, rol } = user;

    const createErrorMessage = (dataInfo, message) => ({
      dataInfo,
      message,
    });

    const existingEmailUser = await userRepository.findOne({
      where: { email },
    });

    if (existingEmailUser) {
      return [null, createErrorMessage("email", "Correo electrónico en uso")];
    }

    const existingRutUser = await userRepository.findOne({
      where: { rut },
    });

    if (existingRutUser) {
      return [null, createErrorMessage("rut", "RUT ya registrado")];
    }

    const newEmployee = userRepository.create({
      nombreCompleto,
      email,
      rut,
      password: await encryptPassword(user.password),
      rol: rol || "vendedor",  // Usamos el rol proporcionado o por defecto mecanico
    });

    await userRepository.save(newEmployee);

    const { password, ...dataEmployee } = newEmployee;

    return [dataEmployee, null];
  } catch (error) {
    console.error("Error al registrar un empleado", error);
    return [null, "Error interno del servidor"];
  }
}

export async function updateEmployeeStatusService(userId, newStatus) {
  

  try {
    const userRepository = AppDataSource.getRepository(User);

    
    const employee = await userRepository.findOneBy({ id: userId });
    if (!employee) {
      return [null, "Empleado no encontrado"];
    }

    
    if (!["activo", "inactivo"].includes(newStatus)) {
      return [null, "Estado inválido. Debe ser 'activo' o 'inactivo'"];
    }

    
    employee.estado = newStatus;
    await userRepository.save(employee);

    return [employee, null];
  } catch (error) {
    console.error("Error al actualizar el estado del empleado:", error);
    return [null, "Error interno del servidor"];
  }
}




export async function changePasswordService(userId, currentPassword, newPassword) {
  const userRepository = AppDataSource.getRepository(User);

  // Paso 1: Validar la nueva contraseña con Joi
  const { error } = changePasswordValidation.validate({ newPassword });
  if (error) {
      // Si hay un error en la validación, lanzamos un error con el mensaje de Joi
      throw new Error(error.details[0].message);
  }

  // Paso 2: Buscar al usuario por su ID
  const user = await userRepository.findOne({ where: { id: userId } });
  if (!user) {
      throw new Error("Usuario no encontrado");
  }

  // Paso 3: Verificar que la contraseña actual sea correcta
  const isMatch = await bcrypt.compare(currentPassword, user.password);
  if (!isMatch) {
      throw new Error("La contraseña actual es incorrecta");
  }

  // Paso 4: Hashear la nueva contraseña
  const hashedPassword = await bcrypt.hash(newPassword, 10);

  // Paso 5: Actualizar la contraseña del usuario
  user.password = hashedPassword;
  await userRepository.save(user);

  return { message: "Contraseña actualizada correctamente" };
}