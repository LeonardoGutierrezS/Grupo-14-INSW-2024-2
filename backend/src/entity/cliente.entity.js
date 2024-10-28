"use strict";
import { EntitySchema } from "typeorm";

const ClienteSchema = new EntitySchema({
  name: "Cliente",
  tableName: "clientes",
  columns: {
    id_cliente: {
      type: "int",
      primary: true,
      generated: true,
    },
    rut: {
      type: "varchar",
      length: 12,
      nullable: false,
      unique: true,
    },
    nombre: {
      type: "varchar",
      length: 255,
      nullable: false,
    },
    whatsapp: {
      type: "varchar",
      length: 20,
      nullable: false,
    },
    correo: {
      type: "varchar",
      length: 255,
      nullable: false,
    },
  },
  indices: [
    {
      name: "IDX_CLIENTE",
      columns: ["id_cliente"],
      unique: true,
    },
    {
      name: "IDX_CLIENTE_RUT",
      columns: ["rut"],
      unique: true,
    },
  ],
});

export default ClienteSchema;
