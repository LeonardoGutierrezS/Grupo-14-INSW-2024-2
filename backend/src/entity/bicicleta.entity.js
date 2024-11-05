"use strict";
import { EntitySchema } from "typeorm";

const BicicletaSchema = new EntitySchema({
  name: "Bicicleta",
  tableName: "bicicletas",
  columns: {
    id_bici: {
      type: "int",
      primary: true,
      generated: true,
    },
    marca: {
      type: "varchar",
      length: 255,
      nullable: false,
    },
    modelo: {
      type: "varchar",
      length: 255,
      nullable: false,
    },
    color: {
      type: "varchar",
      length: 50,
      nullable: false,
    },
  },
  indices: [
    {
      name: "IDX_BICI",
      columns: ["id_bici"],
      unique: true,
    },
  ],
});

export default BicicletaSchema;