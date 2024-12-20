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
    comentario: {
      type: "text",
      nullable: false 
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
      joinColumn: { name: "id_tarea" }, // FK
      onDelete: "CASCADE",
      nullable: false,
    },
    usuario: {
      type: "many-to-one",
      target: "User",
      joinColumn: { name: "id" }, // FK
      onDelete: "CASCADE",
      nullable: false,
    },
  },
});

export default ComentarioSchema;
