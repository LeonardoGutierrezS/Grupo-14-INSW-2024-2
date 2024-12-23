"use strict";
import { AppDataSource } from "../config/configDb.js";
import BicicletaSchema from "../entity/bicicleta.entity.js";
import ClienteSchema from "../entity/cliente.entity.js";
import ReparacionSchema from "../entity/reparacion.entity.js";
import { sendEmail } from "../services/email.service.js";
import { updateIngresoBicicletaService } from "../services/ingresoBicicleta.service.js";

// Crear un nuevo ingreso de bicicleta (Bicicleta, Cliente, Reparación)
export const createIngresoBicicleta = async (req, res) => {
  console.log("entro al controlador") 
  const { bicicleta, cliente, reparacion } = req.body;

  try {
    const bicicletaRepository = AppDataSource.getRepository(BicicletaSchema);
    const clienteRepository = AppDataSource.getRepository(ClienteSchema);
    const reparacionRepository = AppDataSource.getRepository(ReparacionSchema);

    // Crear nuevo cliente
    const newCliente = clienteRepository.create(cliente);
    await clienteRepository.save(newCliente);

    // Crear nueva bicicleta
    const newBicicleta = bicicletaRepository.create(bicicleta);
    await bicicletaRepository.save(newBicicleta);

    // Crear nueva reparación vinculando la bicicleta y el cliente
    const newReparacion = reparacionRepository.create({
      ...reparacion,
      id_bici: newBicicleta.id_bici,
      id_cliente: newCliente.id_cliente,
    });
    await reparacionRepository.save(newReparacion);


    // Configurar el correo
    const subject = "Confirmación de Ingreso de Bicicleta";
    const htmlContent = `
      <h1>¡Ingreso de bicicleta registrado con éxito!</h1>
      <h2>Detalles del Cliente</h2>
      <p><strong>Nombre:</strong> ${newCliente.nombre}</p>
      <p><strong>RUT:</strong> ${newCliente.rut}</p>
      <p><strong>WhatsApp:</strong> ${newCliente.whatsapp}</p>
      <p><strong>Correo:</strong> ${newCliente.correo}</p>

      <h2>Detalles de la Bicicleta</h2>
      <p><strong>Marca:</strong> ${newBicicleta.marca}</p>
      <p><strong>Modelo:</strong> ${newBicicleta.modelo}</p>
      <p><strong>Color:</strong> ${newBicicleta.color}</p>

      <h2>Detalles de la Reparación</h2>
      <p><strong>Tipo de Trabajo:</strong> ${newReparacion.tipo_trabajo}</p>
      <p><strong>Detalle del Trabajo:</strong> ${newReparacion.detalle_trabajo || "N/A"}</p>
      <p><strong>Observaciones:</strong> ${newReparacion.obs_bici || "N/A"}</p>
      <p><strong>Fecha de Ingreso:</strong> ${newReparacion.fecha_ingreso}</p>
      <p><strong>Fecha Estimada de Entrega:</strong> ${newReparacion.fecha_est_entrega || "Por definir"}</p>
      <p><strong>Precio:</strong> $${newReparacion.precio}</p>
      <p><strong>Estado:</strong> ${newReparacion.estado}</p>

      <p>Gracias por confiar en nuestro servicio de reparaciones.</p>
    `;

    // Enviar el correo al cliente
    await sendEmail(newCliente.correo, subject, "Confirmación de ingreso de bicicleta", htmlContent);





    return res.status(201).json({
      status: "Success",
      message: "Ingreso de bicicleta creado con éxito",
      data: { newCliente, newBicicleta, newReparacion },
    });
  } catch (error) {
    return res.status(500).json({ message: "Error creando el ingreso", error });
  }
};

// Obtener todas las reparaciones (visualizar todos los ingresos)
export const getAllIngresos = async (req, res) => {
  try {
    const reparacionRepository = AppDataSource.getRepository(ReparacionSchema);
    const reparaciones = await reparacionRepository.find({
      relations: ["id_bici", "id_cliente"],
    });
    return res.status(200).json(reparaciones);
  } catch (error) {
    return res.status(500).json({ message: "Error obteniendo ingresos", error });
  }
};

// Obtener todas las bicicletas, modificación Maria Paz
export const getAllBicicletas = async (req, res) => {
  try {
    const bicicletaRepository = AppDataSource.getRepository(BicicletaSchema);
    const bicicletas = await bicicletaRepository.find();

    // Log para verificar los datos enviados al frontend
    console.log("Bicicletas obtenidas desde el backend:", bicicletas);

    // Si no hay bicicletas, responde con un mensaje adecuado
    if (!bicicletas || bicicletas.length === 0) {
      return res.status(404).json({ message: "No se encontraron bicicletas" });
    }

    return res.status(200).json(bicicletas);
  } catch (error) {
    console.error("Error al obtener bicicletas:", error.message);
    return res.status(500).json({ message: "Error al obtener bicicletas", error });
  }
};

// Editar un ingreso
// Editar un ingreso de bicicleta, cliente, y reparación
export const updateIngresoBicicleta = async (req, res) => {
  const { id } = req.params;
  const updateData = req.body;

  try {
    const response = await updateIngresoBicicletaService(id, updateData);
    return res.status(200).json(response);
  } catch (error) {
    console.error("Error actualizando el ingreso:", error); // Captura el error en el log
    return res.status(500).json({
      message: "Error actualizando el ingreso",
      error: error.message || error,
    });
  }
};



// Eliminar un ingreso
export const deleteIngresoBicicleta = async (req, res) => {
  const { id } = req.params;

  try {
    const reparacionRepository = AppDataSource.getRepository(ReparacionSchema);

    // Eliminar la reparación
    const reparacionToDelete = await reparacionRepository.findOneBy({ id_reparacion: id });
    if (!reparacionToDelete)
      return res.status(404).json({ message: "Ingreso no encontrado" });

    await reparacionRepository.remove(reparacionToDelete);

    return res.status(200).json({ message: "Ingreso eliminado con éxito" });
  } catch (error) {
    return res.status(500).json({ message: "Error eliminando el ingreso", error });
  }
};