"use strict";
import { EntitySchema } from "typeorm";
import TareaSchema from "./tareas.entity.js"; 
import UserSchema from "./user.entity.js"; 

const ComentarioSchema = new EntitySchema({
  name: "Comentario",
  tableName: "comentarios",
  columns: {
    id_com: {
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
    },
    estado: {
      type: "varchar",
      enum: ["pendiente", "en proceso", "terminado"],
      default: "pendiente",
    },
  },
  relations: {
    tarea: {
      type: "many-to-one",
      target: "Tarea",
      joinColumn: { name: "tarea_id" }, // FK
      onDelete: "CASCADE",
    },
    usuario: {
      type: "many-to-one",
      target: "User",
      joinColumn: { name: "usuario_id" }, // FK
    },
  },
});

export default ComentarioSchema;
