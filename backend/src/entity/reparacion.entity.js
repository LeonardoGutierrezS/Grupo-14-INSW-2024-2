"use strict";
import { EntitySchema } from "typeorm";

const ReparacionSchema = new EntitySchema({
  name: "Reparacion",
  tableName: "reparaciones",
  columns: {
    id_reparacion: {
      type: "int",
      primary: true,
      generated: true,
    },
    id_bici: {
      type: "int",
      nullable: false,
    },
    id_cliente: {
      type: "int",
      nullable: false,
    },
    tipo_trabajo: {
      type: "varchar",
      length: 255,
      nullable: false,
    },
    detalle_trabajo: {
      type: "text",
      nullable: true,
    },
    obs_bici: {
      type: "text",
      nullable: true,
    },
    repuestos: {
      type: "text",
      nullable: true,
    },
    fecha_ingreso: {
      type: "timestamp with time zone",
      nullable: false,
      default: () => "CURRENT_TIMESTAMP",
    },
    fecha_est_entrega: {
      type: "timestamp with time zone",
      nullable: true,
    },
    fecha_entrega: {
      type: "timestamp with time zone",
      nullable: true,
    },
    precio: {
      type: "decimal",
      nullable: false,
    },
    estado: {
      type: "varchar",
      length: 50,
      nullable: false,
    },
  },
  indices: [
    {
      name: "IDX_REPARACION",
      columns: ["id_reparacion"],
      unique: true,
    },
  ],
  relations: {
    id_bici: {
      target: "Bicicleta",
      type: "many-to-one",
      joinColumn: { name: "id_bici" },
    },
    id_cliente: {
      target: "Cliente",
      type: "many-to-one",
      joinColumn: { name: "id_cliente" },
    },
  },
});

export default ReparacionSchema;
