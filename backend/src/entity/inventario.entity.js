"use strict";

import { EntitySchema } from "typeorm";

const InventarioSchema = new EntitySchema({
    name: "Inventario",
    tableName: "inventario",
    columns: {
        id: {
            primary: true,
            type: "int",
            generated: true,
            unique: true
        },
        nombre: {
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
            type: "int"
        },
        id_categoria: {
            type: "int"
        },
        id_tipo: {
            type: "int"
        }
    },
    relations: {
        marca: {
            target: "Marca",
            type: "many-to-one",
            joinColumn: { name: "id_marca" }
        },
        categoria: {
            target: "Categoria",
            type: "many-to-one",
            joinColumn: { name: "id_categoria" }
        },
        tipo: {
            target: "Tipo",
            type: "many-to-one",
            joinColumn: { name: "id_tipo" }
        }

    }
});

export default InventarioSchema;

/* body del inventario
{
    "nombre": "Monitor",
    "tipo_objeto": "Electronico",
    "cantidad": 10,
    "precio": 100,
    "descripcion": "Monitor de 24 pulgadas",
    "id_marca": 1,
    "id_categoria": 1
    "id_tipo": 1
}
*/