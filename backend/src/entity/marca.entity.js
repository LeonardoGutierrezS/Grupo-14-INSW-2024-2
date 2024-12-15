"use strict";
import { EntitySchema } from "typeorm";

const MarcaSchema = new EntitySchema({
    name: "Marca",
    tableName: "marcas",
    columns: {
        id_marca: {
            primary: true,
            type: "int",
            generated: true,
            unique: true
        },
        nombre: {
            type: "varchar",
            length: 100,
            nullable: false,
            unique: true
        }
    },
    relations: {
        inventarios: {
            target: "Inventario",
            type: "one-to-many",
            inverseSide: "marca",
            cascade: true  // Propaga las operaciones a los inventarios relacionados
        }
    }
});

export default MarcaSchema;