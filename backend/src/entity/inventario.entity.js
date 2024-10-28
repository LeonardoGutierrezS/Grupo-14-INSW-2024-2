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
        marca: {
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
        }
    }
});

export default InventarioSchema;

// Example of a JSON object that would be sent to the API to create a new inventory item:
/*
{
    "nombre": "Frenoacv",
    "marca": "ACME",
    "tipo_objeto": "Repuesto",
    "cantidad": 10,
    "precio": 240000,
    "descripcion": "Frenos mas o menos"
}
*/