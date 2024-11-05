"use strict";
import { EntitySchema } from "typeorm";
import UserSchema from "./user.entity.js";
import ComentarioSchema from "./comentario.entity.js";

const TareaSchema = new EntitySchema({
  name: "Tarea",
  tableName: "tareas",
  columns: {
    id_tarea: {
      type: "int",
      primary: true,
      generated: true,
    },
    fecha_creacion: {
      type: "timestamp with time zone",
      nullable: false,
      default: () => "CURRENT_TIMESTAMP",
    },
    detalle: {
      type: "text",
      nullable: false,
    },
    estado: {
      type: "varchar",
      length: 50,
      default: "pendiente", // Estados posibles: 'pendiente', 'en proceso', 'terminado'
    },
    prioridad: {
      type: "varchar",
      length: 50,
      default: "media", // Prioridades posibles: 'baja', 'media', 'alta'
    },
    notificacion_administrador: {
      type: "boolean",
      default: false,
    },
  },
  relations: {
    usuario: { 
      type: "many-to-one",
      target: "User",
      joinColumn: { name: "usuario_id" }, // FK, nombre del campo en 'Tarea' que almacena el id de 'User'
      nullable: false, // Usuario es obligatorio, debe ser un mecánico
    },
    comentarios: {
      type: "one-to-many",
      target: "Comentario",
      inverseSide: "tarea",
    },
  },
});

export default TareaSchema;
