"use strict";

import { EntitySchema } from "typeorm";

const InventarioSchema = new EntitySchema({
    name: "Inventario",
    tableName: "inventario",
    columns: {
        id: {
            primary: true,
            type: "int",
            generated: true
        },
        nombre: {
            type: "varchar",
            length: 100
        },
        tipo_objeto: {
            type: "varchar",
            length: 100
        },
        cantidad: {
            type: "int"
        },
        precio: {
            type: "int"
        },
        descripcion: {
            type: "text"
        },
        id_marca: {
            type: "int",
        }
    },
    relations: {
        marca: {
            target: "Marca",
            type: "many-to-one",
            joinColumn: { name: "id_marca" },
            nullable: false
        }
    }
});

export default InventarioSchema;